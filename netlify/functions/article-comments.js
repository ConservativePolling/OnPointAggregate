const { getStore } = require('@netlify/blobs');

const ADMIN_EMAIL = 'jaydenmdavis2008@outlook.com';

console.log('Using Netlify Blobs for persistent comment storage');

// Get Netlify Blobs store instance
let blobStore = null;

function getBlobStore() {
  if (!blobStore) {
    blobStore = getStore('comments');
  }
  return blobStore;
}

async function loadCommentsStore() {
  try {
    const store = getBlobStore();
    console.log('Loading comments from Netlify Blobs');
    const data = await store.get('all-comments', { type: 'json' });
    if (!data) {
      console.log('No comments in store yet, returning empty store');
      return {};
    }
    console.log('Loaded comments store with', Object.keys(data).length, 'articles');
    return data;
  } catch (error) {
    console.error('❌ Error reading comments store from Blobs:', error);
    console.error('Stack:', error.stack);
    return {};
  }
}

async function saveCommentsStore(store) {
  try {
    const blobStoreInstance = getBlobStore();
    console.log('💾 Saving comments store to Netlify Blobs');
    console.log('Store has', Object.keys(store).length, 'articles');
    await blobStoreInstance.setJSON('all-comments', store);
    console.log('✅ Comments saved successfully to Netlify Blobs');
  } catch (error) {
    console.error('❌ Error writing comments store to Blobs:', error);
    console.error('Stack:', error.stack);
  }
}

// Decode JWT token to get user info
function decodeToken(token) {
  try {
    if (!token) {
      console.log('No token provided');
      return null;
    }

    const cleanToken = token.replace(/^Bearer\s+/i, '');
    const parts = cleanToken.split('.');

    if (parts.length !== 3) {
      console.log('Invalid token format');
      return null;
    }

    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4 !== 0) {
      payload += '=';
    }

    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    console.log('Token decoded, email:', parsed.email);
    return parsed;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// In-memory cache (refreshed on each function invocation)
let commentsStore = null;

async function refreshStore() {
  commentsStore = await loadCommentsStore();
  return commentsStore;
}

async function persistStore() {
  await saveCommentsStore(commentsStore);
}

exports.handler = async (event, context) => {
  console.log('=== Function Invoked ===');
  console.log('Method:', event.httpMethod);
  console.log('Path:', event.path);
  console.log('RawUrl:', event.rawUrl);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));

  const method = event.httpMethod;
  const path = event.path || '';
  const rawUrl = event.rawUrl || '';

  try {
    await refreshStore();

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
        },
        body: ''
      };
    }

    // GET - Fetch comments
    if (method === 'GET') {
      const { articleId } = event.queryStringParameters || {};

      if (!articleId) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId is required' })
        };
      }

      const articleKey = String(articleId);
      const comments = commentsStore[articleKey] || [];
      console.log('Returning', comments.length, 'comments for article', articleKey);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ comments })
      };
    }

    // All other methods require authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader) {
      console.log('No auth header provided');
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    const tokenData = decodeToken(authHeader);

    if (!tokenData || !tokenData.email) {
      console.log('Invalid token data');
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    const isAdmin = tokenData.email === ADMIN_EMAIL;
    const requestBody = event.body ? JSON.parse(event.body) : {};

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    console.log('User:', tokenData.email, 'isAdmin:', isAdmin);

    // Determine action from path or request body
    let action = requestBody.action || 'comment'; // Default action

    // Check path for action type (more reliable routing)
    if (path.includes('/comment-like') || rawUrl.includes('/comment-like')) {
      action = 'like';
      console.log('Action detected from path: LIKE');
    } else if (path.includes('/comment-reply') || rawUrl.includes('/comment-reply')) {
      action = 'reply';
      console.log('Action detected from path: REPLY');
    }

    // POST requests
    if (method === 'POST') {
      console.log('POST action:', action);

      // LIKE ACTION
      if (action === 'like') {
        console.log('Processing LIKE action');
        const { articleId, commentId, replyId } = requestBody;

        if (!articleId || !commentId) {
          console.log('Missing articleId or commentId for like');
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'articleId and commentId are required for like action' })
          };
        }

        const articleKey = String(articleId);
        const comments = commentsStore[articleKey] || [];
        console.log('=== LIKE DEBUG ===');
        console.log('Article ID:', articleKey);
        console.log('Looking for comment ID:', commentId);
        console.log('Total comments in store:', comments.length);
        console.log('Comment IDs in store:', comments.map(c => ({ id: c.id, type: c.type, author: c.author.name })));
        console.log('Full commentsStore keys:', Object.keys(commentsStore));
        console.log('Full commentsStore:', JSON.stringify(commentsStore, null, 2));

        const comment = comments.find(c => c.id === commentId);

        if (!comment) {
          console.log('❌ Comment NOT FOUND');
          console.log('Requested comment ID:', commentId);
          console.log('Available comment IDs:', comments.map(c => c.id));
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
              error: 'Comment not found',
              requestedId: commentId,
              availableIds: comments.map(c => c.id),
              totalComments: comments.length
            })
          };
        }

        console.log('✅ Comment FOUND:', comment.id);

        // Handle reply like
        if (replyId) {
          console.log('Liking reply:', replyId);
          const reply = comment.replies.find(r => r.id === replyId);
          if (!reply) {
            console.log('Reply not found:', replyId);
            return {
              statusCode: 404,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
              body: JSON.stringify({ error: 'Reply not found' })
            };
          }

          const likeIndex = reply.likes.indexOf(tokenData.email);
          if (likeIndex > -1) {
            reply.likes.splice(likeIndex, 1);
            console.log('Unliked reply');
          } else {
            reply.likes.push(tokenData.email);
            console.log('Liked reply');
          }
        } else {
          // Handle comment like
          console.log('Liking comment:', commentId);
          const likeIndex = comment.likes.indexOf(tokenData.email);
          if (likeIndex > -1) {
            comment.likes.splice(likeIndex, 1);
            console.log('Unliked comment');
          } else {
            comment.likes.push(tokenData.email);
            console.log('Liked comment');
          }
        }

        commentsStore[articleKey] = comments;
        await persistStore();

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ success: true, comments })
        };
      }

      // REPLY ACTION
      if (action === 'reply') {
        console.log('Processing REPLY action');
        const { articleId, commentId, text, username } = requestBody;

        if (!articleId || !commentId || !text) {
          console.log('Missing required fields for reply');
          return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'articleId, commentId, and text are required for reply action' })
          };
        }

        const articleKey = String(articleId);
        const comments = commentsStore[articleKey] || [];
        console.log('=== REPLY DEBUG ===');
        console.log('Article ID:', articleKey);
        console.log('Looking for comment ID:', commentId);
        console.log('Total comments in store:', comments.length);
        console.log('Comment IDs in store:', comments.map(c => ({ id: c.id, type: c.type, author: c.author.name })));
        console.log('Full commentsStore keys:', Object.keys(commentsStore));

        const comment = comments.find(c => c.id === commentId);

        if (!comment) {
          console.log('❌ Comment NOT FOUND for reply');
          console.log('Requested comment ID:', commentId);
          console.log('Available comment IDs:', comments.map(c => c.id));
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
              error: 'Comment not found',
              requestedId: commentId,
              availableIds: comments.map(c => c.id),
              totalComments: comments.length
            })
          };
        }

        console.log('✅ Comment FOUND for reply:', comment.id);

        // Use provided username or fall back to email prefix
        const displayName = username || tokenData.email.split('@')[0];

        const newReply = {
          id: generateId(),
          author: {
            name: displayName,
            email: tokenData.email
          },
          text,
          timestamp: new Date().toISOString(),
          likes: []
        };

        comment.replies.push(newReply);
        commentsStore[articleKey] = comments;
        await persistStore();

        console.log('Reply created:', newReply.id);

        return {
          statusCode: 201,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ success: true, reply: newReply, comments })
        };
      }

      // COMMENT ACTION (default)
      console.log('Processing COMMENT action');
      const { articleId, text, type, username } = requestBody;

      if (!articleId || !text) {
        console.log('Missing articleId or text for comment');
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId and text are required for comment action' })
        };
      }

      // Determine comment type
      const commentType = (type === 'reporter' && isAdmin) ? 'reporter' : 'user';

      // Determine display name
      let displayName;
      if (commentType === 'reporter') {
        displayName = 'OnPointArticles Team';
      } else {
        // Use provided username or fall back to email prefix
        displayName = username || tokenData.email.split('@')[0];
      }

      const articleKey = String(articleId);
      const comments = commentsStore[articleKey] || [];

      const newComment = {
        id: generateId(),
        articleId: articleKey,
        type: commentType,
        author: {
          name: displayName,
          email: tokenData.email
        },
        text,
        timestamp: new Date().toISOString(),
        likes: [],
        replies: []
      };

      comments.unshift(newComment);
      commentsStore[articleKey] = comments;
      await persistStore();

      console.log('Comment created:', newComment.id, 'by', tokenData.email, 'type:', commentType);

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, comment: newComment, comments })
      };
    }

    // DELETE - Delete comment (admin only)
    if (method === 'DELETE') {
      console.log('Processing DELETE action');

      if (!isAdmin) {
        console.log('Non-admin tried to delete');
        return {
          statusCode: 403,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Admin access required' })
        };
      }

      const { articleId, commentId, replyId } = requestBody;

      if (!articleId || !commentId) {
        console.log('Missing articleId or commentId for delete');
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId and commentId are required' })
        };
      }

      const articleKey = String(articleId);
      let comments = commentsStore[articleKey] || [];

      if (replyId) {
        // Delete reply
        console.log('Deleting reply:', replyId);
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.replies = comment.replies.filter(r => r.id !== replyId);
        }
      } else {
        // Delete comment
        console.log('Deleting comment:', commentId);
        comments = comments.filter(c => c.id !== commentId);
      }

      commentsStore[articleKey] = comments;
      await persistStore();

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, comments })
      };
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('ERROR in article-comments function:', error);
    console.error('Stack trace:', error.stack);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};

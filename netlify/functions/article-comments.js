const ADMIN_EMAIL = 'jaydenmdavis2008@outlook.com';

console.log('💾 Comment system initializing...');

// In-memory store as fallback
let inMemoryStore = {};
let usingBlobStorage = false;
let blobStoreInstance = null;

// Try to initialize Netlify Blobs
async function initializeBlobStorage() {
  try {
    console.log('Attempting to load @netlify/blobs...');
    const { getStore } = require('@netlify/blobs');
    blobStoreInstance = getStore({
      name: 'comments',
      consistency: 'strong'
    });

    // Test if it works
    await blobStoreInstance.get('test');
    usingBlobStorage = true;
    console.log('✅ Netlify Blobs initialized successfully');
    return true;
  } catch (error) {
    console.warn('⚠️ Netlify Blobs not available:', error.message);
    console.log('📝 Falling back to in-memory storage (data will not persist)');
    usingBlobStorage = false;
    return false;
  }
}

async function loadCommentsStore() {
  try {
    if (!usingBlobStorage) {
      console.log('Using in-memory store');
      return inMemoryStore;
    }

    console.log('📖 Loading from Netlify Blobs...');
    const data = await blobStoreInstance.get('all-comments', { type: 'json' });

    if (!data) {
      console.log('ℹ️ No existing data, starting fresh');
      return {};
    }

    console.log('✅ Loaded', Object.keys(data).length, 'article(s)');
    return data;
  } catch (error) {
    console.error('❌ Error loading from Blobs:', error.message);
    console.log('Falling back to in-memory');
    return inMemoryStore;
  }
}

async function saveCommentsStore(store) {
  try {
    // Always update in-memory store
    inMemoryStore = { ...store };

    if (!usingBlobStorage) {
      console.log('💾 Saved to in-memory store');
      return;
    }

    console.log('💾 Saving to Netlify Blobs...');
    await blobStoreInstance.setJSON('all-comments', store);
    console.log('✅ Persisted to Blobs');
  } catch (error) {
    console.error('❌ Error saving to Blobs:', error.message);
    console.log('Data saved to in-memory only');
  }
}

// Decode JWT token
function decodeToken(token) {
  try {
    if (!token) return null;

    const cleanToken = token.replace(/^Bearer\s+/i, '');
    const parts = cleanToken.split('.');

    if (parts.length !== 3) return null;

    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4 !== 0) {
      payload += '=';
    }

    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Token decode error:', error.message);
    return null;
  }
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

let commentsStore = null;
let initialized = false;

async function initializeIfNeeded() {
  if (!initialized) {
    await initializeBlobStorage();
    initialized = true;
  }
}

async function refreshStore() {
  await initializeIfNeeded();
  commentsStore = await loadCommentsStore();
  return commentsStore;
}

async function persistStore() {
  await saveCommentsStore(commentsStore);
}

exports.handler = async (event, context) => {
  console.log('=== Function Invoked ===');
  console.log('Method:', event.httpMethod);

  const method = event.httpMethod;
  const path = event.path || '';
  const rawUrl = event.rawUrl || '';

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    // Load store
    await refreshStore();

    // CORS preflight
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // GET comments
    if (method === 'GET') {
      const { articleId } = event.queryStringParameters || {};

      if (!articleId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'articleId required' })
        };
      }

      const articleKey = String(articleId);
      const comments = commentsStore[articleKey] || [];
      console.log(`📝 Returning ${comments.length} comment(s) for article ${articleKey}`);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Cache-Control': 'no-cache' },
        body: JSON.stringify({ comments })
      };
    }

    // Auth required for POST/DELETE
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    const tokenData = decodeToken(authHeader);

    if (!tokenData || !tokenData.email) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    const isAdmin = tokenData.email === ADMIN_EMAIL;
    const requestBody = event.body ? JSON.parse(event.body) : {};

    // Determine action
    let action = requestBody.action || 'comment';
    if (path.includes('/comment-like') || rawUrl.includes('/comment-like')) {
      action = 'like';
    } else if (path.includes('/comment-reply') || rawUrl.includes('/comment-reply')) {
      action = 'reply';
    }

    // POST operations
    if (method === 'POST') {
      // LIKE
      if (action === 'like') {
        const { articleId, commentId, replyId } = requestBody;
        if (!articleId || !commentId) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'articleId and commentId required' })
          };
        }

        const articleKey = String(articleId);
        const comments = commentsStore[articleKey] || [];
        const comment = comments.find(c => c.id === commentId);

        if (!comment) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Comment not found' })
          };
        }

        if (replyId) {
          const reply = comment.replies.find(r => r.id === replyId);
          if (!reply) {
            return {
              statusCode: 404,
              headers: corsHeaders,
              body: JSON.stringify({ error: 'Reply not found' })
            };
          }
          const idx = reply.likes.indexOf(tokenData.email);
          if (idx > -1) {
            reply.likes.splice(idx, 1);
          } else {
            reply.likes.push(tokenData.email);
          }
        } else {
          const idx = comment.likes.indexOf(tokenData.email);
          if (idx > -1) {
            comment.likes.splice(idx, 1);
          } else {
            comment.likes.push(tokenData.email);
          }
        }

        commentsStore[articleKey] = comments;
        await persistStore();

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ success: true, comments })
        };
      }

      // REPLY
      if (action === 'reply') {
        const { articleId, commentId, text, username } = requestBody;
        if (!articleId || !commentId || !text) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Missing required fields' })
          };
        }

        const articleKey = String(articleId);
        const comments = commentsStore[articleKey] || [];
        const comment = comments.find(c => c.id === commentId);

        if (!comment) {
          return {
            statusCode: 404,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Comment not found' })
          };
        }

        const newReply = {
          id: generateId(),
          author: {
            name: username || tokenData.email.split('@')[0],
            email: tokenData.email
          },
          text,
          timestamp: new Date().toISOString(),
          likes: []
        };

        comment.replies.push(newReply);
        commentsStore[articleKey] = comments;
        await persistStore();

        console.log('✅ Reply created');

        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({ success: true, reply: newReply, comments })
        };
      }

      // COMMENT (default)
      const { articleId, text, type, username } = requestBody;

      if (!articleId || !text) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'articleId and text required' })
        };
      }

      const commentType = (type === 'reporter' && isAdmin) ? 'reporter' : 'user';
      const displayName = commentType === 'reporter'
        ? 'OnPointArticles Team'
        : (username || tokenData.email.split('@')[0]);

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

      console.log(`💬 Creating ${commentType} comment by ${tokenData.email}`);
      await persistStore();
      console.log('✅ Comment saved');

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, comment: newComment, comments })
      };
    }

    // DELETE
    if (method === 'DELETE') {
      if (!isAdmin) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Admin access required' })
        };
      }

      const { articleId, commentId, replyId } = requestBody;

      if (!articleId || !commentId) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'articleId and commentId required' })
        };
      }

      const articleKey = String(articleId);
      let comments = commentsStore[articleKey] || [];

      if (replyId) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.replies = comment.replies.filter(r => r.id !== replyId);
        }
      } else {
        comments = comments.filter(c => c.id !== commentId);
      }

      commentsStore[articleKey] = comments;
      await persistStore();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, comments })
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    console.error('Stack:', error.stack);

    // Return error but don't crash
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

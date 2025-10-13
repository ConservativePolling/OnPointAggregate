const ADMIN_EMAIL = 'jaydenmdavis2008@outlook.com';

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

// In-memory storage
let commentsStore = {};

exports.handler = async (event, context) => {
  console.log('Function invoked:', event.httpMethod, event.path);

  const method = event.httpMethod;
  const path = event.path || '';

  try {
    // Handle different routes
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

    if (method === 'GET') {
      const { articleId } = event.queryStringParameters || {};

      if (!articleId) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId is required' })
        };
      }

      const comments = commentsStore[articleId] || [];
      console.log('Returning', comments.length, 'comments for article', articleId);

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
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    const tokenData = decodeToken(authHeader);

    if (!tokenData || !tokenData.email) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    const isAdmin = tokenData.email === ADMIN_EMAIL;
    const requestBody = event.body ? JSON.parse(event.body) : {};

    // POST - Create comment
    if (method === 'POST' && !path.includes('/like') && !path.includes('/reply')) {
      const { articleId, text, type } = requestBody;

      if (!articleId || !text) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId and text are required' })
        };
      }

      // Determine comment type
      const commentType = (type === 'reporter' && isAdmin) ? 'reporter' : 'user';

      const comments = commentsStore[articleId] || [];

      const newComment = {
        id: generateId(),
        articleId,
        type: commentType,
        author: {
          name: tokenData.email.split('@')[0],
          email: tokenData.email
        },
        text,
        timestamp: new Date().toISOString(),
        likes: [],
        replies: []
      };

      comments.unshift(newComment);
      commentsStore[articleId] = comments;

      console.log('Comment created:', newComment.id, 'by', tokenData.email);

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, comment: newComment, comments })
      };
    }

    // POST /like - Like/unlike a comment
    if (method === 'POST' && path.includes('/like')) {
      const { articleId, commentId, replyId } = requestBody;

      if (!articleId || !commentId) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId and commentId are required' })
        };
      }

      const comments = commentsStore[articleId] || [];
      const comment = comments.find(c => c.id === commentId);

      if (!comment) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Comment not found' })
        };
      }

      // Handle reply like
      if (replyId) {
        const reply = comment.replies.find(r => r.id === replyId);
        if (!reply) {
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Reply not found' })
          };
        }

        const likeIndex = reply.likes.indexOf(tokenData.email);
        if (likeIndex > -1) {
          reply.likes.splice(likeIndex, 1);
        } else {
          reply.likes.push(tokenData.email);
        }
      } else {
        // Handle comment like
        const likeIndex = comment.likes.indexOf(tokenData.email);
        if (likeIndex > -1) {
          comment.likes.splice(likeIndex, 1);
        } else {
          comment.likes.push(tokenData.email);
        }
      }

      commentsStore[articleId] = comments;

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, comments })
      };
    }

    // POST /reply - Reply to a comment
    if (method === 'POST' && path.includes('/reply')) {
      const { articleId, commentId, text } = requestBody;

      if (!articleId || !commentId || !text) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId, commentId, and text are required' })
        };
      }

      const comments = commentsStore[articleId] || [];
      const comment = comments.find(c => c.id === commentId);

      if (!comment) {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Comment not found' })
        };
      }

      const newReply = {
        id: generateId(),
        author: {
          name: tokenData.email.split('@')[0],
          email: tokenData.email
        },
        text,
        timestamp: new Date().toISOString(),
        likes: []
      };

      comment.replies.push(newReply);
      commentsStore[articleId] = comments;

      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, reply: newReply, comments })
      };
    }

    // DELETE - Delete comment (admin only)
    if (method === 'DELETE') {
      if (!isAdmin) {
        return {
          statusCode: 403,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Admin access required' })
        };
      }

      const { articleId, commentId, replyId } = requestBody;

      if (!articleId || !commentId) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'articleId and commentId are required' })
        };
      }

      let comments = commentsStore[articleId] || [];

      if (replyId) {
        // Delete reply
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.replies = comment.replies.filter(r => r.id !== replyId);
        }
      } else {
        // Delete comment
        comments = comments.filter(c => c.id !== commentId);
      }

      commentsStore[articleId] = comments;

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
    console.error('Error in article-comments function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

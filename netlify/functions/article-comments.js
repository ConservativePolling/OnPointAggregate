const { getStore } = require('@netlify/blobs');

const ADMIN_EMAIL = 'jaydenmdavis2008@outlook.com';

// Decode JWT token to get user info
function decodeToken(token) {
  try {
    if (!token) return null;

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // JWT tokens are base64url encoded and have 3 parts separated by dots
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

exports.handler = async (event, context) => {
  const method = event.httpMethod;
  const store = getStore('comments');

  try {
    switch (method) {
      case 'GET':
        // Get comments for an article
        const { articleId } = event.queryStringParameters || {};

        if (!articleId) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'articleId is required' })
          };
        }

        const comments = await store.get(articleId, { type: 'json' }) || [];

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ comments })
        };

      case 'POST':
        // Add a comment (admin only)
        const authHeader = event.headers.authorization || event.headers.Authorization;

        if (!authHeader) {
          return {
            statusCode: 401,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'No authorization token provided' })
          };
        }

        // Decode the JWT token to get user info
        const tokenData = decodeToken(authHeader);

        if (!tokenData || !tokenData.email) {
          return {
            statusCode: 401,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Invalid token or no email found' })
          };
        }

        // Check if user is admin
        if (tokenData.email !== ADMIN_EMAIL) {
          return {
            statusCode: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: `Forbidden - Admin only. Your email: ${tokenData.email}` })
          };
        }

        const { articleId: postArticleId, text } = JSON.parse(event.body);

        if (!postArticleId || !text) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'articleId and text are required' })
          };
        }

        // Get existing comments
        const existingComments = await store.get(postArticleId, { type: 'json' }) || [];

        // Create new comment
        const newComment = {
          timestamp: new Date().toISOString(),
          text: text,
          highlighted: false
        };

        // Add to the beginning (most recent first)
        const updatedComments = [newComment, ...existingComments];

        // Save back to store
        await store.setJSON(postArticleId, updatedComments);

        return {
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            success: true,
            comment: newComment,
            comments: updatedComments
          })
        };

      case 'OPTIONS':
        // Handle CORS preflight
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
          },
          body: ''
        };

      default:
        return {
          statusCode: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in article-comments function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

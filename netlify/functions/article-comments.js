const ADMIN_EMAIL = 'jaydenmdavis2008@outlook.com';

// Decode JWT token to get user info
function decodeToken(token) {
  try {
    if (!token) {
      console.log('No token provided');
      return null;
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // JWT tokens are base64url encoded and have 3 parts separated by dots
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.log('Invalid token format - not 3 parts');
      return null;
    }

    // Decode the payload (second part)
    // JWT uses base64url encoding, which needs to be converted to base64
    let payload = parts[1];

    // Replace base64url characters with base64
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (payload.length % 4 !== 0) {
      payload += '=';
    }

    const decoded = Buffer.from(payload, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    console.log('Token decoded successfully, email:', parsed.email);
    return parsed;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
}

// In-memory storage (will reset on function cold start, but good enough for demo)
// In production, you'd use a real database
let commentsStore = {};

exports.handler = async (event, context) => {
  console.log('Function invoked:', event.httpMethod, event.path);

  const method = event.httpMethod;

  try {
    switch (method) {
      case 'GET':
        // Get comments for an article
        const { articleId } = event.queryStringParameters || {};

        console.log('GET request for articleId:', articleId);

        if (!articleId) {
          console.log('No articleId provided');
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'articleId is required' })
          };
        }

        const comments = commentsStore[articleId] || [];
        console.log('Returning', comments.length, 'comments');

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
        console.log('POST request received');
        const authHeader = event.headers.authorization || event.headers.Authorization;

        console.log('Auth header present:', !!authHeader);

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
          console.log('User not admin:', tokenData.email);
          return {
            statusCode: 403,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: `Forbidden - Admin only. Your email: ${tokenData.email}` })
          };
        }

        const requestBody = JSON.parse(event.body);
        const { articleId: postArticleId, text } = requestBody;

        console.log('Posting comment to article:', postArticleId);

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
        const existingComments = commentsStore[postArticleId] || [];

        // Create new comment
        const newComment = {
          timestamp: new Date().toISOString(),
          text: text,
          highlighted: false
        };

        // Add to the beginning (most recent first)
        const updatedComments = [newComment, ...existingComments];

        // Save back to store
        commentsStore[postArticleId] = updatedComments;

        console.log('Comment saved successfully. Total comments:', updatedComments.length);

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

const { getStore } = require('@netlify/blobs');

const ADMIN_EMAIL = 'jaydenmdavis2008@outlook.com';

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
            body: JSON.stringify({ error: 'articleId is required' })
          };
        }

        const comments = await store.get(articleId, { type: 'json' }) || [];

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({ comments })
        };

      case 'POST':
        // Add a comment (admin only)
        const { user } = context.clientContext || {};

        if (!user) {
          return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
          };
        }

        // Check if user is admin
        if (user.email !== ADMIN_EMAIL) {
          return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Forbidden - Admin only' })
          };
        }

        const { articleId: postArticleId, text } = JSON.parse(event.body);

        if (!postArticleId || !text) {
          return {
            statusCode: 400,
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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: true,
            comment: newComment,
            comments: updatedComments
          })
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in article-comments function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

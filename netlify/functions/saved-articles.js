// Netlify Function to manage saved articles
exports.handler = async (event, context) => {
  const { user } = context.clientContext;

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  const method = event.httpMethod;

  try {
    switch (method) {
      case 'GET':
        // Get user's saved articles
        // In production, fetch from database
        return {
          statusCode: 200,
          body: JSON.stringify({
            savedArticles: []
          })
        };

      case 'POST':
        // Save an article
        const { articleId } = JSON.parse(event.body);
        // In production, save to database
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Article saved',
            articleId
          })
        };

      case 'DELETE':
        // Remove saved article
        const { articleId: removeId } = JSON.parse(event.body);
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Article removed',
            articleId: removeId
          })
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

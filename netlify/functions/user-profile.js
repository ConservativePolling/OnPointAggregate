// Netlify Function to manage user profiles
exports.handler = async (event, context) => {
  const { user } = context.clientContext;

  // Check if user is authenticated
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
        // Get user profile
        // In production, fetch from database (Fauna, Supabase, etc.)
        return {
          statusCode: 200,
          body: JSON.stringify({
            id: user.sub,
            email: user.email,
            profile: {
              name: user.user_metadata?.full_name || '',
              avatar: user.user_metadata?.avatar_url || '',
              savedArticles: [],
              preferences: {
                emailNotifications: true,
                darkMode: false
              }
            }
          })
        };

      case 'PUT':
        // Update user profile
        const data = JSON.parse(event.body);
        // In production, save to database
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, data })
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

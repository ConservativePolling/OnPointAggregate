exports.handler = async (event, context) => {
  // Get the admin user from Netlify Identity context
  const { user } = context.clientContext;

  // Check if user is logged in
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Not authenticated' })
    };
  }

  // Check if user is admin (replace with your admin email)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'your-email@example.com';
  if (user.email !== ADMIN_EMAIL) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Unauthorized - Admin only' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get user ID from request body
  const { userId } = JSON.parse(event.body);

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID required' })
    };
  }

  // Update user metadata using Netlify Identity Admin API
  // Note: This requires the NETLIFY_API_TOKEN environment variable
  const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const SITE_URL = process.env.URL;

  try {
    const response = await fetch(`${SITE_URL}/.netlify/identity/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
      },
      body: JSON.stringify({
        app_metadata: {
          status: 'approved',
          approvedAt: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const updatedUser = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'User approved successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          status: 'approved'
        }
      })
    };
  } catch (error) {
    console.error('Error approving user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to approve user' })
    };
  }
};

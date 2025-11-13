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

  // Get all users using Netlify Identity Admin API
  const NETLIFY_API_TOKEN = process.env.NETLIFY_API_TOKEN;
  const SITE_URL = process.env.URL;

  try {
    const response = await fetch(`${SITE_URL}/.netlify/identity/admin/users`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();

    // Filter and format users
    const waitlistUsers = users
      .map(u => ({
        id: u.id,
        email: u.email,
        status: u.app_metadata?.status || 'waitlist',
        waitlistPosition: u.app_metadata?.waitlistPosition,
        requestedAt: u.app_metadata?.requestedAt || u.created_at,
        approvedAt: u.app_metadata?.approvedAt
      }))
      .sort((a, b) => new Date(a.requestedAt) - new Date(b.requestedAt));

    // Separate waitlist and approved users
    const onWaitlist = waitlistUsers.filter(u => u.status === 'waitlist');
    const approved = waitlistUsers.filter(u => u.status === 'approved');

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: waitlistUsers.length,
        waitlist: onWaitlist,
        approved: approved,
        waitlistCount: onWaitlist.length,
        approvedCount: approved.length
      })
    };
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch waitlist' })
    };
  }
};

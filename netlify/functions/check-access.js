exports.handler = async (event, context) => {
  // Get the user from Netlify Identity context
  const { user } = context.clientContext;

  // If no user is logged in
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Not authenticated',
        hasAccess: false
      })
    };
  }

  // Get user metadata
  const userMetadata = user.app_metadata || {};
  const status = userMetadata.status || 'waitlist';

  // Check if user is approved
  const hasAccess = status === 'approved';

  return {
    statusCode: 200,
    body: JSON.stringify({
      hasAccess,
      status,
      waitlistPosition: userMetadata.waitlistPosition,
      email: user.email,
      requestedAt: userMetadata.requestedAt
    })
  };
};

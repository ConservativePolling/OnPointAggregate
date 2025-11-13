// This function runs automatically when a new user signs up
// It adds them to the waitlist by setting their app_metadata

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);

  // Get current waitlist count to assign position
  const waitlistPosition = Date.now() % 10000; // Simple position based on timestamp

  // Set user metadata to add them to waitlist
  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        status: 'waitlist',
        requestedAt: new Date().toISOString(),
        waitlistPosition: waitlistPosition
      }
    })
  };
};

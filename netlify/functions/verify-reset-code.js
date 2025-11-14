// Import the same resetCodes Map from request-reset-code
// Note: In serverless, each function instance has its own memory
// For production, use a database or Redis
// This works for demo/testing with warm instances

// Shared storage reference (works when functions are warm)
const resetCodes = global.resetCodes || new Map();
global.resetCodes = resetCodes;

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, email } = JSON.parse(event.body);

    // Validate input
    if (!code || !/^\d{6}$/.test(code)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid code format. Must be 6 digits.' })
      };
    }

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email required' })
      };
    }

    // Check if code exists
    const codeData = resetCodes.get(code);

    if (!codeData) {
      console.log(`✗ Code not found: ${code}`);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          error: 'Invalid code. Please check your email and try again.',
          attemptsRemaining: 0
        })
      };
    }

    // Verify email matches
    if (codeData.email !== email) {
      console.log(`✗ Email mismatch for code ${code}: ${email} !== ${codeData.email}`);
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: 'Code does not match email address',
          attemptsRemaining: 0
        })
      };
    }

    // Check expiration (2 minutes)
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    const age = now - codeData.timestamp;

    if (age > twoMinutes) {
      console.log(`✗ Code expired: ${code} (${Math.floor(age / 1000)}s old)`);
      resetCodes.delete(code);
      return {
        statusCode: 410,
        headers,
        body: JSON.stringify({
          error: 'Code has expired. Please request a new one.',
          expired: true
        })
      };
    }

    // Rate limiting on attempts
    codeData.attempts++;

    if (codeData.attempts > 5) {
      console.log(`✗ Too many attempts for code: ${code}`);
      resetCodes.delete(code);
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Too many incorrect attempts. Please request a new code.',
          locked: true
        })
      };
    }

    // Success! Return the recovery token
    console.log(`✓ Code verified: ${code} for ${email}`);

    // Delete code (one-time use)
    const token = codeData.token;
    resetCodes.delete(code);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token: token,
        email: email,
        message: 'Code verified successfully'
      })
    };

  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};

// Share the resetCodes Map with request-reset-code
// This allows both functions to access the same data when warm
if (require.main === module) {
  const requestResetCode = require('./request-reset-code');
  if (requestResetCode.resetCodes) {
    global.resetCodes = requestResetCode.resetCodes;
  }
}

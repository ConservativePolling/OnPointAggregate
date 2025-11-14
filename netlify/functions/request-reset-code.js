const fetch = require('node-fetch');

// In-memory storage for codes (serverless-friendly)
// Format: { code: { email, token, timestamp, attempts } }
const resetCodes = new Map();

// Rate limiting: { email: { lastRequest, count } }
const rateLimits = new Map();

// Cleanup expired codes every 30 seconds
setInterval(() => {
  const now = Date.now();
  const twoMinutes = 2 * 60 * 1000;

  for (const [code, data] of resetCodes.entries()) {
    if (now - data.timestamp > twoMinutes) {
      resetCodes.delete(code);
      console.log(`Cleaned up expired code: ${code}`);
    }
  }
}, 30000);

// Generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    const { email } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email required' })
      };
    }

    // Rate limiting: Max 5 requests per hour per email
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const rateLimit = rateLimits.get(email) || { lastRequest: 0, count: 0 };

    // Reset count if hour has passed
    if (now - rateLimit.lastRequest > oneHour) {
      rateLimit.count = 0;
    }

    if (rateLimit.count >= 5) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error: 'Too many requests. Please wait an hour before requesting another code.'
        })
      };
    }

    // Get Netlify Identity URL from environment
    const siteUrl = process.env.URL || 'https://onpointaggregate.netlify.app';
    const identityUrl = `${siteUrl}/.netlify/identity`;

    // Request recovery token from Netlify Identity
    console.log('Requesting recovery token for:', email);
    const recoveryResponse = await fetch(`${identityUrl}/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!recoveryResponse.ok) {
      const error = await recoveryResponse.text();
      console.error('Recovery request failed:', error);
      return {
        statusCode: recoveryResponse.status,
        headers,
        body: JSON.stringify({
          error: 'Failed to generate reset code. User may not exist.'
        })
      };
    }

    // Generate 6-digit code
    let code = generateCode();

    // Ensure code is unique
    while (resetCodes.has(code)) {
      code = generateCode();
    }

    const recoveryData = await recoveryResponse.json();

    // Store code with metadata
    resetCodes.set(code, {
      email,
      token: recoveryData.recovery_token || code, // Fallback if structure differs
      timestamp: now,
      attempts: 0
    });

    // Update rate limit
    rateLimit.count++;
    rateLimit.lastRequest = now;
    rateLimits.set(email, rateLimit);

    console.log(`✓ Generated code for ${email}: ${code} (expires in 2 minutes)`);
    console.log(`Rate limit: ${rateLimit.count}/5 requests`);

    // In production, you'd send this via email service
    // For now, return it in response (you can remove this in production)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Reset code sent to your email',
        // REMOVE THIS IN PRODUCTION - for testing only:
        code: code, // Only for testing - remove in production
        expiresIn: 120 // seconds
      })
    };

  } catch (error) {
    console.error('Error generating reset code:', error);
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

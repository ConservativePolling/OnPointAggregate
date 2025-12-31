const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// Polyfill fetch for Node < 18
const fetch = globalThis.fetch || require('node-fetch');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// In-memory storage for codes (survives for function warm time ~5-15 min)
const codeStorage = new Map();

// Clean up expired codes every minute
setInterval(() => {
  const now = Date.now();
  const twoMinutes = 2 * 60 * 1000;

  for (const [code, data] of codeStorage.entries()) {
    if (now - data.timestamp > twoMinutes) {
      codeStorage.delete(code);
    }
  }
}, 60000);

// Generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.handler = async (event, context) => {
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

    console.log('[Reset] Password reset requested for:', email);

    // Check SendGrid configuration
    if (!process.env.SENDGRID_API_KEY) {
      console.error('[Reset] SENDGRID_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    if (!process.env.FROM_EMAIL) {
      console.error('[Reset] FROM_EMAIL not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    // Generate recovery token from Netlify Identity
    let recoveryToken;
    try {
      const siteUrl = process.env.URL || 'https://onpointaggregate.com';
      const apiUrl = `${siteUrl}/.netlify/identity`;

      console.log('[Reset] Calling Netlify Identity at:', apiUrl + '/recover');

      const identityResponse = await fetch(`${apiUrl}/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!identityResponse.ok) {
        const errorText = await identityResponse.text();
        console.error('[Reset] Identity recovery failed:', identityResponse.status, errorText);
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found. Please check your email address.' })
        };
      }

      const identityData = await identityResponse.json();
      recoveryToken = identityData.recovery_token;
      console.log('[Reset] Recovery token generated successfully');
    } catch (identityError) {
      console.error('[Reset] Identity API error:', identityError.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Identity service error',
          details: identityError.message
        })
      };
    }

    // Generate 6-digit code
    let code = generateCode();

    // Ensure code is unique
    while (codeStorage.has(code)) {
      code = generateCode();
    }

    const now = Date.now();

    // Store code in memory
    codeStorage.set(code, {
      email,
      token: recoveryToken,
      timestamp: now,
      attempts: 0
    });

    console.log('[Reset] Generated and stored code:', code);
    console.log('[Reset] Storage size:', codeStorage.size, 'codes');

    // Send email with code
    const emailSent = await sendResetEmail(email, code);

    if (!emailSent) {
      // Clean up code if email failed
      codeStorage.delete(code);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send email. Please try again.' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Reset code sent to your email',
        expiresIn: 120 // seconds
      })
    };

  } catch (error) {
    console.error('✗ Error generating reset code:', error);
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

// Export storage for verify function to access
exports.codeStorage = codeStorage;

async function sendResetEmail(email, code) {
  try {
    // Clean, minimal email template - Vercel style
    const template = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #eaeaea;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #000; letter-spacing: -0.02em;">
                OnPointAggregate
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #000; text-align: center;">
                Reset your password
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #666; text-align: center;">
                Enter this code to reset your password for <strong style="color: #000;">${email}</strong>
              </p>

              <!-- Code Display (Single, Clean) -->
              <div style="text-align: center; margin: 32px 0;">
                <div style="display: inline-block; background: #fafafa; border: 1px solid #eaeaea; border-radius: 8px; padding: 16px 24px;">
                  <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000; letter-spacing: 8px;">
                    ${code}
                  </p>
                </div>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; text-align: center;">
                This code expires in <strong style="color: #000;">2 minutes</strong>
              </p>

              <p style="margin: 0; font-size: 13px; color: #999; text-align: center;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                © 2025 OnPointAggregate. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Password Reset Code - OnPointAggregate',
      html: template
    };

    await sgMail.send(msg);
    console.log('[Reset] Email sent successfully to:', email);
    return true;

  } catch (error) {
    console.error('[Reset] Email sending error:', error.message);
    if (error.response) {
      console.error('[Reset] SendGrid error details:', error.response.body);
    }
    return false;
  }
}

const { getStore } = require('@netlify/blobs');
const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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

    // Get Netlify Blobs store
    const store = getStore('reset-codes');
    const rateLimitStore = getStore('rate-limits');

    // Rate limiting: Max 5 requests per hour per email
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const rateLimitData = await rateLimitStore.get(email);
    let rateLimit = rateLimitData ? JSON.parse(rateLimitData) : { lastRequest: 0, count: 0 };

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
    const siteUrl = process.env.URL || 'http://localhost:8888';
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
    let existingCode = await store.get(code);
    while (existingCode) {
      code = generateCode();
      existingCode = await store.get(code);
    }

    const recoveryData = await recoveryResponse.json();

    // Store code in Netlify Blobs with 2-minute TTL
    await store.set(code, JSON.stringify({
      email,
      token: recoveryData.recovery_token || code,
      timestamp: now,
      attempts: 0
    }), {
      metadata: { ttl: 120 } // 2 minutes
    });

    // Update rate limit
    rateLimit.count++;
    rateLimit.lastRequest = now;
    await rateLimitStore.set(email, JSON.stringify(rateLimit), {
      metadata: { ttl: 3600 } // 1 hour
    });

    console.log(`✓ Generated code for ${email}: ${code} (expires in 2 minutes)`);
    console.log(`Rate limit: ${rateLimit.count}/5 requests`);

    // Send email with code
    const emailSent = await sendResetEmail(email, code);

    if (!emailSent) {
      // If email fails, still return success but log warning
      console.warn('⚠️ Email sending failed, but code is stored. Code:', code);
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

async function sendResetEmail(email, code) {
  try {
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('✗ SENDGRID_API_KEY not configured');
      return false;
    }

    if (!process.env.FROM_EMAIL) {
      console.error('✗ FROM_EMAIL not configured');
      return false;
    }

    // Email template (inlined for Netlify Functions compatibility)
    let template = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
    <!-- Logo/Header -->
    <div style="text-align: center; margin-bottom: 32px; border-bottom: 2px solid #e5e7eb; padding-bottom: 24px;">
      <h1 style="font-size: 28px; font-weight: 700; color: #000; margin: 0; letter-spacing: -0.02em;">
        OnPoint<span style="color: #000;">A</span>ggregate
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0;">Real-time polling and analysis</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 16px 0; text-align: center;">Reset Your Password</h2>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
        We received a request to reset your password for<br>
        <strong>{{ .Email }}</strong>
      </p>

      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
        Enter this 6-digit code to reset your password:
      </p>

      <!-- 6-Digit Code Display -->
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #000 0%, #111 100%); padding: 20px 40px; border-radius: 16px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);">
          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
            <tr>
              <td style="padding: 0 6px;">
                <div style="width: 44px; height: 52px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000;">{{ index .Token 0 }}</span>
                </div>
              </td>
              <td style="padding: 0 6px;">
                <div style="width: 44px; height: 52px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000;">{{ index .Token 1 }}</span>
                </div>
              </td>
              <td style="padding: 0 6px;">
                <div style="width: 44px; height: 52px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000;">{{ index .Token 2 }}</span>
                </div>
              </td>
              <td style="padding: 0 6px;">
                <div style="width: 44px; height: 52px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000;">{{ index .Token 3 }}</span>
                </div>
              </td>
              <td style="padding: 0 6px;">
                <div style="width: 44px; height: 52px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000;">{{ index .Token 4 }}</span>
                </div>
              </td>
              <td style="padding: 0 6px;">
                <div style="width: 44px; height: 52px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #000;">{{ index .Token 5 }}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Simplified Text Version for Email Clients -->
      <p style="text-align: center; font-family: 'Courier New', monospace; font-size: 28px; font-weight: 700; color: #000; letter-spacing: 8px; background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
        {{ .Token }}
      </p>
    </div>

    <!-- Important Info -->
    <div style="background: rgba(239, 68, 68, 0.05); border-left: 3px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
      <p style="color: #991b1b; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
        ⏱️ This code expires in 2 minutes
      </p>
      <p style="color: #7f1d1d; font-size: 13px; line-height: 1.5; margin: 0;">
        For security reasons, this code can only be used once and expires quickly.
      </p>
    </div>

    <!-- Security Notice -->
    <div style="background: rgba(255, 255, 255, 0.6); border-radius: 12px; padding: 20px;">
      <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 12px 0;">
        <strong style="color: #374151;">Security Notice:</strong>
      </p>
      <ul style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 6px;">Never share this code with anyone</li>
        <li style="margin-bottom: 6px;">OnPointAggregate staff will never ask for this code</li>
        <li>If you didn't request this, ignore this email and your password will remain unchanged</li>
      </ul>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb; margin-top: 24px;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © 2025 OnPointAggregate. All rights reserved.
      </p>
    </div>
  </div>
</div>
`;

    // Replace variables
    template = template.replace(/\{\{ \.Email \}\}/g, email);

    // Replace individual digits for the boxes
    for (let i = 0; i < 6; i++) {
      const pattern = new RegExp(`\\{\\{ index \\.Token ${i} \\}\\}`, 'g');
      template = template.replace(pattern, code[i]);
    }

    // Replace full token
    template = template.replace(/\{\{ \.Token \}\}/g, code);

    // Send email via SendGrid
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: 'Password Reset Code - OnPointAggregate',
      html: template
    };

    await sgMail.send(msg);
    console.log('✓ Email sent successfully to:', email);
    return true;

  } catch (error) {
    console.error('✗ Email sending error:', error);
    if (error.response) {
      console.error('SendGrid error:', error.response.body);
    }
    return false;
  }
}

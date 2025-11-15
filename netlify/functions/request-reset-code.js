const { getStore } = require('@netlify/blobs');
const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

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

    // Load email template
    const templatePath = path.join(__dirname, '../../email-templates/reset-code.html');
    let template = await fs.readFile(templatePath, 'utf-8');

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

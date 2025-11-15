# SendGrid Setup Guide for Password Reset System

## 🚀 Quick Setup (5 minutes)

Your code-based password reset system needs SendGrid to send emails. Follow these steps:

---

## Step 1: Create SendGrid Account (Free)

1. Go to: https://signup.sendgrid.com/
2. Sign up for **FREE account** (no credit card required)
3. Choose "Email API" as your use case
4. Verify your email address

**Free tier includes:**
- 100 emails/day (perfect for password resets)
- Full API access
- Email templates
- Analytics

---

## Step 2: Verify Sender Email

**IMPORTANT:** SendGrid requires you to verify the email address you'll send from.

### Option A: Single Sender Verification (Easiest)

1. Go to: https://app.sendgrid.com/settings/sender_auth/senders
2. Click **"Create New Sender"**
3. Fill in:
   - **From Name:** OnPointAggregate
   - **From Email:** `noreply@yourdomain.com` (use your domain)
   - **Reply To:** Your support email
   - **Company Address:** Your address
4. Click **"Create"**
5. Check your email and click verification link
6. **Wait for verification to complete** (can take a few minutes)

### Option B: Domain Authentication (Advanced, Better Deliverability)

1. Go to: https://app.sendgrid.com/settings/sender_auth/domain/create
2. Enter your domain (e.g., `onpointaggregate.com`)
3. Follow DNS setup instructions
4. Add CNAME records to your domain's DNS
5. Verify domain

**Recommended:** Start with Option A, upgrade to Option B later for better deliverability.

---

## Step 3: Create API Key

1. Go to: https://app.sendgrid.com/settings/api_keys
2. Click **"Create API Key"**
3. Settings:
   - **Name:** `Netlify Password Reset`
   - **Permissions:** Choose **"Restricted Access"**
   - Enable only: **Mail Send** → Full Access
4. Click **"Create & View"**
5. **COPY THE API KEY IMMEDIATELY** (you won't see it again!)

Example key format:
```
SG.xxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

---

## Step 4: Add to Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your site
3. Go to: **Site configuration** → **Environment variables**
4. Click **"Add a variable"**

Add these two variables:

**Variable 1:**
```
Key:   SENDGRID_API_KEY
Value: SG.xxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```
(Paste your actual API key from Step 3)

**Variable 2:**
```
Key:   FROM_EMAIL
Value: noreply@yourdomain.com
```
(Use the EXACT email you verified in Step 2)

5. Click **"Save"**

---

## Step 5: Test the System

### Local Testing (Optional):

1. Create `.env` file in your project root:
   ```
   SENDGRID_API_KEY=SG.xxxxx
   FROM_EMAIL=noreply@yourdomain.com
   ```

2. Install netlify-cli:
   ```bash
   npm install -g netlify-cli
   ```

3. Run locally:
   ```bash
   netlify dev
   ```

4. Test password reset at: http://localhost:8888/login.html

### Production Testing:

1. Deploy to Netlify:
   ```bash
   git push
   ```

2. Go to your deployed site
3. Click "Forgot password?"
4. Enter a test email
5. Check inbox for code (check spam folder too!)
6. Enter code on verify page
7. Reset password
8. Success!

---

## 🔧 Troubleshooting

### "Email not arriving"

**Check these in order:**

1. **Spam folder** - SendGrid emails often go to spam initially
2. **Sender verified?** - Go to SendGrid sender auth, ensure green checkmark
3. **Correct FROM_EMAIL?** - Must match verified sender exactly
4. **API key correct?** - Check Netlify environment variables
5. **Check SendGrid Activity:**
   - Go to: https://app.sendgrid.com/email_activity
   - See if email was sent
   - Check status (delivered/bounced/dropped)

### "SendGrid API Error"

Check Netlify function logs:
1. Netlify dashboard → Functions → request-reset-code
2. Look for SendGrid error messages
3. Common issues:
   - API key invalid → Regenerate in SendGrid
   - Sender not verified → Complete Step 2
   - Rate limit exceeded → Wait or upgrade SendGrid plan

### "401 Unauthorized"

- API key is wrong or expired
- Regenerate API key in SendGrid
- Update Netlify environment variable

### "403 Forbidden"

- Sender email not verified
- Complete Step 2 sender verification
- Wait for verification email and click link

### "Email says 'via sendgrid.net'"

This is normal for single sender verification. To remove:
1. Set up domain authentication (Option B in Step 2)
2. This makes emails appear to come directly from your domain

---

## 📧 Email Template Customization

Your email template is at: `email-templates/reset-code.html`

To customize:
1. Edit the HTML file
2. Keep these variables:
   - `{{ .Email }}` - User's email
   - `{{ .Token }}` - Full 6-digit code
   - `{{ index .Token 0 }}` through `{{ index .Token 5 }}` - Individual digits
3. Deploy changes

---

## 📊 Monitor Email Delivery

**SendGrid Dashboard:**
- Activity Feed: https://app.sendgrid.com/email_activity
- Statistics: https://app.sendgrid.com/statistics
- See delivery rates, opens, bounces

**Netlify Function Logs:**
- Dashboard → Functions → request-reset-code
- See console logs:
  - `✓ Email sent successfully to: user@example.com`
  - `✗ Email sending error:` (with details)

---

## 🎯 Free Tier Limits

**SendGrid Free Plan:**
- 100 emails/day
- Full API access
- Email validation
- Activity feed (7 days)

**If you need more:**
- Essentials Plan: $19.95/mo for 50,000 emails/mo
- Or use alternative: Resend, Mailgun, AWS SES

For password resets, 100/day is usually plenty!

---

## ✅ Verification Checklist

Before going live:

- [ ] SendGrid account created
- [ ] Sender email verified (green checkmark)
- [ ] API key created with Mail Send permission
- [ ] SENDGRID_API_KEY added to Netlify
- [ ] FROM_EMAIL added to Netlify (matches verified sender)
- [ ] Tested locally (optional)
- [ ] Tested on production
- [ ] Email received successfully
- [ ] Code works in verify-code.html
- [ ] Password reset completes

---

## 🔐 Security Notes

**Protect your API key:**
- Never commit to git
- Use environment variables only
- Regenerate if exposed
- Use restricted permissions

**Sender reputation:**
- Don't send spam
- Only send to verified users
- Monitor bounce rates
- Keep unsubscribe link (not needed for password resets)

---

## 📞 Need Help?

**SendGrid Support:**
- Docs: https://docs.sendgrid.com/
- Support: https://support.sendgrid.com/

**Check Status:**
- https://status.sendgrid.com/

**Alternative Services:**
If SendGrid doesn't work:
- Resend: https://resend.com/ (100 emails/day free)
- Mailgun: https://www.mailgun.com/ (5,000 emails/mo free)
- AWS SES: https://aws.amazon.com/ses/ (very cheap, complex setup)

---

**Your password reset system is now fully functional!** 🎉

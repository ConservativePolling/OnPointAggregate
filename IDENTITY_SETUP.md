# Netlify Identity Password Reset Setup Guide

## ⚠️ CRITICAL: Dashboard Configuration Required

Your password reset system is fully coded and ready, but **Netlify Identity MUST be configured in the Netlify dashboard** for emails to work.

**Important:** Netlify Identity settings **CANNOT** be configured in `netlify.toml`. All configuration must be done through the Netlify dashboard UI.

---

## Step 1: Enable Netlify Identity

1. Go to your Netlify dashboard: https://app.netlify.com/
2. Select your site (OnPointAggregate)
3. Go to **Site configuration** → **Identity**
4. Click **"Enable Identity"** if not already enabled

---

## Step 2: Configure Site URL

1. In **Site configuration** → **General** → **Site details**
2. Verify your **Site URL** is set correctly (e.g., `https://yoursite.netlify.app`)
3. This is critical - emails use this URL to generate reset links

---

## Step 3: Configure Password Recovery Email Template

### Option A: Use Custom Template (Recommended - Better Branding)

1. In Netlify dashboard, go to **Site configuration** → **Identity** → **Emails**
2. Find **"Recovery email"** or **"Password Recovery"** section
3. Click **"Edit settings"** or **"Use custom template"**
4. Set template path to: `/email-templates/recovery.html`
5. Click **Save**

> **Important**: The custom template is already in your repository at `email-templates/recovery.html`. It has OnPointAggregate branding and will direct users to your custom reset page.

### Option B: Use Default Template (Quick Setup)

If you want to start quickly without custom branding:

1. Go to **Site configuration** → **Identity** → **Emails**
2. Leave the recovery email template on **"Default"**
3. The default Netlify email will still work, but won't have your branding

> **Note**: The default template will link to `yoursite.com/?#recovery_token=XXX`, NOT to your custom reset-password.html page. For best UX, use Option A with the custom template.

### **Custom Template URL Structure**

Your custom email template uses this URL format:
```
{{ .SiteURL }}/reset-password.html#recovery_token={{ .Token }}
```

This ensures users land on your beautiful custom reset page instead of the default Netlify widget.

---

## Step 4: Configure Email Provider (If Needed)

Netlify uses its own email service by default, but for production you may want to configure SMTP:

1. Go to **Site configuration** → **Identity** → **Emails**
2. Click **"Configure external email provider"**
3. Add your SMTP credentials (optional but recommended for reliability)

### Recommended Email Providers:
- **SendGrid** (free tier available)
- **Mailgun** (free tier available)
- **AWS SES** (very cheap)

---

## Step 5: Test Registration (If Needed)

Make sure users can register:

1. Go to **Site configuration** → **Identity** → **Registration**
2. Choose **"Open"** or **"Invite only"** based on your needs
3. If "Invite only", you'll need to manually invite users

---

## Step 6: Verify Everything Works

### Test the Complete Flow:

1. Go to your deployed site: `https://yoursite.netlify.app/login.html`
2. Click **"Forgot password?"**
3. Enter a registered email address
4. Check the inbox (also check spam/junk folders)
5. Click the reset link in the email
6. Verify it opens `/reset-password.html` with the token in the URL
7. Enter a new password and submit
8. Verify you can log in with the new password

---

## Troubleshooting

### No Email Arriving

**Check these in order:**

1. **Is Netlify Identity enabled?**
   - Dashboard → Identity → Should say "Enabled"

2. **Is the user registered?**
   - Dashboard → Identity → Users → Check if email exists
   - If not, register first at `/login.html`

3. **Check spam/junk folder**
   - Netlify emails often go to spam initially

4. **Verify Site URL**
   - Dashboard → Site settings → Site details
   - Must match your actual site URL

5. **Check email template path**
   - Dashboard → Identity → Emails → Recovery email
   - Should point to `/email-templates/recovery.html`
   - Or leave blank to use default template

6. **Check Browser Console for Errors**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try forgot password flow
   - Look for these helpful log messages:

   **Success indicators:**
   - `✓ Netlify Identity is enabled and ready`
   - `✓ Password recovery email sent successfully to: email@example.com`

   **Error indicators:**
   - `✗ Netlify Identity is not enabled` → Enable Identity in dashboard
   - `✗ Identity not ready yet` → Wait for page to fully load
   - `✗ No recovery token in URL` → Email link is malformed
   - `✗ Password recovery error: User not found` → User doesn't exist, register first

   All critical steps now log to console with ✓ or ✗ symbols for easy debugging!

### Invalid/Expired Token Error

If reset-password.html shows "Invalid or expired link":

1. **Token expires in 1 hour** - Request a new reset email
2. **Already used** - Each token can only be used once
3. **Site URL mismatch** - Verify Site URL in dashboard matches your domain

### Password Reset Page Not Loading

1. **Check URL format**: Should be `yoursite.com/reset-password.html#recovery_token=XXXXX`
2. **Token must be in URL hash** (after `#`)
3. **Open DevTools Console** to see what token was extracted

### Email Sends but Link Doesn't Work

1. **Verify template has correct URL**:
   ```
   {{ .SiteURL }}/reset-password.html#recovery_token={{ .Token }}
   ```
2. **Clear browser cache**
3. **Try incognito/private window**

---

## File Structure

Your password reset system consists of these files:

```
/login.html                      # Has "Forgot password?" modal
/reset-password.html             # Password reset form page
/email-templates/recovery.html   # Custom email template
/netlify.toml                    # Netlify configuration
```

---

## How It Works

### Complete Flow:

1. **User clicks "Forgot password?"** on login.html
2. **Enters email** → `netlifyIdentity.gotrue.requestPasswordRecovery(email)`
3. **Netlify sends email** using template from `/email-templates/recovery.html`
4. **User clicks link** in email → `yoursite.com/reset-password.html#recovery_token=XXXXX`
5. **reset-password.html extracts token** from URL hash
6. **User enters new password** with strength validation
7. **JavaScript calls** `netlifyIdentity.gotrue.recover(token)` then `user.update({ password })`
8. **Success!** User redirected to login with new password

---

## Security Features

✅ **Token expires in 1 hour**
✅ **Each token can only be used once**
✅ **Password strength validation** (min 8 chars, uppercase, lowercase, number)
✅ **Real-time password matching**
✅ **No modal popups** - full custom UI
✅ **HTTPS required** by Netlify Identity

---

## Quick Checklist

Before testing, verify:

- [ ] Netlify Identity is enabled in dashboard
- [ ] Site URL is configured correctly
- [ ] Email template path is set (or using default)
- [ ] At least one user is registered
- [ ] reset-password.html is deployed
- [ ] Tested in deployed environment (not localhost)

---

## Need Help?

1. Check browser console for errors (F12 → Console)
2. Check Netlify function logs: Dashboard → Functions → Identity
3. Verify email in spam folder
4. Try with a different email address
5. Check Netlify Status: https://www.netlifystatus.com/

---

## Note on Localhost Testing

⚠️ **Password reset emails will NOT work on localhost!**

Netlify Identity requires a deployed site URL. Test on:
- Your main Netlify URL: `yoursite.netlify.app`
- Deploy previews
- Production domain

The emails will have links pointing to your deployed site, not localhost.

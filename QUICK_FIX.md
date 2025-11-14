# Quick Fix: Password Reset Not Working

## Most Common Issue: Netlify Dashboard Configuration

**The code is 100% complete. Emails won't send until you configure Netlify Identity in the dashboard.**

---

## Fix in 3 Steps:

### 1. Enable Identity
```
Netlify Dashboard → Your Site → Site configuration → Identity → Enable Identity
```

### 2. Set Email Template
```
Site configuration → Identity → Emails → Recovery email → Template path
Enter: /email-templates/recovery.html
Click Save
```

### 3. Test with Registered User
```
- Go to your deployed site (not localhost!)
- Register an account first at /login.html
- Then try forgot password flow
- Check spam folder
```

---

## Still Not Working?

### Check Browser Console (F12)

Look for these errors:

**"Identity is not enabled"**
→ Go enable it in Netlify dashboard

**"User not found"**
→ Register an account first at /login.html

**"Network error"**
→ Are you on localhost? Won't work - use deployed URL

**No errors but no email?**
→ Check spam folder
→ Verify Site URL in Netlify dashboard matches your domain

---

## Verify Your Setup

Run through this checklist:

```bash
✓ Netlify Identity enabled in dashboard?
✓ Site URL configured correctly?
✓ Email template path set to /email-templates/recovery.html?
✓ Testing on deployed site (not localhost)?
✓ User account already registered?
✓ Checked spam folder?
```

If all ✓, emails should work!

---

## Test Right Now

1. Open: https://app.netlify.com/
2. Find your site → Site configuration → Identity
3. Click "Enable Identity" if you see that button
4. Go to "Emails" → Configure recovery email template path
5. Deploy and test on your live site

---

## Emergency Fallback

If emails still won't send after dashboard config:

1. Dashboard → Identity → Users
2. Click on a user → "Send recovery email"
3. Check if email arrives
4. If YES: Your code works, just need to wait for propagation
5. If NO: You may need to configure an external email provider (SMTP)

---

## The email will look like this:

**Subject:** Reset your password

**Body:**
- OnPointAggregate branding
- "Reset Your Password" heading
- Big blue "Reset Password" button
- Link expires in 1 hour
- Shows user's email address

**Link format:**
```
https://yoursite.com/reset-password.html#recovery_token=LONG_TOKEN_HERE
```

When clicked → Opens your custom reset-password.html page

---

## Code is Ready

All these files are deployed and working:

- ✅ login.html - Forgot password modal
- ✅ reset-password.html - Password reset form
- ✅ email-templates/recovery.html - Beautiful email template
- ✅ netlify.toml - Configuration

**You just need to enable Identity in the Netlify dashboard!**

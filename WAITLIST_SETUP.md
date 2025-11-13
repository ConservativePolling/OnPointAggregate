# Waitlist System Setup Instructions

## Overview
Your waitlist system is now ready! This guide will walk you through enabling it on Netlify.

## Step 1: Push Code to GitHub

```bash
cd /Users/jaydendavis/trumpap
git add .
git commit -m "Add waitlist system with Netlify Identity"
git push
```

## Step 2: Enable Netlify Identity

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to **Identity** tab in the left sidebar
4. Click **Enable Identity**

## Step 3: Configure Identity Settings

### Registration Settings
1. In Identity tab, click **Settings and usage**
2. Under **Registration**, select **Open** or **Invite only**
   - **Open**: Anyone can sign up (recommended for waitlist)
   - **Invite only**: You manually invite users

### External Providers (Optional)
1. Scroll to **External providers**
2. Enable **Google** and **GitHub** if you want OAuth
3. Configure each provider with your OAuth credentials

## Step 4: Set Up Identity Hooks (Important!)

This automatically adds new users to the waitlist:

1. In Identity settings, scroll to **Identity** section
2. Click **Functions**
3. Create a new function called `identity-signup`
4. Add this code:

```javascript
exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        status: 'waitlist',
        requestedAt: new Date().toISOString(),
        waitlistPosition: Math.floor(Math.random() * 1000) + 1
      }
    })
  };
};
```

This ensures every new signup is automatically placed on the waitlist!

## Step 5: Set Environment Variables

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add these variables:

```
ADMIN_EMAIL=your-email@example.com
```

Replace `your-email@example.com` with YOUR email address. Only this email will have admin access.

## Step 6: Deploy

Your site will auto-deploy from GitHub. Once deployed:

1. Visit your site's login page: `yoursite.netlify.app/login.html`
2. Create a test account
3. You'll be redirected to dashboard showing waitlist message
4. Log in with your admin email
5. Visit: `yoursite.netlify.app/admin.html`
6. You'll see the waitlist and can approve users!

## How It Works

### User Flow:
1. User visits `/login.html`
2. Signs up (auto-added to waitlist)
3. Redirected to `/dashboard.html`
4. Sees "You're on the waitlist!" message
5. Cannot access main app

### Admin Flow:
1. You log in with admin email
2. Visit `/admin.html`
3. See all waitlist users
4. Click "Approve" next to any user
5. User's status changes from "waitlist" to "approved"
6. User can now access `/verbal-landing.html`

### Protected Content:
To protect any page, add this code at the top:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  netlifyIdentity.on('init', async user => {
    if (!user) {
      window.location.href = '/login.html';
      return;
    }

    // Check if user is approved
    const response = await fetch('/.netlify/functions/check-access', {
      headers: { 'Authorization': `Bearer ${user.token.access_token}` }
    });
    const data = await response.json();

    if (!data.hasAccess) {
      window.location.href = '/dashboard.html';
    }
  });
</script>
```

## Pages Overview

- `/login.html` - Sign up / Sign in
- `/dashboard.html` - Shows waitlist status or redirects if approved
- `/admin.html` - Admin panel to manage waitlist (your email only)
- `/verbal-landing.html` - Main app (protected, approved users only)

## Netlify Functions

Located in `/netlify/functions/`:

- `check-access.js` - Verifies if user has access
- `approve-user.js` - Admin function to approve users
- `get-waitlist.js` - Admin function to get all users

## Testing

1. Create a test account with a non-admin email
2. You should see the waitlist message
3. Log out, log in with your admin email
4. Visit `/admin.html`
5. Approve the test account
6. Log out, log back in with test account
7. Should now be redirected to main app!

## Troubleshooting

**"Not authenticated" error:**
- Make sure Netlify Identity is enabled
- Try clearing cookies and logging in again

**Can't access admin panel:**
- Verify ADMIN_EMAIL environment variable matches your login email exactly
- Check Netlify logs for errors

**Functions not working:**
- Make sure your site has been deployed after adding the functions
- Check Netlify Functions logs in dashboard

## Need Help?

Check Netlify Identity docs: https://docs.netlify.com/visitor-access/identity/

---

That's it! Your waitlist system is ready to go. 🚀

# Netlify Identity Setup Guide

This guide will help you set up authentication for your OnPoint Articles site using Netlify Identity.

## Step 1: Deploy to Netlify

1. **Create a Netlify account** (if you don't have one):
   - Go to https://netlify.com
   - Sign up with your email or GitHub

2. **Deploy your site**:
   - Option A: Drag and drop your project folder to Netlify dashboard
   - Option B: Use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify login
     netlify deploy --prod
     ```

## Step 2: Enable Netlify Identity

1. **Go to your site's dashboard** on Netlify
2. Click on **"Identity"** in the top navigation
3. Click **"Enable Identity"**

## Step 3: Configure Identity Settings

### Registration Preferences
1. In Identity settings, go to **"Registration preferences"**
2. Choose one of:
   - **Open** - Anyone can sign up
   - **Invite only** - Only invited users can sign up (recommended for exclusive content)

### External Providers (Optional)
Enable social login:
- Google
- GitHub
- GitLab
- Bitbucket

### Email Templates
Customize the emails sent to users:
- Invitation
- Confirmation
- Recovery

## Step 4: Invite Users (If Invite Only)

1. Go to **Identity** tab
2. Click **"Invite users"**
3. Enter email addresses
4. Users will receive an invitation email

## Step 5: Test Your Site

1. Visit your deployed site
2. Click **"Login / Sign Up"** button
3. Create an account or login
4. Your email should appear in the header when logged in

## Features Added

✅ **Login/Signup Button** - Shows in header when not logged in
✅ **User Email Display** - Shows logged-in user's email
✅ **Logout Button** - Allows users to sign out
✅ **Auto-reload on auth change** - Page refreshes after login/logout

## Future Enhancements

You can add protected content by checking the `user` state:

```javascript
{user ? (
  // Show premium content
  <div>Exclusive content for subscribers</div>
) : (
  // Show teaser or paywall
  <div>Sign up to read more...</div>
)}
```

## Useful Links

- [Netlify Identity Docs](https://docs.netlify.com/visitor-access/identity/)
- [Netlify Identity Widget](https://github.com/netlify/netlify-identity-widget)
- [Access Control Examples](https://docs.netlify.com/visitor-access/identity/manage-existing-users/)

## Support

If you need help, check:
- Netlify Support Forum: https://answers.netlify.com/
- Netlify Identity Issues: https://github.com/netlify/netlify-identity-widget/issues

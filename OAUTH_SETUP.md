# OAuth Setup Guide for OnPointAggregate

## Overview
This app now uses **direct OAuth authentication** with Google and GitHub through Netlify Identity. Users will see the actual Google/GitHub login screens, not the Netlify Identity modal.

## ✅ What's Been Fixed

1. **Direct OAuth Flow**: Clicking "Continue with Google" or "Continue with GitHub" now redirects users directly to Google/GitHub OAuth screens
2. **No Netlify Modal**: Removed the Netlify Identity widget popup
3. **Route Protection**: All pages now check authentication before loading
4. **Proper Auth Flow**: Users are redirected to dashboard after login, then to main app if approved

## 🔧 Required: Enable OAuth Providers in Netlify

You **MUST** enable Google and GitHub OAuth providers in your Netlify Identity settings:

### Step 1: Open Netlify Identity Settings
1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Identity**
3. Scroll down to **External providers**

### Step 2: Enable Google OAuth
1. Click **Add provider** → **Google**
2. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select existing)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI to: `https://YOUR-SITE.netlify.app/.netlify/identity/callback`
3. Copy the **Client ID** and **Client Secret** into Netlify
4. Click **Enable**

### Step 3: Enable GitHub OAuth
1. Click **Add provider** → **GitHub**
2. You'll need to create a GitHub OAuth app:
   - Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Set Homepage URL: `https://YOUR-SITE.netlify.app`
   - Set Authorization callback URL: `https://YOUR-SITE.netlify.app/.netlify/identity/callback`
3. Copy the **Client ID** and **Client Secret** into Netlify
4. Click **Enable**

### Step 4: Configure Identity Settings
1. Under **Registration preferences**, choose:
   - **Open** (to allow new user signups)
   - OR **Invite only** (to manually approve users)
2. Under **External providers**, make sure both Google and GitHub show as "Enabled"

## 🔐 How Authentication Works Now

### Login Flow
1. User visits site → redirected to `/login.html`
2. User clicks "Continue with Google" or "Continue with GitHub"
3. Redirects **directly** to Google/GitHub OAuth screen (no Netlify modal!)
4. After OAuth approval, returns to login page with auth token
5. User is redirected to `/dashboard.html`
6. Dashboard checks if user is approved:
   - ✅ **Approved**: Redirected to `/verbal-landing.html` (main app)
   - ⏳ **Waitlist**: Stays on dashboard showing waitlist status

### Route Protection
All protected pages (`verbal-landing.html`, `dashboard.html`, `admin.html`) now:
1. Check if user is authenticated
2. Verify user has proper access level
3. Redirect to login if not authenticated

### Bypass Prevention
- Removed catch-all redirect from `netlify.toml`
- Added immediate auth checks to all pages
- Users can't access main app without being authenticated AND approved

## 📝 User Profile Data from OAuth

When users sign in with Google/GitHub, Netlify Identity automatically captures:
- Email address
- Full name
- Profile picture (avatar_url)
- OAuth provider used (google/github)

This data is stored in the user's Netlify Identity profile and accessible via:
```javascript
const user = auth.currentUser();
console.log(user.email);
console.log(user.user_metadata.full_name);
console.log(user.user_metadata.avatar_url);
```

## 🧪 Testing Locally

To test locally:
```bash
netlify dev
```

This will:
- Start local dev server
- Connect to your production Netlify Identity instance
- Allow testing OAuth flows locally

## 🚀 Deployment

After pushing to GitHub:
```bash
git add .
git commit -m "Implement direct OAuth authentication"
git push
```

Netlify will automatically deploy. Make sure you've configured the OAuth providers in Netlify dashboard first!

## ⚠️ Important Notes

1. **Don't forget to enable OAuth providers** - The app won't work until you configure Google and GitHub OAuth in Netlify
2. **Update callback URLs** - Make sure the OAuth callback URLs match your Netlify site URL
3. **Test on production** - OAuth often behaves differently on localhost vs production
4. **Waitlist by default** - New users via OAuth are automatically added to waitlist (configured via `identity-signup.js` function)

## 🐛 Troubleshooting

**Issue**: "Failed to initiate OAuth login"
- **Fix**: Make sure OAuth providers are enabled in Netlify Identity settings

**Issue**: Stuck on login page after OAuth
- **Fix**: Check browser console for errors. Ensure callback URL matches in OAuth provider settings

**Issue**: Users can still access main app without login
- **Fix**: Clear browser cache and redeploy site

**Issue**: "Authentication failed" error
- **Fix**: Check that your Netlify site URL matches the OAuth provider callback URL exactly

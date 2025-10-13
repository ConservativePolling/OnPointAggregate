# OnPoint Articles Account System

A complete custom account system for OnPoint Articles, built with Netlify Identity and React.

## Features

### ✅ User Authentication
- Custom branded "OnPoint Articles" account system
- Secure authentication via Netlify Identity
- Email/password signup and login
- Social login options (Google, GitHub, etc.)
- Password reset and recovery

### ✅ User Dashboard
- Personalized user profile with avatar
- Account statistics (saved articles, reading history)
- Member information display
- Account creation date tracking

### ✅ Saved Articles
- Save/unsave articles with one click
- View all saved articles in dashboard
- Saved articles persist across sessions (localStorage)
- Bookmark icon fills when article is saved

### ✅ User Preferences
- Email notification settings
- Dark mode toggle
- Customizable reading preferences
- Newsletter subscription management

### ✅ Account Features
- Profile dropdown menu
- Quick access to dashboard
- Saved articles counter in menu
- Seamless logout functionality

## How It Works

### Frontend (React)
- Custom UI components for account management
- State management for user sessions
- LocalStorage for saved articles (can be upgraded to backend)
- Responsive design for all devices

### Backend (Netlify)
- **Netlify Identity**: Handles authentication
- **Netlify Functions**: Server less API for user data
  - `/netlify/functions/user-profile` - Get/update user profile
  - `/netlify/functions/saved-articles` - Manage saved articles

### Data Storage
- **User Auth**: Netlify Identity (secure, built-in)
- **Saved Articles**: LocalStorage (can upgrade to database)
- **User Metadata**: Netlify Identity user metadata

## Deployment Steps

### 1. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### 2. Enable Identity
1. Go to Netlify Dashboard
2. Navigate to your site
3. Click **"Identity"** tab
4. Click **"Enable Identity"**

### 3. Configure Registration
1. In Identity settings, go to **"Registration preferences"**
2. Choose:
   - **Open**: Anyone can sign up
   - **Invite only**: Manual approvals (recommended)

### 4. Optional: Add External Providers
Enable social logins:
- Google OAuth
- GitHub
- GitLab
- Bitbucket

### 5. Customize Email Templates
1. Go to Identity > **"Emails"**
2. Edit templates for:
   - Welcome email
   - Confirmation
   - Password recovery

## User Journey

### New User
1. Click "Create Account / Sign In"
2. Fill out registration form
3. Verify email (if enabled)
4. Access full account features

### Returning User
1. Click profile dropdown
2. Access dashboard
3. View saved articles
4. Manage preferences

### Saving Articles
1. Open any article
2. Click bookmark icon (requires login)
3. Article saved to profile
4. Access from dashboard

## Features Roadmap

### Currently Available
✅ User authentication
✅ Account dashboard
✅ Saved articles
✅ User preferences
✅ Dark mode
✅ Profile management

### Future Enhancements
- [ ] Reading history tracking
- [ ] Article recommendations
- [ ] Comment system
- [ ] User following/followers
- [ ] Premium subscriptions
- [ ] Reading time tracking
- [ ] Article sharing via email
- [ ] Custom article collections
- [ ] Push notifications
- [ ] Mobile app sync

## Database Upgrade (Optional)

To scale beyond localStorage, integrate a database:

### Option 1: Fauna DB
```javascript
// netlify/functions/saved-articles.js
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET
});
```

### Option 2: Supabase
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
```

### Option 3: Firebase
```javascript
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

## Security Features

- Secure authentication via Netlify Identity
- JWT tokens for API requests
- HTTPS enforced
- CORS protection
- Rate limiting (via Netlify)
- No passwords stored locally
- Secure password reset flow

## Support

For issues or questions:
- Check Netlify Identity docs: https://docs.netlify.com/visitor-access/identity/
- Netlify Support Forum: https://answers.netlify.com/
- Contact: tips@onpointarticles.com

## License

© 2025 OnPoint Articles. All rights reserved.

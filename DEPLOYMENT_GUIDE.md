# Quick Deployment Guide for OnPoint Articles

## The Identity Error You're Seeing

The error "Failed to load settings from /.netlify/identity" happens because:
- Netlify Identity requires a live Netlify site URL
- It cannot work on localhost without Netlify Dev CLI
- You need to deploy first, then enable Identity

## Option 1: Deploy via Netlify Dashboard (Easiest)

### Step 1: Create Netlify Account
1. Go to https://app.netlify.com/signup
2. Sign up with GitHub (easiest option)
3. Authorize Netlify to access your GitHub

### Step 2: Import from GitHub
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select repository: `ConservativePolling/OnPointAggregate`
4. Keep default settings:
   - Branch: `main`
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click **"Deploy site"**

### Step 3: Wait for Deployment
- Takes about 30-60 seconds
- You'll get a random URL like: `random-name-123456.netlify.app`

### Step 4: Enable Identity
1. In your site dashboard, click **"Identity"** in the top nav
2. Click **"Enable Identity"**
3. Done! Identity is now active

### Step 5: Configure Identity Settings
1. Go to **Identity** → **Settings**
2. Under **Registration preferences**, choose:
   - **Open** (anyone can sign up) OR
   - **Invite only** (you control who joins)
3. Under **External providers** (optional):
   - Enable Google, GitHub, etc. for social login
4. Under **Emails**, customize:
   - Confirmation email
   - Invitation email
   - Password recovery email

### Step 6: Test Your Account System
1. Visit your live site URL
2. Click **"Create Account / Sign In"**
3. Sign up with your email
4. Check your email for confirmation
5. Confirm and login
6. Your OnPoint Articles account should work!

## Option 2: Deploy via Netlify CLI (For Developers)

### Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Login to Netlify
```bash
netlify login
```
This opens browser for authentication.

### Initialize and Deploy
```bash
cd /Users/jaydendavis/OnPointArticle
netlify init
```
Follow prompts:
- Create & configure new site
- Choose team
- Name your site
- Deploy!

### Enable Identity via CLI
After deployment, you still need to enable Identity in the dashboard.

## Option 3: Test Locally with Netlify Dev (Advanced)

If you want to test locally before deploying:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to get site URL first
netlify deploy --prod

# Then run locally with Netlify Dev
netlify dev
```

This runs your site at `localhost:8888` with full Netlify features.

## After Deployment: Update Your Site (Optional)

Once deployed, you can optionally update the Identity widget initialization with your site URL for better error handling:

```javascript
// In index.html, update the netlifyIdentity initialization
if (typeof netlifyIdentity !== 'undefined') {
    netlifyIdentity.init({
        container: '#netlify-modal', // required
        locale: 'en' // optional
    });
}
```

## Troubleshooting

### "Identity settings not found"
- **Solution**: Deploy to Netlify first, then enable Identity in dashboard

### "Registration is disabled"
- **Solution**: In Netlify Dashboard → Identity → Settings → Registration → Choose "Open" or "Invite only"

### "Email confirmation not sending"
- **Solution**: Check spam folder, or in Identity settings → Email templates → Test email delivery

### "Can't create account"
- **Solution**:
  1. Verify Identity is enabled
  2. Check registration is set to "Open"
  3. Check browser console for errors

## Quick Checklist

- [ ] GitHub repo pushed ✅ (Done!)
- [ ] Netlify account created
- [ ] Site deployed from GitHub
- [ ] Identity enabled in dashboard
- [ ] Registration set to "Open" or "Invite only"
- [ ] Test account created successfully

## Your Site URLs

After deployment, you'll have:
- **Live Site**: `https://your-site-name.netlify.app`
- **Admin Panel**: `https://app.netlify.com/sites/your-site-name`
- **Identity Dashboard**: `https://app.netlify.com/sites/your-site-name/identity`

## Next Steps After Setup

1. ✅ Create your own account
2. Test saving articles
3. Test user dashboard
4. Customize email templates
5. Optional: Add custom domain
6. Optional: Invite team members

Need help? Check https://docs.netlify.com/visitor-access/identity/

# Netlify Blobs Setup for Persistent Comments

## Current Issue
Comments are disappearing after ~1 hour because Netlify Blobs is not fully enabled.

## Solution: Enable Netlify Blobs in Dashboard

### Step 1: Enable Blobs in Netlify Dashboard
1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (OnPointAggregate)
3. Go to **Site settings** → **Environment variables**
4. Add this environment variable:
   - **Key**: `NETLIFY_BLOBS_CONTEXT`
   - **Value**: `production`
5. Click **Save**

### Step 2: Verify Blobs is Working
1. After deployment completes, go to **Functions** tab
2. Click on `article-comments` function
3. Click on **Function log** tab
4. Look for this message:
   - ✅ `Netlify Blobs initialized successfully` = **Comments will persist forever**
   - ⚠️ `Netlify Blobs not available` = **Comments only last ~1 hour (in-memory mode)**

### Step 3: Test Persistence
1. Post a test comment
2. Wait 1-2 hours
3. Refresh the page
4. **If Blobs is enabled**: Comment should still be there ✅
5. **If not enabled**: Comment will be gone ❌

## Alternative: Check if Blobs is Available

In Netlify dashboard:
1. Go to **Site settings** → **Integrations**
2. Look for "Netlify Blobs"
3. If not listed, your plan might not include Blobs

## Fallback Options

If Blobs is not available on your plan:
- Comments will work during the session but won't persist long-term
- Consider upgrading Netlify plan for persistent storage
- Or we can integrate with a third-party database (Supabase, Firebase, etc.)

## Current Status
- ✅ `@netlify/blobs` package installed (v10.1.0)
- ✅ Function code supports Blobs
- ✅ Graceful fallback to in-memory if Blobs unavailable
- ⚠️ **Need to enable Blobs in dashboard** (see Step 1 above)

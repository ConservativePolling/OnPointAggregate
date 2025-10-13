# Live Commenting System Guide

## Overview

Your OnPoint Articles site now has a **live commenting system** that allows your admin account to comment on articles in real-time. All visitors can see these comments updating automatically every 5 seconds.

## Features

### For Admin (jaydenmdavis2008@outlook.com)
- **Post Comments**: Add reporter comments directly from the article page
- **HTML Support**: Use HTML in your comments for formatting (bold text, links, etc.)
- **Admin Badge**: A special "Admin Mode" badge appears when you're logged in
- **Instant Updates**: Your comments appear immediately after posting

### For All Visitors
- **Live Updates**: Comments automatically refresh every 5 seconds
- **Live Indicator**: Red "LIVE" badge shows the section is updating in real-time
- **NEW Badge**: The most recent comment is marked with a red "NEW" indicator
- **Relative Timestamps**: Comments show time like "2h ago", "Just now", etc.

## How to Use

### As Admin

1. **Login**: Sign in with jaydenmdavis2008@outlook.com
2. **Navigate to Article**: Go to any article page
3. **Find Comment Box**: Scroll to the "Reporter Comments" section at the bottom
4. **Add Comment**:
   - Type your comment in the blue "Admin Mode" box
   - Use HTML for formatting if needed (example: `<span class='font-bold'>UPDATE:</span>`)
   - Click "Post Comment"
5. **Your Comment Appears**: It will show up immediately at the top of the comments

### HTML Formatting Examples

```html
<span class='font-bold'>UPDATE:</span> New information just received...

This is <span class='font-bold'>important</span> to note.

<a href='https://example.com' class='underline'>Read more here</a>
```

## Technical Details

### Backend
- **Storage**: Comments are stored using Netlify Blobs (serverless key-value store)
- **API Endpoint**: `/.netlify/functions/article-comments`
- **Authentication**: Only jaydenmdavis2008@outlook.com can POST comments
- **Public Access**: Anyone can GET (view) comments

### Frontend
- **Real-time Updates**: Polls the API every 5 seconds for new comments
- **State Management**: Comments managed with React useState/useEffect
- **Admin Detection**: Checks if logged-in user email matches admin email

### Data Structure

Each comment is stored with:
```json
{
  "timestamp": "2025-10-13T18:30:00Z",
  "text": "Your comment text here",
  "highlighted": false
}
```

Comments are stored per article ID in Netlify Blobs.

## Deployment

### Before Deploying to Netlify

1. **Commit Your Changes**:
   ```bash
   git add .
   git commit -m "Add live commenting system"
   git push
   ```

2. **Netlify Blobs**: No additional setup needed! Netlify Blobs is automatically available on all Netlify sites.

3. **Netlify Identity**: Make sure Netlify Identity is enabled (you already have this set up)

### After Deployment

1. **Test Comments**:
   - Login with your admin account
   - Navigate to an article
   - Post a test comment
   - Open another browser/incognito window to verify live updates work

2. **Verify Storage**:
   - Comments persist across page reloads
   - Comments appear for all users
   - Only admin can post new comments

## Troubleshooting

### Comments Not Appearing
- Check browser console for errors
- Verify you're logged in with jaydenmdavis2008@outlook.com
- Make sure Netlify Identity is enabled

### Comments Not Updating Live
- The page polls every 5 seconds - wait at least 5 seconds
- Check browser console for API errors
- Verify Netlify Functions are deployed

### Cannot Post Comments
- Verify you're logged in as admin
- Check that Netlify Identity token is valid
- Look for error messages in the comment form

## Security

- **Admin-Only Posting**: Only jaydenmdavis2008@outlook.com can post comments (enforced server-side)
- **Authentication Required**: Must be logged in via Netlify Identity to post
- **Public Reading**: Anyone can view comments (no authentication needed)
- **HTML Sanitization**: Be careful with HTML - it's rendered as-is (trusted admin input)

## Future Enhancements

Possible improvements:
- Comment editing/deletion
- Comment highlighting/pinning
- Comment notifications
- Comment moderation queue
- Rich text editor for formatting
- Image uploads in comments
- Multiple admin accounts

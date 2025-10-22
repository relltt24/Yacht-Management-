# Deployment Guide

This guide will help you deploy the AI Yacht Management Backend to Firebase App Hosting.

## Prerequisites

1. **Firebase CLI**: Install the Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Project**: You should already have a Firebase project set up
   - Project ID: studio-4010754397 (as mentioned in your setup)

3. **Node.js**: Ensure Node.js 20 or higher is installed

## Deployment Steps

### Step 1: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### Step 2: Initialize Firebase (if not already done)

```bash
firebase init
```

Select:
- ✅ Hosting
- ✅ App Hosting (if available)

### Step 3: Configure Firebase Project

```bash
firebase use studio-4010754397
```

Or if you need to add the project:
```bash
firebase use --add
```

### Step 4: Deploy to Firebase

```bash
firebase deploy
```

This will deploy both:
- The backend API (server.js)
- The static frontend (Index.html)

### Step 5: Verify Deployment

After deployment completes, you'll see output like:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/studio-4010754397/overview
Hosting URL: https://studio-4010754397.web.app
```

Visit your Hosting URL to see the landing page and test the API.

## Testing Your Deployment

### Test the Landing Page
```bash
curl https://your-project-id.web.app/
```

### Test the API
```bash
# Test health check
curl https://your-project-id.web.app/healthz

# Test API root
curl https://your-project-id.web.app/api/yachts

# Test analytics
curl https://your-project-id.web.app/api/analytics/dashboard
```

## Configuration Files

The deployment uses these configuration files:

### apphosting.yaml
```yaml
runtime:
  language: nodejs
  version: 20
service:
  healthCheck:
    path: /healthz
```

This configures:
- Node.js 20 runtime
- Health check endpoint

### firebase.json
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

This configures:
- Public directory (current directory)
- Files to ignore during deployment

### package.json
```json
{
  "name": "my-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

## Environment Variables

If you need to set environment variables in Firebase:

```bash
firebase functions:config:set someservice.key="THE KEY" someservice.id="THE ID"
```

Or use `.env` file locally (not committed to git):
```bash
PORT=8080
NODE_ENV=production
```

## Continuous Deployment

### Option 1: GitHub Actions

Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: studio-4010754397
```

### Option 2: Firebase Automatic Builds

Connect your GitHub repository directly in Firebase Console:
1. Go to Firebase Console
2. Navigate to Hosting
3. Click "Set up automatic builds"
4. Connect your GitHub repository
5. Configure build settings

## Monitoring Your Deployment

### View Logs

```bash
firebase hosting:channel:list
firebase hosting:channel:open
```

### Monitor Performance

- Go to Firebase Console
- Navigate to Hosting dashboard
- View performance metrics, traffic, and errors

### View Application Logs

In Firebase Console:
1. Go to Functions or App Hosting
2. View the Logs tab
3. Filter by severity, timestamp, or content

## Rollback

If you need to rollback to a previous version:

```bash
# List all releases
firebase hosting:releases:list

# Rollback to specific version
firebase hosting:rollback
```

## Troubleshooting

### Issue: "Backend is working" still shows

**Solution**: Ensure you've deployed the updated `server.js` file
```bash
git pull origin main
firebase deploy --only hosting
```

### Issue: 404 errors on API endpoints

**Solution**: Check your firebase.json configuration
- Ensure `"public": "."` is set correctly
- Verify server.js is in the root directory

### Issue: CORS errors

**Solution**: The backend already has CORS configured. If issues persist:
1. Check browser console for specific CORS errors
2. Verify the origin in the error message
3. Update CORS configuration in server.js if needed for production

### Issue: Health check fails

**Solution**: 
- Verify `/healthz` endpoint returns "ok"
- Check apphosting.yaml has correct health check path
- Review deployment logs for errors

### Issue: Dependencies not installed

**Solution**: 
```bash
# Locally
npm install

# Force reinstall
rm -rf node_modules
npm install
```

### Issue: Port already in use (locally)

**Solution**:
```bash
# Find and kill process using port 8080
lsof -ti:8080 | xargs kill -9

# Or use different port
PORT=3000 npm start
```

## Performance Optimization

### Enable Caching

Update firebase.json:
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "/api/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Enable Compression

Firebase automatically compresses responses, but you can optimize server-side:

```javascript
import compression from 'compression';
app.use(compression());
```

## Scaling Considerations

Firebase App Hosting automatically scales, but consider:

1. **Database**: Migrate from in-memory to Firestore or Cloud SQL
2. **Caching**: Implement Redis for frequently accessed data
3. **Load Balancing**: Firebase handles this automatically
4. **Rate Limiting**: Add rate limiting to prevent abuse (see SECURITY.md)

## Cost Monitoring

Monitor your Firebase usage:
1. Go to Firebase Console
2. Navigate to Usage and Billing
3. Set up budget alerts
4. Monitor:
   - Hosting bandwidth
   - Function invocations
   - Database reads/writes

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Monitor error logs
3. ✅ Set up analytics
4. ✅ Configure domain (optional)
5. ✅ Enable SSL (automatic with Firebase)
6. ✅ Set up monitoring alerts
7. ✅ Implement authentication (see SECURITY.md)
8. ✅ Add database persistence
9. ✅ Set up backup strategy

## Custom Domain (Optional)

To use a custom domain:

```bash
firebase hosting:sites:create your-custom-domain
firebase target:apply hosting your-app-name your-custom-domain
firebase deploy --only hosting:your-app-name
```

Then configure DNS:
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Support

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firebase Support**: https://firebase.google.com/support
- **GitHub Issues**: https://github.com/relltt24/Yacht-Management-/issues

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Run locally
npm start

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# View logs
firebase hosting:channel:list

# Rollback
firebase hosting:rollback

# Test locally before deploy
npm start
# Then test endpoints at http://localhost:8080
```

---

**Congratulations!** Your AI Yacht Management Backend is now deployed and ready to support your application! 🚢🎉

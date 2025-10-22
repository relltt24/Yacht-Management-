# Firebase Deployment Quick Start

This guide will help you quickly deploy the AI Yacht Management Backend to Firebase.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Firebase account (free tier works fine)

## Quick Deploy (5 minutes)

### Option 1: Using the Deployment Script (Recommended)

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

The script will:
1. ✅ Check and install Firebase CLI if needed
2. ✅ Install all dependencies
3. ✅ Run the build
4. ✅ Optionally test locally
5. ✅ Login to Firebase
6. ✅ Deploy to your Firebase project

### Option 2: Manual Deployment

```bash
# 1. Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# 2. Install root dependencies
npm install

# 3. Install functions dependencies
cd functions
npm install
cd ..

# 4. Login to Firebase
firebase login

# 5. Set your Firebase project
firebase use studio-4010754397

# 6. Deploy everything
firebase deploy
```

## What Gets Deployed?

### 1. Firebase Functions
- **Endpoint**: `https://your-project.web.app/api/*`
- **Location**: `functions/index.js`
- **Runtime**: Node.js 20
- All API endpoints are served through Firebase Functions

### 2. Firebase Hosting
- **URL**: `https://your-project.web.app/`
- **Content**: `Index.html` landing page
- **Rewrites**: API requests are routed to Firebase Functions

## Project Structure

```
.
├── functions/                    # Firebase Cloud Functions
│   ├── index.js                 # Complete backend API (copied from server.js)
│   ├── package.json             # Functions dependencies
│   └── .gitignore               # Functions ignore file
├── server.js                    # Local development server
├── Index.html                   # Landing page (served by Hosting)
├── firebase.json                # Firebase configuration
├── apphosting.yaml              # App Hosting runtime config
├── deploy.sh                    # Automated deployment script
└── package.json                 # Root dependencies
```

## Configuration Files

### firebase.json
Configures:
- Firebase Functions source directory
- Hosting public files
- URL rewrites (routes API calls to Functions)

### apphosting.yaml
Configures:
- Node.js 20 runtime
- Health check endpoint
- Environment variables

### functions/package.json
Specifies:
- Node.js 20 engine
- Firebase Functions v5
- Express.js and dependencies

## Testing Your Deployment

### 1. Test Hosting Landing Page
```bash
curl https://studio-4010754397.web.app/
```

### 2. Test Health Check
```bash
curl https://studio-4010754397.web.app/healthz
```

### 3. Test API Endpoints
```bash
# Get all yachts
curl https://studio-4010754397.web.app/api/yachts

# Get analytics dashboard
curl https://studio-4010754397.web.app/api/analytics/dashboard

# Create a new yacht
curl -X POST https://studio-4010754397.web.app/api/yachts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sea Breeze",
    "type": "Sailing Yacht",
    "length": 72,
    "capacity": 10
  }'
```

## Local Development

For local development, use the standalone server:

```bash
npm start
```

This runs `server.js` on http://localhost:8080

## Firebase Emulators (Optional)

To test Firebase Functions locally:

```bash
# Install Firebase emulators
firebase init emulators

# Start emulators
firebase emulators:start --only functions,hosting
```

## Deployment Options

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Functions
```bash
firebase deploy --only functions
```

### Deploy Only Hosting
```bash
firebase deploy --only hosting
```

## View Deployment Status

### Firebase Console
https://console.firebase.google.com/project/studio-4010754397

### View Logs
```bash
# Real-time logs
firebase functions:log --follow

# Last 100 lines
firebase functions:log --limit 100
```

## Troubleshooting

### Issue: "Firebase CLI not found"
**Solution:**
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied"
**Solution:**
```bash
firebase login
firebase use studio-4010754397
```

### Issue: "Functions deployment failed"
**Solution:**
1. Check that functions/package.json has all dependencies
2. Run `cd functions && npm install`
3. Make sure Node.js version is 20 or higher
4. Check Firebase console for detailed error logs

### Issue: "CORS errors in browser"
**Solution:**
The backend already has CORS enabled for all origins. If issues persist:
1. Check browser console for specific CORS errors
2. Verify the API is being called at the correct URL
3. Check Firebase Function logs for request details

### Issue: "API returns 404"
**Solution:**
1. Verify firebase.json has the correct rewrites configuration
2. Make sure Functions are deployed: `firebase deploy --only functions`
3. Check that the Function name is "api" (exports.api in functions/index.js)

## Cost Considerations

Firebase offers a generous free tier:
- **Functions**: 2M invocations/month free
- **Hosting**: 10 GB storage + 360 MB/day transfer free

Your yacht management backend should easily fit within free tier limits for development and small production use.

## Next Steps

After successful deployment:

1. ✅ Test all API endpoints
2. ✅ Set up custom domain (optional)
3. ✅ Configure environment variables for production
4. ✅ Add database persistence (Firestore recommended)
5. ✅ Implement authentication
6. ✅ Set up monitoring and alerts
7. ✅ Configure backup strategy

## Support

- **Firebase Docs**: https://firebase.google.com/docs/functions
- **API Documentation**: See API_DOCUMENTATION.md
- **Detailed Deployment Guide**: See DEPLOYMENT.md
- **GitHub Issues**: https://github.com/relltt24/Yacht-Management-/issues

## Quick Reference

```bash
# Deploy everything
firebase deploy

# View logs
firebase functions:log

# Rollback deployment
firebase hosting:rollback

# Test locally
npm start

# Check Firebase status
firebase functions:list
```

---

**Congratulations!** 🎉 Your AI Yacht Management Backend is now deployed and ready to use!

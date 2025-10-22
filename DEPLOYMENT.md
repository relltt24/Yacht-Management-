# Firebase Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Node.js 20 or higher installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] A Firebase project created at https://console.firebase.google.com
- [ ] Firebase Authentication configured (if using auth features)
- [ ] Billing enabled on Firebase (required for Cloud Functions)

## Step-by-Step Deployment

### 1. Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

### 2. Initialize Your Firebase Project

If you haven't already connected this repository to a Firebase project:

```bash
firebase use --add
```

Select your Firebase project from the list and give it an alias (e.g., "default").

Alternatively, if you know your project ID:

```bash
firebase use <your-project-id>
```

This will create a `.firebaserc` file in your project root.

### 3. Install Dependencies

Make sure all dependencies are installed:

```bash
# Install root dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### 4. Test Locally (Optional but Recommended)

#### Test the Express Server:
```bash
npm start
```

Visit http://localhost:8080 to verify the server works.

#### Test with Firebase Emulators:
```bash
firebase emulators:start
```

This will start local emulators for Firebase services.

### 5. Deploy to Firebase

Deploy everything at once:

```bash
firebase deploy
```

Or deploy specific components:

```bash
# Deploy only hosting (static files)
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions
```

### 6. Verify Deployment

After deployment completes, Firebase will provide URLs for your deployed app:

- **Hosting URL**: `https://<your-project-id>.web.app`
- **Functions URL**: `https://us-central1-<your-project-id>.cloudfunctions.net/api`

Test your endpoints:

```bash
# Test hosting
curl https://<your-project-id>.web.app

# Test function
curl https://us-central1-<your-project-id>.cloudfunctions.net/api
```

## Deployment Components

This project deploys:

1. **Firebase Hosting** - Serves the static Index.html file
2. **Cloud Functions** - Serves the API endpoints via functions/index.js
3. **App Hosting** (Optional) - Can serve the Express backend via server.js

## Common Issues and Solutions

### Issue: "Firebase not found"
**Solution**: Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

### Issue: "Error: HTTP Error: 400, Billing account not configured"
**Solution**: Enable billing for your Firebase project at https://console.firebase.google.com

### Issue: "Permission denied"
**Solution**: Make sure you're logged in with the correct account:
```bash
firebase logout
firebase login
```

### Issue: "Module not found" errors during deployment
**Solution**: Ensure all dependencies are installed:
```bash
npm install
cd functions && npm install && cd ..
```

### Issue: Functions deployment fails
**Solution**: Check that you have the Blaze (pay-as-you-go) plan enabled in Firebase Console.

## Environment Variables

If you need environment variables in production:

### For Cloud Functions:
```bash
firebase functions:config:set someservice.key="THE API KEY"
```

### For App Hosting:
Add them to the `env` section in `apphosting.yaml`.

## Monitoring and Logs

### View function logs:
```bash
firebase functions:log
```

### View logs in Firebase Console:
Visit: https://console.firebase.google.com/project/<your-project-id>/functions/logs

## Updating Your Deployment

To update your application:

1. Make your code changes
2. Test locally
3. Commit changes to Git
4. Run `firebase deploy` again

Firebase will automatically update only the changed components.

## Security Notes

- Never commit sensitive data or API keys
- Use Firebase Functions environment variables for secrets
- Review Firebase Security Rules for your database/storage
- Keep dependencies updated regularly

## Support

For issues with Firebase deployment:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase CLI Reference: https://firebase.google.com/docs/cli
- Firebase Support: https://firebase.google.com/support

For issues with this application:
- Check the logs with `firebase functions:log`
- Review the README.md for local testing
- Open an issue in the repository

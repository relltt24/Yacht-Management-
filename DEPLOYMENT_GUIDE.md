# Deployment Guide

This guide will help you publish your Yacht Management app to Firebase.

## Quick Start

Your app is now configured to publish automatically! Follow these steps:

### 1. Configure Firebase Service Account (One-time setup)

For automated deployment via GitHub Actions, you need to configure a Firebase service account secret:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/studio-4010754397/settings/serviceaccounts/adminsdk
   
2. **Generate Private Key**
   - Click "Generate new private key"
   - A JSON file will download - keep it safe!

3. **Add Secret to GitHub**
   - Go to your repository: https://github.com/relltt24/Yacht-Management-/settings/secrets/actions
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT_STUDIO_4010754397`
   - Value: Paste the entire contents of the downloaded JSON file
   - Click "Add secret"

### 2. Deploy Automatically

Once the secret is configured, deployment happens automatically:

- **On PR merge to backend-setup**: Deploys to live site
- **On PR creation**: Creates preview deployment for testing

### 3. Deploy Manually (Alternative)

If you prefer manual deployment:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy everything
firebase deploy

# Or deploy specific parts
firebase deploy --only hosting
firebase deploy --only functions
```

## What Was Fixed

### The Problem
The app wasn't publishing because:
- Missing Firebase project configuration (`.firebaserc`)
- Missing dependency definitions (`package.json` files)
- No Functions configuration in `firebase.json`
- No deployment automation

### The Solution
All necessary configuration files have been created:

✅ `.firebaserc` - Specifies your Firebase project  
✅ `package.json` - Root project configuration  
✅ `functions/package.json` - Functions dependencies  
✅ `firebase.json` - Firebase hosting and functions config  
✅ `.github/workflows/` - Automated deployment pipelines  
✅ `.gitignore` - Excludes build artifacts  
✅ `README.md` - Complete documentation  

### Security
- ✅ 0 npm vulnerabilities (updated to latest secure versions)
- ✅ 0 CodeQL security alerts
- ✅ Proper workflow permissions configured

## Project Structure

```
Yacht-Management-/
├── .firebaserc              # Firebase project ID
├── firebase.json            # Firebase configuration
├── package.json            # Root dependencies
├── Index.html              # Your app's main page
├── functions/              # Firebase Functions
│   ├── index.js           # Functions entry point
│   ├── package.json       # Functions dependencies
│   └── package-lock.json  # Locked dependency versions
├── .github/               # GitHub Actions
│   └── workflows/
│       ├── firebase-hosting-merge.yml      # Deploy on merge
│       └── firebase-hosting-pull-request.yml  # Preview on PR
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
└── DEPLOYMENT_GUIDE.md   # This file
```

## Verifying Deployment

After deployment:

1. **Check GitHub Actions**
   - Go to: https://github.com/relltt24/Yacht-Management-/actions
   - Look for successful deployment runs

2. **Check Firebase Console**
   - Hosting: https://console.firebase.google.com/project/studio-4010754397/hosting/sites
   - Functions: https://console.firebase.google.com/project/studio-4010754397/functions/list

3. **Visit Your Site**
   - Your app will be live at: `https://studio-4010754397.web.app`
   - Or the custom domain if configured

## Troubleshooting

### GitHub Actions Not Running
- Ensure the secret `FIREBASE_SERVICE_ACCOUNT_STUDIO_4010754397` is configured
- Check that workflows are enabled in repository settings

### Deployment Fails
- Check GitHub Actions logs for error messages
- Verify Firebase project permissions
- Ensure service account has proper roles

### Functions Not Deploying
- Check `functions/package.json` for syntax errors
- Ensure `functions/index.js` has valid JavaScript
- Check Firebase Console for function logs

## Next Steps

1. Configure the Firebase service account secret (see step 1 above)
2. Merge this PR to deploy your app
3. Visit your live site!

## Support

For more information:
- Firebase Documentation: https://firebase.google.com/docs
- GitHub Actions Documentation: https://docs.github.com/en/actions
- Repository README: See README.md in the root directory

---

**Status:** ✅ Ready to deploy!  
**Configuration:** Complete  
**Security:** No vulnerabilities detected  

# Yacht Management Application

YM APP - A Firebase-powered yacht management application.

## Setup

1. Install dependencies:
```bash
npm install
cd functions && npm install && cd ..
```

2. Deploy to Firebase:
```bash
npm run deploy
```

Or deploy specific services:
```bash
npm run deploy:hosting  # Deploy hosting only
npm run deploy:functions  # Deploy functions only
```

## Local Development

Run the Firebase emulator:
```bash
npm run serve
```

## Deployment

The application automatically deploys to Firebase when changes are pushed to:
- `main` branch
- `backend-setup` branch

### Manual Deployment

If you need to deploy manually:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Deploy:
```bash
firebase deploy
```

## Project Structure

```
.
├── Index.html           # Main HTML file
├── firebase.json        # Firebase configuration
├── .firebaserc         # Firebase project settings
├── package.json        # Root package configuration
├── functions/          # Firebase Functions
│   ├── index.js        # Functions entry point
│   └── package.json    # Functions dependencies
└── .github/            # GitHub Actions workflows
    └── workflows/
        ├── firebase-hosting-merge.yml
        └── firebase-hosting-pull-request.yml
```

## Firebase Project

- Project ID: `studio-4010754397`
- Hosting URL: Available after deployment
- Functions: Express.js backend

## GitHub Actions

This project includes automated deployment through GitHub Actions:

1. **On Push to main/backend-setup**: Automatically deploys to live Firebase Hosting
2. **On Pull Request**: Creates a preview deployment for testing

### Required Secrets

The following GitHub secret must be configured:
- `FIREBASE_SERVICE_ACCOUNT_STUDIO_4010754397`: Firebase service account credentials

To set up this secret:
1. Go to your repository Settings → Secrets and variables → Actions
2. Create a new repository secret
3. Name it: `FIREBASE_SERVICE_ACCOUNT_STUDIO_4010754397`
4. Get the value from Firebase Console → Project Settings → Service Accounts → Generate new private key

## Troubleshooting

### Publishing Issues

If the app isn't publishing:

1. Check that all dependencies are installed:
```bash
npm install
cd functions && npm install
```

2. Verify Firebase project is configured:
```bash
cat .firebaserc
```

3. Check GitHub Actions status in the Actions tab

4. Ensure Firebase service account secret is configured in GitHub

### Functions Issues

If functions aren't deploying:

1. Check `functions/package.json` exists with correct dependencies
2. Verify `firebase.json` includes functions configuration
3. Check Node.js version matches (Node 18)

## Support

For issues, please check the GitHub repository issues page.

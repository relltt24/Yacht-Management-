# Firebase Client Configuration

This directory contains the Firebase client-side initializer using the modular SDK (v9+).

## Overview

The `index.ts` file initializes Firebase Authentication, Firestore, and Storage services for use in the browser. It is designed to be SSR-safe and prevents double initialization.

## Required Environment Variables

The Firebase initializer requires the following environment variables to be set. These variables **must** be prefixed with `NEXT_PUBLIC_` to be accessible in the browser:

- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain (e.g., `your-project.firebaseapp.com`)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket (e.g., `your-project.appspot.com`)
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID

## Local Development Setup

### 1. Create Environment File

Create a `.env.local` file in the root of your project (this file should NOT be committed to version control):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Test the Build

```bash
npm run build
```

### 4. Start the Server

```bash
npm start
```

## Production/CI Configuration

### Firebase Hosting

To configure these environment variables in Firebase Hosting:

1. Go to the Firebase Console
2. Select your project
3. Navigate to Hosting → Settings
4. Add environment variables in the "Environment configuration" section

### GitHub Actions / CI

Add these as repository secrets or environment variables in your CI/CD pipeline configuration.

## Security Notes

⚠️ **IMPORTANT SECURITY GUIDELINES:**

1. **DO NOT commit any real Firebase API keys or credentials to the repository**
2. All sensitive configuration should be stored in environment variables
3. The `.env.local` file is listed in `.gitignore` and should never be committed
4. The `NEXT_PUBLIC_*` prefix means these values will be visible in the browser - ensure you have proper Firebase security rules configured
5. Never commit production credentials - use environment variables in your deployment platform

## Usage

Import Firebase services in your application:

```typescript
// Named imports
import { auth, firestore, storage } from '../../firebase';

// Default import
import firebase from '../../firebase';
const { auth, firestore, storage } = firebase;
```

## SSR Compatibility

The initializer includes guards to prevent Firebase from initializing on the server:
- Uses `typeof window !== 'undefined'` checks
- Returns stub objects for SSR contexts
- Only initializes once using `getApps()` check

## Troubleshooting

### Build Errors

If you see "Module not found" errors:
- Ensure the import path is correct relative to your file
- Verify the file exists at `src/firebase/index.ts`

### Runtime Errors

If Firebase services aren't working:
- Check that all environment variables are set correctly
- Verify the `NEXT_PUBLIC_` prefix is used
- Ensure environment variables are available in your deployment platform

### Configuration Errors

If you see Firebase initialization errors:
- Double-check your Firebase project configuration
- Verify the environment variables match your Firebase console settings
- Check that Firebase security rules are properly configured

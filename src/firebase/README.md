# Firebase Client Configuration

This directory contains the Firebase client initializer for the Yacht Management application.

## Setup Instructions

### 1. Install Dependencies

After cloning the repository, install all required dependencies:

```bash
npm install
```

This will install the Firebase SDK (v9.22.0) along with other project dependencies.

### 2. Configure Environment Variables

The Firebase initializer uses environment variables to avoid committing sensitive configuration to the repository.

#### For Local Development

Create a `.env.local` file in the project root (this file is gitignored):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

You can find these values in your Firebase Console:
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click the gear icon (Settings) → Project settings
4. Scroll to "Your apps" section
5. If you haven't created a web app, click "Add app" and select Web
6. Copy the configuration values

#### For Firebase Studio / Production

Set the environment variables in your Firebase Studio or deployment environment:

1. Go to Firebase Console → App Hosting
2. Navigate to your app's Environment variables section
3. Add each `NEXT_PUBLIC_FIREBASE_*` variable with its corresponding value

#### For GitHub Actions

If you're using GitHub Actions for CI/CD:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add each environment variable as a repository secret

## Why NEXT_PUBLIC_* Prefix?

The `NEXT_PUBLIC_*` prefix is required for environment variables that need to be accessible in the browser (client-side) when using Next.js:

- **Client-side access**: Next.js embeds `NEXT_PUBLIC_*` variables at build time, making them available in client-side code
- **Security**: Regular environment variables (without the prefix) are only available server-side
- **Firebase config is safe**: Firebase configuration values (API key, project ID, etc.) are designed to be public and used in client applications

**Important**: Never put sensitive secrets like service account keys or admin SDK credentials in `NEXT_PUBLIC_*` variables.

## How the Initializer Works

The `src/firebase/index.ts` file:

1. **Imports Firebase SDK modules** using the modular v9+ API (tree-shakeable)
2. **Reads configuration** from `NEXT_PUBLIC_*` environment variables
3. **Initializes Firebase once** using `getApps()` to prevent duplicate initialization
4. **Exports Firebase services**: `auth`, `firestore`, and `storage`

## Usage Example

Import Firebase services in your components or pages:

```typescript
// Import specific services
import { auth, firestore, storage } from '@/firebase';

// Or import the default export
import firebase from '@/firebase';
const { auth, firestore, storage } = firebase;

// Use the services
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

async function getYachts() {
  const querySnapshot = await getDocs(collection(firestore, 'yachts'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

## Testing

To verify your Firebase configuration is working:

1. Set up your `.env.local` file with valid credentials
2. Start the development server: `npm run dev` (or `npm start` for this project)
3. Import and use a Firebase service in your code
4. Check the browser console for any Firebase errors

## Troubleshooting

### "Firebase: No Firebase App '[DEFAULT]' has been created"

This means Firebase isn't initialized. Check that:
- All `NEXT_PUBLIC_FIREBASE_*` variables are set
- The variables are loaded before Firebase is used
- You're importing from `@/firebase` or the correct path

### "Firebase: Error (auth/invalid-api-key)"

Your API key is incorrect or missing. Double-check your `.env.local` file.

### "Module not found: Can't resolve 'firebase/app'"

Run `npm install` to install the Firebase dependency.

## Security Notes

- **Never commit** actual Firebase credentials to the repository
- Use `.env.local` for local development (gitignored)
- Set environment variables in your hosting platform for production
- The Firebase config (API key, project ID, etc.) is safe to expose client-side
- Keep admin/service account credentials on the server only
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

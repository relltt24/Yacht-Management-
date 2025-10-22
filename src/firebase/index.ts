/**
 * Firebase Client Initializer using Modular SDK (v9+)
 * 
 * This file initializes Firebase services for browser/client-side use.
 * It uses NEXT_PUBLIC_* environment variables which are safe for client-side code.
 * 
 * DO NOT commit any secret keys or private credentials to this file.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
// These must be prefixed with NEXT_PUBLIC_ to be available in the browser
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if not already initialized
// This prevents multiple initialization errors
let app: FirebaseApp;
if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else if (typeof window !== 'undefined') {
  app = getApps()[0];
} else {
  // For SSR/server-side contexts, don't initialize
  // Firebase client SDK should only run in browser
  app = {} as FirebaseApp;
}

// Initialize Firebase services
// These will only be fully functional in browser context
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined' && getApps().length > 0) {
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
} else {
  // Provide stub objects for SSR contexts
  auth = {} as Auth;
  firestore = {} as Firestore;
  storage = {} as FirebaseStorage;
}

// Export individual services for named imports
export { auth, firestore, storage };

// Default export with all services
export default { auth, firestore, storage, app };

# Firebase Backend Setup Guide

## Overview

This guide will help you set up the complete Firebase backend infrastructure for the M/Y Azure Dreams yacht management platform. The backend includes Firestore database, Firebase Authentication, and comprehensive seed data.

## Architecture

### Firestore Structure

All application data is organized under a top-level collection called `vessels`. For this prototype, we use a single document `default-vessel` with all data stored in subcollections.

```
/vessels
  └── /default-vessel (document)
      ├── /itinerary (subcollection)
      ├── /maintenanceRecords (subcollection)
      ├── /expenses (subcollection)
      ├── /documents (subcollection)
      ├── /calendarEvents (subcollection)
      ├── /guestPreferences (subcollection)
      ├── /crewMembers (subcollection)
      ├── /vendorJobs (subcollection)
      └── /vendorBids (subcollection)
```

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com))
2. Node.js 18+ installed
3. Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name your project (e.g., "azure-dreams-yacht")
4. Follow the setup wizard

### 1.2 Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable these sign-in methods:
   - **Email/Password**: Click "Enable" toggle
   - **Google**: Click "Enable" toggle and configure

### 1.3 Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (we'll deploy rules later)
4. Select your preferred region
5. Click "Enable"

### 1.4 Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon `</>` to create a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 2: Environment Configuration

Create a `.env.local` file in your project root:

```env
# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# For server-side/initialization scripts (without NEXT_PUBLIC_ prefix)
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

**Important**: Never commit `.env.local` to version control!

## Step 3: Deploy Firestore Security Rules

The project includes `firestore.rules` that allows authenticated users to access all vessel data.

### Deploy Rules via Firebase CLI

```bash
# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy the security rules
firebase deploy --only firestore:rules
```

### Manual Deployment

Alternatively, copy the contents of `firestore.rules` and paste into Firebase Console:

1. Go to Firestore Database → Rules
2. Replace the existing rules with the content from `firestore.rules`
3. Click "Publish"

## Step 4: Initialize Database with Seed Data

### Option 1: Using the Initialization Script

```bash
# Make sure environment variables are set
node src/lib/init-firestore.js
```

This will populate your Firestore database with:
- 3 itinerary stops (Catalina, Santa Barbara, Cabo)
- 5 maintenance records
- 5 expense records
- 12 document files with folder structure
- 10 calendar events
- 6 guest preference profiles
- 6 crew member profiles
- 3 vendor jobs
- 4 vendor bids

### Option 2: Manual Data Entry

You can manually add documents using Firebase Console or import the data programmatically in your application.

## Step 5: Verify Setup

### Test Authentication

```javascript
import { auth } from './src/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Create a test user
const email = 'test@example.com';
const password = 'testpassword123';
await createUserWithEmailAndPassword(auth, email, password);
```

### Test Firestore Access

```javascript
import { firestore } from './src/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Read itinerary data
const itineraryRef = collection(firestore, 'vessels/default-vessel/itinerary');
const snapshot = await getDocs(itineraryRef);
snapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});
```

## Available Data Entities

### ItineraryStop
```typescript
{
  id: string;
  location: string;
  arrival: Date;
  departure: Date;
  activities: string[];
  guests: string[];
  crew: string[];
  imageUrl: string;
  imageHint: string;
}
```

### MaintenanceRecord
```typescript
{
  id: string;
  date: Date;
  service: string;
  vendor: string;
  cost: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  notes: string;
  rating?: number;
}
```

### Expense
```typescript
{
  id: string;
  date: Date;
  category: 'Fuel' | 'Provisioning' | 'Maintenance' | 'Salaries' | 'Other';
  description: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  approver?: string;
}
```

### CalendarEvent
```typescript
{
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'Maintenance' | 'Guest Trip' | 'Crew Schedule' | 'Charter' | 'Dockage' | 'Interior';
  description: string;
  participants: string[];
  allDay: boolean;
}
```

### CrewMember
```typescript
{
  id: string;
  name: string;
  position: 'Chef' | 'Deckhand' | 'Stewardess' | 'First Mate' | 'Captain' | 'Engineer';
  rate: number;
  rating: number;
  bio: string;
  imageUrl: string;
  imageHint: string;
  certifications: string[];
  availability: Array<{ start: Date; end: Date }>;
}
```

For complete TypeScript interfaces, see `src/lib/seed-data.ts`.

## Firestore Best Practices

### Reading Data

```javascript
import { firestore } from './src/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Get all itinerary stops
const itineraryRef = collection(firestore, 'vessels/default-vessel/itinerary');
const snapshot = await getDocs(itineraryRef);

// Query with filters
const q = query(
  collection(firestore, 'vessels/default-vessel/maintenanceRecords'),
  where('status', '==', 'Scheduled')
);
const results = await getDocs(q);
```

### Writing Data

```javascript
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';

// Add a new document with auto-generated ID
const newExpense = {
  date: new Date(),
  category: 'Fuel',
  description: 'Diesel refuel',
  amount: 5000,
  status: 'Pending'
};
const docRef = await addDoc(
  collection(firestore, 'vessels/default-vessel/expenses'),
  newExpense
);

// Set a document with specific ID
await setDoc(
  doc(firestore, 'vessels/default-vessel/expenses', 'exp-123'),
  newExpense
);
```

### Real-time Listeners

```javascript
import { onSnapshot } from 'firebase/firestore';

// Listen for changes
const unsubscribe = onSnapshot(
  collection(firestore, 'vessels/default-vessel/itinerary'),
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New itinerary:', change.doc.data());
      }
      if (change.type === 'modified') {
        console.log('Modified itinerary:', change.doc.data());
      }
      if (change.type === 'removed') {
        console.log('Removed itinerary:', change.doc.data());
      }
    });
  }
);

// Cleanup
unsubscribe();
```

## Security Considerations

1. **Authentication**: All Firestore operations require authentication
2. **Rules**: Current rules allow any authenticated user full access - modify for production
3. **Environment Variables**: Never commit API keys to version control
4. **API Keys**: Firebase API keys can be public (they're for identification, not authorization)
5. **Rate Limiting**: Consider implementing rate limiting for production use

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Check that you're authenticated
- Verify security rules are deployed
- Ensure you're accessing the correct collection path

### Error: "Firebase not initialized"
- Verify environment variables are set correctly
- Check that you're importing from the correct path

### TypeScript Errors
- Run `npm run type-check` to verify types
- Ensure all imports match the TypeScript interfaces

## Next Steps

1. Build your frontend application using the Firebase SDK
2. Implement user authentication flows
3. Create UI components for each data collection
4. Add real-time updates using Firestore listeners
5. Implement search and filtering
6. Add file upload to Firebase Storage
7. Set up Firebase Functions for backend logic (optional)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Backend Architecture](./docs/backend.json) - Complete schema definition

## Support

For issues or questions:
1. Review the TypeScript interfaces in `src/lib/seed-data.ts`
2. Check the backend architecture in `docs/backend.json`
3. Verify security rules in `firestore.rules`
4. Consult Firebase documentation

---

**Your AI-powered yacht management platform is ready to set sail! ⛵**

# Quick Start Guide - Firestore Data Model

## Installation

```bash
npm install firebase firebase-admin
npm install --save-dev typescript @types/node
```

## Import Types

```typescript
// Import all types
import * from './src/types';

// Or import specific types
import { 
  Vessel, 
  Itinerary, 
  MaintenanceRecord,
  Expense,
  CalendarEvent 
} from './src/types';
```

## Firebase Configuration

Create a `firebase-config.ts` file:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

## Basic Usage Examples

### 1. Create an Itinerary Entry

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase-config';
import { Itinerary } from './src/types';

const createItinerary = async (vesselId: string) => {
  const itinerary: Itinerary = {
    location: "Monaco",
    arrival: Timestamp.fromDate(new Date('2025-06-15')),
    departure: Timestamp.fromDate(new Date('2025-06-20')),
    activities: ["Grand Prix", "Casino Visit"],
    guests: ["John Doe"],
    crew: ["Captain Mike"],
    imageUrl: "https://example.com/monaco.jpg",
    imageHint: "Monaco harbor at sunset"
  };

  const docRef = await addDoc(
    collection(db, `vessels/${vesselId}/itinerary`),
    itinerary
  );
  console.log("Itinerary created with ID:", docRef.id);
};
```

### 2. Add an Expense

```typescript
import { Expense } from './src/types';

const addExpense = async (vesselId: string) => {
  const expense: Expense = {
    date: Timestamp.now(),
    category: "Fuel",
    description: "Refueling in Cannes",
    amount: 8500,
    status: "Pending"
  };

  await addDoc(
    collection(db, `vessels/${vesselId}/expenses`),
    expense
  );
};
```

### 3. Create Guest Preferences

```typescript
import { doc, setDoc } from 'firebase/firestore';
import { GuestPreferences } from './src/types';

const createGuestPreferences = async (vesselId: string, guestName: string) => {
  const preferences: GuestPreferences = {
    allergies: ["Shellfish"],
    dietaryRestrictions: ["Gluten-free"],
    favoriteFoods: ["Sushi", "Mediterranean cuisine"],
    diningStyle: "Formal dining at 7 PM",
    beveragePreferences: {
      water: ["San Pellegrino"],
      coffee: ["Espresso"],
      wine: ["Bordeaux"]
    },
    specialOccasions: ["Birthday: June 15"],
    otherNotes: "Prefers morning yoga"
  };

  // Use guest name as document ID
  await setDoc(
    doc(db, `vessels/${vesselId}/guestPreferences/${guestName}`),
    preferences
  );
};
```

### 4. Query Data

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

// Get all approved expenses
const getApprovedExpenses = async (vesselId: string) => {
  const q = query(
    collection(db, `vessels/${vesselId}/expenses`),
    where('status', '==', 'Approved')
  );
  
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
};

// Get upcoming calendar events
const getUpcomingEvents = async (vesselId: string) => {
  const now = Timestamp.now();
  const q = query(
    collection(db, `vessels/${vesselId}/calendarEvents`),
    where('start', '>=', now)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### 5. Add a Maintenance Record

```typescript
import { MaintenanceRecord } from './src/types';

const addMaintenanceRecord = async (vesselId: string) => {
  const record: MaintenanceRecord = {
    date: Timestamp.now(),
    service: "Engine Service",
    vendor: "Marine Services Inc.",
    cost: 15000,
    status: "Completed",
    notes: "All engines serviced",
    rating: 5
  };

  await addDoc(
    collection(db, `vessels/${vesselId}/maintenanceRecords`),
    record
  );
};
```

### 6. Create a Calendar Event

```typescript
import { CalendarEvent } from './src/types';

const createCalendarEvent = async (vesselId: string) => {
  const event: CalendarEvent = {
    title: "Mediterranean Charter",
    start: Timestamp.fromDate(new Date('2025-07-01')),
    end: Timestamp.fromDate(new Date('2025-07-15')),
    type: "Guest Trip",
    description: "Two-week charter",
    participants: ["John Doe", "Captain Mike"],
    allDay: false
  };

  await addDoc(
    collection(db, `vessels/${vesselId}/calendarEvents`),
    event
  );
};
```

## Default Vessel ID

As specified in requirements, you can use `default-vessel` as the default vessel ID:

```typescript
const DEFAULT_VESSEL_ID = 'default-vessel';

// Use it in your functions
await createItinerary(DEFAULT_VESSEL_ID);
```

## Security

All authenticated users can read/write to vessel data. Make sure users are authenticated before accessing Firestore:

```typescript
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is authenticated, can access Firestore
    console.log('User authenticated:', user.uid);
  } else {
    // User is not authenticated
    console.log('Please sign in');
  }
});
```

## Next Steps

1. Deploy Firestore rules: `firebase deploy --only firestore:rules`
2. Set up Firebase Authentication
3. Build your Next.js application using these types
4. Refer to `FIRESTORE_DATA_MODEL.md` for detailed documentation

## TypeScript Compilation

```bash
# Check types without emitting files
npm run type-check

# Build TypeScript files
npm run build
```

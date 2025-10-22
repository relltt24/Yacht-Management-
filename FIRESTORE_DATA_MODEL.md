# Firestore Data Model Documentation

## Overview

This document describes the complete Firestore data model for the high-end yacht management platform. All data is organized under a `vessels` collection, where each vessel has a unique ID (e.g., `default-vessel`). All subsequent data is stored in subcollections under that specific vessel document.

## Data Structure

```
/vessels/{vesselId}
├── /itinerary/{itineraryId}
├── /maintenanceRecords/{recordId}
├── /expenses/{expenseId}
├── /documents/{documentId}
├── /calendarEvents/{eventId}
├── /guestPreferences/{guestName}
├── /crewMembers/{crewMemberId}
├── /vendorJobs/{jobId}
└── /vendorBids/{bidId}
```

## Collections and Subcollections

### 1. Vessels (Main Collection)
**Path:** `/vessels/{vesselId}`

The main collection that contains vessel information.

**Fields:**
- `name` (string): Vessel name
- `type` (string): Vessel type (e.g., 'Motor Yacht', 'Sailing Yacht')
- `length` (number): Vessel length in feet or meters
- `year` (number): Year built
- `homePort` (string): Home port location
- `owner` (string): Owner name or ID
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

### 2. Itinerary
**Path:** `/vessels/{vesselId}/itinerary/{itineraryId}`

Stores trip itineraries and destinations.

**Fields:**
- `location` (string): Destination location
- `arrival` (timestamp): Arrival date and time
- `departure` (timestamp): Departure date and time
- `activities` (array of strings): Planned activities
- `guests` (array of strings): Guest names/IDs
- `crew` (array of strings): Crew member names/IDs
- `imageUrl` (string): URL to destination image
- `imageHint` (string): Hint for AI image generation

**Example:**
```typescript
{
  location: "Monaco",
  arrival: Timestamp.fromDate(new Date('2025-06-15')),
  departure: Timestamp.fromDate(new Date('2025-06-20')),
  activities: ["Grand Prix", "Casino de Monte-Carlo", "Yacht Show"],
  guests: ["John Doe", "Jane Smith"],
  crew: ["Captain Mike", "Chef Sarah"],
  imageUrl: "https://...",
  imageHint: "Luxury yacht in Monaco harbor"
}
```

### 3. Maintenance Records
**Path:** `/vessels/{vesselId}/maintenanceRecords/{recordId}`

Tracks maintenance history and service records.

**Fields:**
- `date` (timestamp): Service date
- `service` (string): Service description
- `vendor` (string): Service provider name
- `cost` (number): Service cost
- `status` (string): 'Completed', 'In Progress', or 'Scheduled'
- `notes` (string): Additional notes
- `rating` (number, optional): Service rating (1-5)

**Example:**
```typescript
{
  date: Timestamp.now(),
  service: "Engine Overhaul",
  vendor: "Marine Services Inc.",
  cost: 15000,
  status: "Completed",
  notes: "All engines serviced, replaced filters",
  rating: 5
}
```

### 4. Expenses (Wallet)
**Path:** `/vessels/{vesselId}/expenses/{expenseId}`

Manages all yacht expenses and financial tracking.

**Fields:**
- `date` (timestamp): Expense date
- `category` (string): 'Fuel', 'Provisioning', 'Maintenance', 'Crew', 'Docking', 'Insurance', 'Other'
- `description` (string): Expense description
- `amount` (number): Expense amount
- `status` (string): 'Approved', 'Pending', or 'Rejected'
- `approver` (string, optional): Approver name/ID

**Example:**
```typescript
{
  date: Timestamp.now(),
  category: "Fuel",
  description: "Refueling in Cannes",
  amount: 8500,
  status: "Approved",
  approver: "John Doe"
}
```

### 5. Documents
**Path:** `/vessels/{vesselId}/documents/{documentId}`

Stores vessel documentation with folder structure and access control.

**Fields:**
- `name` (string): Document name
- `type` (string): 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'folder', 'image', 'other'
- `size` (string): File size (e.g., "2.5 MB")
- `lastModified` (timestamp): Last modification date
- `path` (string): Folder path (e.g., "/Certificates/Insurance")
- `category` (string): Document category
- `access` (array of strings): User roles with access ['Owner', 'Captain', 'Crew', 'Guest', 'Manager']

**Example:**
```typescript
{
  name: "Insurance Certificate 2025",
  type: "pdf",
  size: "2.5 MB",
  lastModified: Timestamp.now(),
  path: "/Certificates/Insurance",
  category: "Legal",
  access: ["Owner", "Captain", "Manager"]
}
```

### 6. Calendar Events
**Path:** `/vessels/{vesselId}/calendarEvents/{eventId}`

Unified calendar for all yacht events.

**Fields:**
- `title` (string): Event title
- `start` (timestamp): Start date/time
- `end` (timestamp): End date/time
- `type` (string): 'Maintenance', 'Guest Trip', 'Crew Schedule', 'Interior', 'Provisioning', 'Docking', 'Other'
- `description` (string): Event description
- `participants` (array of strings): Participant names/IDs
- `allDay` (boolean): All-day event flag

**Example:**
```typescript
{
  title: "Mediterranean Charter",
  start: Timestamp.fromDate(new Date('2025-07-01')),
  end: Timestamp.fromDate(new Date('2025-07-15')),
  type: "Guest Trip",
  description: "Two-week charter through Greek islands",
  participants: ["John Doe", "Jane Smith", "Captain Mike"],
  allDay: false
}
```

### 7. Guest Preferences
**Path:** `/vessels/{vesselId}/guestPreferences/{guestName}`

**Note:** Document ID should be the guest's name.

Stores detailed guest preferences for personalized service.

**Fields:**
- `allergies` (array of strings): Food/environmental allergies
- `dietaryRestrictions` (array of strings): Dietary restrictions
- `favoriteFoods` (array of strings): Favorite foods and dishes
- `diningStyle` (string): Preferred dining style
- `beveragePreferences` (object): Detailed beverage preferences
  - `water` (array of strings)
  - `coffee` (array of strings)
  - `tea` (array of strings)
  - `spirits` (array of strings)
  - `wine` (array of strings)
- `specialOccasions` (array of strings): Birthdays, anniversaries, etc.
- `otherNotes` (string): Additional notes

**Example:**
```typescript
{
  allergies: ["Shellfish", "Peanuts"],
  dietaryRestrictions: ["Gluten-free"],
  favoriteFoods: ["Sushi", "Mediterranean cuisine", "Fresh fruits"],
  diningStyle: "Formal dining, prefer 7 PM dinner",
  beveragePreferences: {
    water: ["San Pellegrino", "Fiji"],
    coffee: ["Espresso", "Cappuccino"],
    tea: ["Earl Grey", "Green tea"],
    spirits: ["Macallan 18", "Grey Goose"],
    wine: ["Bordeaux", "Champagne"]
  },
  specialOccasions: ["Birthday: June 15", "Anniversary: August 20"],
  otherNotes: "Prefers morning yoga sessions, likes classical music during dinner"
}
```

### 8. Crew Members (Freelance Marketplace)
**Path:** `/vessels/{vesselId}/crewMembers/{crewMemberId}`

Database for freelance crew marketplace.

**Fields:**
- `name` (string): Crew member name
- `position` (string): Position (e.g., 'Chef', 'Deckhand', 'Engineer')
- `rate` (number): Daily or hourly rate
- `rating` (number): Rating (1-5)
- `bio` (string): Biography/description
- `imageUrl` (string): Profile image URL
- `certifications` (array of strings): Certifications and licenses
- `availability` (array of objects): Available date ranges
  - Each object has `start` and `end` timestamps

**Example:**
```typescript
{
  name: "Sarah Johnson",
  position: "Executive Chef",
  rate: 450,
  rating: 4.8,
  bio: "Award-winning chef with 15 years experience in luxury yachting",
  imageUrl: "https://...",
  certifications: ["STCW", "Food Safety Level 3", "Wine Sommelier"],
  availability: [
    {
      start: Timestamp.fromDate(new Date('2025-06-01')),
      end: Timestamp.fromDate(new Date('2025-08-31'))
    }
  ]
}
```

### 9. Vendor Jobs
**Path:** `/vessels/{vesselId}/vendorJobs/{jobId}`

Job postings for vendor marketplace.

**Fields:**
- `title` (string): Job title
- `vessel` (string): Vessel name or ID
- `budget` (number): Job budget
- `deadline` (timestamp): Job deadline
- `description` (string): Job description

**Example:**
```typescript
{
  title: "Annual Hull Cleaning and Maintenance",
  vessel: "M/Y Serenity",
  budget: 25000,
  deadline: Timestamp.fromDate(new Date('2025-05-01')),
  description: "Complete hull cleaning, anti-fouling, and underwater inspection required"
}
```

### 10. Vendor Bids
**Path:** `/vessels/{vesselId}/vendorBids/{bidId}`

Bids submitted by vendors for jobs.

**Fields:**
- `jobId` (string): Reference to vendor job
- `vendorId` (string): Vendor user ID
- `bidAmount` (number): Bid amount
- `estimatedHours` (number): Estimated hours to complete
- `coverLetter` (string): Vendor's proposal/cover letter
- `status` (string): 'Submitted', 'Accepted', or 'Rejected'

**Example:**
```typescript
{
  jobId: "job123",
  vendorId: "vendor456",
  bidAmount: 22000,
  estimatedHours: 120,
  coverLetter: "We specialize in luxury yacht maintenance with 20 years experience...",
  status: "Submitted"
}
```

## Security Rules

The Firestore security rules are configured to allow any authenticated user to read and write to any document within a specific vessel's subcollections.

**Path:** `firestore.rules`

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /vessels/{vesselId}/{document=**} {
      allow read, write: if isAuthenticated();
    }
    
    match /vessels/{vesselId} {
      allow read, write: if isAuthenticated();
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## TypeScript Usage

All TypeScript interfaces are defined in `src/types/firestore.ts`. Import them as needed:

```typescript
import {
  Vessel,
  Itinerary,
  MaintenanceRecord,
  Expense,
  Document,
  CalendarEvent,
  GuestPreferences,
  CrewMember,
  VendorJob,
  VendorBid
} from './types/firestore';
```

## Example: Creating Data

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase-config';
import { Itinerary } from './types/firestore';

// Create a new itinerary entry
const itinerary: Itinerary = {
  location: "St. Tropez",
  arrival: Timestamp.fromDate(new Date('2025-07-10')),
  departure: Timestamp.fromDate(new Date('2025-07-15')),
  activities: ["Beach clubs", "Shopping", "Fine dining"],
  guests: ["Guest 1", "Guest 2"],
  crew: ["Captain", "Chef"],
  imageUrl: "https://example.com/image.jpg",
  imageHint: "Luxury yacht in St. Tropez harbor at sunset"
};

const itineraryRef = collection(db, 'vessels/default-vessel/itinerary');
await addDoc(itineraryRef, itinerary);
```

## Example: Querying Data

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase-config';

// Query approved expenses
const expensesRef = collection(db, 'vessels/default-vessel/expenses');
const q = query(expensesRef, where('status', '==', 'Approved'));
const querySnapshot = await getDocs(q);

querySnapshot.forEach((doc) => {
  console.log(doc.id, ' => ', doc.data());
});
```

## Notes

- All timestamps use Firestore's `Timestamp` type from `firebase/firestore`
- Document IDs can be auto-generated or custom (e.g., guest preferences use guest name as ID)
- The data model is designed for scalability and flexibility
- Security rules are permissive for authenticated users but can be further refined based on specific requirements
- Consider implementing Cloud Functions for complex business logic and data validation

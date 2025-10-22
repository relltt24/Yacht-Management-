# Firebase Backend Infrastructure for M/Y Azure Dreams

## Overview

This repository contains the complete Firebase backend infrastructure for the M/Y Azure Dreams yacht management platform. The platform is built with Next.js and uses Firestore database and Firebase Authentication.

## Architecture

### Data Structure

All application data is organized under a top-level Firestore collection named `vessels`. For this prototype, all data lives under a single document with the ID `default-vessel`.

**Structure:**
```
/vessels/default-vessel/
├── itinerary/              (Yacht trip itineraries)
├── maintenanceRecords/     (Maintenance and service history)
├── expenses/               (Financial tracking and expenses)
├── documents/              (Document management system)
├── calendarEvents/         (Unified calendar events)
├── guestPreferences/       (Guest preferences and requirements)
├── crewMembers/            (Crew marketplace profiles)
├── vendorJobs/             (Job opportunities for vendors)
└── vendorBids/             (Vendor bids for jobs)
```

## Files Created

### 1. `docs/backend.json`

Complete architecture documentation describing:
- **Entities**: JSON schemas for all 10 data types (UserProfile, ItineraryStop, MaintenanceRecord, Expense, DocumentFile, CalendarEvent, CrewMember, GuestPreference, VendorJob, VendorBid)
- **Firestore Structure**: Mapping of collection paths to entity schemas
- **Authentication**: Email/Password and Google OAuth providers
- **User Roles**: Owner, Captain, Crew, Guest, Vendor

### 2. `firestore.rules`

Security rules for Firestore database:
- Allows any authenticated user (`request.auth != null`) to perform all read and write operations on the `vessels` collection and all nested subcollections
- Uses the wildcard pattern `{document=**}` to apply rules to all nested documents

### 3. `src/lib/seed-data.ts`

Comprehensive TypeScript file containing:

#### Type Definitions
- 8 TypeScript types for enums (UserRole, MaintenanceStatus, ExpenseCategory, etc.)

#### Interface Definitions
- 9 complete TypeScript interfaces matching the backend.json schemas

#### Seed Data Collections

**Itinerary (4 stops):**
- Catalina Island, CA (Nov 15-18, 2025)
- Santa Barbara, CA (Nov 20-22, 2025)
- Cabo San Lucas, Mexico (Dec 5-12, 2025)
- Marina del Rey, CA (Jan 10-12, 2026)

**Maintenance Records (5 records):**
- Engine Overhaul - Completed ($45,000)
- HVAC System Repair - Completed ($8,500)
- Navigation System Update - Completed ($2,400)
- Hull Inspection & Anti-fouling - In Progress ($12,000)
- Annual Safety Certification - Scheduled ($3,200)

**Expenses (5 records):**
- Fuel ($8,750) - Approved
- Provisioning ($4,200) - Approved
- Maintenance ($1,850) - Approved
- Salaries ($28,000) - Pending
- Dockage Fees ($6,500) - Pending

**Documents (14 files/folders):**
- Safety & Compliance folder with 3 documents
- Crew Dossiers folder with 3 documents
- Insurance & Registration folder with 2 documents
- Maintenance Records folder with 2 documents

**Calendar Events (11 events):**
- Derived from itinerary (4 trips)
- Derived from maintenance (2 scheduled services)
- Unique events: Shipyard Period, Owner Day Trip, Interior Deep Clean, Crew Training, New Year's Eve Charter, Monthly Dockage Fee

**Guest Preferences (6 guests):**
- John Anderson - Fine dining, Scotch & Bordeaux
- Sarah Anderson - Vegetarian, shellfish allergy, champagne
- Emily Chen - Gluten-free, pescatarian, vodka martini
- Michael Roberts - Keto diet, lactose intolerant, bourbon
- Thomas Anderson - Adventurous eater, bee sting allergy, tequila
- Robert Williams - Low sodium, peanut allergy, gin & tonic

**Crew Members (6 profiles):**
- Chef Isabella Martinez (Chef) - $650/day, 5-star rating
- Deckhand Marcus Thompson (Deckhand) - $350/day, 4.5-star rating
- Stewardess Sophie Laurent (Stewardess) - $450/day, 5-star rating
- First Mate Alex Rivera (First Mate) - $550/day, 4.5-star rating
- Chef Antonio Rossi (Chef) - $700/day, 4-star rating
- Deckhand Emma Wilson (Deckhand) - $380/day, 4.5-star rating

**Vendor Jobs (3 opportunities):**
- Full Hull Repaint ($85,000 budget, deadline Mar 15, 2026)
- Teak Deck Replacement ($62,000 budget, deadline Feb 28, 2026)
- Electronics Upgrade Package ($125,000 budget, deadline Jan 31, 2026)

**Vendor Bids (4 bids):**
- 2 bids for Hull Repaint job ($82,000 and $89,500)
- 1 bid for Teak Deck job ($59,000)
- 1 bid for Electronics Upgrade ($118,000)

## Usage

### Importing Seed Data

```typescript
import {
  itinerarySeedData,
  maintenanceSeedData,
  expenseSeedData,
  documentsSeedData,
  calendarEventsSeedData,
  guestPreferencesSeedData,
  crewMembersSeedData,
  vendorJobsSeedData,
  vendorBidsSeedData,
  allSeedData
} from './src/lib/seed-data';

// Use individual collections
console.log(itinerarySeedData);

// Or import all data at once
console.log(allSeedData.itinerary);
```

### Using Interfaces

```typescript
import { ItineraryStop, MaintenanceRecord, CrewMember } from './src/lib/seed-data';

const newStop: ItineraryStop = {
  id: 'itin-005',
  location: 'San Diego, CA',
  arrival: new Date('2026-02-01'),
  departure: new Date('2026-02-03'),
  activities: ['Museum visits', 'Harbor cruise'],
  guests: ['John Doe'],
  crew: ['Captain Smith'],
  imageUrl: 'https://example.com/image.jpg',
  imageHint: 'San Diego harbor view'
};
```

## Firebase Configuration

Update your `firebase.json` to reference the security rules:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

## Authentication Providers

The platform supports two authentication methods:
1. **Email/Password** - Traditional email and password authentication
2. **Google OAuth** - Sign in with Google account

## Security

- All data access requires authentication (`request.auth != null`)
- No public access to any vessel data
- Role-based access control can be implemented in application logic
- CodeQL security scan completed with 0 vulnerabilities found

## Data Statistics

- **Total Interfaces**: 9
- **Total Type Definitions**: 8
- **Total Seed Records**: 
  - Itinerary Stops: 4
  - Maintenance Records: 5
  - Expenses: 5
  - Documents: 14
  - Calendar Events: 11
  - Guest Preferences: 6
  - Crew Members: 6
  - Vendor Jobs: 3
  - Vendor Bids: 4
  - **Grand Total: 58 seed records**

## Next Steps

1. Initialize Firebase project
2. Deploy Firestore security rules: `firebase deploy --only firestore:rules`
3. Import seed data into Firestore using the provided TypeScript interfaces
4. Configure Firebase Authentication providers (Email/Password and Google)
5. Connect frontend Next.js application to Firebase backend

## License

This backend infrastructure is part of the M/Y Azure Dreams yacht management platform.

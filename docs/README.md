# Firebase Backend Architecture Documentation

## Overview

This directory contains the complete Firebase backend infrastructure definition for the M/Y Azure Dreams yacht management platform. The architecture is designed to be the single source of truth for the entire data layer.

## Files

### 1. `backend.json`
**Purpose:** Master architecture definition file containing:
- JSON Schema definitions for all data entities
- Firestore collection structure mappings
- Authentication provider configuration

**Size:** 537 lines  
**Format:** JSON Schema (draft-07)

### 2. `firestore.rules`
**Purpose:** Firebase Firestore security rules

**Size:** 8 lines  
**Security Model:** Vessel-scoped access control - authenticated users can read/write all data under their vessel

## Architecture Components

### Authentication
The system uses Firebase Authentication with two providers:
- **Google Sign-In** (`google.com`)
- **Email/Password** (`password`)

### Data Entities (10 schemas)

| Entity | Description | Required Fields |
|--------|-------------|----------------|
| **UserProfile** | User account information | name, email, role |
| **ItineraryStop** | Trip planning stops | location, arrival, departure |
| **MaintenanceRecord** | Service history | date, service, vendor, cost, status |
| **Expense** | Financial tracking | date, category, description, amount, status |
| **DocumentFile** | Document management | name, type, path, access |
| **CalendarEvent** | Unified calendar | title, start, end, type, allDay |
| **GuestPreference** | Guest requirements | (all optional) |
| **CrewMember** | Crew marketplace | name, position, rate |
| **VendorJob** | Job postings | title, budget, deadline |
| **VendorBid** | Vendor bids | jobId, vendorId, bidAmount |

### Firestore Collection Structure

All collections are nested under `/vessels/{vesselId}/` for proper data scoping:

```
/vessels/{vesselId}/
├── itinerary/{itineraryId}
├── maintenanceRecords/{recordId}
├── expenses/{expenseId}
├── documents/{docId}
├── calendarEvents/{eventId}
├── guestPreferences/{guestId}
├── crewMembers/{crewId}
├── vendorJobs/{jobId}
└── vendorBids/{bidId}
```

## Usage Examples

### JavaScript/TypeScript

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Initialize Firebase (use your config)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example 1: Add an itinerary stop
const vesselId = 'my-yacht-123';
const itineraryRef = collection(db, `vessels/${vesselId}/itinerary`);
await addDoc(itineraryRef, {
  location: 'Monaco',
  arrival: '2025-11-15T14:00:00Z',
  departure: '2025-11-17T10:00:00Z',
  activities: ['Casino visit', 'Grand Prix viewing'],
  guests: ['John Doe'],
  crew: ['captain-001']
});

// Example 2: Query maintenance records
const maintenanceRef = collection(db, `vessels/${vesselId}/maintenanceRecords`);
const q = query(maintenanceRef, where('status', '==', 'In Progress'));
const snapshot = await getDocs(q);
snapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
});

// Example 3: Add an expense
const expensesRef = collection(db, `vessels/${vesselId}/expenses`);
await addDoc(expensesRef, {
  date: new Date().toISOString(),
  category: 'Fuel',
  description: 'Refuel at port',
  amount: 8500.00,
  status: 'Pending'
});
```

### Security Rules Behavior

```javascript
// ✅ Authenticated users can read all vessel data
const itinerary = await getDocs(collection(db, 'vessels/yacht-123/itinerary'));

// ✅ Authenticated users can write to vessel collections
await addDoc(collection(db, 'vessels/yacht-123/expenses'), expenseData);

// ❌ Unauthenticated users cannot access any data
// This will fail if user is not signed in
```

## Validation

All entity schemas include:
- **Type validation** - Enforces correct data types (string, number, boolean, array, object)
- **Format validation** - Validates email, URI, date-time formats
- **Enum constraints** - Restricts values to predefined options (e.g., expense categories)
- **Required fields** - Ensures critical data is always present
- **Range validation** - Enforces minimum/maximum values where applicable

## Implementation Checklist

- [x] Define all entity schemas with JSON Schema
- [x] Map Firestore collections to vessel subcollections
- [x] Configure authentication providers
- [x] Create security rules for vessel-scoped access
- [x] Validate JSON structure
- [x] Document usage examples

## Next Steps

To implement this backend in your Firebase project:

1. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Enable Authentication Providers:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Google and Email/Password providers

3. **Use the Schema Definitions:**
   - Reference `backend.json` when building your frontend
   - Implement type-safe interfaces based on the schemas
   - Use the entity definitions for form validation

4. **Initialize Firestore Collections:**
   - Collections are created automatically when you add the first document
   - Follow the collection paths defined in `backend.json`

## Schema Validation

The `backend.json` file follows JSON Schema draft-07 specification. You can validate your data against these schemas using libraries like:

- **JavaScript/TypeScript:** `ajv`, `jsonschema`
- **Python:** `jsonschema`
- **Java:** `json-schema-validator`

Example with AJV:
```javascript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import backendSchema from './docs/backend.json';

const ajv = new Ajv();
addFormats(ajv);

// Validate an itinerary stop
const validate = ajv.compile(backendSchema.entities.ItineraryStop);
const valid = validate(myItineraryData);
if (!valid) console.log(validate.errors);
```

## Support

For questions or issues related to the backend architecture:
1. Review the entity schemas in `backend.json`
2. Check the security rules in `firestore.rules`
3. Refer to the usage examples above
4. Consult the [Firebase documentation](https://firebase.google.com/docs)

## Version

**Version:** 1.0.0  
**Last Updated:** 2025-10-22  
**Schema Standard:** JSON Schema draft-07

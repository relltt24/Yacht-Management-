# AI Yacht Management System - Firebase Backend

A comprehensive RESTful API backend for managing yacht fleets with AI-ready analytics.

## Features

- **Complete CRUD API**: Full yacht, crew, maintenance, booking, and inventory management
- **AI Analytics Endpoints**: Pre-aggregated data for ML/AI applications
- **Firebase Cloud Functions**: Serverless deployment with automatic scaling
- **Dual Route Support**: Works with both `/api/*` and root paths for flexibility
- **In-Memory Storage**: Quick development and testing (easily replaced with Firestore)
- **Comprehensive Tests**: Jest + Supertest test suite with 12+ tests
- **GitHub Actions CI/CD**: Automated testing and deployment

## Architecture

- **Cloud Functions** (Express) in `functions/` - Full API implementation
- **Static Hosting** in `public/` - Landing page and frontend assets
- **Firebase Hosting** configuration with smart routing
- **Firestore Rules** for future database integration
- **GitHub Actions** workflow for automated deployment

**Important:** No secrets are committed. You must add the service account secret to GitHub secrets.

## Quick setup (developer machine)

1. Install Node 18 (`nvm use 18` recommended).
2. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
3. Install repo dependencies:
   ```bash
   npm ci
   cd functions && npm ci
   ```

## Add required secret to GitHub repository (required for CI deploy)

1. Create a Firebase service account:
   - Firebase Console → Project Settings → Service accounts → Generate new private key.
   - Copy the JSON content (DO NOT commit the JSON file to the repo).
2. Add the JSON content as a GitHub Actions secret:
   - Repo → Settings → Secrets and variables → Actions → New repository secret
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: paste the full JSON

## Local development with emulator

Start Firestore & Functions emulator:
```bash
firebase emulators:start --only functions,firestore
```

Run tests:
```bash
npm --prefix ./functions run test
```

## Deploying

- **CI**: the GitHub Actions workflow will run on push to `main` and deploy using the `FIREBASE_SERVICE_ACCOUNT` secret.
- **Manual**: ensure your firebase CLI is authenticated and run:
  ```bash
  firebase deploy --only hosting,functions --project yachtmanagement
  ```

## Post-merge steps

After merging this PR:

1. Add `FIREBASE_SERVICE_ACCOUNT` secret in repository **Settings → Secrets and variables → Actions**:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: paste the JSON from Firebase service account (do NOT commit)
2. Confirm Studio runtime env values in Firebase Studio (`apphosting.yaml` runtime.env placeholders)
3. Merge and monitor CI + Firebase Studio builds.

## Migration Plan

See `scripts/migrate_stub.md` for the safe approach to migrate existing Firestore data to the new structure.

## API Endpoints

The API is accessible at `/api/*` when deployed to Firebase. All endpoints support:

- **Yachts**: `/api/yachts` - Full CRUD operations
- **Crew**: `/api/crew` - Crew management with certifications
- **Maintenance**: `/api/maintenance` - Maintenance scheduling and tracking
- **Bookings**: `/api/bookings` - Charter and reservation management
- **Inventory**: `/api/inventory` - Supply and equipment tracking
- **Analytics**: `/api/analytics/*` - AI-ready analytics and insights

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint documentation.

## Testing

Run the test suite:
```bash
cd functions && npm test
```

All tests verify:
- Basic functionality (health checks, API info)
- CRUD operations (yachts, crew, bookings, etc.)
- Analytics endpoints
- Dual route support (root and `/api` prefix)

## Notes

- No secrets are committed in this repository
- The backend uses in-memory storage for quick development
- Authentication is ready for Firebase Auth integration
- All endpoints support query parameter filtering
- CORS is configured for cross-origin requests
- Comprehensive error handling and validation

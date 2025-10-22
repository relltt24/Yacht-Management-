# Yacht Management System - Firebase Backend

This branch adds a minimal, stable Firebase backend scaffold:

- Cloud Functions (Express) in `functions/`
- Firestore security rules (`firestore.rules`)
- Hosting configuration in `firebase.json`
- Firebase Studio config in `apphosting.yaml`
- GitHub Actions workflow to run tests and deploy to Firebase (requires a repo secret)
- Test suite (jest + supertest) for basic endpoints

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

## Notes

- No secrets are added in this PR.
- The backend uses Firebase Functions (Express) with Firestore for data persistence.
- Authentication is stubbed (placeholder middleware) - production will validate JWT tokens.
- Tests use jest + supertest for basic endpoint validation.

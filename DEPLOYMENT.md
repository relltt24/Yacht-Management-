# Firebase Deployment Setup

This repository uses Firebase Hosting for deployment. The GitHub Actions workflows are configured to automatically deploy the application.

## Required Secrets

To enable Firebase deployment, you need to add the following secrets to your GitHub repository:

### 1. FIREBASE_SERVICE_ACCOUNT
This is a service account key JSON for Firebase authentication.

**How to create:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file
6. In GitHub: Settings > Secrets and variables > Actions > New repository secret
7. Name: `FIREBASE_SERVICE_ACCOUNT`
8. Value: Paste the entire JSON content

### 2. FIREBASE_PROJECT_ID
Your Firebase project ID.

**How to find:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Copy the "Project ID"
5. In GitHub: Settings > Secrets and variables > Actions > New repository secret
6. Name: `FIREBASE_PROJECT_ID`
7. Value: Paste your project ID

## Workflows

### CI Workflow (ci.yml)
Runs on every push and pull request to `main` and `backend-setup` branches:
- Installs dependencies
- Lints the code (if ESLint is configured)
- Tests the Express backend server

### Firebase Hosting Deployment (firebase-hosting-merge.yml)
Runs on every merge to the `main` branch:
- Deploys the application to Firebase Hosting production

### Firebase Hosting Preview (firebase-hosting-pull-request.yml)
Runs on every pull request:
- Creates a preview deployment on Firebase Hosting
- Adds a comment to the PR with the preview URL

## Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start

# The server will run on http://localhost:8080
```

## Firebase Configuration

The `firebase.json` file configures Firebase Hosting:
- Public directory: `.` (root directory)
- Ignores: `firebase.json`, hidden files, `node_modules`

The `apphosting.yaml` file configures Firebase App Hosting:
- Runtime: Node.js 20
- Health check endpoint: `/healthz`

## Troubleshooting

### "action_required" status
This usually means the workflow is waiting for approval or missing secrets. Check:
1. Repository Settings > Secrets - ensure FIREBASE_SERVICE_ACCOUNT and FIREBASE_PROJECT_ID are set
2. Repository Settings > Environments - check if there are any protection rules requiring approval

### Build failures
Check the workflow logs in the Actions tab for specific error messages. Common issues:
- Missing dependencies: Run `npm install` locally to verify
- Node version mismatch: Ensure you're using Node.js 20
- Port conflicts: The server uses port 8080 by default

### Deployment failures
- Verify Firebase secrets are correctly set
- Ensure Firebase project is properly initialized
- Check Firebase Console for any project-level issues

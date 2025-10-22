# Yacht Management System

A Firebase-powered yacht management application with backend API support.

## Project Structure

```
.
├── Index.html          # Static frontend homepage
├── server.js           # Express backend server for Firebase App Hosting
├── package.json        # Root package.json for the backend server
├── functions/          # Firebase Cloud Functions
│   ├── index.js        # Functions entry point
│   └── package.json    # Functions dependencies
├── firebase.json       # Firebase configuration
└── apphosting.yaml     # Firebase App Hosting configuration
```

## Prerequisites

- Node.js 20 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project set up

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install functions dependencies:
```bash
cd functions
npm install
cd ..
```

## Local Development

### Run the Express server locally:
```bash
npm start
```

The server will start on port 8080 (or the PORT environment variable).

### Test Firebase Functions locally:
```bash
firebase emulators:start
```

## Deployment

### Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

### Deploy Firebase Functions:
```bash
firebase deploy --only functions
```

### Deploy everything:
```bash
firebase deploy
```

## API Endpoints

### Backend Server (server.js)
- `GET /` - Root endpoint, returns "Backend is working!"
- `GET /healthz` - Health check endpoint for Firebase App Hosting
- `GET /api/status` - Returns JSON status with timestamp

### Firebase Functions
- `GET /api` - Firebase Function endpoint (via firebase.json rewrite)
- `GET /api/healthz` - Health check for Firebase Functions

## Firebase Configuration

### firebase.json
Configures Firebase Hosting to:
- Serve static files from the root directory
- Rewrite `/api/**` requests to the Firebase Function
- Ignore unnecessary files during deployment

### apphosting.yaml
Configures Firebase App Hosting with:
- Node.js 20 runtime
- 512 MiB memory
- Auto-scaling from 0 to 10 instances
- Health check on `/healthz` endpoint

## Environment Variables

- `PORT` - Port for the Express server (default: 8080)
- `NODE_ENV` - Environment mode (default: production in Firebase)

## Publishing to Firebase

To successfully publish your app:

1. Make sure you're logged in to Firebase:
```bash
firebase login
```

2. Initialize your Firebase project (if not done):
```bash
firebase use --add
```

3. Deploy your application:
```bash
firebase deploy
```

The deployment will:
- Upload static files (Index.html) to Firebase Hosting
- Deploy the Express backend via Firebase App Hosting
- Deploy Cloud Functions for additional API endpoints

## Support

For issues or questions, please open an issue in the repository.

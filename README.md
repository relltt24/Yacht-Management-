# Yacht Management System

A yacht management application built with Node.js, Express, and Firebase.

## Features

- Express backend server with health check endpoint
- Firebase Cloud Functions integration
- Firebase Hosting for static content

## Prerequisites

- Node.js 20 or higher
- npm
- Firebase CLI (optional, for deploying functions and hosting)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/relltt24/Yacht-Management-.git
cd Yacht-Management-
```

2. Install dependencies:
```bash
npm install
```

3. Install Firebase Functions dependencies (optional):
```bash
cd functions
npm install
cd ..
```

## Running the Application

### Local Development

Start the Express server:
```bash
npm start
```

The server will run on `http://localhost:8080` (or the port specified in the `PORT` environment variable).

Available endpoints:
- `/` - Main backend endpoint
- `/healthz` - Health check endpoint

## Project Structure

```
.
├── functions/          # Firebase Cloud Functions
│   ├── index.js       # Cloud Functions entry point
│   └── package.json   # Functions dependencies
├── src/               # Source files
│   └── firebase/      # Firebase configuration stubs
├── index.html         # Main HTML page
├── server.js          # Express server
├── package.json       # Project dependencies
├── firebase.json      # Firebase configuration
└── apphosting.yaml    # Firebase App Hosting configuration
```

## Deployment

### Firebase Hosting

To deploy the static site to Firebase Hosting:
```bash
firebase deploy --only hosting
```

### Firebase Functions

To deploy Cloud Functions:
```bash
firebase deploy --only functions
```

### Firebase App Hosting

The application is configured for Firebase App Hosting with the `apphosting.yaml` file.

## Environment Variables

- `PORT` - Server port (default: 8080)

## License

ISC

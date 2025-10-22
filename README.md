# Yacht Management Application

A yacht management application with Express.js backend and static frontend, deployed on Firebase Hosting.

## Project Structure

```
.
├── .github/
│   └── workflows/          # GitHub Actions workflows
├── functions/              # Firebase Functions
├── src/
│   └── firebase/          # Firebase client configuration
├── Index.html             # Main HTML page
├── server.js              # Express backend server
├── package.json           # Node.js dependencies
├── firebase.json          # Firebase Hosting configuration
└── apphosting.yaml        # Firebase App Hosting configuration
```

## Features

- Express.js backend with health check endpoint
- Static HTML frontend
- Firebase Hosting deployment
- Automated CI/CD with GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/relltt24/Yacht-Management-.git
cd Yacht-Management-

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the server
npm start

# The server will be available at http://localhost:8080
```

### Endpoints

- `GET /` - Main application page
- `GET /healthz` - Health check endpoint (returns "ok")

## Deployment

The application is automatically deployed to Firebase Hosting via GitHub Actions.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment configuration and setup instructions.

## Workflows

- **CI**: Runs tests and linting on every push and PR
- **Firebase Hosting (merge)**: Deploys to production on merge to main
- **Firebase Hosting (PR)**: Creates preview deployments for pull requests

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for CI checks to pass
5. Preview deployment will be available in the PR comments

## License

YM APP

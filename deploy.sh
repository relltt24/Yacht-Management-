#!/bin/bash
# Firebase Deployment Script for AI Yacht Management Backend
# This script helps deploy the backend to Firebase Cloud Functions

set -e

echo "🚢 AI Yacht Management Backend - Firebase Deployment"
echo "=================================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "📦 Installing Firebase CLI globally..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI is installed"
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo ""

# Step 1: Install root dependencies
echo "1️⃣  Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Step 2: Install functions dependencies
echo "2️⃣  Installing functions dependencies..."
cd functions
npm install
cd ..
echo "✅ Functions dependencies installed"
echo ""

# Step 3: Run build
echo "3️⃣  Running build..."
npm run build
echo "✅ Build completed"
echo ""

# Step 4: Test locally
echo "4️⃣  Would you like to test locally first? (y/n)"
read -r test_local

if [[ "$test_local" =~ ^[Yy]$ ]]; then
    echo "Starting local server for testing..."
    echo "Open http://localhost:8080 in your browser"
    echo "Press Ctrl+C to stop the server and continue with deployment"
    npm start
fi

echo ""
echo "5️⃣  Login to Firebase (if not already logged in)..."
firebase login --no-localhost

echo ""
echo "6️⃣  Selecting Firebase project..."
firebase use studio-4010754397 || firebase use --add

echo ""
echo "7️⃣  Deploying to Firebase..."
echo ""
echo "Choose deployment option:"
echo "  1) Deploy everything (Hosting + Functions)"
echo "  2) Deploy Functions only"
echo "  3) Deploy Hosting only"
read -r -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Deploying everything..."
        firebase deploy
        ;;
    2)
        echo "Deploying Functions only..."
        firebase deploy --only functions
        ;;
    3)
        echo "Deploying Hosting only..."
        firebase deploy --only hosting
        ;;
    *)
        echo "Invalid choice. Deploying everything..."
        firebase deploy
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🎉 Your backend is now live!"
echo ""
echo "📊 View your deployment:"
echo "   Console: https://console.firebase.google.com/project/studio-4010754397"
echo "   Hosting: https://studio-4010754397.web.app"
echo ""
echo "🧪 Test your API:"
echo "   curl https://studio-4010754397.web.app/api/yachts"
echo "   curl https://studio-4010754397.web.app/healthz"
echo ""
echo "📝 View logs:"
echo "   firebase functions:log"
echo ""

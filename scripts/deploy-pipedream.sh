#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Pipedream Connect deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first: npm i -g vercel"
    exit 1
fi

# Check if environment variables are set
if [ -z "$PIPEDREAM_CLIENT_ID" ] || [ -z "$PIPEDREAM_CLIENT_SECRET" ] || [ -z "$PIPEDREAM_PROJECT_ID" ]; then
    echo "❌ Required Pipedream environment variables are not set"
    echo "Please run setup-pipedream-env.sh first"
    exit 1
fi

# Build the application
echo "📦 Building the application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel deploy --prod

# Verify deployment
echo "✅ Deployment complete!"
echo "Please verify the following:"
echo "1. Check that the Pipedream Connect button appears on the integrations page"
echo "2. Try connecting to a test integration (e.g., Google Sheets)"
echo "3. Verify that the connection flow works correctly"
echo "4. Check the browser console for any errors"

# Open the integrations page
echo "🌐 Opening the integrations page..."
vercel open /integrations 
#!/bin/bash

# Deploy the enhanced voice agent engine timeout fix
echo "Deploying voice agent audio engine timeout fix..."

# Build the project 
npm run build

# Deploy to Vercel without linting
echo "Deploying to Vercel directly..."
vercel deploy --prod

echo "Voice agent audio engine timeout fix deployment completed!"
echo "This fix includes:"
echo "- Multi-stage audio initialization to prevent engine timeouts"
echo "- Increased timeouts for audio publishing (45-60s)"
echo "- Enhanced error handling with specific user-friendly error messages"
echo "- Improved reconnection policy for more resilient connections"
echo "- Better track initialization with proper enable() calls" 
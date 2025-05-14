#!/bin/bash

# Deploy the enhanced voice agent connection fix (v2)
echo "Deploying voice agent connection fix v2..."

# Build the project 
npm run build

# Deploy to Vercel without linting
echo "Deploying to Vercel directly..."
vercel deploy --prod

echo "Voice agent connection fix v2 deployment completed!"
echo "This fix includes:"
echo "- Added connection lock to prevent duplicate connections"
echo "- Improved disconnect handling with better error messages"
echo "- Simplified audio initialization sequence"
echo "- More resilient publishing retry mechanism"
echo "- Fix for premature disconnections"
echo "- Sequential audio track initialization with proper error handling" 
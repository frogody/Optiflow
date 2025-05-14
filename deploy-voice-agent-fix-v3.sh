#!/bin/bash

# Deploy the voice agent toast notification fix (v3)
echo "Deploying voice agent toast notification fix v3..."

# Build the project 
npm run build

# Deploy to Vercel without linting
echo "Deploying to Vercel directly..."
vercel deploy --prod

echo "Voice agent toast notification fix v3 deployment completed!"
echo "This fix includes:"
echo "- Added safe toast wrapper to handle missing toast.info method"
echo "- Replaced all toast calls with safe wrapper to prevent unhandled rejections"
echo "- Added fallback to console.log for toast notifications"
echo "- Improved error handling for toast notifications" 
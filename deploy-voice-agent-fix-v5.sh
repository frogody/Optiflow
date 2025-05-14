#!/bin/bash

# Deploy the voice agent auto-speak fix (v5)
echo "Deploying voice agent auto-speak fix v5..."

# Build the project 
npm run build

# Deploy to Vercel without linting
echo "Deploying to Vercel directly..."
vercel deploy --prod

echo "Voice agent auto-speak fix v5 deployment completed!"
echo "This fix includes:"
echo "- Added explicit voice configuration for agents"
echo "- Configured automatic greeting with audible message on join"
echo "- Enhanced audio track attachment with maximum volume"
echo "- Added detailed logging of agent connection and audio tracks"
echo "- Improved UI messages to show agent connection status"
echo "- Added specific greeting asking if audio can be heard" 
#!/bin/bash

# Deploy the voice agent enhanced force-join fix (v4)
echo "Deploying voice agent enhanced force-join fix v4..."

# Build the project 
npm run build

# Deploy to Vercel without linting
echo "Deploying to Vercel directly..."
vercel deploy --prod

echo "Voice agent enhanced force-join fix v4 deployment completed!"
echo "This fix includes:"
echo "- Enhanced force-join mechanism with multiple dispatch attempts"
echo "- Better error handling in force-join process"
echo "- Detailed logging for diagnosis"
echo "- Better agent metadata configuration"
echo "- Auto-greeting functionality" 
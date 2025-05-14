#!/bin/bash

# Deploy the voice agent fix without running the linter
echo "Deploying voice agent fix..."

# Build the project 
npm run build

# Deploy to Vercel without linting
echo "Deploying to Vercel directly..."
vercel deploy --prod

echo "Voice agent fix deployment complete!" 
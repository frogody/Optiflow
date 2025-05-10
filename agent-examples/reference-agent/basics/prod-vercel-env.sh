#!/bin/bash
# Script to update Vercel environment variables for LiveKit

# Requirements: Vercel CLI installed and logged in
# Install with: npm i -g vercel
# Login with: vercel login

echo "Updating Vercel environment variables for LiveKit integration..."

# Replace 'your-project-name' with your actual Vercel project name
PROJECT_NAME="optiflow"

vercel env add LIVEKIT_URL production <<< "wss://isyncsosync-p1slrjy.livekit.cloud"
vercel env add LIVEKIT_API_KEY production <<< "APIcPGS63mCxqbP"
vercel env add LIVEKIT_API_SECRET production <<< "AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB"

echo "Environment variables added to Vercel project."
echo "IMPORTANT: You need to redeploy your application for these changes to take effect."
echo "Run: vercel --prod" 
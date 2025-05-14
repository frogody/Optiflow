#!/bin/bash

# Script to fix the LiveKit URL environment variable

# Print current LiveKit environment variables
echo "Current LiveKit environment variables:"
env | grep -i livekit

# Check if the wrong URL is present
if grep -q "LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud" .env.local 2>/dev/null; then
  echo "Fixing typo in LIVEKIT_URL in .env.local"
  sed -i '' 's|LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud|LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud|g' .env.local
fi

# Set the correct URL in the current shell
export LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud

# Check for NEXT_PUBLIC_LIVEKIT_URL and add it if missing
if ! env | grep -q NEXT_PUBLIC_LIVEKIT_URL; then
  echo "Adding NEXT_PUBLIC_LIVEKIT_URL to environment"
  export NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud
fi

# Add to .env.local if it exists
if [ -f .env.local ]; then
  echo "Updating .env.local with correct LiveKit URLs"
  # Check if LIVEKIT_URL exists in the file
  if grep -q "^LIVEKIT_URL=" .env.local; then
    sed -i '' 's|^LIVEKIT_URL=.*|LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud|g' .env.local
  else
    echo "LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud" >> .env.local
  fi
  
  # Check if NEXT_PUBLIC_LIVEKIT_URL exists in the file
  if grep -q "^NEXT_PUBLIC_LIVEKIT_URL=" .env.local; then
    sed -i '' 's|^NEXT_PUBLIC_LIVEKIT_URL=.*|NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud|g' .env.local
  else
    echo "NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud" >> .env.local
  fi
else
  echo "Creating .env.local with correct LiveKit URLs"
  echo "LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud" > .env.local
  echo "NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud" >> .env.local
fi

echo "Updated LiveKit environment variables. Please update these in your Vercel environment variables as well."
echo "LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud"
echo "NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud" 
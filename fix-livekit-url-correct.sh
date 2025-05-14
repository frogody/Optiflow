#!/bin/bash

# Script to set the correct LiveKit URL from the dashboard

# Set the correct URL in the current shell
export LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud

# Check for NEXT_PUBLIC_LIVEKIT_URL and add it if missing
if ! env | grep -q NEXT_PUBLIC_LIVEKIT_URL; then
  echo "Adding NEXT_PUBLIC_LIVEKIT_URL to environment"
  export NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud
fi

# Update .env.local if it exists
if [ -f .env.local ]; then
  echo "Updating .env.local with correct LiveKit URLs"
  # Check if LIVEKIT_URL exists in the file
  if grep -q "^LIVEKIT_URL=" .env.local; then
    sed -i '' 's|^LIVEKIT_URL=.*|LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud|g' .env.local
  else
    echo "LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud" >> .env.local
  fi
  
  # Check if NEXT_PUBLIC_LIVEKIT_URL exists in the file
  if grep -q "^NEXT_PUBLIC_LIVEKIT_URL=" .env.local; then
    sed -i '' 's|^NEXT_PUBLIC_LIVEKIT_URL=.*|NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud|g' .env.local
  else
    echo "NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud" >> .env.local
  fi
else
  echo "Creating .env.local with correct LiveKit URLs"
  echo "LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud" > .env.local
  echo "NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud" >> .env.local
fi

echo "Updated LiveKit environment variables with the correct URLs from your dashboard."
echo "LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud"
echo "NEXT_PUBLIC_LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud"
echo ""
echo "Please ensure these are also set in your Vercel environment variables." 
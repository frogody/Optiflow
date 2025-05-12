#!/bin/bash

# Fix pnpm frozen lockfile issue in CI/CD environments
echo "Running deployment fix script..."

# Check if pnpm-lock.yaml exists and if pnpm is being used
if [ -f "pnpm-lock.yaml" ]; then
  echo "pnpm lock file found, modifying vercel.json to use pnpm with --no-frozen-lockfile"
  
  # Backup original vercel.json if it exists
  if [ -f "vercel.json" ]; then
    cp vercel.json vercel.json.bak
    # Update installCommand in vercel.json to use pnpm
    jq '.installCommand = "pnpm install --no-frozen-lockfile"' vercel.json > vercel.json.new
    mv vercel.json.new vercel.json
    echo "Updated vercel.json to use pnpm install --no-frozen-lockfile"
  else
    # Create vercel.json if it doesn't exist
    echo '{
  "version": 2,
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs",
  "github": {
    "enabled": true,
    "silent": true
  }
}' > vercel.json
    echo "Created new vercel.json with pnpm configuration"
  fi
else
  echo "No pnpm lock file found, no changes needed"
fi

# Make the script executable
chmod +x deploy-fix.sh

echo "Deployment fix script completed" 
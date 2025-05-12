#!/bin/bash

echo "Starting build cache cleanup process..."

# Remove Next.js build directory
if [ -d ".next" ]; then
  echo "Removing .next directory..."
  rm -rf .next
  echo ".next directory removed successfully!"
else
  echo ".next directory not found, skipping removal."
fi

# Remove Vercel build directory if it exists
if [ -d ".vercel/output" ]; then
  echo "Removing .vercel/output directory..."
  rm -rf .vercel/output
  echo ".vercel/output directory removed successfully!"
else
  echo ".vercel/output directory not found, skipping removal."
fi

echo "Build cache cleanup completed!"
echo "You can now run 'npm run build' to create a fresh build." 
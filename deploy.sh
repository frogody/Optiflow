#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Make sure .env.production exists
if [ ! -f .env.production ]; then
  echo "⚠️ .env.production file not found. Creating from template..."
  cp .env.local .env.production
  echo "⚠️ Please edit .env.production with your production values."
fi

# Check for required environment variables
echo "🔍 Checking environment variables..."
node scripts/check-env.js
if [ $? -ne 0 ]; then
  echo "❌ Environment check failed. Please fix the issues and try again."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "📦 Building application..."
npm run build

# Run database migrations if using Prisma
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Start the application
echo "🌐 Starting application in production mode..."
npm run start 
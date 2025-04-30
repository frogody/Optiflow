#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Please install it first: npm i -g vercel"
    exit 1
fi

# Get Pipedream credentials from user
read -p "Enter your Pipedream Client ID: " PIPEDREAM_CLIENT_ID
read -p "Enter your Pipedream Client Secret: " PIPEDREAM_CLIENT_SECRET
read -p "Enter your Pipedream Project ID: " PIPEDREAM_PROJECT_ID
read -p "Enter your Pipedream Project Environment (development/production): " PIPEDREAM_PROJECT_ENVIRONMENT

# Validate environment
if [[ "$PIPEDREAM_PROJECT_ENVIRONMENT" != "development" && "$PIPEDREAM_PROJECT_ENVIRONMENT" != "production" ]]; then
    echo "Invalid environment. Must be 'development' or 'production'"
    exit 1
fi

# Set environment variables in Vercel
echo "Setting up Pipedream environment variables in Vercel..."
vercel env add PIPEDREAM_CLIENT_ID
vercel env add PIPEDREAM_CLIENT_SECRET
vercel env add PIPEDREAM_PROJECT_ID
vercel env add PIPEDREAM_PROJECT_ENVIRONMENT

# Set public environment variables
vercel env add NEXT_PUBLIC_PIPEDREAM_CLIENT_ID
vercel env add NEXT_PUBLIC_PIPEDREAM_PROJECT_ID
vercel env add NEXT_PUBLIC_PIPEDREAM_PROJECT_ENVIRONMENT

echo "Environment variables have been set up. Please redeploy your application." 
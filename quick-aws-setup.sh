#!/bin/bash

# This script quickly sets up temporary AWS API Gateway configuration
# for testing purposes without requiring AWS CLI credentials

echo "==== Quick AWS API Gateway Setup ===="
echo

# Generate a temporary API key
TEMP_API_KEY="optiflow-voice-agent-key-$(date +%s)"
API_ENDPOINT="sfd8q2ch3k.execute-api.us-east-2.amazonaws.com"

echo "Generated temporary API key: $TEMP_API_KEY"
echo "Using API endpoint: $API_ENDPOINT"

# Create or update environment variable files
echo -e "\nUpdating environment variables..."

# For local development
if [ -f .env.local ]; then
    grep -v NEXT_PUBLIC_AWS_API_KEY .env.local > .env.local.tmp
    echo "NEXT_PUBLIC_AWS_API_KEY=\"$TEMP_API_KEY\"" >> .env.local.tmp
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"$API_ENDPOINT\"" >> .env.local.tmp
    mv .env.local.tmp .env.local
    echo "Updated .env.local with AWS API key"
else
    echo "NEXT_PUBLIC_AWS_API_KEY=\"$TEMP_API_KEY\"" > .env.local
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"$API_ENDPOINT\"" >> .env.local
    echo "Created .env.local with AWS API key"
fi

# For production
if [ -f .env.production ]; then
    grep -v NEXT_PUBLIC_AWS_API_KEY .env.production > .env.production.tmp
    echo "NEXT_PUBLIC_AWS_API_KEY=\"$TEMP_API_KEY\"" >> .env.production.tmp
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"$API_ENDPOINT\"" >> .env.production.tmp
    mv .env.production.tmp .env.production
    echo "Updated .env.production with AWS API key"
fi

echo -e "\n==== Setup Complete ===="
echo "Your temporary API key is: $TEMP_API_KEY"
echo "IMPORTANT: This is a temporary key for testing. For production, use the full AWS setup."
echo 
echo "You can now test your voice agent with this configuration."
echo "Remember to set up proper AWS API Gateway authentication before deploying to production." 
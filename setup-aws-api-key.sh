#!/bin/bash

# This script sets up the AWS API Key for your voice agent
# You must have the AWS CLI installed and configured with appropriate permissions

set -e
echo "==== Optiflow Voice Agent - AWS API Gateway Setup ===="
echo

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    echo "See: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
echo "Verifying AWS credentials..."
aws sts get-caller-identity > /dev/null || { 
    echo "Error: AWS credentials not configured or insufficient permissions."
    echo "Please run 'aws configure' to set up your credentials."
    exit 1
}

# Get the API endpoint from user or use default
read -p "Enter the AWS API Gateway endpoint ID [sfd8q2ch3k]: " API_ID
API_ID=${API_ID:-sfd8q2ch3k}

# Get the API stage
read -p "Enter the API Gateway stage name [default: 'prod']: " API_STAGE
API_STAGE=${API_STAGE:-prod}

# Generate a name for the API key
KEY_NAME="optiflow-voice-agent-key-$(date +%Y%m%d-%H%M%S)"

echo -e "\nGenerating API key: $KEY_NAME..."
API_KEY_RESULT=$(aws apigateway create-api-key \
    --name "$KEY_NAME" \
    --enabled \
    --generate-distinct-id \
    --description "API key for Optiflow Voice Agent")

API_KEY_ID=$(echo $API_KEY_RESULT | jq -r '.id')
API_KEY_VALUE=$(echo $API_KEY_RESULT | jq -r '.value')

if [ -z "$API_KEY_ID" ] || [ "$API_KEY_ID" == "null" ]; then
    echo "Error: Failed to create API key."
    exit 1
fi

echo "API key created successfully with ID: $API_KEY_ID"

# Create a usage plan if needed
echo -e "\nCreating usage plan..."
USAGE_PLAN_RESULT=$(aws apigateway create-usage-plan \
    --name "optiflow-voice-agent-plan" \
    --description "Usage plan for Optiflow Voice Agent" \
    --throttle burstLimit=10,rateLimit=5 \
    --quota limit=200,offset=0,period=DAY \
    --api-stages apiId=$API_ID,stage=$API_STAGE)

USAGE_PLAN_ID=$(echo $USAGE_PLAN_RESULT | jq -r '.id')

if [ -z "$USAGE_PLAN_ID" ] || [ "$USAGE_PLAN_ID" == "null" ]; then
    echo "Error: Failed to create usage plan."
    exit 1
fi

echo "Usage plan created with ID: $USAGE_PLAN_ID"

# Connect the API key to the usage plan
echo -e "\nConnecting API key to usage plan..."
aws apigateway create-usage-plan-key \
    --usage-plan-id "$USAGE_PLAN_ID" \
    --key-id "$API_KEY_ID" \
    --key-type "API_KEY"

echo -e "\nAPI key attached to usage plan successfully."

# Create or update environment variable files
echo -e "\nUpdating environment variables..."

# For local development
if [ -f .env.local ]; then
    grep -v NEXT_PUBLIC_AWS_API_KEY .env.local > .env.local.tmp
    echo "NEXT_PUBLIC_AWS_API_KEY=\"$API_KEY_VALUE\"" >> .env.local.tmp
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"$API_ID.execute-api.us-east-2.amazonaws.com\"" >> .env.local.tmp
    mv .env.local.tmp .env.local
    echo "Updated .env.local with AWS API key"
else
    echo "NEXT_PUBLIC_AWS_API_KEY=\"$API_KEY_VALUE\"" > .env.local
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"$API_ID.execute-api.us-east-2.amazonaws.com\"" >> .env.local
    echo "Created .env.local with AWS API key"
fi

# For production
if [ -f .env.production ]; then
    grep -v NEXT_PUBLIC_AWS_API_KEY .env.production > .env.production.tmp
    echo "NEXT_PUBLIC_AWS_API_KEY=\"$API_KEY_VALUE\"" >> .env.production.tmp
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"$API_ID.execute-api.us-east-2.amazonaws.com\"" >> .env.production.tmp
    mv .env.production.tmp .env.production
    echo "Updated .env.production with AWS API key"
fi

# For Vercel deployment
echo -e "\nWould you like to update Vercel environment variables? (y/n)"
read update_vercel

if [[ "$update_vercel" == "y" || "$update_vercel" == "Y" ]]; then
    if ! command -v vercel &> /dev/null; then
        echo "Error: Vercel CLI is not installed. Please install it first."
        echo "Run: npm i -g vercel"
        exit 1
    fi
    
    echo "Running Vercel environment update..."
    vercel env add NEXT_PUBLIC_AWS_API_KEY production
    vercel env add NEXT_PUBLIC_AWS_API_ENDPOINT production
fi

echo -e "\n==== Setup Complete ===="
echo "Your API key is: $API_KEY_VALUE"
echo "Please keep this key secure and do not commit it to version control."
echo 
echo "You can now use the AWS API Gateway with proper authentication for your voice agent."
echo "If you need to update the key in the future, run this script again." 
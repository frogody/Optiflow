#!/bin/bash
# Deployment script for Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment to all Vercel environments...${NC}\n"

# Function to handle errors
handle_error() {
  echo -e "${RED}Error: $1${NC}"
  exit 1
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  handle_error "Vercel CLI is not installed. Please install it using 'npm i -g vercel'"
fi

# Login to Vercel if needed
echo -e "${YELLOW}Logging in to Vercel...${NC}"
vercel login || handle_error "Failed to login to Vercel"

# Function to check LiveKit environment variables
check_livekit_vars() {
  echo "Checking LiveKit environment variables..."
  if [ -z "$LIVEKIT_URL" ]; then
    echo "ERROR: LIVEKIT_URL is not set in .env file"
    exit 1
  fi
  
  if [ -z "$LIVEKIT_API_KEY" ]; then
    echo "ERROR: LIVEKIT_API_KEY is not set in .env file"
    exit 1
  fi
  
  if [ -z "$LIVEKIT_API_SECRET" ]; then
    echo "ERROR: LIVEKIT_API_SECRET is not set in .env file"
    exit 1
  fi
  
  # Ensure NEXT_PUBLIC_ variables are set for client-side
  if [ -z "$NEXT_PUBLIC_LIVEKIT_URL" ]; then
    echo "Setting NEXT_PUBLIC_LIVEKIT_URL to $LIVEKIT_URL"
    export NEXT_PUBLIC_LIVEKIT_URL=$LIVEKIT_URL
    # Add to Vercel env
    vercel env add NEXT_PUBLIC_LIVEKIT_URL production <<< "$LIVEKIT_URL"
  fi
  
  echo "LiveKit environment variables are set correctly ✅"
}

# Function to check AWS API Gateway environment variables
check_aws_api_gateway_vars() {
  echo -e "\n${YELLOW}Checking AWS API Gateway environment variables...${NC}"
  
  # Check .env.production file for AWS API Key and Endpoint
  if [ -f .env.production ]; then
    source .env.production
    if [ -z "$NEXT_PUBLIC_AWS_API_KEY" ] || [ -z "$NEXT_PUBLIC_AWS_API_ENDPOINT" ]; then
      echo -e "${YELLOW}Warning: AWS API Gateway configuration missing in .env.production${NC}"
      echo -e "${YELLOW}Run ./setup-aws-api-key.sh to configure AWS API Gateway access${NC}"
      
      # Ask if user wants to continue without AWS API Gateway config
      read -p "Continue deployment without AWS API Gateway configuration? (y/n): " continue_deploy
      if [[ "$continue_deploy" != "y" && "$continue_deploy" != "Y" ]]; then
        handle_error "Deployment cancelled by user"
      fi
      
      echo -e "${YELLOW}Continuing deployment without AWS API Gateway configuration...${NC}"
      return 1
    else
      echo -e "${GREEN}AWS API Gateway configuration found in .env.production${NC}"
      return 0
    fi
  else
    echo -e "${RED}Warning: .env.production file not found${NC}"
    read -p "Continue anyway? (y/n): " continue_deploy
    if [[ "$continue_deploy" != "y" && "$continue_deploy" != "Y" ]]; then
      handle_error "Deployment cancelled by user"
    fi
    return 1
  fi
}

# Add LiveKit check before deployment
check_livekit_vars

# Add AWS API Gateway check before deployment
check_aws_api_gateway_vars
aws_config_status=$?

# Check if .env file exists
if [ ! -f .env.production ]; then
  echo "Error: .env.production file not found"
  exit 1
fi

# Load environment variables
source .env.production

# Deploy to Vercel with the environment variables
echo "Deploying to Vercel..."

# Run the Vercel deployment command with the environment variables
vercel deploy --prod \
  --env NEXTAUTH_URL="$NEXTAUTH_URL" \
  --env NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  --env GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  --env GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  --env DATABASE_URL="$DATABASE_URL" \
  --env LIVEKIT_API_URL="$LIVEKIT_API_URL" \
  --env LIVEKIT_API_KEY="$LIVEKIT_API_KEY" \
  --env LIVEKIT_API_SECRET="$LIVEKIT_API_SECRET" \
  --env NEXT_PUBLIC_LIVEKIT_URL="$NEXT_PUBLIC_LIVEKIT_URL" \
  --env NEXT_PUBLIC_VOICE_AGENT_URL="$NEXT_PUBLIC_VOICE_AGENT_URL" \
  --env NEXT_PUBLIC_AWS_API_KEY="$NEXT_PUBLIC_AWS_API_KEY" \
  --env NEXT_PUBLIC_AWS_API_ENDPOINT="$NEXT_PUBLIC_AWS_API_ENDPOINT"

echo "Deployment complete!"

# Deploy to preview environment
echo -e "\n${YELLOW}Deploying to preview environment...${NC}"
vercel --confirm || handle_error "Failed to deploy to preview environment"

# Deploy to development environment
echo -e "\n${YELLOW}Deploying to development environment...${NC}"
vercel --confirm --env NEXT_PUBLIC_DEPLOYMENT_ENV=development || handle_error "Failed to deploy to development environment"

# Deploy to production environment
echo -e "\n${YELLOW}Deploying to production environment...${NC}"
vercel --prod --confirm || handle_error "Failed to deploy to production environment"

# Add AWS API Gateway environment variables to Vercel if they exist
if [ $aws_config_status -eq 0 ]; then
  # Check if variables already exist in Vercel
  if ! vercel env ls | grep -q "NEXT_PUBLIC_AWS_API_KEY"; then
    echo "Adding NEXT_PUBLIC_AWS_API_KEY to Vercel environment..."
    vercel env add NEXT_PUBLIC_AWS_API_KEY
  fi
  
  if ! vercel env ls | grep -q "NEXT_PUBLIC_AWS_API_ENDPOINT"; then
    echo "Adding NEXT_PUBLIC_AWS_API_ENDPOINT to Vercel environment..."
    vercel env add NEXT_PUBLIC_AWS_API_ENDPOINT
  fi
fi

# Remove deprecated environment variable if exists
if vercel env ls | grep -q "LIVEKIT_WS_URL"; then
  echo "Removing deprecated LIVEKIT_WS_URL..."
  vercel env rm LIVEKIT_WS_URL
fi

# Add the client version for frontend use
if ! vercel env ls | grep -q "NEXT_PUBLIC_LIVEKIT_URL"; then
  echo "Adding NEXT_PUBLIC_LIVEKIT_URL to Vercel environment..."
  vercel env add NEXT_PUBLIC_LIVEKIT_URL
fi

echo -e "\n${GREEN}All deployments completed successfully!${NC}"
echo -e "Preview URL: $(vercel ls | grep preview | awk '{print $2}')"
echo -e "Development URL: $(vercel ls | grep development | awk '{print $2}')"
echo -e "Production URL: $(vercel ls | grep production | awk '{print $2}')" 
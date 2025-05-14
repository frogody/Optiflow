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

# Add LiveKit v2 environment variable checks
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

# Add LiveKit check before deployment
check_livekit_vars

# Deploy to preview environment
echo -e "\n${YELLOW}Deploying to preview environment...${NC}"
vercel --confirm || handle_error "Failed to deploy to preview environment"

# Deploy to development environment
echo -e "\n${YELLOW}Deploying to development environment...${NC}"
vercel --confirm --env NEXT_PUBLIC_DEPLOYMENT_ENV=development || handle_error "Failed to deploy to development environment"

# Deploy to production environment
echo -e "\n${YELLOW}Deploying to production environment...${NC}"
vercel --prod --confirm || handle_error "Failed to deploy to production environment"

# Add LiveKit v2 environment variables if needed
if ! vercel env ls | grep -q "LIVEKIT_URL"; then
  echo "Adding LIVEKIT_URL to Vercel environment..."
  vercel env add LIVEKIT_URL
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
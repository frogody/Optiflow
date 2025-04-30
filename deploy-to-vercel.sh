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

# Deploy to preview environment
echo -e "\n${YELLOW}Deploying to preview environment...${NC}"
vercel --confirm || handle_error "Failed to deploy to preview environment"

# Deploy to development environment
echo -e "\n${YELLOW}Deploying to development environment...${NC}"
vercel --confirm --env NEXT_PUBLIC_DEPLOYMENT_ENV=development || handle_error "Failed to deploy to development environment"

# Deploy to production environment
echo -e "\n${YELLOW}Deploying to production environment...${NC}"
vercel --prod --confirm || handle_error "Failed to deploy to production environment"

echo -e "\n${GREEN}All deployments completed successfully!${NC}"
echo -e "Preview URL: $(vercel ls | grep preview | awk '{print $2}')"
echo -e "Development URL: $(vercel ls | grep development | awk '{print $2}')"
echo -e "Production URL: $(vercel ls | grep production | awk '{print $2}')" 
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking for Vercel CLI...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Login to Vercel if not already logged in
echo -e "${YELLOW}Logging in to Vercel...${NC}"
vercel login

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel deploy --prod

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}Check your Vercel dashboard for deployment status${NC}" 
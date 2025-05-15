#!/bin/bash

# This script fixes the voice agent connection by:
# 1. Clearing the AWS API Gateway settings (which are returning 404 errors)
# 2. Setting up direct voice agent URL configuration

set -e
echo "==== Optiflow Voice Agent - Connection Fix ===="
echo

# Color codes for readable output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists and create it if not
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    touch .env.local
else
    echo -e "${GREEN}.env.local file exists${NC}"
    # Backup the existing file
    cp .env.local .env.local.bak
    echo -e "${GREEN}Backed up existing .env.local to .env.local.bak${NC}"
fi

# Ask for voice agent URL
echo -e "${YELLOW}Enter your voice agent URL (leave empty if none):${NC}"
read -p "> " VOICE_AGENT_URL

# Update environment files
echo -e "\n${YELLOW}Updating environment files...${NC}"

# For local development
echo -e "${YELLOW}Updating .env.local...${NC}"
grep -v "NEXT_PUBLIC_AWS_API" .env.local > .env.local.tmp || true
grep -v "NEXT_PUBLIC_VOICE_AGENT_URL" .env.local.tmp > .env.local.tmp2 || true

# Add the new configuration
echo "# Voice Agent Configuration - updated $(date)" >> .env.local.tmp2
echo "NEXT_PUBLIC_VOICE_AGENT_URL=\"${VOICE_AGENT_URL}\"" >> .env.local.tmp2
echo "# AWS API Gateway disabled (was returning 404 errors)" >> .env.local.tmp2
echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"\"" >> .env.local.tmp2
echo "NEXT_PUBLIC_AWS_API_KEY=\"\"" >> .env.local.tmp2
echo "# For development use only" >> .env.local.tmp2
echo "NEXT_PUBLIC_DEBUG_VOICE_AGENT=true" >> .env.local.tmp2

mv .env.local.tmp2 .env.local
rm -f .env.local.tmp
echo -e "${GREEN}Updated .env.local with Voice Agent URL${NC}"

# Now build the app
echo -e "\n${YELLOW}Building the application with updated configuration...${NC}"
if command -v npm &> /dev/null; then
    npm run build
    BUILD_STATUS=$?
    if [ $BUILD_STATUS -eq 0 ]; then
        echo -e "${GREEN}Build completed successfully${NC}"
    else
        echo -e "${RED}Build failed with status $BUILD_STATUS${NC}"
    fi
else
    echo -e "${RED}npm not found, skipping build${NC}"
fi

echo -e "\n${GREEN}===== Voice Agent Connection Fix Complete =====${NC}"
if [ -n "$VOICE_AGENT_URL" ]; then
    echo -e "Your voice agent URL is: ${VOICE_AGENT_URL}"
else
    echo -e "${YELLOW}No voice agent URL was provided. You'll need to use the API endpoints in the Next.js app.${NC}"
fi

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Run the application in development mode: ${GREEN}npm run dev${NC}"
echo -e "2. Open the browser console and interact with the voice agent"
echo -e "3. Check for successful connections in the console logs"
echo -e "4. Deploy the application: ${GREEN}npm run build && npm run start${NC}"
echo 
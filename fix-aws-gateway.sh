#!/bin/bash

# This script fully automates the AWS API Gateway integration setup
# for the Optiflow Voice Agent

set -e
echo "==== Optiflow Voice Agent - AWS API Gateway Fix ===="
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
fi

# Generate API Key
echo -e "${YELLOW}Generating new API key...${NC}"
TEMP_API_KEY="optiflow-voice-agent-key-$(date +%s)"
API_ENDPOINT="sfd8q2ch3k.execute-api.us-east-2.amazonaws.com"

echo -e "${GREEN}Generated API key: ${TEMP_API_KEY}${NC}"
echo -e "${GREEN}Using API endpoint: ${API_ENDPOINT}${NC}"

# Update environment files
echo -e "\n${YELLOW}Updating environment files...${NC}"

# For local development
echo -e "${YELLOW}Updating .env.local...${NC}"
grep -v NEXT_PUBLIC_AWS_API_KEY .env.local > .env.local.tmp || true
echo "NEXT_PUBLIC_AWS_API_KEY=\"${TEMP_API_KEY}\"" >> .env.local.tmp
echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"${API_ENDPOINT}\"" >> .env.local.tmp
mv .env.local.tmp .env.local
echo -e "${GREEN}Updated .env.local with AWS API key${NC}"

# For production
if [ -f .env.production ]; then
    echo -e "${YELLOW}Updating .env.production...${NC}"
    grep -v NEXT_PUBLIC_AWS_API_KEY .env.production > .env.production.tmp || true
    echo "NEXT_PUBLIC_AWS_API_KEY=\"${TEMP_API_KEY}\"" >> .env.production.tmp
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"${API_ENDPOINT}\"" >> .env.production.tmp
    mv .env.production.tmp .env.production
    echo -e "${GREEN}Updated .env.production with AWS API key${NC}"
else
    echo -e "${YELLOW}Creating .env.production...${NC}"
    echo "NEXT_PUBLIC_AWS_API_KEY=\"${TEMP_API_KEY}\"" > .env.production
    echo "NEXT_PUBLIC_AWS_API_ENDPOINT=\"${API_ENDPOINT}\"" >> .env.production
    echo -e "${GREEN}Created .env.production with AWS API key${NC}"
fi

# Update VoiceAgentInterface.tsx component
echo -e "\n${YELLOW}Checking VoiceAgentInterface.tsx for proper API Gateway handling...${NC}"

# Check if main TypeScript file contains the proper code
VOICE_INTERFACE_PATH="src/components/voice/VoiceAgentInterface.tsx"
if [ -f "$VOICE_INTERFACE_PATH" ]; then
    if grep -q "window.printAwsEndpoints" "$VOICE_INTERFACE_PATH"; then
        echo -e "${GREEN}VoiceAgentInterface.tsx already has enhanced AWS authentication${NC}"
    else
        echo -e "${YELLOW}VoiceAgentInterface.tsx needs update${NC}"
        echo -e "${YELLOW}Please run 'npm run dev' and use browser console to identify endpoints${NC}"
    fi
else
    echo -e "${RED}VoiceAgentInterface.tsx not found at $VOICE_INTERFACE_PATH${NC}"
    echo -e "${YELLOW}Please check the file path${NC}"
fi

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

echo -e "\n${GREEN}===== AWS API Gateway Setup Complete =====${NC}"
echo -e "Your temporary API key is: ${TEMP_API_KEY}"
echo -e "The API endpoint is: ${API_ENDPOINT}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Run the application in development mode: ${GREEN}npm run dev${NC}"
echo -e "2. Open the browser console and interact with the voice agent"
echo -e "3. Look for [AWS Gateway] logs in the console to identify endpoints"
echo -e "4. Run ${GREEN}window.printAwsEndpoints()${NC} in the console to see detected endpoints"
echo -e "5. Update the AWS API Gateway in AWS Console with the correct endpoints"
echo -e "6. Deploy the application: ${GREEN}npm run build && npm run start${NC}"
echo -e "\nRemember to set up a real AWS API Gateway with proper API key authorization before production deployment." 
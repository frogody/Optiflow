#!/bin/bash
# More direct deployment script for Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting simplified Vercel deployment for Pipedream integration${NC}"

# Check if we have a Vercel project
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

# Create a simplified .env.production file with essential values
echo -e "${YELLOW}Setting up essential environment variables for Pipedream${NC}"

# Create a minimal .vercelignore file to reduce package size
echo -e "${YELLOW}Creating a .vercelignore file to optimize deployment${NC}"
cat > .vercelignore << EOL
.git
node_modules
README.md
*.log
.next
EOL

# Attempt to verify package.json dependencies
echo -e "${YELLOW}Checking package.json for issues${NC}"
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}jq not found, skipping package validation${NC}"
else
    # Check for any problematic dependencies
    jq '.dependencies' package.json > /dev/null
    if [ $? -ne 0 ]; then
        echo -e "${RED}Issue with dependencies in package.json${NC}"
        exit 1
    fi
fi

# Force deployment with overrides
echo -e "${YELLOW}Attempting deployment with Vercel CLI...${NC}"
vercel --prod --yes

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the logs for more information.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment initiated successfully!${NC}"
echo -e "${YELLOW}Important:${NC}"
echo -e "1. ${YELLOW}Configure your Pipedream OAuth App with the correct callback URL from Vercel${NC}"
echo -e "2. ${YELLOW}Set environment variables in the Vercel dashboard${NC}"
echo -e "3. ${YELLOW}Test your Pipedream integration at the /test-pipedream route${NC}"
echo -e "${GREEN}See the PIPEDREAM_DEPLOYMENT.md file for more details${NC}" 
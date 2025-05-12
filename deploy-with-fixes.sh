#!/bin/bash

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}= Optiflow Deployment Script with React Conflict Fixes  =${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed.${NC}"
    echo -e "Install it with: ${YELLOW}npm install -g vercel${NC}"
    exit 1
fi

# Apply the service page fixes
echo -e "\n${GREEN}Applying React version conflict fixes to service pages...${NC}"
node fix-service-pages-for-deploy.js

# Apply additional React version conflict fixes
echo -e "\n${GREEN}Applying additional React version conflict fixes...${NC}"
node fix-react-conflicts.js

# Apply fix to replace heroicons
echo -e "\n${GREEN}Replacing heroicons to prevent React version conflicts...${NC}"
node fix-heroicons.js

# Apply fix to problematic enterprise and workflow-editor pages
echo -e "\n${GREEN}Fixing final problematic pages (enterprise, workflow-editor)...${NC}"
node fix-final-pages.js

# Apply comprehensive fix to all pages
echo -e "\n${GREEN}Applying comprehensive fixes to all pages...${NC}"
node fix-react-version-conflicts.js

# Fix environment variables if needed
echo -e "\n${GREEN}Fixing environment variables...${NC}"
# Use the ES module version
node fix-pipedream-env.mjs

# Verify environment variables
echo -e "\n${GREEN}Verifying environment configuration...${NC}"
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found.${NC}"
    echo -e "Create it with: ${YELLOW}cp .env.example .env.production${NC}"
    echo -e "Then update the values and try again."
    exit 1
fi

# Run a local build test to make sure things work
echo -e "\n${GREEN}Running a local build test...${NC}"
# Temporarily disable static page generation for local build test
export NEXT_DISABLE_STATIC_GENERATION=true
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Local build failed. Fix the issues before deploying.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Local build successful! Proceeding with deployment...${NC}"

# Deploy to Vercel
echo -e "\n${GREEN}Deploying to Vercel...${NC}"
vercel --prod

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Check the Vercel logs for more information.${NC}"
    exit 1
fi

echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}= Deployment completed successfully!            =${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Verify the deployed application at https://app.isyncso.com"
echo -e "2. Check the Pipedream integration with ${YELLOW}node test-pipedream-integration.js${NC}"
echo -e "3. Complete the checklist in PIPEDREAM_DEPLOYMENT_CHECKLIST.md"

exit 0 
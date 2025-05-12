#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment fix script...${NC}"

# Fix pnpm frozen lockfile issue in CI/CD environments
if [ -n "$CI" ] || [ -n "$VERCEL" ]; then
  echo -e "${YELLOW}CI/CD environment detected, adjusting npm flags...${NC}"
  export NPM_FLAGS="--no-frozen-lockfile"
  chmod +x deploy-fix.sh
fi

# First run the React version conflict fixes
echo -e "${GREEN}Running React version conflict fixes...${NC}"
node fix-react-version-conflicts.js

# Fix NextJS configuration exports
echo -e "${GREEN}Fixing Next.js configuration exports...${NC}"
node fix-config-exports.js

# Fix any dynamic export issues
echo -e "${GREEN}Adding dynamic exports to prevent static generation issues...${NC}"
node fix-dynamic-export.js

# Run the comprehensive service page fixes
echo -e "${GREEN}Running comprehensive service page fixes...${NC}"
node fix-all-service-pages.js

# Run Pipedream environment fixes
echo -e "${GREEN}Fixing Pipedream environment variables...${NC}"
node fix-pipedream-env.mjs

# Clear the Next.js cache
echo -e "${GREEN}Clearing Next.js cache...${NC}"
rm -rf .next

# Final deployment to Vercel
echo -e "${GREEN}Deploying to Vercel...${NC}"
vercel --prod

# Check deployment status
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment completed successfully!${NC}"
else
  echo -e "${RED}Deployment failed. Please check the logs above.${NC}"
  exit 1
fi
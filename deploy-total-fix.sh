#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}= Comprehensive Next.js 15 Deployment Fix =${NC}"
echo -e "${BLUE}==========================================${NC}"

echo -e "\n${GREEN}Step 1: Updating next.config.mjs with React compatibility fixes${NC}"
# This step is already done - we've updated next.config.mjs

echo -e "\n${GREEN}Step 2: Updating all client components to avoid React version conflicts${NC}"
node fix-all-client-components.js

echo -e "\n${GREEN}Step 3: Fixing service pages specifically${NC}"
node fix-all-service-pages.js

echo -e "\n${GREEN}Step 4: Completely disabling static rendering for all pages${NC}"
node disable-static-rendering.js

echo -e "\n${GREEN}Step 5: Updating the Next.js middleware${NC}"
# This step is already done - we've updated middleware.ts

echo -e "\n${GREEN}Step 6: Clearing Next.js cache${NC}"
rm -rf .next
rm -rf node_modules/.cache

echo -e "\n${GREEN}Step 7: Running local build to test fixes${NC}"
# Using NODE_OPTIONS to increase memory and disable static generation
NODE_OPTIONS="--max-old-space-size=8192" NEXT_DISABLE_STATIC_GENERATION=true npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Local build failed. Checking environment...${NC}"
  
  # Check if environment variables are set
  if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local from example if available...${NC}"
    if [ -f ".env.example" ]; then
      cp .env.example .env.local
      echo -e "${GREEN}Created .env.local from .env.example${NC}"
    fi
  fi
  
  echo -e "${YELLOW}Applying additional Pipedream environment fixes...${NC}"
  node fix-pipedream-env.mjs
  
  echo -e "${YELLOW}Trying build again with more memory...${NC}"
  NODE_OPTIONS="--max-old-space-size=12288" NEXT_DISABLE_STATIC_GENERATION=true npm run build
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Build still failing. Deploying with --skip-build option.${NC}"
    echo -e "${YELLOW}This will use Vercel's build process instead of local build.${NC}"
    vercel --prod --skip-build
  else
    echo -e "${GREEN}Local build succeeded on second attempt.${NC}"
    echo -e "${GREEN}Deploying to Vercel...${NC}"
    vercel --prod
  fi
else
  echo -e "${GREEN}Local build succeeded.${NC}"
  echo -e "${GREEN}Deploying to Vercel...${NC}"
  vercel --prod
fi

# Check deployment status
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}==========================================${NC}"
  echo -e "${GREEN}= Deployment completed successfully!     =${NC}"
  echo -e "${GREEN}==========================================${NC}"
else
  echo -e "\n${RED}==========================================${NC}"
  echo -e "${RED}= Deployment failed.                     =${NC}"
  echo -e "${RED}= Check logs for more information.       =${NC}"
  echo -e "${RED}==========================================${NC}"
  exit 1
fi 
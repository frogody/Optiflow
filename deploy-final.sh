#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}= Final Next.js 15 Deployment Fix       =${NC}"
echo -e "${BLUE}==========================================${NC}"

echo -e "\n${GREEN}Step 1: Running all fixes for React compatibility${NC}"
node fix-all-client-components.js
node fix-all-service-pages.js
node disable-static-rendering.js

echo -e "\n${GREEN}Step 2: Fixing Pipedream environment${NC}"
node fix-pipedream-env.mjs

echo -e "\n${GREEN}Step 3: Clearing Next.js cache${NC}"
rm -rf .next
rm -rf node_modules/.cache

echo -e "\n${GREEN}Step 4: Deploying directly to Vercel${NC}"
# Skip local build to use Vercel's build process
NEXT_DISABLE_STATIC_GENERATION=true vercel --prod

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
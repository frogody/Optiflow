#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}= Next.js 14 Downgrade and Deploy       =${NC}"
echo -e "${BLUE}==========================================${NC}"

echo -e "\n${GREEN}Step 1: Installing Next.js 14${NC}"
npm install next@14.1.0 --save

echo -e "\n${GREEN}Step 2: Updating eslint-config-next to match${NC}"
npm install eslint-config-next@14.1.0 --save-dev

echo -e "\n${GREEN}Step 3: Clearing Next.js cache${NC}"
rm -rf .next
rm -rf node_modules/.cache

echo -e "\n${GREEN}Step 4: Applying Pipedream fixes${NC}"
node fix-pipedream-env.mjs

echo -e "\n${GREEN}Step 5: Deploying to Vercel${NC}"
vercel --prod

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
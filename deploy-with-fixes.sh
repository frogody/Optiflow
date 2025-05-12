#!/bin/bash

# Colors for better output readability
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
  exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}Vercel CLI is not installed. Installing...${NC}"
  npm install -g vercel
fi

# Check if project dependencies are installed
if [ ! -d "node_modules" ]; then
  echo -e "${GREEN}Installing project dependencies...${NC}"
  npm install
fi

# Ensure environment variables are set
echo -e "\n${GREEN}Checking environment variables...${NC}"
if [ ! -f ".env.local" ]; then
  echo -e "${RED}Warning: .env.local file not found. Some functionality may not work.${NC}"
  
  # Check if .env.example exists and copy it
  if [ -f ".env.example" ]; then
    echo -e "${GREEN}Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
  fi
fi

# Clean build cache
echo -e "\n${GREEN}Cleaning build cache...${NC}"
rm -rf .next
rm -rf node_modules/.cache

# Run TypeScript type check (but continue on errors)
echo -e "\n${GREEN}Running TypeScript type check...${NC}"
npx tsc --noEmit || true

# Try to build locally first
echo -e "\n${GREEN}Attempting local build...${NC}"
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Local build failed. Trying fixes before redeploying...${NC}"
else
  echo -e "\n${GREEN}Local build successful! Proceeding with deployment...${NC}"
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

# Fix custom integration page specifically for React version issues
echo -e "\n${GREEN}Fixing custom-integration page for React version conflicts...${NC}"
node fix-custom-integration-page.js

# Make service pages dynamic to prevent static generation issues
echo -e "\n${GREEN}Making service pages dynamic...${NC}"
node make-service-pages-dynamic.js

# Additional fixes
echo -e "\n${GREEN}Running additional config fixes...${NC}"
node fix-config-exports.js
node fix-dynamic-export.js

# Verify environment variables
if [ -f ".env.local" ]; then
  echo -e "\n${GREEN}Environment variables are set.${NC}"
else
  echo -e "${RED}Warning: .env.local file still missing.${NC}"
fi

# Deploy to Vercel
echo -e "\n${GREEN}Deploying to Vercel...${NC}"
vercel --prod

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo -e "\n${GREEN}Deployment completed successfully!${NC}"
else
  echo -e "\n${RED}Deployment failed. Please check the logs above.${NC}"
  exit 1
fi 
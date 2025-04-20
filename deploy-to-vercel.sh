#!/bin/bash
# Deployment script for Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Preparing to deploy Optiflow with Pipedream Connect to Vercel${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

# Check for .env file with required variables
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}Creating .env.production file from example${NC}"
    cp .env.example .env.production
    echo -e "${RED}Please edit .env.production with your actual values before continuing${NC}"
    echo -e "Press Enter when ready to continue or Ctrl+C to abort"
    read
fi

# Verify Pipedream environment variables
echo -e "${YELLOW}Verifying Pipedream environment variables${NC}"
if grep -q "your_pipedream_client_id" .env.production; then
    echo -e "${RED}Please update your Pipedream Client ID in .env.production${NC}"
    exit 1
fi

if grep -q "your_pipedream_client_secret" .env.production; then
    echo -e "${RED}Please update your Pipedream Client Secret in .env.production${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the logs for more information.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Don't forget to configure your Pipedream OAuth App with the correct callback URL${NC}"
echo -e "${YELLOW}See PIPEDREAM_DEPLOYMENT.md for more details${NC}"

NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id
PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret
PIPEDREAM_PROJECT_ID=your_pipedream_project_id
PIPEDREAM_PROJECT_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://your-app.vercel.app/api/pipedream/callback 
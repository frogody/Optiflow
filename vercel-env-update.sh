#!/bin/bash
# Script to update all Vercel environment variables at once
# This will fix Google OAuth and other configuration issues

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Updating all Vercel environment variables...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

# Get the current Vercel deployment URL
CURRENT_URL=$(vercel ls --prod | grep "Ready" | head -n 1 | awk '{print $2}')

if [ -z "$CURRENT_URL" ]; then
    echo -e "${RED}Could not determine current deployment URL.${NC}"
    echo -e "${YELLOW}Please enter your Vercel deployment URL (e.g., https://your-app.vercel.app):${NC}"
    read DEPLOYMENT_URL
else
    DEPLOYMENT_URL=$CURRENT_URL
    echo -e "${GREEN}Found deployment URL: ${DEPLOYMENT_URL}${NC}"
fi

# Read all environment variables from .env.production
echo -e "${YELLOW}Reading environment variables from .env.production...${NC}"

# Update variables for the Vercel deployment
echo -e "${YELLOW}Creating Vercel environment variable payload...${NC}"

# Create a temporary JSON file for environment variables
cat > vercel-env.json << EOL
{
  "NEXTAUTH_URL": "${DEPLOYMENT_URL}",
  "NEXT_PUBLIC_APP_URL": "${DEPLOYMENT_URL}",
  "NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI": "${DEPLOYMENT_URL}/api/pipedream/callback",
  "GOOGLE_REDIRECT_URI": "${DEPLOYMENT_URL}/api/auth/callback/google"
}
EOL

# Print the created environment variables
echo -e "${YELLOW}Environment variables to be set:${NC}"
cat vercel-env.json

# Ask for confirmation
echo -e "${YELLOW}Do you want to update these environment variables on Vercel? (y/n)${NC}"
read confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "${RED}Operation cancelled.${NC}"
    rm vercel-env.json
    exit 1
fi

# Pull environment variables from Vercel
echo -e "${YELLOW}Pulling environment from Vercel...${NC}"
vercel pull --yes

# Update environment variables in Vercel
echo -e "${YELLOW}Updating environment variables in Vercel...${NC}"
vercel env add NEXTAUTH_URL ${DEPLOYMENT_URL}
vercel env add NEXT_PUBLIC_APP_URL ${DEPLOYMENT_URL}
vercel env add NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI ${DEPLOYMENT_URL}/api/pipedream/callback
vercel env add GOOGLE_REDIRECT_URI ${DEPLOYMENT_URL}/api/auth/callback/google

# Clean up
rm vercel-env.json

# Inform about environment verification
echo -e "${YELLOW}Verifying environment variables...${NC}"
vercel env ls

# Redeploy with updated environment variables
echo -e "${YELLOW}Would you like to redeploy with the updated environment variables? (y/n)${NC}"
read redeploy

if [ "$redeploy" == "y" ] || [ "$redeploy" == "Y" ]; then
    echo -e "${YELLOW}Redeploying...${NC}"
    vercel --prod
    echo -e "${GREEN}Deployment complete!${NC}"
else
    echo -e "${YELLOW}Skipping deployment. You can deploy manually with 'vercel --prod'${NC}"
fi

echo -e "${GREEN}Environment variables updated successfully!${NC}"
echo -e "${YELLOW}Important post-update steps:${NC}"
echo -e "1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials"
echo -e "2. Update your OAuth 2.0 Client with this exact redirect URI: ${DEPLOYMENT_URL}/api/auth/callback/google"
echo -e "3. Save the changes and wait a few minutes for them to propagate"
echo -e "4. Test your application login again" 
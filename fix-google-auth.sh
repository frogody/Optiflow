#!/bin/bash
# Fix script for Google OAuth with Vercel deployment

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing Google OAuth configuration for Vercel deployment${NC}"

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

# Update environment variables
echo -e "${YELLOW}Updating OAuth environment variables...${NC}"

# Set the correct environment variables for Vercel
vercel env add NEXTAUTH_URL ${DEPLOYMENT_URL}
vercel env add NEXT_PUBLIC_APP_URL ${DEPLOYMENT_URL}
vercel env add GOOGLE_REDIRECT_URI ${DEPLOYMENT_URL}/api/auth/callback/google

# Ensure these variables are accessible in the production environment
echo -e "${YELLOW}Linking environment variables to production...${NC}"
vercel env ls

# Deploy with the updated environment variables
echo -e "${YELLOW}Redeploying with updated environment variables...${NC}"
vercel --prod

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}Important post-deployment steps:${NC}"
echo -e "1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials"
echo -e "2. Update your OAuth 2.0 Client with this exact redirect URI: ${DEPLOYMENT_URL}/api/auth/callback/google"
echo -e "3. Save the changes and wait a few minutes for them to propagate"
echo -e "4. Test your application login again" 
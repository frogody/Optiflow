#!/bin/bash
# Script to update environment variables in Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Updating environment variables in Vercel for Pipedream integration...${NC}"

# Get Vercel project info
PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*' | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ] || [ -z "$ORG_ID" ]; then
    echo -e "${RED}Failed to get Vercel project information. Make sure you are in the correct directory and the project is linked to Vercel.${NC}"
    exit 1
fi

echo -e "${YELLOW}Found Vercel project with ID: $PROJECT_ID${NC}"

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --prod --scope $ORG_ID | grep "Ready" | head -1 | awk '{print $2}')

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${YELLOW}No production deployment found. Using temporary URL based on local config...${NC}"
    DEPLOYMENT_URL="optiflow-q3hqc6tsb-isyncso.vercel.app"
    echo -e "${YELLOW}Please update this URL manually after deployment: $DEPLOYMENT_URL${NC}"
else
    echo -e "${GREEN}Found deployment URL: $DEPLOYMENT_URL${NC}"
fi

# Update the Pipedream credentials in .env.production
echo -e "${YELLOW}Updating Pipedream credentials in .env.production...${NC}"

# Create a backup of the original file
cp .env.production .env.production.bak

# Update or create the .env.production file with real values
cat > .env.production << EOL
# Pipedream Configuration
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id
PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret
PIPEDREAM_PROJECT_ID=your_pipedream_project_id
PIPEDREAM_PROJECT_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://${DEPLOYMENT_URL}
NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://${DEPLOYMENT_URL}/api/pipedream/callback

# Database URL for production
DATABASE_URL=${DATABASE_URL:-"postgresql://user:password@localhost:5432/mydb"}

# Node environment
NODE_ENV=production

# NextAuth.js
NEXTAUTH_URL=https://${DEPLOYMENT_URL}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"generate_a_secure_secret_here"}

# Other required environment variables
AUTH_SECRET=${AUTH_SECRET:-"generate_a_secure_secret_here"}
EOL

echo -e "${GREEN}.env.production file updated with the correct deployment URLs.${NC}"
echo -e "${YELLOW}Please update your actual Pipedream credentials in this file.${NC}"

# Display steps for setting up Vercel environment variables
echo -e "${YELLOW}Follow these steps to set up your environment variables in Vercel:${NC}"
echo -e "1. Go to your Vercel project dashboard"
echo -e "2. Navigate to Settings > Environment Variables"
echo -e "3. Add the following environment variables:"
echo -e "   - NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id"
echo -e "   - PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret"
echo -e "   - PIPEDREAM_PROJECT_ID=your_pipedream_project_id"
echo -e "   - PIPEDREAM_PROJECT_ENVIRONMENT=production"
echo -e "   - NEXT_PUBLIC_APP_URL=https://$DEPLOYMENT_URL"
echo -e "   - NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://$DEPLOYMENT_URL/api/pipedream/callback"
echo -e "   - NEXTAUTH_URL=https://$DEPLOYMENT_URL"
echo -e "   - NEXTAUTH_SECRET=your_secure_secret"
echo -e "   - AUTH_SECRET=your_secure_secret"
echo -e "   - DATABASE_URL=your_database_connection_string"

echo -e "${YELLOW}Don't forget to update the Redirect URI in your Pipedream OAuth app settings to:${NC}"
echo -e "${GREEN}https://$DEPLOYMENT_URL/api/pipedream/callback${NC}"

echo -e "${YELLOW}For more information, see PIPEDREAM_DEPLOYMENT.md${NC}" 
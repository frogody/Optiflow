#!/bin/bash
# Deployment script for app.isyncso.com

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment to app.isyncso.com${NC}"

# Check if we have required tools
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

# Link to the correct project
echo -e "${YELLOW}Linking to the correct Vercel project...${NC}"
vercel link --project optiflow --scope isyncso --yes

# Validate environment variables
echo -e "${YELLOW}Validating environment variables...${NC}"
if [ ! -f .env.production ]; then
    echo -e "${RED}.env.production file not found${NC}"
    exit 1
fi

# Check for required environment variables
required_vars=(
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "DATABASE_URL"
    "PIPEDREAM_CLIENT_ID"
    "PIPEDREAM_CLIENT_SECRET"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env.production; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}Missing required environment variables in .env.production:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

# Ensure NEXTAUTH_URL is set to app.isyncso.com
if ! grep -q 'NEXTAUTH_URL="https://app.isyncso.com"' .env.production; then
    echo -e "${RED}NEXTAUTH_URL in .env.production must be set to https://app.isyncso.com${NC}"
    exit 1
fi

# Run type check
echo -e "${YELLOW}Running type check...${NC}"
if ! npm run lint; then
    echo -e "${RED}Lint check failed${NC}"
    exit 1
fi

# Deploy to production
echo -e "${YELLOW}Deploying to production...${NC}"
DEPLOYMENT_URL=$(vercel deploy --prod)

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Check the logs above for details.${NC}"
    exit 1
fi

# Extract deployment URL
DEPLOYMENT_URL=$(echo "$DEPLOYMENT_URL" | grep -o 'https://.*vercel.app')

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}Failed to extract deployment URL${NC}"
    exit 1
fi

# Set production alias via Vercel API
echo -e "${YELLOW}Setting production alias via Vercel API...${NC}"
VERCEL_TEAM_ID_FOR_API="team_3IImOWASk24KHHAQ55rvxO3x"
ALIAS_DOMAIN="app.isyncso.com"

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}VERCEL_TOKEN is not set${NC}"
    exit 1
else
    # Vercel API endpoint for setting an alias for a deployment
    API_ALIAS_URL="https://api.vercel.com/v2/deployments/$DEPLOYMENT_ID/aliases?teamId=$VERCEL_TEAM_ID_FOR_API"
fi

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
sleep 10  # Wait for deployment to stabilize

# Check if deployment is accessible
if ! curl -s -f -o /dev/null "https://app.isyncso.com"; then
    echo -e "${RED}Deployment verification failed. Site is not accessible at app.isyncso.com${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed and verified successfully!${NC}"
echo -e "\n${YELLOW}Important next steps:${NC}"
echo -e "1. ${YELLOW}Verify OAuth callback URLs in your providers' dashboards:${NC}"
echo -e "   - Google: https://app.isyncso.com/api/auth/callback/google"
echo -e "   - Pipedream: https://app.isyncso.com/api/pipedream/callback"
echo -e "2. ${YELLOW}Verify environment variables in Vercel dashboard${NC}"
echo -e "3. ${YELLOW}Test authentication flows${NC}"
echo -e "4. ${YELLOW}Monitor deployment logs for any issues${NC}"
echo -e "5. ${YELLOW}Run database migrations if needed:${NC}"
echo -e "   - Connect to your production database"
echo -e "   - Run: npx prisma migrate deploy" 
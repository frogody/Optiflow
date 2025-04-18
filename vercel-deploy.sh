#!/bin/bash
# Enhanced deployment script for Vercel with OIDC support

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting enhanced Vercel deployment${NC}"

# Check if we have required tools
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}jq is required for deployment. Please install it first.${NC}"
    exit 1
fi

# Validate environment variables
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
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}Missing required environment variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

# Verify OIDC token
if [ -z "$VERCEL_OIDC_TOKEN" ]; then
    echo -e "${RED}VERCEL_OIDC_TOKEN is not set. Please provide a valid OIDC token.${NC}"
    exit 1
fi

# Create a minimal .vercelignore file
echo -e "${YELLOW}Creating optimized .vercelignore file${NC}"
cat > .vercelignore << EOL
.git
node_modules
README.md
*.log
.next
playwright-report
test-results
tests
test-utils
mocks
EOL

# Validate package.json
echo -e "${YELLOW}Validating package.json${NC}"
if ! jq . package.json > /dev/null 2>&1; then
    echo -e "${RED}Invalid package.json${NC}"
    exit 1
fi

# Check for build script
if ! jq -e '.scripts.build' package.json > /dev/null 2>&1; then
    echo -e "${RED}No build script found in package.json${NC}"
    exit 1
fi

# Run type check
echo -e "${YELLOW}Running type check${NC}"
if ! npm run typecheck; then
    echo -e "${RED}Type check failed${NC}"
    exit 1
fi

# Force deployment with overrides and OIDC token
echo -e "${YELLOW}Initiating Vercel deployment...${NC}"
VERCEL_TOKEN=$VERCEL_OIDC_TOKEN vercel deploy --prod --yes

# Check deployment status
if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Check the logs above for details.${NC}"
    exit 1
fi

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
sleep 10  # Wait for deployment to stabilize

# Get deployment URL
DEPLOY_URL=$(vercel ls --prod | grep -m 1 "https://" | awk '{print $2}')
if [ -z "$DEPLOY_URL" ]; then
    echo -e "${RED}Could not verify deployment URL${NC}"
    exit 1
fi

# Check if deployment is accessible
if ! curl -s -f -o /dev/null "$DEPLOY_URL"; then
    echo -e "${RED}Deployment verification failed. Site is not accessible.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed and verified successfully!${NC}"
echo -e "\n${YELLOW}Important next steps:${NC}"
echo -e "1. ${YELLOW}Verify OAuth callback URLs in your providers' dashboards:${NC}"
echo -e "   - Google: ${DEPLOY_URL}/api/auth/callback/google"
echo -e "   - Pipedream: ${DEPLOY_URL}/api/pipedream/callback"
echo -e "2. ${YELLOW}Verify environment variables in Vercel dashboard${NC}"
echo -e "3. ${YELLOW}Test authentication flows${NC}"
echo -e "4. ${YELLOW}Monitor deployment logs for any issues${NC}" 
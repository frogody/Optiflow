#!/bin/bash
# Deployment script with dependency fix for Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Preparing to deploy with dependency fixes${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed. Installing now...${NC}"
    npm install -g vercel
fi

# Fix dependencies
echo -e "${YELLOW}Fixing dependency conflicts...${NC}"
npm install --package-lock-only --legacy-peer-deps

# Update package.json to pin auth versions
echo -e "${YELLOW}Making sure auth dependencies are compatible...${NC}"
jq '.dependencies."@auth/core" = "0.34.2"' package.json > package.json.tmp && mv package.json.tmp package.json

# Run the Vercel build fix script
echo -e "${YELLOW}Running build fix script...${NC}"
chmod +x vercel-build-fix.sh
./vercel-build-fix.sh

# Create temporary .vercelignore file to exclude unnecessary files
echo -e "${YELLOW}Creating optimized .vercelignore file...${NC}"
cat > .vercelignore << 'EOL'
.git
node_modules
.github
backups
.next/cache
EOL

# Create a temporary npmrc file to use legacy-peer-deps
echo -e "${YELLOW}Creating .npmrc with legacy-peer-deps...${NC}"
echo "legacy-peer-deps=true" > .npmrc

# Deploy to Vercel with environment variables
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod \
  -e NODE_ENV=production \
  -e NEXTAUTH_URL=https://optiflow-project.vercel.app \
  -e DATABASE_URL=postgres://placeholder:placeholder@placeholder.neon.tech/neondb?sslmode=require \
  -e NEXTAUTH_SECRET=placeholder-secret-placeholder-secret-placeholder-secret \
  -e ELEVENLABS_API_KEY=0e53722686a318cb9c198e0d98bfde09 \
  -e ELEVENLABS_AGENT_ID=i3gU7j7TnkhSqx3MNkhu \
  -e SKIP_PRISMA_GENERATE=true

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the logs for more information.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Application is now available on Vercel.${NC}" 
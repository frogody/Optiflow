#!/bin/bash
# Script to standardize LiveKit environment variables across the application
# This will update all references to use LIVEKIT_URL instead of LIVEKIT_WS_URL

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Standardizing LiveKit environment variables across the application...${NC}"

# Check if LIVEKIT_URL is set in the main .env file
if grep -q "LIVEKIT_URL" .env; then
  LIVEKIT_URL_VALUE=$(grep "LIVEKIT_URL" .env | cut -d '=' -f2)
  echo -e "${GREEN}Found LIVEKIT_URL in .env: $LIVEKIT_URL_VALUE${NC}"
else
  echo -e "${RED}LIVEKIT_URL not found in .env file. Please add it first.${NC}"
  exit 1
fi

# Remove any LIVEKIT_WS_URL from environment files
echo -e "${YELLOW}Removing LIVEKIT_WS_URL from environment files...${NC}"
sed -i '' '/LIVEKIT_WS_URL/d' .env .env.* 2>/dev/null || true

# Ensure LIVEKIT_URL is present in all environment files
echo -e "${YELLOW}Ensuring LIVEKIT_URL is in all environment files...${NC}"
for env_file in .env .env.development.local .env.production.local .env.local; do
  if [ -f "$env_file" ]; then
    if ! grep -q "LIVEKIT_URL" "$env_file"; then
      echo "LIVEKIT_URL=$LIVEKIT_URL_VALUE" >> "$env_file"
      echo -e "${GREEN}Added LIVEKIT_URL to $env_file${NC}"
    fi
  fi
done

# Also ensure NEXT_PUBLIC_LIVEKIT_URL is present (for client-side)
echo -e "${YELLOW}Ensuring NEXT_PUBLIC_LIVEKIT_URL is in all environment files...${NC}"
for env_file in .env .env.development.local .env.production.local .env.local; do
  if [ -f "$env_file" ]; then
    if ! grep -q "NEXT_PUBLIC_LIVEKIT_URL" "$env_file"; then
      echo "NEXT_PUBLIC_LIVEKIT_URL=$LIVEKIT_URL_VALUE" >> "$env_file"
      echo -e "${GREEN}Added NEXT_PUBLIC_LIVEKIT_URL to $env_file${NC}"
    fi
  fi
done

# Update voice-agent env.example
if [ -f "voice-agent/env.example" ]; then
  echo -e "${YELLOW}Updating voice-agent/env.example...${NC}"
  sed -i '' 's/LIVEKIT_WS_URL/LIVEKIT_URL/g' voice-agent/env.example
  echo -e "${GREEN}Updated voice-agent/env.example${NC}"
fi

# Check Vercel environment variables
if command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Checking Vercel environment variables...${NC}"
  if vercel env ls | grep -q "LIVEKIT_WS_URL"; then
    echo -e "${RED}Found LIVEKIT_WS_URL in Vercel environment. Please remove it:${NC}"
    echo -e "vercel env rm LIVEKIT_WS_URL"
    echo -e "${YELLOW}And ensure LIVEKIT_URL is set:${NC}"
    echo -e "vercel env add LIVEKIT_URL $LIVEKIT_URL_VALUE"
  fi
else
  echo -e "${YELLOW}Vercel CLI not found. Please manually check your Vercel environment variables.${NC}"
fi

echo -e "${GREEN}LiveKit environment variables have been standardized!${NC}"
echo -e "${YELLOW}Important:${NC}"
echo -e "1. If you're using Vercel, make sure to update your Vercel environment variables"
echo -e "2. Update any scripts that rely on LiveKit variables"
echo -e "3. Restart any running servers or services" 
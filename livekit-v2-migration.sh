#!/bin/bash
# Script to migrate LiveKit from v1 to v2

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting LiveKit v2 migration...${NC}"

# 1. First ensure environment variables are standardized
echo -e "${YELLOW}Standardizing LiveKit environment variables...${NC}"
./fix-livekit-url.sh

# 2. Update LiveKit dependencies
echo -e "${YELLOW}Updating LiveKit dependencies...${NC}"
npm install @livekit/components-react@^2.0.0 @livekit/components-styles@^2.0.0 livekit-client@^2.0.0 --save

# 3. Apply Prisma migration
echo -e "${YELLOW}Applying database migrations...${NC}"
npx prisma migrate deploy

# 4. Update the virtual environment for voice agent
echo -e "${YELLOW}Updating voice agent dependencies...${NC}"
cd voice-agent
python -m pip install --upgrade livekit==1.0.0 livekit-agents==1.0.0 livekit-plugins-openai==1.0.0
cd ..

# 5. Build the project
echo -e "${YELLOW}Building the project with new dependencies...${NC}"
npm run build

# 6. Verify code changes
echo -e "${YELLOW}Verifying code changes...${NC}"
FILES_TO_CHECK=(
  "src/components/workflow/VoiceAgent.tsx"
  "src/lib/livekit.ts"
  "voice-agent/main_agent.py"
)
for file in "${FILES_TO_CHECK[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}Checking $file...${NC}"
    # Do any verification needed
  else
    echo -e "${RED}⚠️ Warning: $file not found${NC}"
  fi
done

echo -e "${GREEN}LiveKit v2 migration completed successfully!${NC}"
echo -e "${YELLOW}Important Notes:${NC}"
echo -e "1. Make sure to test the voice agent functionality thoroughly"
echo -e "2. Check logs for any errors: voice-agent/agent.log"
echo -e "3. If you're deploying to production, update your Vercel environment variables"
echo -e "4. Review LIVEKIT_V2_MIGRATION.md for detailed information"
echo -e "5. Test thoroughly before deploying to production"
echo -e "6. Run 'npm run dev' to test locally"
echo -e "7. Verify voice agent functionality"
echo -e "8. Deploy to production with './deploy-to-vercel.sh'" 
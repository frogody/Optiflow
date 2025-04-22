#!/bin/bash
# Minimal deployment script for Voice Feature to Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Preparing minimal deployment for Voice Workflow Generator${NC}"

# Create a temp directory for deployment
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}Created temporary directory: ${TEMP_DIR}${NC}"

# Copy only necessary files for the voice feature
echo -e "${YELLOW}Copying minimal files for deployment...${NC}"
mkdir -p "${TEMP_DIR}/src/app/voice-test"
mkdir -p "${TEMP_DIR}/src/components"
mkdir -p "${TEMP_DIR}/src/services"
mkdir -p "${TEMP_DIR}/src/types"
mkdir -p "${TEMP_DIR}/public"

# Copy the voice-test page
cp -r src/app/voice-test "${TEMP_DIR}/src/app/"
cp -r src/app/layout.tsx "${TEMP_DIR}/src/app/"
cp -r src/app/globals.css "${TEMP_DIR}/src/app/"
cp -r src/app/page.tsx "${TEMP_DIR}/src/app/"

# Copy necessary components
cp -r src/components/MicrophonePermission.tsx "${TEMP_DIR}/src/components/"
cp -r src/services/ElevenLabsConversationalService.ts "${TEMP_DIR}/src/services/"
cp -r src/types/elevenlabs.ts "${TEMP_DIR}/src/types/"

# Create package.json
cat > "${TEMP_DIR}/package.json" << 'EOL'
{
  "name": "voice-workflow-generator",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@11labs/client": "^0.1.3",
    "next": "^14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "elevenlabs": "^1.57.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.19",
    "@types/react": "^18.2.57",
    "@types/react-dom": "^18.2.19",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
EOL

# Create next.config.js
cat > "${TEMP_DIR}/next.config.js" << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ELEVENLABS_API_KEY: "0e53722686a318cb9c198e0d98bfde09",
    NEXT_PUBLIC_ELEVENLABS_AGENT_ID: "i3gU7j7TnkhSqx3MNkhu"
  }
}

module.exports = nextConfig
EOL

# Create .env file
cat > "${TEMP_DIR}/.env" << 'EOL'
ELEVENLABS_API_KEY=0e53722686a318cb9c198e0d98bfde09
ELEVENLABS_AGENT_ID=i3gU7j7TnkhSqx3MNkhu
EOL

# Create minimal tsconfig
cat > "${TEMP_DIR}/tsconfig.json" << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOL

# Create .gitignore
cat > "${TEMP_DIR}/.gitignore" << 'EOL'
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL

# Create vercel.json
cat > "${TEMP_DIR}/vercel.json" << 'EOL'
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "ELEVENLABS_API_KEY": "0e53722686a318cb9c198e0d98bfde09",
    "ELEVENLABS_AGENT_ID": "i3gU7j7TnkhSqx3MNkhu",
    "NEXT_PUBLIC_ELEVENLABS_API_KEY": "0e53722686a318cb9c198e0d98bfde09",
    "NEXT_PUBLIC_ELEVENLABS_AGENT_ID": "i3gU7j7TnkhSqx3MNkhu"
  }
}
EOL

# Go to temp directory
cd "${TEMP_DIR}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
vercel --prod --yes --name voice-workflow-generator

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed. Please check the logs for more information.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Voice Workflow Generator is now available on your Vercel deployment.${NC}"

# Cleanup
echo -e "${YELLOW}Cleaning up temporary directory...${NC}"
cd -
rm -rf "${TEMP_DIR}" 
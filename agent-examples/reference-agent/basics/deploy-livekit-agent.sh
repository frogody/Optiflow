#!/bin/bash
# Production deployment script for LiveKit voice agent
# This script will:
# 1. Run on the production server
# 2. Clone or pull the latest code
# 3. Set up environment variables
# 4. Start the agent with the correct credentials
# 5. Set up process management

set -e

# Configuration
REPO_URL="https://github.com/your-username/optiflow.git" # Replace with your actual repo URL
INSTALL_DIR="/opt/livekit-agent"
LOG_FILE="/var/log/livekit-agent.log"

# LiveKit credentials
LIVEKIT_URL="wss://isyncsosync-p1slrjy.livekit.cloud"
LIVEKIT_API_KEY="APIcPGS63mCxqbP"
LIVEKIT_API_SECRET="AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB"
OPENAI_API_KEY="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"
DEEPGRAM_API_KEY="b0630b3eba032494e7f164b4a6c5471e17f4fed8"
LIVEKIT_ROOM="voice-agent-room"

# Create installation directory
mkdir -p $INSTALL_DIR
cd $INSTALL_DIR

# Check if we need to clone or just pull
if [ -d "agent-examples" ]; then
    echo "Repository exists, pulling latest changes..."
    cd agent-examples
    git pull
else
    echo "Cloning repository..."
    git clone $REPO_URL .
    # Or just copy the agent directory if the repo is private
    # mkdir -p agent-examples/reference-agent/basics
    # cp -r /path/to/source/agent-examples/reference-agent/basics/* agent-examples/reference-agent/basics/
fi

# Go to agent directory
cd agent-examples/reference-agent/basics

# Install dependencies
echo "Installing dependencies..."
npm install

# Install global packages
echo "Installing global packages..."
npm install -g tsx pm2

# Create environment file
echo "Setting up environment variables..."
cat > .env.production << EOL
LIVEKIT_URL=$LIVEKIT_URL
LIVEKIT_API_KEY=$LIVEKIT_API_KEY
LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET
OPENAI_API_KEY=$OPENAI_API_KEY
DEEPGRAM_API_KEY=$DEEPGRAM_API_KEY
LIVEKIT_ROOM=$LIVEKIT_ROOM
LOG_LEVEL=debug
EOL

# Create PM2 process configuration
cat > livekit-agent.pm2.json << EOL
{
  "apps": [
    {
      "name": "livekit-voice-agent",
      "script": "tsx",
      "args": "src/listen-and-respond.ts",
      "env": {
        "LIVEKIT_URL": "$LIVEKIT_URL",
        "LIVEKIT_API_KEY": "$LIVEKIT_API_KEY",
        "LIVEKIT_API_SECRET": "$LIVEKIT_API_SECRET",
        "OPENAI_API_KEY": "$OPENAI_API_KEY",
        "DEEPGRAM_API_KEY": "$DEEPGRAM_API_KEY",
        "LIVEKIT_ROOM": "$LIVEKIT_ROOM",
        "LOG_LEVEL": "debug",
        "NODE_ENV": "production"
      },
      "log_file": "$LOG_FILE",
      "time": true,
      "autorestart": true,
      "restart_delay": 5000
    }
  ]
}
EOL

# Start/restart agent with PM2
echo "Starting agent with PM2..."
pm2 delete livekit-voice-agent || true
pm2 start livekit-agent.pm2.json

# Setup PM2 to start on system boot
echo "Setting up PM2 to start on system boot..."
pm2 save
pm2 startup

echo "==================================================="
echo "LiveKit voice agent deployed successfully!"
echo "The agent is running with PM2 and will auto-restart."
echo "Logs are available at: $LOG_FILE"
echo "Monitor with: pm2 monit"
echo "==================================================="

# Instructions for nginx setup if needed
cat << EOL

NEXT STEPS:
1. Ensure your Vercel project has the following environment variables:
   LIVEKIT_URL=$LIVEKIT_URL
   LIVEKIT_API_KEY=$LIVEKIT_API_KEY
   LIVEKIT_API_SECRET=$LIVEKIT_API_SECRET

2. Redeploy your Vercel application:
   vercel --prod

3. Test the voice agent at:
   https://app.isyncso.com/voice-chat
EOL 
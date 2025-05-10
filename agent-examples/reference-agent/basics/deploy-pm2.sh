#!/bin/bash
# PM2 deployment script for LiveKit voice agent

set -e

echo "Installing required global packages..."
npm install -g tsx @dotenvx/dotenvx pm2

echo "Installing dependencies..."
npm install

echo "Setting up environment variables..."
cat > .env.production << EOL
LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud
LIVEKIT_API_KEY=APIcPGS63mCxqbP
LIVEKIT_API_SECRET=AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB
OPENAI_API_KEY=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
DEEPGRAM_API_KEY=b0630b3eba032494e7f164b4a6c5471e17f4fed8
LIVEKIT_ROOM=voice-agent-room
LOG_LEVEL=debug
EOL

echo "Starting agent with PM2..."
pm2 delete livekit-voice-agent || true
pm2 start --name livekit-voice-agent "dotenvx run -f .env.production -- tsx src/listen-and-respond.ts prod"

echo "Setting up PM2 to start on system boot..."
pm2 save
pm2 startup

echo "Deployment complete! Agent is running under PM2."
echo "Check logs with: pm2 logs livekit-voice-agent"
echo "Monitor status with: pm2 monit" 
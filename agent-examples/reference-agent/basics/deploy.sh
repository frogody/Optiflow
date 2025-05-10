#!/bin/bash
# Deploy script for LiveKit voice agent

set -e

echo "Building Docker image for LiveKit voice agent..."
docker build -t livekit-voice-agent:latest .

echo "Stopping any existing container..."
docker stop livekit-voice-agent || true
docker rm livekit-voice-agent || true

echo "Starting new container..."
docker run -d --restart always \
  --name livekit-voice-agent \
  -e LIVEKIT_URL=wss://isyncsosync-p1slrjy.livekit.cloud \
  -e LIVEKIT_API_KEY=APIcPGS63mCxqbP \
  -e LIVEKIT_API_SECRET=AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB \
  -e OPENAI_API_KEY=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 \
  -e DEEPGRAM_API_KEY=b0630b3eba032494e7f164b4a6c5471e17f4fed8 \
  -e LIVEKIT_ROOM=voice-agent-room \
  -e LOG_LEVEL=debug \
  livekit-voice-agent:latest

echo "Deployment complete! Container is running."
echo "Check logs with: docker logs livekit-voice-agent" 
#!/bin/bash

# Check if we're inside the .venv
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "Activating virtual environment..."
    source livekit-agent-venv/bin/activate
fi

# Set environment variables
export LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud
export LIVEKIT_API_KEY=APIcPGS63mCxqbP
export LIVEKIT_API_SECRET=AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWIcVbPLgyEB

echo "Starting Simple Voice Agent with:"
echo "LIVEKIT_URL=$LIVEKIT_URL"
echo "LIVEKIT_API_KEY=${LIVEKIT_API_KEY:0:5}..."

# Install dependencies if needed
pip install livekit aiohttp

# Run the simple agent
cd voice-agent
python simple_agent.py 
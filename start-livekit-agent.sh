#!/bin/bash

# Check if we're inside the .venv
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "Activating virtual environment..."
    source livekit-agent-venv/bin/activate
fi

# Set environment variables if not already set
export LIVEKIT_URL=${LIVEKIT_URL:-"wss://isyncsosync-p1sl1ryj.livekit.cloud"}
export LIVEKIT_API_KEY=${LIVEKIT_API_KEY:-"APIcPGS63mCxqbP"}
export LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET:-"AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWIcVbPLgyEB"}
export OPENAI_API_KEY=${OPENAI_API_KEY:-"sk-proj-9qbMAdQ0vnNrfR6Ex7dVd9X-wrtK2w1wN0NqRbxVmNm3vdJeb85H5SCjUbIamVPSZiPCYYGxVRT3BlbkFJ6kv"}

echo "Starting LiveKit agent with:"
echo "LIVEKIT_URL=$LIVEKIT_URL"
echo "LIVEKIT_API_KEY=${LIVEKIT_API_KEY:0:5}..."
echo "OPENAI_API_KEY=${OPENAI_API_KEY:0:10}..."

# Run the reference agent
cd agent-examples/reference-agent/basics
python agent.py 
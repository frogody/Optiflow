#!/bin/bash

# Start the LiveKit agent in development mode with the proper parameters
# Make sure the script is run from the agent-server directory
cd "$(dirname "$0")"

echo "Starting LiveKit agent server..."
echo "API Key: $LIVEKIT_API_KEY"
echo "URL: $LIVEKIT_URL"

# First set the correct environment variables
export LIVEKIT_URL=${LIVEKIT_URL:-$NEXT_PUBLIC_LIVEKIT_URL}
export LIVEKIT_API_KEY=${LIVEKIT_API_KEY:-"API2tbQViSwUAZB"}
export LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET:-"PwNX4F1FwxFVxd7f25RMv3Fw4SLRGwFUvtzeh4LhUOc"}
export OPENAI_API_KEY=${OPENAI_API_KEY:-"sk-proj-9qbMAqQ0vnNrfRGEx7oVd9X-wrtK2w1wNQNqRbxVmNm3vdJeb85H5SCjUbIamVPSZiPCYvGxVRT3B1bkFJ6kvpBB8769Hy7qtuxNPT94Hkwx"}
export DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY:-"b0630b3eba032494e7f164b4a6c5471e17f4fed8"}

# Use the simple agent 
node simple.js dev --log-level=debug 
#!/bin/bash

# Start the Python LiveKit agent with all required environment variables
cd "$(dirname "$0")"

echo "Starting Python LiveKit agent..."

# Set environment variables
export LIVEKIT_URL=${LIVEKIT_URL:-wss://isyncsosyncp1s1lryj.livekit.cloud}
export LIVEKIT_API_KEY=${LIVEKIT_API_KEY:-API2tbQViSwUAZB}
export LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET:-PwNX4F1FwxFVxd7f25RMv3Fw4SLRGwFUvtzeh4LhUOc}
export OPENAI_API_KEY=${OPENAI_API_KEY:-sk-proj-9qbMAdQ0vnNrfR6Ex7dVd9X-wrtK2w1wN0NqRbxVmNm3vdJeb85H5SCjUbIamVPSZiPCYYGxVRT3BlbkFJ6kvpBB8769Hy7qtuxNPT94Hkwd}
export OPTIFLOW_API_BASE=${OPTIFLOW_API_BASE:-http://localhost:3005}

echo "LIVEKIT_URL: $LIVEKIT_URL"
echo "LIVEKIT_API_KEY: $LIVEKIT_API_KEY"
echo "OPTIFLOW_API_BASE: $OPTIFLOW_API_BASE"

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install or upgrade dependencies
echo "Installing/upgrading dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run the Python agent
echo "Starting the agent..."
python3 agent.py 
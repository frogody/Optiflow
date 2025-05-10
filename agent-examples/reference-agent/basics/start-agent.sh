#!/bin/bash
# Run the LiveKit agent using Python and livekit-agents[openai] in the correct venv

# Activate the correct Python virtual environment
source /Users/godyduinsbergen/Optiflow/livekit-agent-venv/bin/activate

# Set environment variables
export LIVEKIT_URL="wss://isyncsosync-p1slrjy.livekit.cloud"
export LIVEKIT_API_KEY="APIcPGS63mCxqbP"
export LIVEKIT_API_SECRET="AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB"
export LIVEKIT_ROOM="optiflow-voice-$(date +%Y-%m-%d)"
export OPENAI_API_KEY="${OPENAI_API_KEY}"

# Run the agent in the background using the correct Python
python /Users/godyduinsbergen/Optiflow/agent-examples/reference-agent/basics/agent.py > agent.log 2>&1 &

# Save the process ID
echo $! > agent.pid

# Info
echo "Agent started with PID $(cat agent.pid)"
echo "View logs with: tail -f agent.log"
echo "To stop agent: kill $(cat agent.pid)" 
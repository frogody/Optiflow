FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional packages for the health check endpoint
RUN pip install --no-cache-dir fastapi uvicorn

# Copy agent code
COPY . .

# Create a simple runner script
COPY <<EOF /app/run.py
from fastapi import FastAPI
import uvicorn
import threading
import os
import json
import time
import asyncio
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

app = FastAPI(title="Voice Agent API")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check all required env vars
        required_vars = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"]
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        return {
            "status": "healthy" if not missing_vars else "unhealthy",
            "config": {
                "livekit_url": os.getenv("LIVEKIT_URL", "").replace("wss://", "****://"),
                "has_livekit_api_key": bool(os.getenv("LIVEKIT_API_KEY")),
                "has_livekit_api_secret": bool(os.getenv("LIVEKIT_API_SECRET")),
                "has_openai_api_key": bool(os.getenv("OPENAI_API_KEY")),
                "has_elevenlabs_api_key": bool(os.getenv("ELEVENLABS_API_KEY")),
                "has_deepgram_api_key": bool(os.getenv("DEEPGRAM_API_KEY")), 
            },
            "missing_vars": missing_vars,
            "version": "1.0.0",
            "timestamp": time.time()
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/agent/dispatch")
async def dispatch_agent():
    """Endpoint to dispatch the agent to a room"""
    return {"status": "success", "message": "Agent dispatch functionality would be implemented here"}

@app.post("/agent/token")
async def generate_token():
    """Endpoint to generate a LiveKit token"""
    return {"status": "success", "message": "Token generation would be implemented here"}

@app.post("/agent/force-join")
async def force_join():
    """Endpoint to force the agent to join a room"""
    return {"status": "success", "message": "Force join functionality would be implemented here"}

def run_agent():
    """Run the actual voice agent"""
    try:
        # Here we would import and run our voice agent logic
        # This would be equivalent to running: 
        # livekit-cli agent run main_agent:request_fnc
        from main_agent import request_fnc
        print("Starting agent main function...")
        asyncio.run(request_fnc())
    except Exception as e:
        print(f"Error running agent: {e}")
        traceback.print_exc()

def start_web_server():
    """Start the web server in a separate thread"""
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Start the web server in a separate thread
server_thread = threading.Thread(target=start_web_server)
server_thread.daemon = True
server_thread.start()

# Run the agent in the main thread
run_agent()
EOF

# Set the entrypoint to the new script
ENTRYPOINT ["python", "run.py"] 
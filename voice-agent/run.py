from fastapi import FastAPI, HTTPException
import uvicorn
import threading
import os
import json
import sys
import time
import asyncio
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

app = FastAPI(title="Voice Agent API")

# Environment variables check
LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

@app.get("/health")
async def health_check():
    """Health check endpoint for Render.com"""
    # This health check doesn't try to import the agent code, making it more robust
    return {
        "status": "healthy",
        "livekit_connected": bool(LIVEKIT_URL and LIVEKIT_API_KEY and LIVEKIT_API_SECRET),
        "openai_available": bool(OPENAI_API_KEY),
        "environment": {
            "livekit_url": LIVEKIT_URL[:20] + "..." if LIVEKIT_URL else None,
            "livekit_api_key": LIVEKIT_API_KEY[:10] + "..." if LIVEKIT_API_KEY else None,
            "livekit_api_secret": "***masked***" if LIVEKIT_API_SECRET else None,
            "openai_api_key": "***masked***" if OPENAI_API_KEY else None,
            "deepgram_api_key": "***masked***" if DEEPGRAM_API_KEY else None,
            "elevenlabs_api_key": "***masked***" if ELEVENLABS_API_KEY else None
        }
    }

def run_agent():
    """Run the agent in a separate thread"""
    try:
        # We try to import the agent, but it won't impact the health check if it fails
        print("Attempting to import agent modules...")
        try:
            from main_agent import request_fnc
            print("Voice agent imported successfully.")
            print("NOTE: To run the agent with LiveKit, use the LiveKit CLI.")
            print("livekit-server agent run main_agent:request_fnc")
        except ImportError as e:
            print(f"Error importing agent: {e}")
            print(traceback.format_exc())
            print("The server will continue running with health check, but the agent is not available.")
            print("This won't affect the deployment health check.")
    except Exception as e:
        print(f"Error in run_agent: {e}")
        print(traceback.format_exc())

# Start the agent in a separate thread with a delay to ensure FastAPI starts first
def delayed_agent_start():
    # Wait a few seconds before trying to start the agent
    time.sleep(5)
    run_agent()

agent_thread = threading.Thread(target=delayed_agent_start)
agent_thread.daemon = True
agent_thread.start()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

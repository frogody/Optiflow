#!/usr/bin/env python3
import requests
import os
import json
from dotenv import load_dotenv
import time
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI(title="Voice Agent Test Server")

# Check if environment variables are set
required_vars = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"]
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    print(f"Error: The following required environment variables are not set: {', '.join(missing_vars)}")
    print("Please set them in your .env file or environment before running this script.")
    exit(1)

class HealthResponse(BaseModel):
    status: str
    livekit_connected: bool
    openai_available: bool
    environment: dict

@app.get("/health")
async def health_check():
    """Check if the agent service is healthy and environment is configured properly"""
    env_status = {
        "livekit_url": mask_string(os.getenv("LIVEKIT_URL", "")),
        "livekit_api_key": mask_string(os.getenv("LIVEKIT_API_KEY", "")),
        "livekit_api_secret": "***masked***" if os.getenv("LIVEKIT_API_SECRET") else "not set",
        "openai_api_key": "***masked***" if os.getenv("OPENAI_API_KEY") else "not set",
        "deepgram_api_key": "***masked***" if os.getenv("DEEPGRAM_API_KEY") else "not set",
        "elevenlabs_api_key": "***masked***" if os.getenv("ELEVENLABS_API_KEY") else "not set",
    }
    
    livekit_status = check_livekit_connection()
    openai_status = check_openai_status()
    
    return HealthResponse(
        status="healthy",
        livekit_connected=livekit_status,
        openai_available=openai_status,
        environment=env_status
    )

def mask_string(s: str) -> str:
    """Mask a string to show only the first few and last few characters"""
    if not s:
        return "not set"
    if len(s) <= 8:
        return "***masked***"
    return s[:4] + "..." + s[-4:]

def check_livekit_connection() -> bool:
    """Check if LiveKit server is accessible"""
    livekit_url = os.getenv("LIVEKIT_URL", "")
    if not livekit_url:
        return False
    
    # Convert wss:// to https:// for the health check
    if livekit_url.startswith("wss://"):
        http_url = livekit_url.replace("wss://", "https://")
    else:
        http_url = livekit_url
        
    try:
        # Most LiveKit servers have a /health endpoint
        response = requests.get(f"{http_url}/.well-known/livekit/health", timeout=5)
        return response.status_code == 200
    except Exception as e:
        print(f"LiveKit connection check failed: {e}")
        return False

def check_openai_status() -> bool:
    """Check if OpenAI API is accessible"""
    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    if not openai_api_key:
        return False
    
    try:
        # Make a simple API call to OpenAI
        headers = {
            "Authorization": f"Bearer {openai_api_key}",
            "Content-Type": "application/json"
        }
        response = requests.get(
            "https://api.openai.com/v1/models", 
            headers=headers,
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        print(f"OpenAI connection check failed: {e}")
        return False

class AgentRequestModel(BaseModel):
    room_name: str
    user_id: str = None
    message: str = None

@app.post("/test/agent")
async def test_agent(request: AgentRequestModel):
    """Test the agent by sending a request to join a room"""
    try:
        # This is a simulated test endpoint that won't actually connect to LiveKit
        # In a real implementation, you would use the LiveKit API to create a token and join a room
        
        return {
            "status": "success",
            "message": f"Agent would join room {request.room_name} for user {request.user_id or 'anonymous'}",
            "details": {
                "livekit_url": mask_string(os.getenv("LIVEKIT_URL", "")),
                "ai_services_configured": bool(os.getenv("OPENAI_API_KEY")),
                "simulated": True,
                "timestamp": time.time()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error testing agent: {str(e)}")

if __name__ == "__main__":
    print("\n🎙️ Voice Agent Test Server 🎙️")
    print("==============================")
    print("This server provides endpoints to test the voice agent configuration.")
    print("Access the health check at: http://localhost:8000/health")
    print("Send test agent requests to: http://localhost:8000/test/agent")
    print("Access the API documentation at: http://localhost:8000/docs")
    print("----------------------------------------------")
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 
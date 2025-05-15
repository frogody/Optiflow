from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import uvicorn
import logging
from config import CORS_ORIGINS, PORT, DEBUG, LIVEKIT_URL, logger

# Create FastAPI app
app = FastAPI()

# Configure CORS with proper settings
logger.info(f"Configuring CORS with origins: {CORS_ORIGINS}")

# Ensure proper CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    max_age=86400,  # 24 hours
)

# Current health endpoint that's working
@app.get("/health")
async def health_check():
    return {
        "status": "ok", 
        "cors_origins": CORS_ORIGINS,
        "livekit_url": LIVEKIT_URL
    }

# Add the missing agent/dispatch endpoint
@app.post("/agent/dispatch")
async def agent_dispatch(request: Request):
    try:
        # Get request body if any
        body = await request.json()
    except:
        body = {}
    
    # Log the request for debugging
    logger.info(f"Received agent dispatch request: {body}")
    
    # Return a proper response with connection details
    return {
        "status": "success",
        "message": "Agent dispatched successfully",
        "data": {
            "agent_id": "voice-agent-123",
            "connection_info": {
                "token": "mock-token-xyz",
                "room": body.get("roomName", "default-room"),
                "service": "livekit",
                "server_url": LIVEKIT_URL
            }
        }
    }

# Add token generation endpoint
@app.get("/agent/token")
async def agent_token(room: str = None, identity: str = None):
    # Log the request for debugging
    logger.info(f"Received token request - Room: {room}, Identity: {identity}")
    
    # Use provided values or defaults
    room_name = room or "default-room"
    user_id = identity or "anonymous-user"
    
    return {
        "token": f"mock-token-{room_name}-{user_id}",
        "expires_at": "2025-05-16T00:00:00Z", 
        "room": room_name,
        "identity": user_id
    }

# Add a catchall OPTIONS route to handle preflight requests for any endpoint
@app.options("/{path:path}")
async def options_route(path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
            "Access-Control-Max-Age": "86400",
        }
    )

if __name__ == "__main__":
    logger.info(f"Starting voice agent service on port {PORT}")
    uvicorn.run(app, host="0.0.0.0", port=PORT) 
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import uvicorn

app = FastAPI()

# Configure CORS - read origins from environment or use defaults
# Allow the website domain where your voice agent will be embedded
origins = os.getenv("CORS_ALLOW_ORIGIN", "https://app.isyncso.com,http://localhost:3000").split(",")
if origins == [""]:
    origins = ["https://app.isyncso.com", "http://localhost:3000"]  # Fallback

print(f"Configuring CORS with origins: {origins}")

# Ensure proper CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    max_age=86400,  # 24 hours
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add the missing agent/dispatch endpoint
@app.post("/agent/dispatch")
async def agent_dispatch(request: Request):
    try:
        # Get request body if any
        body = await request.json()
    except:
        body = {}
    
    # Log the request for debugging
    print(f"Received agent dispatch request: {body}")
    
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
                "server_url": os.getenv("LIVEKIT_URL", "wss://example.livekit.cloud")
            }
        }
    }

# Explicit OPTIONS route for /agent/dispatch with proper CORS headers
@app.options("/agent/dispatch")
async def agent_dispatch_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": ", ".join(origins),
            "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400",
        }
    )

# Add token generation endpoint
@app.get("/agent/token")
async def agent_token(room: str = None, identity: str = None):
    # Log the request for debugging
    print(f"Received token request - Room: {room}, Identity: {identity}")
    
    # Use provided values or defaults
    room_name = room or "default-room"
    user_id = identity or "anonymous-user"
    
    return {
        "token": f"mock-token-{room_name}-{user_id}",
        "expires_at": "2025-05-16T00:00:00Z",
        "room": room_name,
        "identity": user_id
    }

# Explicit OPTIONS route for /agent/token with proper CORS headers
@app.options("/agent/token")
async def agent_token_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": ", ".join(origins),
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400",
        }
    )

# Add a catchall OPTIONS route to handle preflight requests for any endpoint
@app.options("/{rest_of_path:path}")
async def options_route(rest_of_path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": ", ".join(origins),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400",
        }
    )

if __name__ == "__main__":
    # Get port from environment variable or default to 8000
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting voice agent service on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 
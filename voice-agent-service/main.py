from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import uvicorn

# Create FastAPI app
app = FastAPI()

# Configure CORS - read origins from environment or use defaults
origins = os.getenv("CORS_ALLOW_ORIGIN", "https://app.isyncso.com").split(",")
if origins == [""]:
    origins = ["https://app.isyncso.com"]  # Fallback

print(f"Configuring CORS with origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=os.getenv("CORS_ALLOW_METHODS", "*").split(","),
    allow_headers=os.getenv("CORS_ALLOW_HEADERS", "*").split(","),
)

# Current health endpoint that's working
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Add the missing agent/dispatch endpoint
@app.post("/agent/dispatch")
async def agent_dispatch(request: Request):
    try:
        # Get request body if any
        body = await request.json()
    except:
        body = {}
    
    # Simple mock response
    return {
        "status": "success",
        "message": "Agent dispatched successfully",
        "data": {
            "agent_id": "mock-agent-123",
            "connection_info": {
                "token": "mock-token-xyz",
                "room": "mock-room-456"
            }
        }
    }

# Also handle OPTIONS requests explicitly for CORS preflight
@app.options("/agent/dispatch")
async def agent_dispatch_options():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": origins[0],
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Add other needed endpoints here
@app.get("/agent/token")
async def agent_token():
    return {
        "token": "mock-token-abc-123",
        "expires_at": "2025-05-16T00:00:00Z"
    }

if __name__ == "__main__":
    # Get port from environment variable or default to the one used by FastAPI
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 
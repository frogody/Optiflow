import os
import logging
import asyncio
import json
import time
from livekit import rtc
import aiohttp
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("simple-agent")

# Environment variables with defaults
LIVEKIT_URL = os.environ.get("LIVEKIT_URL", "wss://isyncsosync-p1sl1ryj.livekit.cloud")
LIVEKIT_API_KEY = os.environ.get("LIVEKIT_API_KEY", "APIcPGS63mCxqbP")
LIVEKIT_API_SECRET = os.environ.get("LIVEKIT_API_SECRET", "AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWIcVbPLgyEB")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

class SimpleVoiceAgent:
    def __init__(self, room_name):
        self.room_name = room_name
        self.room = None
        self.running = True
    
    async def connect(self):
        logger.info(f"Connecting to room: {self.room_name}")
        
        # Create room
        self.room = rtc.Room()
        
        # Generate token
        token = await self._create_token()
        
        # Connect to room
        await self.room.connect(LIVEKIT_URL, token)
        logger.info(f"Connected to room: {self.room_name}")
        
        # Set up event listeners
        self.room.on(rtc.RoomEvent.ParticipantConnected, self._on_participant_connected)
        
        # Send initial greeting after a delay
        await asyncio.sleep(2)
        await self._send_greeting()
    
    async def _create_token(self):
        """Create a LiveKit token for the agent"""
        # Import locally to avoid dependency issues
        try:
            from livekit.tokens import AccessToken, VideoGrant
            
            # Create access token with server API key and secret
            at = AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
            
            # Set identity for this agent
            identity = f"agent-jarvis-{int(time.time())}"
            at.identity = identity
            at.name = "Jarvis"
            
            # Define grant (permissions)
            grant = VideoGrant(
                room=self.room_name,
                room_join=True,
                can_publish=True,
                can_subscribe=True,
                can_publish_data=True
            )
            at.add_grant(grant)
            
            # Generate JWT token
            return at.to_jwt()
            
        except ImportError:
            # Fall back to making HTTP request if livekit.tokens is not available
            logger.info("Using HTTP fallback for token generation")
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"https://app.isyncso.com/api/livekit/token",
                    json={"room": self.room_name, "identity": f"agent-jarvis-{int(time.time())}"}
                ) as resp:
                    if resp.status != 200:
                        raise RuntimeError(f"Failed to get token: {await resp.text()}")
                    data = await resp.json()
                    return data["token"]
    
    async def _on_participant_connected(self, participant):
        """Handle new participant joining"""
        logger.info(f"Participant connected: {participant.identity}")
        await self._send_greeting()
    
    async def _send_greeting(self):
        """Send a greeting message to the room"""
        if not self.room:
            logger.warning("Cannot send greeting - room not connected")
            return
        
        message = {
            "type": "agent_transcript",
            "transcript": "Hello! I'm Jarvis, your voice assistant. How can I help you today?",
            "timestamp": datetime.now().isoformat()
        }
        
        # Encode and publish the message
        data = json.dumps(message).encode()
        await self.room.local_participant.publish_data(data, reliability=rtc.DataPacket_Kind.RELIABLE)
        logger.info(f"Sent greeting message")
    
    async def run(self):
        """Run the agent until stopped"""
        await self.connect()
        
        # Keep the agent running
        while self.running:
            await asyncio.sleep(1)
    
    async def stop(self):
        """Stop the agent gracefully"""
        self.running = False
        if self.room:
            await self.room.disconnect()
            logger.info("Disconnected from room")

async def find_and_join_rooms():
    """Find rooms and join them"""
    while True:
        try:
            # In a real implementation, this would query LiveKit for rooms to join
            # For this simple agent, we'll just scan for rooms in our database or join any requested
            room_name = os.environ.get("AGENT_ROOM")
            
            if not room_name:
                # If no specific room is set, try to connect to a default room
                # This would be replaced with logic to find active rooms
                current_time = int(time.time())
                room_name = f"sync-jarvis-{current_time}"
            
            logger.info(f"Found room to join: {room_name}")
            
            # Create and run agent for this room
            agent = SimpleVoiceAgent(room_name)
            await agent.run()
            
            # Wait before looking for more rooms
            await asyncio.sleep(10)
            
        except Exception as e:
            logger.error(f"Error joining room: {e}", exc_info=True)
            await asyncio.sleep(5)  # Wait before retrying

if __name__ == "__main__":
    try:
        logger.info("Starting simple voice agent")
        asyncio.run(find_and_join_rooms())
    except KeyboardInterrupt:
        logger.info("Agent stopped by user")
    except Exception as e:
        logger.error(f"Unhandled error: {e}", exc_info=True) 
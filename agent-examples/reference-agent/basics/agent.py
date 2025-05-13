import os
import logging
import asyncio
import signal
import sys
from datetime import datetime
from livekit import rtc
from livekit.agents import VoiceAgent, run_agent
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from livekit.plugins import silero
from livekit_plugins_openai import OpenAIVoice, OpenAILLM

# Configure logging
log_level = os.environ.get('LOG_LEVEL', 'info').upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('voice-agent')

# Get environment variables with defaults for Optiflow
LIVEKIT_WS_URL = os.environ.get("LIVEKIT_WS_URL", "wss://isyncsosync-p1slrjy.livekit.cloud")
LIVEKIT_API_KEY = os.environ.get("LIVEKIT_API_KEY", "APIcPGS63mCxqbP")
LIVEKIT_API_SECRET = os.environ.get("LIVEKIT_API_SECRET", "AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Generate a daily consistent room name (same as client-side)
today = datetime.now().strftime("%Y-%m-%d")
LIVEKIT_ROOM = os.environ.get("LIVEKIT_ROOM", f"optiflow-voice-{today}")

# Check required environment variables
if not OPENAI_API_KEY:
    logger.error("OPENAI_API_KEY environment variable is required")
    exit(1)

# Configure OpenAI voice and LLM plugins
openai_voice = OpenAIVoice(
    api_key=OPENAI_API_KEY,
    voice="alloy",  # Options: alloy, echo, fable, onyx, nova, shimmer
    model="tts-1", # or "tts-1-hd" for higher quality
)

openai_llm = OpenAILLM(
    api_key=OPENAI_API_KEY,
    model="gpt-4o", # or "gpt-3.5-turbo" for faster responses
)

# Load VAD and turn detection models
vad = silero.VAD.load()
turn_detector = MultilingualModel()

# Define the system prompt for the agent
SYSTEM_PROMPT = """
You are Optiflow's Automation Assistant, a friendly and professional voice-activated AI.
You help users navigate the Optiflow platform, build automations, and understand workflows.

Key abilities:
- Guide users through building automations with Optiflow's workflow builder
- Help users navigate the application (dashboard, settings, workflow editor, etc.)
- Answer questions about Optiflow's features and capabilities
- Offer best practices for workflow automation
- Provide troubleshooting and support for common issues

When speaking:
- Be concise and clear in your explanations
- Use simple, conversational language
- If you don't know something, be honest and offer to help find the answer
- Keep responses under 3-4 sentences when possible

The user is speaking to you through a voice interface, so keep your responses natural
and easy to follow in a conversational context.
"""

# Handle graceful shutdown
should_exit = False
agent_instance = None

def handle_shutdown_signal(sig, frame):
    global should_exit, agent_instance
    logger.info(f"Received signal {sig}, shutting down gracefully...")
    should_exit = True
    if agent_instance:
        logger.info("Disconnecting agent...")
        asyncio.create_task(agent_instance.disconnect())
    else:
        # Force exit if no agent instance
        sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, handle_shutdown_signal)
signal.signal(signal.SIGTERM, handle_shutdown_signal)

async def main():
    global agent_instance
    
    try:
        # Check for participants in the room first (to prevent duplicates)
        try:
            logger.info(f"Checking for existing agents in room {LIVEKIT_ROOM}...")
            # TODO: Implement actual check for existing agents in the room
            # This would require additional LiveKit APIs
        except Exception as check_err:
            logger.warning(f"Failed to check room participants: {check_err}")
        
        # Configure the agent with a retry mechanism
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries and not should_exit:
            try:
                logger.info(f"Creating agent (attempt {retry_count+1}/{max_retries})...")
                agent = VoiceAgent.create_voice_response_agent(
                    url=LIVEKIT_WS_URL,
                    api_key=LIVEKIT_API_KEY,
                    api_secret=LIVEKIT_API_SECRET,
                    identity="optiflow-agent",
                    name="Optiflow Voice Assistant",
                    llm=openai_llm,
                    tts=openai_voice,
                    vad=vad,
                    room_name=LIVEKIT_ROOM,
                    turn_detector=turn_detector,
                )
                
                # Set the system prompt
                agent.llm_conversation.system_message = SYSTEM_PROMPT
                
                # Store reference for shutdown handling
                agent_instance = agent
                
                # Log successful agent creation
                logger.info(f"Agent created, connecting to room: {LIVEKIT_ROOM}")
                
                # Add welcome message when users join
                @agent.on_user_joined
                async def on_user_joined(participant):
                    try:
                        logger.info(f"User joined: {participant.identity}")
                        await asyncio.sleep(1)  # Brief delay for better user experience
                        await agent.speak("Hello! I'm your Optiflow assistant. How can I help you today?")
                    except Exception as e:
                        logger.error(f"Error in welcome message: {e}")
                
                # Connect and run the agent
                await run_agent(agent)
                break  # If we get here without error, break the retry loop
                
            except Exception as e:
                retry_count += 1
                logger.error(f"Error running agent (attempt {retry_count}/{max_retries}): {e}", exc_info=True)
                if retry_count < max_retries and not should_exit:
                    logger.info(f"Retrying in 5 seconds...")
                    await asyncio.sleep(5)
                else:
                    logger.error("Maximum retries reached, giving up")
                    raise
    except Exception as e:
        logger.error(f"Fatal error in agent: {e}", exc_info=True)
        exit(1)

if __name__ == "__main__":
    try:
        # Run the agent
        logger.info(f"Starting LiveKit voice agent with URL: {LIVEKIT_WS_URL}")
        logger.info(f"Room name: {LIVEKIT_ROOM}")
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Agent stopped by user")
    except Exception as e:
        logger.error(f"Error running agent: {e}", exc_info=True)
        exit(1) 
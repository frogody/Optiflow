import asyncio
import os
import logging
import json
from dotenv import load_dotenv
import requests
import aiohttp
from livekit.agents import (
    JobContext,
    JobType,
    WorkerOptions,
    Agent,
    AgentSession,
    tts as lk_tts,
    stt as lk_stt,
    llm as lk_llm,
    tools as lk_tools,
)
from livekit.agents.utils import AudioEncoding
from livekit.agents.pipeline import llm_node, tts_node, stt_node
from livekit.plugins import openai as openai_plugin
from livekit.plugins import deepgram as deepgram_plugin
from livekit.plugins import elevenlabs as elevenlabs_plugin
import time
from livekit import agents
from livekit.plugins.openai import OpenAITTSPlugin, OpenAIASRPlugin, OpenAIChatCompletionPlugin
import traceback

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Environment variables
LIVEKIT_URL = os.getenv("LIVEKIT_URL") or "wss://isyncsosync-p1sl1ryj.livekit.cloud"
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY") or "APIcPGS63mCxqbP"
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET") or "AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWIcVbPLgyEB"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")  # Default: "Josh"
OPTIFLOW_BACKEND_URL = os.getenv("OPTIFLOW_BACKEND_URL")
OPTIFLOW_BACKEND_API_KEY = os.getenv("OPTIFLOW_BACKEND_API_KEY")
AGENT_EVENT_WEBHOOK_URL = os.getenv("AGENT_EVENT_WEBHOOK_URL")

# System prompt
SYSTEM_PROMPT = """
You are a helpful voice assistant for Optiflow. Your name is Jarvis.
When a user connects, always greet them right away with a friendly introduction.
Keep your responses clear and concise.
"""

# Setup plugins
asr_plugin = OpenAIASRPlugin(api_key=OPENAI_API_KEY)
tts_plugin = OpenAITTSPlugin(api_key=OPENAI_API_KEY, voice="alloy")
llm_plugin = OpenAIChatCompletionPlugin(
    api_key=OPENAI_API_KEY,
    model="gpt-4o",
    system_prompt=SYSTEM_PROMPT,
)

# --- Pipedream Tool Definition ---
class PipedreamActionTool(lk_tools.Tool):
    def __init__(self):
        super().__init__(
            name="execute_pipedream_action",
            description=(
                "Executes a specific action via Pipedream by calling the Optiflow backend. "
                "Use this for tasks like sending emails, creating calendar events, "
                "managing tasks in Asana/Jira, or interacting with CRMs. "
                "Specify the 'action_type' (e.g., 'send_email', 'create_asana_task') and "
                "necessary 'parameters'."
            ),
        )
        logger.info("PipedreamActionTool initialized.")

    async def arun(self, ctx: lk_tools.ToolContext, action_type: str, parameters: dict) -> str:
        logger.info(f"PipedreamTool called: action_type={action_type}, params={parameters}")
        
        if not OPTIFLOW_BACKEND_URL or not OPTIFLOW_BACKEND_API_KEY:
            error_msg = "Optiflow backend not configured for Pipedream actions."
            logger.error(error_msg)
            return json.dumps({"error": error_msg})
        
        # Get the user identity from the context
        user_identity = ctx.job.participant.identity if ctx.job.participant else None
        if not user_identity:
            error_msg = "User identity not found for Pipedream action."
            logger.error(error_msg)
            return json.dumps({"error": error_msg})
        
        payload = {
            "action_type": action_type,
            "parameters": parameters,
            "user_identity": user_identity
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPTIFLOW_BACKEND_API_KEY}"
        }
        
        try:
            logger.info(f"Calling Optiflow backend for Pipedream action: {action_type}")
            response = requests.post(
                f"{OPTIFLOW_BACKEND_URL}/api/pipedream/execute", 
                json=payload, 
                headers=headers, 
                timeout=30
            )
            response.raise_for_status()
            result = response.text
            logger.info(f"Pipedream action {action_type} executed successfully")
            return result
        except requests.RequestException as e:
            error_msg = f"Failed to execute Pipedream action: {str(e)}"
            logger.error(error_msg)
            return json.dumps({"error": error_msg})

# --- Knowledge Base Tool (Enhanced) ---
class KnowledgeBaseQueryTool(lk_tools.Tool):
    def __init__(self, backend_url=None, backend_api_key=None):
        super().__init__(
            name="query_knowledge_base",
            description=(
                "Queries the knowledge base for information. Used to retrieve information from company documentation, "
                "user-specific knowledge, team resources, or organization-wide content. "
                "Specify 'query_text' for the search query. "
                "Optionally specify 'kb_type' ('personal', 'team', or 'organization') to search specific knowledge bases."
            ),
        )
        self.backend_url = backend_url or os.getenv("OPTIFLOW_BACKEND_URL")
        self.backend_api_key = backend_api_key or os.getenv("OPTIFLOW_BACKEND_API_KEY")
        logger.info("KnowledgeBaseQueryTool initialized with backend URL")
    
    async def arun(self, ctx: lk_tools.ToolContext, query_text: str, kb_type: str = None) -> str:
        logger.info(f"KnowledgeBaseTool called: query='{query_text}', kb_type='{kb_type}'")
        
        if not self.backend_url or not self.backend_api_key:
            logger.warning("Backend URL or API key not configured, returning simulated response")
            return json.dumps({
                "results": [
                    f"Simulated knowledge base result for query: '{query_text}' in '{kb_type or 'all'}' KB."
                ]
            })
        
        # Extract user ID from context if available
        user_id = None
        try:
            if hasattr(ctx, "metadata") and "user_id" in ctx.metadata:
                user_id = ctx.metadata["user_id"]
        except Exception as e:
            logger.error(f"Error extracting user ID from context: {e}")
        
        try:
            # Prepare search parameters
            params = {
                "query": query_text,
                "userId": user_id,
            }
            
            # Add knowledge base type if specified
            if kb_type:
                params["knowledgeBaseType"] = kb_type
            
            # Make API request to backend
            headers = {
                "Authorization": f"Bearer {self.backend_api_key}",
                "Content-Type": "application/json"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.backend_url}/api/knowledge/search",
                    json=params,
                    headers=headers
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Error querying knowledge base: {response.status}, {error_text}")
                        return json.dumps({
                            "error": f"Failed to query knowledge base: {response.status}",
                            "results": []
                        })
                    
                    data = await response.json()
                    
                    # Format the results nicely for the agent
                    formatted_results = []
                    for doc in data.get("documents", []):
                        formatted_result = {
                            "title": doc.get("title", "Untitled Document"),
                            "content": doc.get("content", ""),
                            "source": doc.get("metadata", {}).get("source", "Unknown Source"),
                            "score": doc.get("similarity", 0)
                        }
                        formatted_results.append(formatted_result)
                    
                    if not formatted_results:
                        return json.dumps({
                            "message": f"No results found for query: '{query_text}'",
                            "results": []
                        })
                    
                    return json.dumps({
                        "message": f"Found {len(formatted_results)} relevant documents.",
                        "results": formatted_results
                    })
                    
        except Exception as e:
            logger.error(f"Error in KnowledgeBaseQueryTool: {e}")
            return json.dumps({
                "error": f"Error querying knowledge base: {str(e)}",
                "results": []
            })

async def send_agent_event(event_type, user_id, room_id):
    if not AGENT_EVENT_WEBHOOK_URL:
        return
    payload = {
        "event_type": event_type,
        "user_id": user_id,
        "room_id": room_id,
        "timestamp": int(time.time()),
    }
    try:
        async with aiohttp.ClientSession() as client:
            async with client.post(
                AGENT_EVENT_WEBHOOK_URL,
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as resp:
                if resp.status != 200:
                    logger.error(f"Failed to send agent event webhook: {resp.status} {await resp.text()}")
    except Exception as e:
        logger.error(f"Error sending agent event webhook: {e}")

class JarvisAgent:
    def __init__(self):
        try:
            # Initialize STT (Speech-to-Text)
            self.stt_plugin = deepgram_plugin.STT(api_key=DEEPGRAM_API_KEY) if DEEPGRAM_API_KEY else lk_stt.NoOpSTT()
            logger.info(f"STT initialized: {type(self.stt_plugin).__name__}")
            
            # Initialize LLM (Language Model)
            self.llm_plugin = openai_plugin.LLM(
                model="gpt-4-turbo-preview", 
                api_key=OPENAI_API_KEY
            ) if OPENAI_API_KEY else lk_llm.NoOpLLM()
            logger.info(f"LLM initialized: {type(self.llm_plugin).__name__}")
            
            # Initialize TTS (Text-to-Speech)
            self.tts_plugin = elevenlabs_plugin.TTS(
                api_key=ELEVENLABS_API_KEY,
                voice_id=ELEVENLABS_VOICE_ID,
                model_id="eleven_multilingual_v2"
            ) if ELEVENLABS_API_KEY else lk_tts.NoOpTTS()
            logger.info(f"TTS initialized: {type(self.tts_plugin).__name__}")
            
            # Initialize tools
            self.pipedream_tool = PipedreamActionTool()
            self.kb_tool = KnowledgeBaseQueryTool(backend_url=OPTIFLOW_BACKEND_URL, backend_api_key=OPTIFLOW_BACKEND_API_KEY)
            
            # Register tools with the LLM
            self.llm_plugin.tools = [self.pipedream_tool, self.kb_tool]
            
            logger.info("JarvisAgent fully initialized.")
        except Exception as e:
            logger.error(f"Error initializing JarvisAgent: {e}")
            logger.error(traceback.format_exc())
            raise

    async def process_job(self, job: JobContext):
        try:
            logger.info(f"JarvisAgent processing job: {job.id} for participant: {job.participant.identity if job.participant else 'N/A'}")
            
            # Parse metadata to extract user information and mem0 memory context
            metadata = {}
            memory_context = []
            user_id = None
            try:
                if job.metadata:
                    metadata = json.loads(job.metadata)
                    logger.info(f"Received metadata with job: {metadata.keys()}")
                    
                    # Extract memory context if available
                    if 'memoryContext' in metadata and isinstance(metadata['memoryContext'], list):
                        memory_context = metadata['memoryContext']
                        logger.info(f"Found memory context with {len(memory_context)} items")
                    
                    # Extract user ID for memory storage
                    if 'userId' in metadata:
                        user_id = metadata['userId']
                        logger.info(f"Using user ID from metadata: {user_id}")
            except Exception as e:
                logger.error(f"Error parsing metadata: {e}")
                # Continue without memory context
            
            # Create initial chat context
            initial_ctx = lk_llm.ChatContext()
            initial_ctx.append(
                role=lk_llm.ChatRole.SYSTEM,
                content=("You are Jarvis, a highly capable AI assistant for Optiflow. "
                        "Your primary user is an Optiflow user who is using your voice interface. "
                        "You can understand voice commands, execute tasks using available tools "
                        "(like Pipedream for external actions and a knowledge base for information retrieval), "
                        "and respond in a helpful, concise, and professional manner. "
                        "When a tool is used, summarize the outcome for the user. "
                        "If you need clarification, ask the user. "
                        "Always confirm actions before execution if they are irreversible or sensitive. "
                        "Keep your responses conversational but efficient.")
            )
            
            # Add memory context to enhance the assistant's knowledge of the user
            if memory_context and len(memory_context) > 0:
                memory_str = "\n\nHere is the conversation history with this user that you should use to provide continuity:\n"
                for memory_item in memory_context:
                    if isinstance(memory_item, dict) and 'content' in memory_item and 'role' in memory_item:
                        initial_ctx.append(
                            role=lk_llm.ChatRole.SYSTEM,
                            content=f"Previous conversation: {memory_item['role']}: {memory_item['content']}"
                        )
                logger.info("Enhanced prompt with memory context")
            
            # Create an AgentSession (v1.0 API)
            session = AgentSession(
                room=job.room,
                participant=job.participant,
                stt=self.stt_plugin,
                llm=self.llm_plugin,
                tts=self.tts_plugin,
                audio_encoding=AudioEncoding.PCM_S16LE,
                llm_context=initial_ctx
            )
            
            try:
                # Send welcome message
                welcome_message = "Hello, I'm Jarvis, your voice assistant for Optiflow. How can I help you today?"
                await session.tts.synthesize(welcome_message)
                
                # Start polling for user presence in the background
                presence_task = None
                if job.participant and job.room:
                    user_id = job.participant.identity
                    room_id = job.room.name
                    presence_task = asyncio.create_task(self.poll_user_presence(user_id, room_id, session))
                
                # Main conversation loop
                async for event in session.process_media():
                    # Event handling based on event type 
                    # V1.0 uses a different event model
                    if event.type == "transcript":
                        # User said something
                        logger.info(f"User said: {event.text}")
                    
                    elif event.type == "agent_speaking_started":
                        # Agent started speaking
                        logger.info("Agent started speaking")
                    
                    elif event.type == "agent_speaking_finished":
                        # Agent finished speaking
                        logger.info("Agent finished speaking")
                    
                    elif event.type == "error":
                        # Handle errors
                        logger.error(f"Error in session: {event.error}")
                
                # Cleanup tasks
                if presence_task:
                    presence_task.cancel()
                    
            except Exception as e:
                error_msg = f"Error in agent processing: {e}"
                logger.error(error_msg, exc_info=True)
                
                try:
                    # Notify the frontend of the error
                    await session.send_data(json.dumps({
                        "type": "error",
                        "message": "An internal error occurred with the agent."
                    }))
                    
                    # Also try to speak the error if TTS is available
                    await session.tts.synthesize("I'm sorry, but I've encountered an internal error. Please try reconnecting.")
                except Exception as send_e:
                    logger.error(f"Failed to send error to client: {send_e}")
        except Exception as e:
            error_msg = f"Error in agent processing: {e}"
            logger.error(error_msg, exc_info=True)
            logger.error(traceback.format_exc())
            try:
                # Notify the frontend of the error
                await session.send_data(json.dumps({
                    "type": "error",
                    "message": "An internal error occurred with the agent."
                }))
                # Also try to speak the error if TTS is available
                await session.tts.synthesize("I'm sorry, but I've encountered an internal error. Please try reconnecting.")
            except Exception as send_e:
                logger.error(f"Failed to send error to client: {send_e}")
        finally:
            logger.info(f"Agent processing finished for job {job.id}.")
            await session.close()
    
    async def poll_user_presence(self, user_id, room_id, session: AgentSession):
        """Poll the Optiflow backend for user presence. If inactive, end the session."""
        poll_interval = 30  # seconds
        inactivity_limit = 10 * 60  # 10 minutes in seconds
        last_active = time.time()
        while True:
            try:
                async with aiohttp.ClientSession() as client:
                    async with client.post(
                        f"{OPTIFLOW_BACKEND_URL}/api/presence/check",
                        json={"userId": user_id},
                        headers={"Content-Type": "application/json"}
                    ) as resp:
                        data = await resp.json()
                        if not data.get("inactive", False):
                            last_active = time.time()
                        else:
                            # If inactive for more than inactivity_limit, end session
                            if time.time() - last_active > inactivity_limit:
                                logger.info(f"[AGENT LEAVE] User {user_id} inactive for over 10 minutes. Jarvis agent leaving room: {room_id}")
                                await send_agent_event("agent_leave", user_id, room_id)
                                
                                await session.send_data(json.dumps({
                                    "type": "agent_status",
                                    "status": "leaving_room",
                                    "reason": "user_inactive"
                                }))
                                
                                await session.tts.synthesize("I'll be here when you return. Goodbye!")
                                await session.close()
                                return
            except Exception as e:
                logger.error(f"Error polling user presence: {e}")
            await asyncio.sleep(poll_interval)

async def request_fnc(job_request: JobContext):
    logger.info(f"Received job request: {job_request.id}, type: {job_request.type}")
    
    if job_request.type == JobType.JT_AGENT:
        agent = JarvisAgent()
        await agent.process_job(job_request)
    else:
        logger.warning(f"Unhandled job type: {job_request.type}")

async def run_agent_worker():
    if not LIVEKIT_URL:
        raise ValueError("LIVEKIT_URL is not set in environment variables.")
    
    worker_opts = WorkerOptions(
        request_handler=request_fnc,
    )
    
    logger.info(f"Starting Jarvis Agent Worker, connecting to LiveKit: {LIVEKIT_URL}")
    
    # This is placeholder code - you would use the livekit-server agent CLI in production
    # For example: livekit-server agent run main_agent:request_fnc --url $LIVEKIT_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET
    
    print("Jarvis Agent Worker defined. To run:")
    print("1. Ensure all .env variables are set (LIVEKIT_URL, API keys, etc.).")
    print("2. Use LiveKit CLI: `livekit-server agent run main_agent:request_fnc --url $LIVEKIT_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET`")

# Initialize agent with new v2 structure
async def main():
    # Get API keys from environment
    livekit_api_key = os.environ.get("LIVEKIT_API_KEY")
    livekit_api_secret = os.environ.get("LIVEKIT_API_SECRET")
    openai_api_key = os.environ.get("OPENAI_API_KEY")
    
    # Create plugins using v2 syntax
    asr_plugin = OpenAIASRPlugin(api_key=openai_api_key)
    tts_plugin = OpenAITTSPlugin(api_key=openai_api_key, voice="alloy")
    llm_plugin = OpenAIChatCompletionPlugin(
        api_key=openai_api_key,
        model="gpt-4-turbo",
        system_prompt="You are an AI assistant helping users with their questions.",
    )
    
    # Define tools the agent can use
    tools = [
        {
            "name": "get_weather",
            "description": "Get the weather for a specific location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The location to get weather for"
                    }
                },
                "required": ["location"]
            }
        }
    ]
    
    # Set up agent session with pipeline nodes
    agent_session = agents.AgentSession(
        livekit_url=os.environ.get("LIVEKIT_URL"),
        api_key=livekit_api_key,
        api_secret=livekit_api_secret,
        identity="voice-agent",
    )
    
    # Create pipeline with nodes
    pipeline = agent_session.create_pipeline(room_name="test-room")
    
    # Add nodes to pipeline
    pipeline.add_node(agents.nodes.AudioTranscriptionNode(plugin=asr_plugin))
    pipeline.add_node(agents.nodes.ChatCompletionNode(plugin=llm_plugin, tools=tools))
    pipeline.add_node(agents.nodes.TextToSpeechNode(plugin=tts_plugin))
    
    # Define tool implementations
    async def get_weather(location):
        return f"The weather in {location} is sunny and 75 degrees."
    
    # Register tool handlers
    pipeline.register_tool("get_weather", get_weather)
    
    # Start the pipeline
    await pipeline.start()
    
    # Keep the agent running
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down agent...")
    finally:
        await pipeline.stop()

if __name__ == "__main__":
    print("Jarvis Voice Agent Script")
    print("========================")
    print("This script defines the agent worker to be used with LiveKit.")
    print("To run this agent, use the LiveKit CLI command as shown below:")
    print("livekit-server agent run main_agent:request_fnc --url [LIVEKIT_URL] --api-key [LIVEKIT_API_KEY] --api-secret [LIVEKIT_API_SECRET]")
    
    # The following is not necessary if using the livekit-server CLI to run the agent
    # It's here for manual testing or direct execution in development
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Agent worker stopped by user.")
    except Exception as e:
        logger.error(f"Error running agent worker: {e}", exc_info=True)
        logger.error(traceback.format_exc())
        print(f"Error: {e}") 
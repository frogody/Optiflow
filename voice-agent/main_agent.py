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
from livekit.plugins import openai as openai_plugin
from livekit.plugins import deepgram as deepgram_plugin
from livekit.plugins import elevenlabs as elevenlabs_plugin
import time

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("jarvis_agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# --- Configuration ---
LIVEKIT_WS_URL = os.getenv("LIVEKIT_WS_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")  # Default: "Josh"
OPTIFLOW_BACKEND_URL = os.getenv("OPTIFLOW_BACKEND_URL")
OPTIFLOW_BACKEND_API_KEY = os.getenv("OPTIFLOW_BACKEND_API_KEY")
AGENT_EVENT_WEBHOOK_URL = os.getenv("AGENT_EVENT_WEBHOOK_URL")

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

class JarvisAgent(Agent):
    def __init__(self):
        super().__init__()
        
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
                                # TODO: Send agent leave event to monitoring/analytics service
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

    async def _main_agent_loop(self, session: AgentSession):
        user_id = session.participant.identity if session.participant else None
        room_id = session.room.name if session.room else None
        logger.info(f"[AGENT JOIN] Jarvis agent joining room: {room_id} for user: {user_id}")
        await send_agent_event("agent_join", user_id, room_id)
        initial_prompt = (
            "You are Jarvis, a highly capable AI assistant for Optiflow. "
            "Your primary user is an Optiflow user who is using your voice interface. "
            "You can understand voice commands, execute tasks using available tools "
            "(like Pipedream for external actions and a knowledge base for information retrieval), "
            "and respond in a helpful, concise, and professional manner. "
            "When a tool is used, summarize the outcome for the user. "
            "If you need clarification, ask the user. "
            "Always confirm actions before execution if they are irreversible or sensitive. "
            "Keep your responses conversational but efficient."
        )
        
        # Initialize chat history
        chat_history = [lk_llm.ChatMessage(role=lk_llm.ChatRole.SYSTEM, content=initial_prompt)]
        
        # Send welcome message
        welcome_message = "Hello, I'm Jarvis, your voice assistant for Optiflow. How can I help you today?"
        await session.tts.synthesize(welcome_message)
        await session.send_data(json.dumps({
            "type": "agent_transcript", 
            "transcript": welcome_message
        }))
        
        # Start polling for user presence in the background
        presence_task = None
        if user_id and room_id:
            presence_task = asyncio.create_task(self.poll_user_presence(user_id, room_id, session))
        
        # Main conversation loop
        user_input_audio_stream = await session.stt.stream()
        async for event in user_input_audio_stream:
            if event.type == lk_stt.SpeechDataEvent.FINAL_TRANSCRIPT:
                user_query = event.alternatives[0].text
                if not user_query.strip():
                    continue  # Skip empty transcripts
                
                logger.info(f"User said: {user_query}")
                
                # Send user transcript to frontend
                await session.send_data(json.dumps({
                    "type": "user_transcript", 
                    "transcript": user_query
                }))
                
                # Add user message to chat history
                chat_history.append(lk_llm.ChatMessage(role=lk_llm.ChatRole.USER, content=user_query))
                
                # Stream response from LLM to TTS
                llm_stream = await self.llm_plugin.chat(history=chat_history)
                tts_input_stream = lk_tts.SynthesizeStream()
                await session.tts.play(tts_input_stream)
                
                full_response_text = ""
                async for llm_event in llm_stream:
                    if llm_event.type == lk_llm.LLMChunkEvent.CHUNK:
                        full_response_text += llm_event.text
                        tts_input_stream.push_text(llm_event.text)
                
                tts_input_stream.mark_segment_end()
                
                # Add assistant message to chat history
                chat_history.append(lk_llm.ChatMessage(
                    role=lk_llm.ChatRole.ASSISTANT, 
                    content=full_response_text
                ))
                
                # Send agent transcript to frontend
                await session.send_data(json.dumps({
                    "type": "agent_transcript", 
                    "transcript": full_response_text
                }))
                
                logger.info(f"Jarvis responded: {full_response_text}")
                
            elif event.type == lk_stt.SpeechDataEvent.ERROR:
                error_msg = f"Speech recognition error: {event.error}"
                logger.error(error_msg)
                await session.send_data(json.dumps({
                    "type": "error", 
                    "message": error_msg
                }))
                
                # Also synthesize the error message
                await session.tts.synthesize("I'm having trouble understanding you. Could you try again?")
                break
            finally:
                if presence_task:
                    presence_task.cancel()
                logger.info(f"[AGENT LEAVE] Jarvis agent leaving room: {room_id} for user: {user_id}")
                await send_agent_event("agent_leave", user_id, room_id)

    async def process_job(self, job: JobContext):
        logger.info(f"JarvisAgent processing job: {job.id} for participant: {job.participant.identity if job.participant else 'N/A'}")
        
        session = AgentSession(
            agent=self,
            room=job.room,
            participant=job.participant,  # The user participant this agent is serving
            stt=self.stt_plugin,
            llm=self.llm_plugin,
            tts=self.tts_plugin,
            audio_encoding=AudioEncoding.PCM_S16LE,
            audio_publish_options=None,  # Agent typically doesn't publish its own mic
        )
        
        try:
            await self._main_agent_loop(session)
        except Exception as e:
            error_msg = f"Error in agent processing loop: {e}"
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
        finally:
            logger.info(f"Agent processing finished for job {job.id}.")

async def request_fnc(job_request: JobContext):
    logger.info(f"Received job request: {job_request.id}, type: {job_request.type}")
    
    if job_request.type == JobType.JT_AGENT:
        agent = JarvisAgent()
        await agent.process_job(job_request)
    else:
        logger.warning(f"Unhandled job type: {job_request.type}")

async def run_agent_worker():
    if not LIVEKIT_WS_URL:
        raise ValueError("LIVEKIT_WS_URL is not set in environment variables.")
    
    worker_opts = WorkerOptions(
        request_handler=request_fnc,
    )
    
    logger.info(f"Starting Jarvis Agent Worker, connecting to LiveKit: {LIVEKIT_WS_URL}")
    
    # This is placeholder code - you would use the livekit-server agent CLI in production
    # For example: livekit-server agent run main_agent:request_fnc --url $LIVEKIT_WS_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET
    
    print("Jarvis Agent Worker defined. To run:")
    print("1. Ensure all .env variables are set (LIVEKIT_WS_URL, API keys, etc.).")
    print("2. Use LiveKit CLI: `livekit-server agent run main_agent:request_fnc --url $LIVEKIT_WS_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET`")

if __name__ == "__main__":
    print("Jarvis Voice Agent Script")
    print("========================")
    print("This script defines the agent worker to be used with LiveKit.")
    print("To run this agent, use the LiveKit CLI command as shown below:")
    print("livekit-server agent run main_agent:request_fnc --url [LIVEKIT_WS_URL] --api-key [LIVEKIT_API_KEY] --api-secret [LIVEKIT_API_SECRET]")
    
    # The following is not necessary if using the livekit-server CLI to run the agent
    # It's here for manual testing or direct execution in development
    try:
        asyncio.run(run_agent_worker())
    except KeyboardInterrupt:
        print("Agent worker stopped by user.")
    except Exception as e:
        logger.error(f"Error running agent worker: {e}", exc_info=True)
        print(f"Error: {e}") 
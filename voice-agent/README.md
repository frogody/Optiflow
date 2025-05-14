# Jarvis Voice Agent for Optiflow

A LiveKit-based voice agent implementation that provides a Jarvis-like voice assistant experience for the Optiflow application.

## Overview

This voice agent integrates with:
- **LiveKit** for WebRTC audio streaming
- **Deepgram** for speech-to-text (STT)
- **OpenAI GPT-4** for natural language understanding and generation
- **ElevenLabs** for high-quality text-to-speech (TTS)
- **Optiflow Backend** for executing actions through Pipedream integrations

## Setup

### Prerequisites

- Python 3.9+
- Access to a LiveKit server instance
- API keys for Deepgram, OpenAI, and ElevenLabs
- Optiflow backend with Pipedream integration capabilities

### Installation

1. Create a Python virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file based on the provided `env.example`:
   ```
   cp env.example .env
   ```

4. Edit the `.env` file with your actual API keys and configuration values.

## Running the Agent

### Using LiveKit CLI (Recommended for Production)

The agent is designed to be run with the `livekit-server` CLI:

```bash
livekit-server agent run main_agent:request_fnc --url $LIVEKIT_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET
```

### For Development/Testing

You can also run the script directly for development purposes:

```bash
python main_agent.py
```

This will output instructions on how to properly run the agent with LiveKit CLI.

## Environment Variables

Key environment variables include:

- `LIVEKIT_URL`: WebSocket URL for your LiveKit server
- `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`: Authentication credentials for LiveKit
- `OPENAI_API_KEY`: API key for OpenAI
- `DEEPGRAM_API_KEY`: API key for Deepgram
- `ELEVENLABS_API_KEY`: API key for ElevenLabs
- `ELEVENLABS_VOICE_ID`: (Optional) Voice ID for ElevenLabs, defaults to "Josh"
- `OPTIFLOW_BACKEND_URL`: URL for the Optiflow backend
- `OPTIFLOW_BACKEND_API_KEY`: Shared API key for the agent to authenticate with the Optiflow backend

## Integration with Optiflow

The agent connects to the Optiflow backend to execute Pipedream actions for users. When the agent is running, it joins LiveKit rooms when dispatched, listens to user commands, and responds with voice.

The Optiflow backend is responsible for:
1. Creating LiveKit rooms
2. Generating and providing tokens for clients
3. Dispatching agents to rooms
4. Executing Pipedream actions requested by the agent

## Tools Implementation

### PipedreamActionTool

Enables the agent to execute Pipedream workflows via Optiflow backend. This enables actions like:
- Sending emails
- Creating calendar events
- Managing tasks in Asana/Jira
- Interacting with CRMs

### KnowledgeBaseQueryTool (Placeholder)

Placeholder for a future implementation of knowledge retrieval. Will allow the agent to:
- Query company-wide knowledge
- Query user-specific knowledge

## Logging

The agent logs all activities to both the console and a `jarvis_agent.log` file for debugging and monitoring.

## Security Considerations

- API keys are stored in `.env` and loaded via `dotenv`
- The agent authenticates with the Optiflow backend using `OPTIFLOW_BACKEND_API_KEY`
- User identity is passed to maintain proper access control
- Always confirm potentially destructive actions before execution 
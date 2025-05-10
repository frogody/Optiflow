# Jarvis Voice Agent Integration for Optiflow

This document provides instructions for setting up and deploying the Jarvis voice agent feature within the Optiflow application.

## Overview

The Jarvis voice agent is a LiveKit-based voice assistant that allows users to interact with Optiflow using voice commands. The agent can:

- Process natural language voice commands
- Execute actions through Pipedream integrations
- Access knowledge bases for information retrieval
- Provide voice responses using high-quality text-to-speech

## Architecture

The system consists of two main components:

1. **Frontend Voice Interface**: A React component in the Optiflow Next.js application that handles:
   - WebRTC audio streaming via LiveKit
   - User interface for voice interactions
   - Voice visualization and transcripts

2. **Voice Agent Service**: A Python-based LiveKit agent that handles:
   - Speech-to-text processing (Deepgram)
   - Natural language understanding (OpenAI GPT-4)
   - Text-to-speech generation (ElevenLabs)
   - Executing actions via the Optiflow backend

## Prerequisites

- LiveKit server instance
- API keys for:
  - OpenAI (GPT-4)
  - Deepgram (speech-to-text)
  - ElevenLabs (text-to-speech)
- Pipedream account with configured workflows
- Python 3.9+ for the agent service

## Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your Optiflow Next.js application's `.env` file:

```env
# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud

# Backend Agent Communication
OPTIFLOW_BACKEND_API_KEY=shared_secret_key_for_agent_backend_communication
```

### 2. Deploy the Voice Agent Service

The voice agent service is located in the `voice-agent` directory.

1. Create a Python virtual environment:

```bash
cd voice-agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on the provided example:

```bash
cp env.example .env
```

4. Edit the `.env` file with your API keys and configuration.

5. Run the agent with LiveKit CLI (for production):

```bash
livekit-server agent run main_agent:request_fnc --url $LIVEKIT_WS_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET
```

For development or testing, you can run directly:

```bash
python main_agent.py
```

### 3. Deploying to Production

#### Frontend

The frontend components are automatically deployed with your Optiflow Next.js application to Vercel.

#### Agent Service

For production, deploy the agent service using one of these methods:

1. **Docker Deployment**:
   - Create a Dockerfile in the `voice-agent` directory
   - Build and push to your container registry
   - Deploy to your preferred container platform (AWS ECS, GCP Cloud Run, etc.)

2. **Serverless Deployment**:
   - Package the agent code for serverless platforms
   - Deploy to AWS Lambda, Google Cloud Functions, or similar

## Usage

1. Navigate to `/voice-agent` in the Optiflow application
2. Click "Connect to Jarvis"
3. Once connected, start speaking or type commands in the text box
4. The agent will respond with voice and show transcripts in the conversation window

## Example Commands

- "Send an email to my team about the project status"
- "Create a task in Asana for the website redesign"
- "What's on my calendar for tomorrow?"
- "Summarize my recent notifications"

## Security Considerations

- The agent service authenticates with the Optiflow backend using a shared API key
- User identity is preserved to maintain proper access control
- Sensitive actions require confirmation before execution
- API keys are securely stored as environment variables

## Troubleshooting

### Common Issues

1. **Voice agent not connecting**:
   - Check that LiveKit server is accessible
   - Verify API keys are correctly set
   - Check browser microphone permissions

2. **Agent not responding to voice**:
   - Ensure Deepgram API key is valid
   - Check microphone levels and background noise
   - Verify browser WebRTC support

3. **Actions not executing**:
   - Verify Pipedream connections are properly set up
   - Check user has authorized necessary integrations
   - Review logs for specific error messages

### Logs

- Frontend logs: Browser console
- Agent logs: `jarvis_agent.log` in the agent service directory

## Future Enhancements

- Support for more voice commands and actions
- Improved knowledge base integration
- Voice customization options
- Multi-language support

## Support

For questions or support with the voice agent integration, contact the Optiflow development team. 

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
livekit-server agent run main_agent:request_fnc --url $LIVEKIT_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET
```
# Optiflow LiveKit Voice Agent

This is a voice-enabled agent for Optiflow that uses LiveKit to enable real-time voice interactions. The agent can help users create workflows and send messages through voice commands.

## Features

- Real-time voice interaction using LiveKit
- Create workflows by describing them verbally
- Send messages to various services (Slack, Email, etc.)
- Uses advanced AI models for speech recognition and natural language understanding

## Requirements

- Python 3.8 or higher
- LiveKit account and credentials
- OpenAI API key
- Deepgram API key

## Installation

1. Make sure you have Python 3.8+ installed
2. Set up your environment variables in `.env` file or export them:

```bash
LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
OPENAI_API_KEY=your-openai-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
OPTIFLOW_API_BASE=https://your-optiflow-instance.com
```

3. Install the requirements:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

You can start the agent using the provided script:

```bash
./start-python-agent.sh
```

Or run it directly:

```bash
python agent.py dev --log-level=debug
```

## Connecting to the Agent

1. Navigate to your Optiflow application
2. Go to the Voice Agent page
3. Grant microphone permissions when prompted
4. Wait for the agent to connect
5. Start speaking to the agent

## Agent Commands

The agent understands commands like:

- "Create a workflow called [name] with [number] steps"
- "Send a message to [recipient] via [service] saying [content]"
- General questions about Optiflow

## Troubleshooting

- If the agent doesn't respond, check that your microphone is working and has permission
- Verify that your API keys are correct in the environment variables
- Check the logs for any errors
- Make sure your browser supports AudioContext and WebRTC

## Switching from JavaScript to Python

The Python implementation of LiveKit Agents is more stable and feature-complete than the JavaScript version. If you were previously using the JavaScript version and are switching to Python:

1. Stop any running JavaScript agent servers
2. Ensure Python 3.8+ is installed
3. Run `./start-python-agent.sh` to start the Python agent
4. The frontend connection method remains the same 
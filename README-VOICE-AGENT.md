# LiveKit Website Guide Voice Agent

This agent is a stateless website guide for IYCNSO, built with LiveKit Agents and ElevenLabs TTS. It greets users, explains IYCNSO, and offers to route users to different pages on your website. If the user confirms, it issues a navigation command for your frontend to handle.

## Requirements
- Python 3.11+
- Environment variables set for LiveKit and ElevenLabs (see `.env`)

## Running Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the agent:
   ```bash
   python website_guide_agent.py
   ```

## Deploying with Docker

1. Build the image:
   ```bash
   docker build -t website-guide-agent .
   ```
2. Run the container:
   ```bash
   docker run --env-file .env website-guide-agent
   ```

## Production Notes
- The agent is stateless and does not require user IDs or persistent memory.
- Frontend should listen for `ROUTE: /page-path` in the agent's response to trigger navigation.

## References
- [LiveKit Agents Docs](https://docs.livekit.io/agents/)
- [LiveKit + ElevenLabs TTS](https://docs.livekit.io/agents/integrations/elevenlabs/) 
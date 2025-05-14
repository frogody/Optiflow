# Voice Agent Deployment Guide

## Overview
The 404 error on https://voice-agent-699x03ut-isyncso.vercel.app is because the voice agent is a Python application that cannot run on Vercel's serverless platform. This guide will walk you through properly deploying the voice agent to a container platform and updating the web application to connect to it.

## Step 1: Configure Environment Variables

Create a `.env` file in the `voice-agent` directory with the following variables:

```bash
# LiveKit Configuration
LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud
LIVEKIT_API_KEY=APIDsO77tjLY9cj
LIVEKIT_API_SECRET=3jUzWuEsgp2Y7nDkqEE7V4aGQzGgNpnEdyPOJ6zRUYFA

# AI Services
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Optiflow Backend
OPTIFLOW_BACKEND_URL=https://app.isyncso.com
OPTIFLOW_BACKEND_API_KEY=your_backend_api_key
```

Replace the placeholder values with your actual API keys.

## Step 2: Deploy the Voice Agent to Render.com

Render.com is recommended for its ease of use with Docker deployments:

1. Sign up for a [Render.com](https://render.com) account
2. Create a new Web Service
3. Select "Deploy an existing image from a registry"
4. Set up a Docker registry or use Render's built-in registry
5. Build and push the Docker image:

```bash
cd voice-agent
docker build -t registry.render.com/your-account/optiflow-voice-agent:latest .
docker push registry.render.com/your-account/optiflow-voice-agent:latest
```

6. In Render.com, set the image URL to `registry.render.com/your-account/optiflow-voice-agent:latest` 
7. Add all the environment variables from your `.env` file
8. Set the health check path to `/health`
9. Deploy the service

## Step 3: Update the Web Application Configuration

After deployment, update the web application's environment variables to point to your new voice agent deployment:

1. Add the deployed voice agent URL to your web application's environment:

```bash
NEXT_PUBLIC_VOICE_AGENT_URL=https://your-voice-agent-service.onrender.com
```

2. Deploy the web application to Vercel:

```bash
npm run build
vercel deploy --prod
```

## Step 4: Test the Deployment

1. Go to your Vercel-deployed web application
2. Navigate to the voice agent interface
3. Click "Connect to Sync"
4. Verify that the agent responds with audio

## Troubleshooting

### If the agent doesn't connect:

1. Check that the LiveKit credentials are correct in both the web app and voice agent
2. Verify the CORS settings on the voice agent allow requests from your web app domain
3. Check the logs in the Render.com dashboard for any errors

### If there's no audio:

1. Ensure the required API keys for OpenAI, Deepgram, and ElevenLabs are correctly set
2. Check browser console for any WebSocket connection errors
3. Verify microphone permissions in the browser

## Alternative Deployment Options

- **Fly.io**: Similar to Render.com but with a global edge network
- **Google Cloud Run**: Good for scaling and integration with Google Cloud
- **AWS ECS/Fargate**: More complex but provides deep integration with AWS services

## Security Considerations

- Ensure your API keys are properly secured as environment variables
- Set up authentication for the voice agent API endpoints
- Use HTTPS for all communication between services

For any additional help, refer to the [Voice Agent README](./voice-agent/README.md) or [VOICE_AGENT_DEBUG.md](./VOICE_AGENT_DEBUG.md). 
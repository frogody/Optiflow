# Optiflow Voice Agent

This repository contains the voice agent for Optiflow, powered by LiveKit. The agent can understand natural language commands, respond to queries, and perform actions using tools.

## Deployment Instructions

The voice agent is a Python application that should be deployed as a Docker container to a platform that supports containerized applications like Render.com, Fly.io, or Google Cloud Run.

### Prerequisites

- [Docker](https://www.docker.com/get-started/) installed on your machine
- API keys for LiveKit, OpenAI, Deepgram, and ElevenLabs
- Access to a container registry (Docker Hub, Render.com registry, etc.)

### Step 1: Configure Environment Variables

Create a `.env` file in the `voice-agent` directory based on the `env.example` template:

```bash
# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# AI Services
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL  # Default: "Josh" voice

# Optiflow Backend (optional)
OPTIFLOW_BACKEND_URL=https://your-optiflow-instance.com
OPTIFLOW_BACKEND_API_KEY=your_shared_api_key_with_optiflow_backend
```

### Step 2: Build and Deploy the Docker Container

#### Build and Test Locally

```bash
cd voice-agent
docker build -t optiflow-voice-agent:latest .
docker run -p 8000:8000 --env-file .env optiflow-voice-agent:latest
```

You can now access the health check endpoint at http://localhost:8000/health to verify the configuration.

#### Deploy to Render.com

1. Sign up for a [Render.com](https://render.com) account
2. Create a new Web Service
3. Select "Deploy an existing image from a registry"
4. Push your Docker image to a registry:

```bash
docker tag optiflow-voice-agent:latest registry.render.com/your-account/optiflow-voice-agent:latest
docker push registry.render.com/your-account/optiflow-voice-agent:latest
```

5. In Render.com, set the image URL to `registry.render.com/your-account/optiflow-voice-agent:latest`
6. Add all the environment variables from your `.env` file
7. Set the health check path to `/health`
8. Deploy the service

### Step 3: Update the Web Application

After deploying the voice agent, update the web application environment variables to connect to it:

1. Add the deployed voice agent URL to your web application's environment:

```bash
NEXT_PUBLIC_VOICE_AGENT_URL=https://your-voice-agent-service.onrender.com
```

2. Deploy the web application:

```bash
npm run build
vercel deploy --prod
```

## Testing the Deployment

1. Access the web application
2. Navigate to the voice agent interface
3. Click "Connect to Sync"
4. Verify that the agent responds with audio

## Troubleshooting

### If the agent doesn't connect:

1. Check the health endpoint of your agent service for any configuration issues
2. Verify that all required API keys are set
3. Check the CORS settings if you're seeing cross-origin errors
4. Examine the browser console and agent logs for errors

### If there's no audio:

1. Ensure microphone permissions are granted in the browser
2. Check that the ElevenLabs API key is valid
3. Verify WebSocket connections in the browser network panel

## Using the Test Tools

We provide two test tools to help with deployment:

1. `test-agent.py` - A local FastAPI server that tests the configuration
2. `voice-agent-test.html` - A web page to test agent endpoints

Run the local test server with:
```bash
python test-agent.py
```

Then open `voice-agent-test.html` in your browser to test the deployment.

## Alternative Deployment Options

- **Fly.io**: Deploy with `flyctl deploy`
- **Google Cloud Run**: Deploy using `gcloud run deploy`
- **AWS ECS/Fargate**: Deploy using AWS CLI or Console

For any issues, please refer to the [Voice Agent Debug Guide](./VOICE_AGENT_DEBUG.md).

# Voice Agent Integration

## AWS API Gateway Integration

The voice agent now uses an AWS API Gateway for secure communication. To set up the AWS API Gateway:

1. Run the setup script to generate an API key and configure your environment:
   ```bash
   ./setup-aws-api-key.sh
   ```

2. Verify the AWS API Gateway configuration:
   ```bash
   ./test-aws-api-gateway.js
   ```

3. Make sure the following environment variables are set:
   - `NEXT_PUBLIC_AWS_API_KEY`: Your API Gateway key
   - `NEXT_PUBLIC_AWS_API_ENDPOINT`: The API Gateway endpoint (e.g., 'sfd8q2ch3k.execute-api.us-east-2.amazonaws.com')

See [AWS_API_GATEWAY_SETUP.md](./AWS_API_GATEWAY_SETUP.md) for detailed setup instructions.

## Troubleshooting

If you're experiencing 403 Forbidden errors when accessing the AWS API Gateway:

1. Verify your API key is set correctly in the environment variables
2. Make sure the API key is being sent with the `x-api-key` header
3. Validate API Gateway permissions in AWS console

Run the test script to diagnose issues:
```bash
./test-aws-api-gateway.js
``` 
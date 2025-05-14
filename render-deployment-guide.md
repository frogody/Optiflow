# Deploying Voice Agent to Render.com

This guide walks you through deploying the Optiflow Voice Agent to Render.com.

## Prerequisites
- Docker installed locally
- Docker Hub account (optional but recommended)
- Your voice agent Docker image built (using the build-and-deploy.sh script)

## Step 1: Push Docker Image to Registry

If you haven't already, push your Docker image to a registry:

1. Set your Docker Hub username in the build-and-deploy.sh script:
```bash
REGISTRY="yourusername"  # Your Docker Hub username
```

2. Run the build script:
```bash
cd voice-agent
./build-and-deploy.sh
```

3. This will prompt you to log in to Docker Hub and will push the image.

## Step 2: Create a Web Service on Render.com

1. Sign up or log in to [Render.com](https://render.com)
2. From your dashboard, click "New +" and select "Web Service"
3. In the creation form, select "Deploy an existing image"
4. For the image URL, enter: `yourusername/optiflow-voice-agent:latest`
   (Replace yourusername with your Docker Hub username)
5. Give your service a name (e.g., "optiflow-voice-agent")
6. Select a plan (the starter plan should be sufficient for testing)
7. Under Advanced settings:
   - Set health check path to: `/health`
   - Add all environment variables from your `.env` file:
     - LIVEKIT_URL
     - LIVEKIT_API_KEY
     - LIVEKIT_API_SECRET
     - OPENAI_API_KEY (if using OpenAI features)
     - DEEPGRAM_API_KEY (if using speech recognition)
     - ELEVENLABS_API_KEY (if using voice synthesis)
     - ELEVENLABS_VOICE_ID (if using voice synthesis)
     - OPTIFLOW_BACKEND_URL
     - OPTIFLOW_BACKEND_API_KEY

8. Click "Create Web Service"

Render will pull your image from Docker Hub and start the service. It may take a few minutes for the initial deploy.

## Step 3: Test the Deployment

1. Once the deployment is complete, Render will provide a URL for your service (e.g., `https://optiflow-voice-agent.onrender.com`)
2. Test the health check endpoint:
```bash
curl https://optiflow-voice-agent.onrender.com/health
```

3. The response should look like:
```json
{
  "status": "healthy",
  "config": {
    "livekit_url": "****://your-livekit-url",
    "has_livekit_api_key": true,
    "has_livekit_api_secret": true,
    "has_openai_api_key": true,
    "has_elevenlabs_api_key": true,
    "has_deepgram_api_key": true
  },
  "version": "1.0.0",
  "timestamp": 1621234567.89
}
```

## Step 4: Update Web Application

1. Go to your Vercel dashboard for the web application
2. Navigate to "Settings" → "Environment Variables"
3. Add a new environment variable:
   - Name: `NEXT_PUBLIC_VOICE_AGENT_URL`
   - Value: `https://optiflow-voice-agent.onrender.com` (your Render URL)
4. Save changes and deploy the web application:
```bash
vercel deploy --prod
```

5. Your web application should now connect to the voice agent deployed on Render.

## Troubleshooting

- **403 Forbidden errors**: Check that your API keys are correctly set in the environment variables
- **Connection timeouts**: Ensure your Render service is running and network connectivity is working
- **CORS errors**: The agent is configured to accept requests from your web application domain

### Logs

You can view logs for your service in the Render dashboard under your service → Logs. 
# Voice Agent Deployment Instructions

## Overview
The voice agent needs to be deployed as a Docker container service on Render.com, while the web application should be deployed on Vercel.

## Step 1: Voice Agent Deployment to Render.com

### 1.1. Sign up/Login to Render.com
1. Go to [Render.com](https://render.com) and sign up or log in
2. Click "New" and select "Web Service"

### 1.2. Configure the Web Service
1. For "Public Git repository", enter: `https://github.com/frogody/optiflow-voice-agent`
2. Fill in the following details:
   - **Name**: `optiflow-voice-agent`
   - **Region**: Choose closest to your users (e.g., `US East`)
   - **Branch**: `main`
   - **Runtime**: `Docker`
   - **Instance Type**: "Starter" should be sufficient (512 MB RAM, $7/month)
   - **Health Check Path**: `/health`

### 1.3. Set Environment Variables
Add the following environment variables (click "Advanced" → "Add Environment Variable"):

```
LIVEKIT_URL=wss://isyncsosync-p1sl1ryj.livekit.cloud
LIVEKIT_API_KEY=APIDsO77tjLY9cj
LIVEKIT_API_SECRET=3jUzWuEsgp2Y7nDkqEE7V4aGQzGgNpnEdyPOJ6zRUYFA
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
OPTIFLOW_BACKEND_URL=https://app.isyncso.com
OPTIFLOW_BACKEND_API_KEY=your_backend_api_key
```

### 1.4. Deploy the Service
1. Click "Create Web Service"
2. Wait for the deployment to complete (this may take a few minutes)
3. Once deployed, note the URL assigned to your service (e.g., `https://optiflow-voice-agent.onrender.com`)

## Step 2: Update Web Application to Connect to Voice Agent

### 2.1. Update Environment Variables in Vercel
1. Go to your Vercel project for the web application
2. Navigate to Settings → Environment Variables
3. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_VOICE_AGENT_URL`
   - **Value**: The URL from Render.com (e.g., `https://optiflow-voice-agent.onrender.com`)

### 2.2. Redeploy the Web Application
1. Trigger a new deployment in Vercel
2. This will incorporate the new environment variable

## Step 3: Test the Integration

1. Open your web application
2. Navigate to the voice agent interface
3. You should see that it now connects to your deployed voice agent
4. Test with a simple voice command to verify

## Troubleshooting

### Voice Agent Issues
- Check the logs in Render.com to identify any errors
- Verify that all environment variables are set correctly
- Test the health endpoint: `https://optiflow-voice-agent.onrender.com/health`

### Web Application Issues
- Check that `NEXT_PUBLIC_VOICE_AGENT_URL` is set correctly
- Inspect browser console for connection errors
- Verify that your LiveKit credentials are valid

## Security Considerations

- The voice agent is publicly accessible, but secured by your LiveKit credentials
- Consider adding additional security measures like rate limiting or authentication for production use 
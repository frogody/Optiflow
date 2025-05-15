# Voice Agent Render Deployment Guide

This guide helps you deploy the voice agent to Render with the proper CORS configuration and endpoints.

## Files
- `voice_agent_fix.py`: The FastAPI application with proper CORS and the `/agent/dispatch` endpoint
- `voice_agent_requirements.txt`: Required Python packages

## Deployment Steps

1. **Create a Git Repository**
   - Create a new GitHub/GitLab repository
   - Add `voice_agent_fix.py` and `voice_agent_requirements.txt` to the repository
   - Rename `voice_agent_fix.py` to `main.py` and `voice_agent_requirements.txt` to `requirements.txt`
   - Commit and push to your repository

2. **Create a New Web Service on Render**
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"
   - Connect your Git repository
   - Configure the service:
     - **Name**: optiflow-voice-agent (or your preferred name)
     - **Region**: Choose the one closest to your users
     - **Branch**: main (or your default branch)
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Configure Environment Variables**
   - In the Render Dashboard, go to your web service
   - Click on the "Environment" tab
   - Add these variables:
     - `CORS_ALLOW_ORIGIN`: `https://app.isyncso.com`
     - `CORS_ALLOW_CREDENTIALS`: `true`
     - `CORS_ALLOW_METHODS`: `GET,POST,PUT,DELETE,OPTIONS`
     - `CORS_ALLOW_HEADERS`: `X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version`

4. **Deploy the Service**
   - Click "Create Web Service" or "Manual Deploy" if you're updating an existing service
   - Wait for the deployment to complete (usually takes 2-5 minutes)

5. **Verify the Deployment**
   - Once deployed, Render will provide a URL (like `https://optiflow-voice-agent.onrender.com`)
   - Test the health endpoint: `https://optiflow-voice-agent.onrender.com/health`
   - It should return `{"status":"ok"}`

6. **Update Your Vercel Environment Variables**
   - Make sure your Vercel deployment has the correct `NEXT_PUBLIC_VOICE_AGENT_URL` environment variable
   - It should be set to your Render service URL (e.g., `https://optiflow-voice-agent.onrender.com`)

## Testing

After deployment, you should test the voice agent integration from your frontend. The Render deployment includes:

- `/health` - Health check endpoint
- `/agent/dispatch` - The endpoint to dispatch an agent
- `/agent/token` - An endpoint providing a mock token

This simple implementation will help diagnose if the CORS issues are fixed. You can later replace it with your actual voice agent implementation. 
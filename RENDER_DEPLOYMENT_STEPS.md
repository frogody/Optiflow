# Render.com Deployment Steps for Voice Agent Service

This document provides step-by-step instructions for deploying the Optiflow Voice Agent service to Render.com.

## Prerequisites

- A GitHub account with your voice agent code repository
- A Render.com account (you can sign up for free at https://render.com)
- Your code changes pushed to GitHub

## Step 1: Login to Render.com

1. Go to https://dashboard.render.com
2. Sign in with your account

## Step 2: Create a New Web Service

1. Click the "New +" button in the top right corner
2. Select "Web Service" from the dropdown menu

![Create New Web Service](https://docs.render.com/img/create-new-service.png)

## Step 3: Connect to Your GitHub Repository

1. Choose "GitHub" as your deployment option
2. Click "Connect" next to your GitHub account if not already connected
3. Find and select your voice agent repository
4. If you don't see your repository, click "Configure GitHub App" and add the repository

![Connect to GitHub](https://docs.render.com/img/services/services-select-repo.png)

## Step 4: Configure Your Web Service

Fill in the following information:

1. **Name**: optiflow-voice-agent
2. **Region**: Choose the closest to your users
3. **Branch**: main (or your default branch)
4. **Runtime**: Python
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `python main.py`

![Configure Web Service](https://docs.render.com/img/python-configure.png)

## Step 5: Add Environment Variables

1. Scroll down to the "Environment" section
2. Add the following key-value pairs:
   - Key: `CORS_ALLOW_ORIGIN` | Value: `https://app.isyncso.com,http://localhost:3000`
   - Key: `LIVEKIT_URL` | Value: `wss://your-livekit-instance.livekit.cloud`
   - Key: `PORT` | Value: `10000` (Render uses this port by default)
   - Key: `DEBUG` | Value: `false`

![Environment Variables](https://docs.render.com/img/environment-variables.png)

## Step 6: Configure Advanced Settings

1. Under "Advanced" settings, set:
   - **Health Check Path**: `/health`
   - **Auto Deploy**: Checked (Yes)

## Step 7: Create Web Service

1. Review all settings one last time
2. Click "Create Web Service" button at the bottom of the page

## Step 8: Monitor Deployment

1. Render will now build and deploy your service
2. Watch the logs for any errors during the build and deployment process

![Deployment Logs](https://docs.render.com/img/services/services-logs.png)

## Step 9: Test Your Deployment

Once deployment is complete:

1. Click on the service URL (e.g., `https://optiflow-voice-agent.onrender.com`)
2. Test the health endpoint: `https://optiflow-voice-agent.onrender.com/health`
3. Test CORS with our test tool by opening `voice-agent-test.html` and selecting the "Render.com" tab

## Step 10: Update Your Frontend

Update your frontend application to use the new service URL:

```javascript
// In your frontend configuration
const VOICE_AGENT_URL = "https://optiflow-voice-agent.onrender.com";
```

## Troubleshooting

If your deployment fails:

1. Check the build logs for errors
2. Verify your repository has all the required files (main.py, requirements.txt)
3. Make sure your environment variables are correctly set
4. Test locally before deploying to ensure your code works

For CORS issues, refer to the [detailed CORS troubleshooting guide](VOICE_AGENT_RENDER_DEPLOY.md#understanding-cors-errors). 
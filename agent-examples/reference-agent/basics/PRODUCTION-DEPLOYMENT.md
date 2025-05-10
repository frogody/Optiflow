# LiveKit Voice Agent Production Deployment

This guide provides instructions for deploying the LiveKit voice agent in production. The agent enables voice conversations for your application hosted at app.isyncso.com.

## Overview

The deployment consists of two parts:

1. **Frontend** - Already deployed on Vercel at app.isyncso.com
2. **Voice Agent** - Needs to be deployed as a separate service on a server

## Prerequisites

- A server or VPS with either:
  - Docker installed (recommended)
  - Node.js v18+ installed
- Access to your Vercel project settings for app.isyncso.com

## Option 1: Docker Deployment (Recommended)

Docker provides the most reliable and isolated environment for running the agent.

1. **Upload the agent files to your server:**
   ```bash
   scp -r * your-username@your-server:/path/to/livekit-agent/
   ```

2. **SSH into your server:**
   ```bash
   ssh your-username@your-server
   ```

3. **Navigate to the agent directory:**
   ```bash
   cd /path/to/livekit-agent/
   ```

4. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

5. **Verify the agent is running:**
   ```bash
   docker logs livekit-voice-agent
   ```

The agent will automatically restart if the server reboots.

## Option 2: PM2 Deployment

If Docker is not available, you can use PM2 to manage the agent process.

1. **Upload the agent files to your server:**
   ```bash
   scp -r * your-username@your-server:/path/to/livekit-agent/
   ```

2. **SSH into your server:**
   ```bash
   ssh your-username@your-server
   ```

3. **Navigate to the agent directory:**
   ```bash
   cd /path/to/livekit-agent/
   ```

4. **Run the PM2 deployment script:**
   ```bash
   ./deploy-pm2.sh
   ```

5. **Verify the agent is running:**
   ```bash
   pm2 logs livekit-voice-agent
   ```

PM2 will ensure the agent restarts on system boot.

## Setting Up Vercel Environment Variables

Ensure your Vercel project has the correct LiveKit environment variables:

1. **Install the Vercel CLI (if not already installed):**
   ```bash
   npm i -g vercel
   ```

2. **Log in to Vercel:**
   ```bash
   vercel login
   ```

3. **Run the Vercel environment setup script:**
   ```bash
   ./prod-vercel-env.sh
   ```

4. **Redeploy your application:**
   ```bash
   vercel --prod
   ```

## Testing the Voice Agent

1. **Open your browser and go to:** https://app.isyncso.com/voice-chat

2. **Allow microphone access when prompted**

3. **Click "Unmute Microphone" and speak**

4. **The agent should process your speech and respond**

## Monitoring and Troubleshooting

### Docker Deployment
```bash
# View logs in real-time
docker logs -f livekit-voice-agent

# Restart the agent if needed
docker restart livekit-voice-agent
```

### PM2 Deployment
```bash
# View logs in real-time
pm2 logs livekit-voice-agent

# Monitor CPU and memory usage
pm2 monit

# Restart the agent if needed
pm2 restart livekit-voice-agent
```

## Environment Variables

The agent uses the following environment variables:

- `LIVEKIT_URL`: wss://isyncsosync-p1slrjy.livekit.cloud
- `LIVEKIT_API_KEY`: APIcPGS63mCxqbP
- `LIVEKIT_API_SECRET`: AxD4cT19ffntf1YXfDQDZmbzkj3VwdMiqWlcVbPLgyEB
- `OPENAI_API_KEY`: Your OpenAI API key
- `DEEPGRAM_API_KEY`: Your Deepgram API key
- `LIVEKIT_ROOM`: voice-agent-room

These are pre-configured in the deployment scripts. 
#!/bin/bash
set -e

# Define variables 
IMAGE_NAME="optiflow-voice-agent"
IMAGE_TAG=$(date +%Y%m%d%H%M%S)

# Build the Docker image
echo "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t $IMAGE_NAME:$IMAGE_TAG .
docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest

# Test the container locally
echo "You can test the container locally with:"
echo "docker run -p 8000:8000 --env-file .env $IMAGE_NAME:$IMAGE_TAG"

# Deployment instructions for render.com
echo ""
echo "==== DEPLOYMENT INSTRUCTIONS ===="
echo "To deploy this container to render.com:"
echo ""
echo "1. Create a new Web Service in render.com"
echo "2. Choose 'Deploy an existing image from a registry'"
echo "3. Configure the following settings:"
echo "   - Name: $IMAGE_NAME"
echo "   - Image URL: Your Docker registry URL for this image"
echo "   - Environment Variables: Copy all variables from your .env file"
echo ""
echo "4. Add the following environment variables from your .env file:"
echo "   - LIVEKIT_URL"
echo "   - LIVEKIT_API_KEY"
echo "   - LIVEKIT_API_SECRET"
echo "   - OPENAI_API_KEY"
echo "   - DEEPGRAM_API_KEY"
echo "   - ELEVENLABS_API_KEY"
echo "   - ELEVENLABS_VOICE_ID"
echo "   - OPTIFLOW_BACKEND_URL"
echo "   - OPTIFLOW_BACKEND_API_KEY"
echo ""
echo "5. Set the health check path to: /health"
echo ""
echo "Alternative deployment options:"
echo "- Railway.app: Supports direct GitHub deployment with Dockerfile"
echo "- Fly.io: Deploy with 'flyctl deploy'"
echo "- Google Cloud Run: 'gcloud run deploy $IMAGE_NAME --image [YOUR-IMAGE]'"
echo ""
echo "Remember to update the web application to point to your deployed agent URL"
echo "============================================" 
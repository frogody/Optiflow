#!/bin/bash
set -e

# Define variables - use Docker Hub instead of Render registry
REGISTRY="" # Set to your Docker Hub username if you have one, or leave empty for local only
IMAGE_NAME="optiflow-voice-agent"
VERSION=$(date +%Y%m%d%H%M)

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file"
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "No .env file found. Make sure your environment variables are set elsewhere."
fi

# Check for required environment variables
required_vars=("LIVEKIT_URL" "LIVEKIT_API_KEY" "LIVEKIT_API_SECRET")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Required environment variable $var is not set."
    exit 1
  fi
done

# Build the Docker image
echo "Building Docker image: $IMAGE_NAME:$VERSION"
docker build -t $IMAGE_NAME:$VERSION .
docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest

FULL_IMAGE="$IMAGE_NAME:$VERSION"

# Push to registry if specified
if [ "$REGISTRY" != "" ]; then
  echo "Pushing image to Docker Hub: $REGISTRY/$IMAGE_NAME:$VERSION"
  docker tag $IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:$VERSION
  docker tag $IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:latest
  
  # Log in to Docker Hub if not already logged in
  docker login
  
  docker push $REGISTRY/$IMAGE_NAME:$VERSION
  docker push $REGISTRY/$IMAGE_NAME:latest
  
  FULL_IMAGE="$REGISTRY/$IMAGE_NAME:$VERSION"
  
  echo "Image pushed to Docker Hub: $FULL_IMAGE"
else
  echo "Skipping push to registry (REGISTRY not specified)"
fi

echo "Image built successfully: $FULL_IMAGE"

echo "===== DEPLOYMENT INSTRUCTIONS ====="
echo "Option 1: Run locally with Docker"
echo "  docker run -p 8000:8000 --env-file .env $IMAGE_NAME:latest"
echo ""
echo "Option 2: Deploy to Render.com"
echo "  1. Go to render.com and create a new Web Service"
echo "  2. Select 'Deploy existing image'"
echo "  3. If you pushed to Docker Hub, enter: $REGISTRY/$IMAGE_NAME:latest"
echo "  4. If not, you need to push the image to a registry first"
echo "  5. Set health check path to /health"
echo "  6. Add all environment variables from .env"
echo ""
echo "Option 3: Deploy to other platforms"
echo "  - Railway.app: Connect GitHub repo with Dockerfile"
echo "  - Fly.io: flyctl deploy"
echo "  - Google Cloud Run: gcloud run deploy"
echo ""
echo "After deployment, update your NextJS app environment:"
echo "NEXT_PUBLIC_VOICE_AGENT_URL=https://your-deployment-url"
echo ""
echo "Run the following to test the API locally:"
echo "  curl http://localhost:8000/health"
echo "=======================================================" 
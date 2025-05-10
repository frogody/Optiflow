#!/bin/bash
set -e

# Define variables - replace these with your actual values
DOCKER_REGISTRY="your-registry.com"
IMAGE_NAME="optiflow-jarvis-agent"
IMAGE_TAG=$(date +%Y%m%d%H%M%S)

# Build the Docker image
echo "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
docker build -t $IMAGE_NAME:$IMAGE_TAG .
docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest

# Push the image to registry (uncomment when ready for production)
# echo "Pushing image to registry: $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
# docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
# docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKER_REGISTRY/$IMAGE_NAME:latest
# docker push $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG
# docker push $DOCKER_REGISTRY/$IMAGE_NAME:latest

echo "Image built successfully: $IMAGE_NAME:$IMAGE_TAG"
echo "To run the container locally:"
echo "docker run -p 8000:8000 --env-file .env $IMAGE_NAME:$IMAGE_TAG"

# Deploy to your platform of choice
# Examples:
# - AWS ECS
# - Google Cloud Run
# - Kubernetes
# - Azure Container Instances

# Example for Google Cloud Run (uncomment and customize when ready)
# echo "Deploying to Google Cloud Run..."
# gcloud run deploy $IMAGE_NAME \
#   --image $DOCKER_REGISTRY/$IMAGE_NAME:$IMAGE_TAG \
#   --platform managed \
#   --region us-central1 \
#   --allow-unauthenticated \
#   --set-env-vars="LIVEKIT_WS_URL=wss://your-livekit-server.com"

echo "Deployment completed!" 
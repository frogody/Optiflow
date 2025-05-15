#!/bin/bash

# Deploy Voice Agent Service to Render.com
# This script helps with deploying the voice agent service to Render.com

echo "===== Optiflow Voice Agent Deployment Script for Render.com ====="
echo "This script will help you deploy the Voice Agent service to Render.com"

# Make sure we're in the root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Make sure voice-agent-service directory exists
if [ ! -d "voice-agent-service" ]; then
    echo "Error: voice-agent-service directory not found."
    exit 1
fi

echo "Step 1: Committing changes to git"
git add voice-agent-service/main.py voice-agent-service/config.py voice-agent-service/requirements.txt voice-agent-service/render.yaml app.py
git commit -m "Update voice agent service with improved CORS configuration for Render.com"

echo -e "\nStep 2: Next Steps for Render.com Deployment:"
echo "1. Push your changes to GitHub:"
echo "   git push origin main"
echo ""
echo "2. Log into your Render.com dashboard at https://dashboard.render.com"
echo "3. Click 'New +' and select 'Blueprint'"
echo "4. Connect to your GitHub repository"
echo "5. Render will detect the render.yaml file and set up the service"
echo "6. Configure the LIVEKIT_URL environment variable in the Render dashboard"
echo "7. Deploy the service"
echo ""
echo "After deployment, your voice agent will be available at:"
echo "https://optiflow-voice-agent.onrender.com"
echo ""
echo "To test the service, visit:" 
echo "https://optiflow-voice-agent.onrender.com/health"
echo ""

# Make the script executable
chmod +x "$0" 
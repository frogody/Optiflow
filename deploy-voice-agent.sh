#!/bin/bash

# Deploy Voice Agent Service to Render.com
# This script helps with deploying the voice agent service to Render.com

echo "===== Optiflow Voice Agent Deployment Script ====="
echo "This script will help you deploy the Voice Agent service to Render.com"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if current directory is a git repository
if [ ! -d ".git" ]; then
    echo "Error: Not a git repository. Please run this script from the root of your Optiflow repository."
    exit 1
fi

# Ensure the voice-agent-service directory exists
if [ ! -d "voice-agent-service" ]; then
    echo "Error: voice-agent-service directory not found. Please run this script from the root of your Optiflow repository."
    exit 1
fi

# Check if user is authenticated with git
if ! git config --get user.name &> /dev/null; then
    echo "Error: Git user not configured. Please set your git user name and email."
    echo "Run the following commands:"
    echo "  git config --global user.name \"Your Name\""
    echo "  git config --global user.email \"your.email@example.com\""
    exit 1
fi

echo ""
echo "This script will:"
echo "1. Commit any changes to the voice agent service"
echo "2. Push the changes to your repository"
echo "3. Guide you through deploying to Render.com"
echo ""

read -p "Continue? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Deployment canceled."
    exit 0
fi

# Stage changes in voice-agent-service directory
echo "Staging changes in voice-agent-service directory..."
git add voice-agent-service/*

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit in voice-agent-service directory."
else
    # Ask for commit message
    read -p "Enter commit message for voice agent changes: " commit_message
    
    # Commit the changes
    if [ -z "$commit_message" ]; then
        commit_message="Update voice agent service"
    fi
    
    git commit -m "$commit_message"
    
    echo "Changes committed successfully."
fi

# Ask if user wants to push the changes
read -p "Push changes to remote repository? (y/n): " push_confirm
if [ "$push_confirm" == "y" ]; then
    # Get current branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    # Push the changes
    echo "Pushing changes to $current_branch branch..."
    git push origin $current_branch
    
    echo "Changes pushed successfully."
else
    echo "Skipping push to remote repository."
fi

echo ""
echo "===== Render.com Deployment Guide ====="
echo "To deploy the voice agent service to Render.com:"
echo ""
echo "1. Sign in to your Render.com account"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Configure the service with these settings:"
echo "   - Name: optiflow-voice-agent"
echo "   - Root Directory: voice-agent-service"
echo "   - Environment: Python"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: python main.py"
echo "5. Add the following environment variables:"
echo "   - PORT: 10000"
echo "   - CORS_ALLOW_ORIGIN: https://your-website-domain.com"
echo ""
echo "After deployment, update your frontend configuration with:"
echo "NEXT_PUBLIC_VOICE_AGENT_URL=https://your-render-service-url.onrender.com"
echo "NEXT_PUBLIC_VOICE_AGENT_ENABLED=true"
echo ""
echo "For more detailed instructions, refer to VOICE_AGENT_SETUP.md"
echo ""
echo "Deployment guide completed. Your code is ready to be deployed." 
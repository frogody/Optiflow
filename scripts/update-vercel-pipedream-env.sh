#!/bin/bash

# Pipedream Environment Variable Updater for Vercel
# This script updates your Pipedream environment variables in Vercel

# Text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Pipedream Environment Variable Updater for Vercel${NC}"
echo "====================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed${NC}"
    echo "Please install it with: npm i -g vercel"
    exit 1
fi

# Check for login status
echo "Checking Vercel login status..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel first"
    vercel login
fi

# Get project information
echo "Getting project information..."
PROJECT_NAME=$(basename $(pwd))
echo -e "Project: ${GREEN}$PROJECT_NAME${NC}"

# Create temp .env file for Pipedream variables
TEMP_ENV_FILE=".env.pipedream.tmp"
touch $TEMP_ENV_FILE

# Get existing variables
echo "Checking existing environment variables..."
CLIENT_ID=$(grep -E "^NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=" .env.* 2>/dev/null | head -n 1 | cut -d= -f2- | tr -d '"')
CLIENT_SECRET=$(grep -E "^PIPEDREAM_CLIENT_SECRET=" .env.* 2>/dev/null | head -n 1 | cut -d= -f2- | tr -d '"')
PROJECT_ID=$(grep -E "^PIPEDREAM_PROJECT_ID=" .env.* 2>/dev/null | head -n 1 | cut -d= -f2- | tr -d '"')
PROJECT_ENV=$(grep -E "^PIPEDREAM_PROJECT_ENVIRONMENT=" .env.* 2>/dev/null | head -n 1 | cut -d= -f2- | tr -d '"')
APP_URL=$(grep -E "^NEXT_PUBLIC_APP_URL=" .env.* 2>/dev/null | head -n 1 | cut -d= -f2- | tr -d '"')
REDIRECT_URI=$(grep -E "^NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=" .env.* 2>/dev/null | head -n 1 | cut -d= -f2- | tr -d '"')

# Prompt for missing or updates to variables
echo ""
echo "Please provide the Pipedream environment variables:"
echo "(Press Enter to keep current values if shown)"

# Client ID
echo -n "NEXT_PUBLIC_PIPEDREAM_CLIENT_ID [$CLIENT_ID]: "
read input
CLIENT_ID=${input:-$CLIENT_ID}
[[ -n $CLIENT_ID ]] && echo "NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=\"$CLIENT_ID\"" >> $TEMP_ENV_FILE

# Client Secret
echo -n "PIPEDREAM_CLIENT_SECRET [$CLIENT_SECRET]: "
read input
CLIENT_SECRET=${input:-$CLIENT_SECRET}
[[ -n $CLIENT_SECRET ]] && echo "PIPEDREAM_CLIENT_SECRET=\"$CLIENT_SECRET\"" >> $TEMP_ENV_FILE

# Project ID
echo -n "PIPEDREAM_PROJECT_ID [$PROJECT_ID]: "
read input
PROJECT_ID=${input:-$PROJECT_ID}
[[ -n $PROJECT_ID ]] && echo "PIPEDREAM_PROJECT_ID=\"$PROJECT_ID\"" >> $TEMP_ENV_FILE

# Project Environment
echo -n "PIPEDREAM_PROJECT_ENVIRONMENT [$PROJECT_ENV]: "
read input
PROJECT_ENV=${input:-$PROJECT_ENV}
[[ -n $PROJECT_ENV ]] && echo "PIPEDREAM_PROJECT_ENVIRONMENT=\"$PROJECT_ENV\"" >> $TEMP_ENV_FILE

# App URL
echo -n "NEXT_PUBLIC_APP_URL [$APP_URL]: "
read input
APP_URL=${input:-$APP_URL}
[[ -n $APP_URL ]] && echo "NEXT_PUBLIC_APP_URL=\"$APP_URL\"" >> $TEMP_ENV_FILE

# Redirect URI
default_redirect_uri="${APP_URL}/api/pipedream/callback"
REDIRECT_URI=${REDIRECT_URI:-$default_redirect_uri}
echo -n "NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI [$REDIRECT_URI]: "
read input
REDIRECT_URI=${input:-$REDIRECT_URI}
[[ -n $REDIRECT_URI ]] && echo "NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=\"$REDIRECT_URI\"" >> $TEMP_ENV_FILE

# Check if all required variables are present
if [[ -z $CLIENT_ID ]] || [[ -z $CLIENT_SECRET ]] || [[ -z $PROJECT_ID ]] || [[ -z $PROJECT_ENV ]]; then
    echo -e "${RED}Error: Missing required environment variables${NC}"
    echo "Please provide all required variables"
    rm $TEMP_ENV_FILE
    exit 1
fi

# Check if we should update local .env files too
echo ""
echo -n "Do you want to update your local .env files too? (y/n) [y]: "
read update_local
update_local=${update_local:-y}

if [[ $update_local == "y" ]]; then
    ENV_LOCAL=".env.local"
    
    # Create .env.local if it doesn't exist
    if [[ ! -f $ENV_LOCAL ]]; then
        echo "Creating $ENV_LOCAL..."
        touch $ENV_LOCAL
    fi
    
    # Update .env.local with Pipedream variables
    echo "Updating $ENV_LOCAL with Pipedream variables..."
    while read line; do
        var_name=$(echo $line | cut -d= -f1)
        
        # Remove existing variable
        grep -v "^$var_name=" $ENV_LOCAL > "$ENV_LOCAL.tmp" || true
        mv "$ENV_LOCAL.tmp" $ENV_LOCAL
        
        # Add updated variable
        echo $line >> $ENV_LOCAL
    done < $TEMP_ENV_FILE
    
    echo -e "${GREEN}Updated local environment files${NC}"
fi

# Prompt to update Vercel environment
echo ""
echo -n "Do you want to update Vercel environment variables? (y/n) [y]: "
read update_vercel
update_vercel=${update_vercel:-y}

if [[ $update_vercel == "y" ]]; then
    echo "Updating Vercel environment variables..."
    
    # Loop through variables and update them on Vercel
    while read line; do
        var_name=$(echo $line | cut -d= -f1)
        var_value=$(echo $line | cut -d= -f2- | tr -d '"')
        
        echo "Setting $var_name..."
        vercel env add $var_name production <<< $var_value
        vercel env add $var_name preview <<< $var_value
        vercel env add $var_name development <<< $var_value
    done < $TEMP_ENV_FILE
    
    echo -e "${GREEN}Updated Vercel environment variables${NC}"
    echo "You need to redeploy your application for the changes to take effect"
    
    echo -n "Do you want to redeploy now? (y/n) [n]: "
    read redeploy
    redeploy=${redeploy:-n}
    
    if [[ $redeploy == "y" ]]; then
        echo "Redeploying application..."
        vercel --prod
    fi
fi

# Clean up
rm $TEMP_ENV_FILE

echo -e "${GREEN}Pipedream environment variables have been updated!${NC}"
echo "Make sure to restart your development server if you're running one" 
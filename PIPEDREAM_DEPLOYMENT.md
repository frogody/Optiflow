# Pipedream Integration Deployment Guide

This guide explains how to deploy your application with Pipedream Connect integration to Vercel environments.

## Prerequisites

1. A Pipedream account with Connect API access
2. Your OAuth client credentials from Pipedream
3. Vercel account and CLI installed locally

## Setup Steps

### 1. Configure Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

```
# Pipedream Configuration
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your-client-id
PIPEDREAM_CLIENT_SECRET=your-client-secret
PIPEDREAM_PROJECT_ID=your-project-id
NEXT_PUBLIC_APP_URL=your-app-url (e.g., https://app.isyncso.com)
NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=your-callback-url (e.g., https://app.isyncso.com/api/pipedream/callback)
```

You can add these in the Vercel dashboard under Project Settings → Environment Variables, or use the Vercel CLI:

```bash
vercel env add PIPEDREAM_CLIENT_SECRET
```

### 2. Configure Pipedream OAuth Application

1. In your Pipedream account, go to Settings → API Keys
2. Configure your OAuth application with the correct redirect URI:
   - For development: `http://localhost:3000/api/pipedream/callback`
   - For production: `https://app.isyncso.com/api/pipedream/callback` (or your custom domain)

### 3. Deploy to All Environments

Use the provided script to deploy to all environments:

```bash
./deploy-to-vercel.sh
```

This will deploy to:
- Preview environment (for testing)
- Development environment 
- Production environment

### 4. Verify Deployment

After deployment, verify that your Pipedream integration is working correctly:

1. Navigate to your deployed application
2. Try connecting an account through the Pipedream integration
3. Check the console logs for successful connection

## Troubleshooting

### Token Creation Issues

If you're having issues creating tokens:

1. Check that your `PIPEDREAM_CLIENT_SECRET` is correct
2. Verify your `PIPEDREAM_PROJECT_ID` is set correctly
3. Check the server logs for detailed error messages

### Connection Issues

If accounts aren't connecting properly:

1. Ensure the redirect URI in your Pipedream OAuth app matches your deployed application
2. Check that you're using the correct app slug in your connection code
3. Verify the token is being passed correctly to the frontend

## Environment-Specific Configurations

For different environments, the script sets:

- Development: Sets `NEXT_PUBLIC_DEPLOYMENT_ENV=development`
- Production: Uses your production configuration

You may need to customize other environment variables per environment in your Vercel project settings. 
# Deploying Pipedream Connect on Vercel

This guide will help you set up and deploy the Pipedream Connect integration on Vercel.

## Prerequisites

1. A Pipedream account with API access
2. A Vercel account
3. Your Optiflow repository connected to Vercel

## Setup Steps

### 1. Create a Pipedream OAuth App

1. Log in to your [Pipedream account](https://pipedream.com/auth/login)
2. Navigate to **Developer Settings** > **OAuth Apps**
3. Click **New OAuth App**
4. Fill in the details:
   - **App Name**: Your application name (e.g., "Optiflow")
   - **Description**: A brief description of your app
   - **Redirect URI**: `https://your-vercel-domain.vercel.app/api/pipedream/callback`
   - **Scopes**: Select the necessary scopes for your integration
5. Save the app and note down the **Client ID** and **Client Secret**

### 2. Configure Environment Variables in Vercel

1. Open your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** > **Environment Variables**
3. Add the following environment variables:

```
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id
PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret
PIPEDREAM_PROJECT_ID=your_pipedream_project_id
PIPEDREAM_PROJECT_ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://your-vercel-domain.vercel.app/api/pipedream/callback
```

4. Click **Save**

### 3. Deploy to Vercel

1. Make sure your code changes are committed to your repository
2. Push to the branch that's connected to your Vercel project
3. Vercel will automatically deploy your application
4. Once deployed, verify the correct URL is used in your Pipedream OAuth app settings

## Testing the Integration

1. Visit your deployed application
2. Navigate to `/test-pipedream` to test the integration
3. Try connecting to different services to ensure the OAuth flow works correctly

## Troubleshooting

If you encounter issues with the OAuth callback:

1. Check that the redirect URI in your Pipedream OAuth app matches exactly with your deployed application URL
2. Verify all environment variables are correctly set in Vercel
3. Check the Vercel function logs for any errors
4. Ensure your browser allows third-party cookies for the OAuth popup

## Security Considerations

- Never commit your Pipedream Client Secret to your repository
- The Client ID is public and can be exposed in the frontend code
- Always use HTTPS for your redirect URI

## Additional Resources

- [Pipedream OAuth Documentation](https://pipedream.com/docs/connect/oauth)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) 
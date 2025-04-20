# Manual Deployment to Vercel with Pipedream Integration

Since we're encountering issues with the automated CLI deployment, here's a step-by-step guide to deploy your application manually through the Vercel dashboard:

## Step 1: Prepare Your Project

1. Make sure all your Pipedream integration files are committed to your repository:
   - `src/app/api/pipedream/callback/route.ts` - OAuth callback handler
   - `src/components/PipedreamConnectButton.tsx` - Connect button component
   - `src/lib/pipedream/usePipedreamConnect.ts` - React hook
   - `src/lib/pipedream/server.ts` - Server-side functions

2. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add Pipedream integration"
   git push
   ```

## Step 2: Deploy via Vercel Dashboard

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. In the Environment Variables section, add these crucial variables:
   ```
   NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id
   PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret
   PIPEDREAM_PROJECT_ID=your_pipedream_project_id
   PIPEDREAM_PROJECT_ENVIRONMENT=production
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI=https://your-vercel-domain.vercel.app/api/pipedream/callback
   ```

6. Click "Deploy"

## Step 3: Update Pipedream OAuth App

1. After deployment, note your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Log in to your [Pipedream account](https://pipedream.com/auth/login)
3. Navigate to **Developer Settings** > **OAuth Apps**
4. Select your OAuth app and update the **Redirect URI** to:
   ```
   https://your-app.vercel.app/api/pipedream/callback
   ```
5. Save the changes

## Step 4: Test the Integration

1. Visit your deployed app
2. Navigate to `/test-pipedream` to test the Pipedream Connect functionality
3. Try connecting to services like Slack, Gmail, or GitHub
4. Verify that the OAuth flow redirects back to your app correctly

## Troubleshooting

If you encounter issues with the connection flow:

1. **403 Forbidden Error**: Check your Redirect URI in both Vercel environment variables and Pipedream OAuth app settings
2. **Callback Not Working**: Ensure the `api/pipedream/callback` route is properly deployed
3. **Connection Errors**: Check the browser console for any API errors

For persistent issues, you may need to:

1. Check your browser console for specific error messages
2. Verify that all environment variables are correctly set in Vercel
3. Ensure your Pipedream account has the necessary permissions

## Using the Dashboard to Monitor Usage

1. Visit Vercel dashboard to view your deployments
2. Check Function Logs to monitor the OAuth callback execution
3. Review the Analytics section to track usage patterns

## Additional Resources

- [Vercel Dashboard Guide](https://vercel.com/docs/dashboard)
- [Environment Variables in Vercel](https://vercel.com/docs/projects/environment-variables)
- [Pipedream Connect Documentation](https://pipedream.com/docs/connect/) 
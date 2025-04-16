# Pipedream Integration Deployment Summary

We've integrated Pipedream Connect into your project to easily connect with third-party services. Here's a summary of how to deploy and use this integration:

## Deployment Options

### Option 1: Manual Deployment (Recommended)
For the most reliable deployment, follow the steps in `MANUAL_DEPLOYMENT.md` to deploy through the Vercel dashboard.

### Option 2: CLI Deployment
If you prefer using the CLI:
```bash
# Make sure you've set up your environment variables first
./deploy-to-vercel.sh
```

## Key Files

1. **Components**:
   - `src/components/PipedreamConnectButton.tsx` - Button for connecting services
   - `src/lib/pipedream/usePipedreamConnect.ts` - React hook for managing connections

2. **API Routes**:
   - `src/app/api/pipedream/callback/route.ts` - Handles OAuth callbacks

3. **Demo Pages**:
   - `/test-pipedream` - Test page for trying the integration
   - `/connections` - Connection management page

## Post-Deployment Steps

1. **Configure Pipedream OAuth App**:
   - Set the redirect URI to your deployed URL
   - Example: `https://your-app.vercel.app/api/pipedream/callback`

2. **Test the Integration**:
   - Visit `/test-pipedream` on your deployed site
   - Try connecting to various services

3. **Troubleshoot If Needed**:
   - See `PIPEDREAM_DEPLOYMENT.md` for detailed troubleshooting steps

## Using the Integration in Your Components

```jsx
// Basic usage
import PipedreamConnectButton from '@/components/PipedreamConnectButton';

export default function MyComponent() {
  return (
    <PipedreamConnectButton
      appSlug="slack"
      buttonText="Connect to Slack"
      onSuccess={(accountId) => console.log('Connected:', accountId)}
    />
  );
}
```

For more detailed information, refer to:
- `PIPEDREAM_DEPLOYMENT.md` - Detailed deployment instructions
- `README-PIPEDREAM.md` - Overall integration documentation 
# Pipedream Connect Integration for Optiflow

This README provides information about the Pipedream Connect integration for Optiflow.

## Overview

Pipedream Connect allows your users to easily connect to hundreds of services like Slack, Gmail, GitHub, and more through a unified OAuth flow. This integration simplifies the process of connecting to external services and managing those connections.

## Features

- Simple OAuth connection to popular services
- Unified management of user connections
- Easy-to-use React components and hooks
- Streamlined deployment to Vercel

## Integration Components

The integration consists of the following components:

1. **OAuth Callback Handler** (`src/app/api/pipedream/callback/route.ts`)
   - Handles the OAuth redirect from external services
   - Processes the authentication code and state
   - Redirects users back to the application

2. **Connect Button** (`src/components/PipedreamConnectButton.tsx`)
   - Simple React component for connecting to services
   - Handles loading, connecting, and error states
   - Customizable appearance

3. **React Hook** (`src/lib/pipedream/usePipedreamConnect.ts`)
   - Manages the connection flow
   - Handles token management and client initialization
   - Provides connection status and errors

4. **Server API Functions** (`src/lib/pipedream/server.ts`)
   - Server-side functions for token creation
   - Account management and retrieval

## Demo Pages

- `/connections` - Main connections management page
- `/test-pipedream` - Test page for Pipedream Connect functionality

## Deployment

To deploy this integration to Vercel:

1. Set up your Pipedream account and obtain API credentials
2. Configure environment variables in Vercel
3. Run the deployment script:

```bash
./deploy-to-vercel.sh
```

For detailed deployment instructions, see `PIPEDREAM_DEPLOYMENT.md`.

## Local Development

To test the integration locally:

1. Copy `.env.example` to `.env.local`
2. Fill in your Pipedream API credentials
3. Run the development server:

```bash
npm run dev
```

## Usage Examples

### Basic Connection Button

```jsx
import PipedreamConnectButton from '@/components/PipedreamConnectButton';

export default function MyComponent() {
  const handleSuccess = (accountId) => {
    console.log(`Connected with account ID: ${accountId}`);
  };

  return (
    <PipedreamConnectButton
      appSlug="slack"
      buttonText="Connect to Slack"
      onSuccess={handleSuccess}
    />
  );
}
```

### Using the Hook Directly

```jsx
import { usePipedreamConnect } from '@/lib/pipedream/usePipedreamConnect';

export default function MyComponent() {
  const { connectService, isConnecting, isReady } = usePipedreamConnect({
    onSuccess: (accountId) => {
      console.log(`Connected with account ID: ${accountId}`);
    }
  });

  return (
    <button
      onClick={() => connectService('github')}
      disabled={!isReady || isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect to GitHub'}
    </button>
  );
}
```

## Troubleshooting

If you encounter issues with the connection flow:

1. Check that your environment variables are correctly set
2. Ensure the redirect URI in your Pipedream app settings matches your application URL
3. Verify that the user has cookies enabled for the OAuth popup

## Resources

- [Pipedream Documentation](https://pipedream.com/docs)
- [Pipedream Connect API Reference](https://pipedream.com/docs/connect/api-reference)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction) 
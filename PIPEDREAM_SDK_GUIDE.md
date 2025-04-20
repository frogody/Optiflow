# Using the Pipedream SDK in Your Frontend

This guide explains how to use the Pipedream SDK to handle OAuth connections directly from your frontend application.

## Installation

First, install the Pipedream SDK:

```bash
npm install @pipedream/sdk --save
```

## Configuration

Set up your environment variables in `.env.local` for development and `.env.production` for production:

```
NEXT_PUBLIC_PIPEDREAM_API_KEY=your_pipedream_api_key
NEXT_PUBLIC_PIPEDREAM_API_SECRET=your_pipedream_api_secret
NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_pipedream_client_id
NEXT_PUBLIC_PIPEDREAM_TOKEN=your_pipedream_token
```

## Basic Usage

### Creating a Client

```javascript
import { createFrontendClient } from '@pipedream/sdk/browser';

// Initialize the Pipedream client
const pd = createFrontendClient();
```

### Connecting an Account

```javascript
await pd.connectAccount({
  app: 'slack', // The app to connect (lowercase)
  oauthAppId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID, // Your Pipedream OAuth app ID
  token: process.env.NEXT_PUBLIC_PIPEDREAM_TOKEN, // Your Pipedream token
  onSuccess: ({ id }) => {
    console.log(`Account successfully connected: ${id}`);
    // Handle successful connection (e.g., save the account ID)
  }
});
```

## Generic Connector Component

We've created a reusable `PipedreamConnector` component that you can use for any supported app:

```javascript
<PipedreamConnector 
  appName="slack" 
  onSuccess={(id) => handleAccountConnected('Slack', id)}
  onError={(error) => handleConnectionError('Slack', error)}
/>
```

## App-Specific Connectors

For a better user experience, you can create app-specific connectors with custom styling:

```javascript
<SlackConnector 
  onSuccess={handleAccountConnected}
  onError={handleConnectionError}
/>
```

## Supported Applications

Pipedream supports OAuth connections to hundreds of applications, including:

- Slack
- Gmail / Google Workspace
- Microsoft 365
- Salesforce
- HubSpot
- GitHub
- Shopify
- Stripe
- And many more...

Check the [Pipedream website](https://pipedream.com/apps) for a full list of supported apps.

## Handling Connected Accounts

After a successful connection, you should:

1. Save the account ID to your backend
2. Associate it with the user's account
3. Use it for future API operations

## Error Handling

Use the `onError` callback to handle connection failures:

```javascript
onError: (error) => {
  console.error('Connection error:', error);
  // Display error message to user
}
```

## Security Considerations

- Never expose your Pipedream API secret in client-side code
- The client ID and token can be exposed as they have limited capabilities
- Use HTTPS for all connections
- Consider implementing additional authorization checks on your backend

## Example Implementation

See the following files for example implementations:

- `src/components/PipedreamConnector.tsx` - Generic connector
- `src/components/SlackConnector.tsx` - Slack-specific connector
- `src/app/connections/page.tsx` - Connection dashboard
- `src/app/integrations/slack/page.tsx` - Slack integration page 
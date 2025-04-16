'use client';

import { useState, useEffect } from 'react';
import { createFrontendClient } from '@pipedream/sdk/browser';

interface PipedreamConnectorProps {
  appName: string;
  className?: string;
  buttonText?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

export default function PipedreamConnector({
  appName,
  className = '',
  buttonText = `Connect ${appName}`,
  onSuccess,
  onError
}: PipedreamConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [pdClient, setPdClient] = useState<any>(null);

  useEffect(() => {
    // Initialize the Pipedream client
    const pd = createFrontendClient();
    setPdClient(pd);
  }, []);

  const handleConnect = async () => {
    if (!pdClient) return;
    
    setIsConnecting(true);
    try {
      await pdClient.connectAccount({
        app: appName.toLowerCase(),
        // Use environment variables for client ID
        oauthAppId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
        token: process.env.NEXT_PUBLIC_PIPEDREAM_TOKEN || '',
        onSuccess: ({ id }: { id: string }) => {
          setIsConnecting(false);
          console.log(`Account successfully connected: ${id}`);
          if (onSuccess) onSuccess(id);
        }
      });
    } catch (error) {
      setIsConnecting(false);
      console.error('Error connecting account:', error);
      if (onError && error instanceof Error) onError(error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || !pdClient}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {isConnecting ? 'Connecting...' : buttonText}
    </button>
  );
} 
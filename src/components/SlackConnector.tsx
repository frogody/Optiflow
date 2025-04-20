'use client';

import { useState, useEffect } from 'react';
import { createFrontendClient } from '@pipedream/sdk/browser';
import { FaSlack } from 'react-icons/fa';

interface SlackConnectorProps {
  className?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

export default function SlackConnector({
  className = '',
  onSuccess,
  onError
}: SlackConnectorProps) {
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
        app: 'slack',
        // Use environment variables for client ID
        oauthAppId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
        token: process.env.NEXT_PUBLIC_PIPEDREAM_TOKEN || '',
        onSuccess: ({ id }: { id: string }) => {
          setIsConnecting(false);
          console.log(`Slack successfully connected: ${id}`);
          if (onSuccess) onSuccess(id);
        }
      });
    } catch (error) {
      setIsConnecting(false);
      console.error('Error connecting Slack:', error);
      if (onError && error instanceof Error) onError(error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || !pdClient}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#4A154B] text-white rounded-md hover:bg-[#5a2d5c] transition-colors disabled:opacity-50 ${className}`}
    >
      <FaSlack className="h-5 w-5" />
      {isConnecting ? 'Connecting...' : 'Connect Slack'}
    </button>
  );
} 
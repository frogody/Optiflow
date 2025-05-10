'use client';

import { createFrontendClient } from '@pipedream/sdk/browser';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaSlack } from 'react-icons/fa';

interface SlackConnectorProps {
  className?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

export default function SlackConnector() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { data: session     } = useSession();

  const handleConnect = async () => {
    if (!session?.user?.id) {
      console.log('No user session found');
      toast.error('You must be logged in to connect Slack');
      return;
    }
    
    setIsConnecting(true);
    try {
      console.log('Starting Slack connection process...', { userId: session.user.id,
        email: session.user.email
          });
      
      // Get a token from our backend API
      const response = await fetch('/api/pipedream/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          external_user_id: session.user.id,
          app_id: 'slack'
        }),
      });
      
      console.log('Backend response status:', response.status);
      const data = await response.json();
      console.log('Backend response data:', { hasToken: !!data.token,
        error: data.error,
        details: data.details
          });
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get connect token');
      }
      
      if (!data.token) {
        throw new Error('Connect token not received');
      }
      
      console.log('Token received, initializing Pipedream client...');
      
      // Create a new client instance for this connection
      const pdClient = createFrontendClient();
      
      // Use the token to start the OAuth flow
      await pdClient.connect({
        app: 'slack',
        token: data.token,
        onSuccess: ({ accountId }: { accountId: string     }) => {
          setIsConnecting(false);
          console.log(`Slack successfully connected: ${accountId}`);
          toast.success('Slack connected successfully!');
          if (onSuccess) onSuccess(accountId);
        },
        onError: (error: any) => {
          setIsConnecting(false);
          console.error('Error in Pipedream Connect flow:', { message: error.message,
            name: error.name,
            stack: error.stack,
            details: error
              });
          toast.error(error.message || 'Failed to connect Slack');
          if (onError) onError(new Error(error.message || 'Failed to connect Slack'));
        }
      });
    } catch (error) {
      setIsConnecting(false);
      console.error('Error connecting Slack:', { message: error instanceof Error ? error.message : 'Unknown error',
        error
          });
      toast.error(error instanceof Error ? error.message : 'Failed to connect Slack');
      if (onError && error instanceof Error) onError(error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || !session}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#4A154B] text-white rounded-md hover:bg-[#5a2d5c] transition-colors disabled:opacity-50 ${className}`}
    >
      <FaSlack className="h-5 w-5" />
      { isConnecting ? 'Connecting...' : 'Connect Slack'    }
    </button>
  );
} 
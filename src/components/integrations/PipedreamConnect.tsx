import { createFrontendClient } from '@pipedream/sdk/browser';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Spinner } from '@/components/ui/Spinner';


interface PipedreamConnectProps {
  app: string;
  onSuccess?: (account: { id: string     }) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const PipedreamConnect: React.FC<PipedreamConnectProps> = ({
  app,
  onSuccess,
  onError,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status     } = useSession();

  const handleConnect = useCallback(async () => {
    if (!app) { const error = new Error('App name is required');
      console.error('Connection error:', error);
      onError?.(error);
      return;
        }

    if (!session?.user?.id) {
      toast.error('Please sign in to connect your account');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Initiating connection for ${app}...`);
      console.log('Environment:', { hasClientId: !!process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID,
        hasProjectId: !!process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID,
        projectEnvironment: process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ENVIRONMENT
          });

      // Get the connect token from our backend
      const response = await fetch('/api/pipedream/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          external_user_id: session.user.id,
          user_facing_label: `Connect ${app} for ${session.user.email}`,
          app_id: app // Pass the app ID to the backend
        }),
      });

      const data = await response.json();

      if (!response.ok) { console.error('Token creation failed:', data);
        throw new Error(data.error || data.details || 'Failed to fetch connect token');
          }

      if (!data.token) {
        throw new Error('Connect token not received');
      }

      console.log(`Token received for ${app}, initializing connection...`);

      // Initialize the Pipedream frontend client
      const pd = createFrontendClient();

      // Start the connection flow
      await pd.connectAccount({
        app,
        token: data.token,
        onSuccess: (account) => {
          console.log(`Successfully connected ${app}:`, account);
          toast.success(`Successfully connected ${app}!`);
          onSuccess?.(account);
          setIsLoading(false);
        },
        onError: (errorData) => {
          console.error(`Connection error for ${app}:`, errorData);
          const errorMessage = errorData.message || `Failed to connect ${app}. Please try again.`;
          toast.error(errorMessage);
          onError?.(new Error(errorMessage));
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error(`Error during ${app} connection:`, err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
    }
  }, [app, session, onSuccess, onError]);

  if (status === 'loading') {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-blue-600 text-white rounded-md opacity-50 ${className}`}
        title={`Connect ${app}`}
        aria-label={`Connect ${app}`}
      >
        <Spinner className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading || !session}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 ${className}`}
      title={`Connect ${app}`}
      aria-label={`Connect ${app}`}
    >
      {isLoading ? (
        <Spinner className="w-5 h-5" />
      ) : !session ? (
        'Sign in to Connect'
      ) : (
        `Connect ${app}`
      )}
    </button>
  );
}; 
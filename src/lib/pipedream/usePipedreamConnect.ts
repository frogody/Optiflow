import { createFrontendClient } from '@pipedream/sdk/browser';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useUserStore } from '../userStore';

interface UsePipedreamConnectOptions {
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * React hook for handling Pipedream Connect OAuth integrations
 */
export function usePipedreamConnect(options: UsePipedreamConnectOptions = {}) {
  const { onSuccess, onError } = options;
  const { currentUser } = useUserStore();
  const userId = currentUser?.id || '';
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [pdClient, setPdClient] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize the Pipedream client
  useEffect(() => {
    async function initialize() {
      if (pdClient) return; // Already initialized
      
      try {
        setIsInitializing(true);
        setError(null);
        console.log('Initializing Pipedream client...');
        
        if (!process.env['NEXT_PUBLIC_PIPEDREAM_CLIENT_ID']) {
          throw new Error('Missing Pipedream client ID in environment variables');
        }
        
        const client = createFrontendClient();
        console.log('Pipedream client initialized successfully');
        setPdClient(client);
      } catch (err) {
        console.error('Error initializing Pipedream client:', err);
        const error = err instanceof Error ? err : new Error('Failed to initialize Pipedream client');
        setError(error);
        
        if (retryCount < 2) {
          console.log(`Retrying client initialization (attempt ${retryCount + 1})...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => initialize(), 1000);
        } else if (onError) {
          onError(error);
        }
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();
  }, [onError, pdClient, retryCount]) // eslint-disable-line react-hooks/exhaustive-deps

  // Function to connect to a service
  const connectService = useCallback(async (appSlug: string, oauthAppId?: string) => {
    if (!pdClient) {
      const errorMsg = 'Pipedream client not initialized';
      console.error(errorMsg);
      toast.error(errorMsg);
      setError(new Error(errorMsg));
      if (onError) onError(new Error(errorMsg));
      return;
    }

    if (!userId) {
      const errorMsg = 'User ID not available. Cannot create connection token.';
      console.error(errorMsg);
      toast.error(errorMsg);
      setError(new Error(errorMsg));
      if (onError) onError(new Error(errorMsg));
      return;
    }

    setIsConnecting(true);
    setError(null);
    let fetchedToken: string | null = null;

    try {
      // Step 1: Fetch the Pipedream connection token on demand
      console.log('Requesting Pipedream connection token for connectService...');
      const tokenResponse = await fetch('/api/pipedream/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          external_user_id: userId,
          user_facing_label: `Connection for user ${userId} with ${appSlug}`
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create Pipedream token for connection');
      }
      
      const tokenData = await tokenResponse.json();
      if (!tokenData.token) {
        throw new Error('Token response missing token value');
      }
      fetchedToken = tokenData.token;
      setToken(fetchedToken); // Set token in state
      console.log('Pipedream token created successfully for connectService');

      // Step 2: Proceed with Pipedream account connection
      console.log(`Connecting to ${appSlug} using fetched token...`);
      
      const connectConfig: any = {
        app: appSlug,
        token: fetchedToken, // Use the just-fetched token
        onSuccess: ({ id }: { id: string     }) => {
          setIsConnecting(false);
          console.log(`Successfully connected to ${appSlug}`, id);
          toast.success(`Successfully connected to ${appSlug}`);
          if (onSuccess) onSuccess(id);
        },
        onError: (connectError: any) => {
          setIsConnecting(false);
          const errorMsg = connectError?.message || `Failed to connect to ${appSlug}`;
          console.error('Connection error:', errorMsg, connectError);
          toast.error(errorMsg);
          const newError = new Error(errorMsg);
          setError(newError);
          if (onError) onError(newError);
        }
      };

      if (oauthAppId) {
        console.log(`Using OAuth app ID: ${oauthAppId}`);
        connectConfig.oauthAppId = oauthAppId;
      } else {
        console.warn('No OAuth app ID provided, using default');
      }

      await pdClient.connectAccount(connectConfig);

    } catch (err) {
      setIsConnecting(false);
      const errorMessage = err instanceof Error ? err.message : `Failed to connect to ${appSlug}`;
      console.error('Overall connection error:', errorMessage, err);
      
      const newError = err instanceof Error ? err : new Error(errorMessage);
      setError(newError);
      toast.error(errorMessage);
      if (onError) onError(newError);
    }
  }, [pdClient, userId, onSuccess, onError]) // eslint-disable-line react-hooks/exhaustive-deps

  return { connectService,
    isInitializing,
    isConnecting,
    isReady: !!pdClient,
    error
      };
} 
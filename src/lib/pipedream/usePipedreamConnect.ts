import { useState, useEffect, useCallback } from 'react';
import { createFrontendClient } from '@pipedream/sdk/browser';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/lib/userStore';

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
        
        // Check for required environment variable
        if (!process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID) {
          throw new Error('Missing Pipedream client ID in environment variables');
        }
        
        const client = createFrontendClient();
        console.log('Pipedream client initialized successfully');
        setPdClient(client);
      } catch (err) {
        console.error('Error initializing Pipedream client:', err);
        const error = err instanceof Error ? err : new Error('Failed to initialize Pipedream client');
        setError(error);
        
        // Retry initialization if it failed (with a limit)
        if (retryCount < 2) {
          console.log(`Retrying client initialization (attempt ${retryCount + 1})...`);
          setRetryCount(prev => prev + 1);
          // Retry after a short delay
          setTimeout(() => initialize(), 1000);
        } else if (onError) {
          onError(error);
        }
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();
  }, [onError, pdClient, retryCount]);

  // Get Pipedream token when user changes
  useEffect(() => {
    if (!userId) {
      console.log('No user ID available, skipping token creation');
      return;
    }

    // Only fetch token if client is initialized
    if (!pdClient) {
      console.log('Pipedream client not initialized, skipping token creation');
      return;
    }

    async function getToken() {
      try {
        console.log('Requesting Pipedream connection token...');
        
        // Use fetch API instead of direct server call
        const response = await fetch('/api/pipedream/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            external_user_id: userId,
            user_facing_label: `Connection for user ${userId}`
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || errorData.error || 'Failed to create token');
        }
        
        const data = await response.json();
        
        if (!data.token) {
          throw new Error('Token response missing token value');
        }
        
        console.log('Pipedream token created successfully');
        setToken(data.token);
      } catch (err) {
        console.error('Error creating Pipedream token:', err);
        const error = err instanceof Error ? err : new Error('Failed to create Pipedream token');
        setError(error);
        if (onError) onError(error);
        
        // Show error to user
        toast.error('Failed to create connection token. Please try again later.');
      }
    }

    getToken();
  }, [userId, onError, pdClient]);

  // Function to connect to a service
  const connectService = useCallback(async (appSlug: string, oauthAppId?: string) => {
    if (!pdClient) {
      const errorMsg = 'Pipedream client not initialized';
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!token) {
      const errorMsg = 'Pipedream connection token not available';
      console.error(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log(`Connecting to ${appSlug}...`);
      
      // Prepare config
      const connectConfig: any = {
        app: appSlug,
        token,
        onSuccess: ({ id }: { id: string }) => {
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
          const error = new Error(errorMsg);
          setError(error);
          if (onError) onError(error);
        }
      };

      // Add OAuth app ID if provided
      if (oauthAppId) {
        console.log(`Using OAuth app ID: ${oauthAppId}`);
        connectConfig.oauthAppId = oauthAppId;
      } else {
        console.warn('No OAuth app ID provided, using default');
      }

      // Launch the connection flow
      await pdClient.connectAccount(connectConfig);
    } catch (err) {
      setIsConnecting(false);
      const errorMessage = err instanceof Error ? err.message : `Failed to connect to ${appSlug}`;
      console.error('Connection error:', errorMessage, err);
      
      const error = err instanceof Error ? err : new Error(errorMessage);
      setError(error);
      
      toast.error(errorMessage);
      
      if (onError) onError(error);
    }
  }, [pdClient, token, onSuccess, onError]);

  return {
    connectService,
    isInitializing,
    isConnecting,
    isReady: !!pdClient && !!token,
    error
  };
} 
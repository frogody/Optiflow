import { useState, useEffect, useCallback } from 'react';
import { createFrontendClient } from '@pipedream/sdk/browser';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/lib/userStore';
import { serverConnectTokenCreate } from './server';

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

  // Initialize the Pipedream client
  useEffect(() => {
    async function initialize() {
      try {
        setIsInitializing(true);
        const client = createFrontendClient();
        setPdClient(client);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Pipedream client');
        setError(error);
        if (onError) onError(error);
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();
  }, [onError]);

  // Get Pipedream token when user changes
  useEffect(() => {
    if (!userId) return;

    async function getToken() {
      try {
        const { token: newToken } = await serverConnectTokenCreate({
          external_user_id: userId
        });
        setToken(newToken);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create Pipedream token');
        setError(error);
        if (onError) onError(error);
      }
    }

    getToken();
  }, [userId, onError]);

  // Function to connect to a service
  const connectService = useCallback(async (appSlug: string, oauthAppId?: string) => {
    if (!pdClient || !token) {
      toast.error('Pipedream client not ready');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Prepare config
      const connectConfig: any = {
        app: appSlug,
        token,
        onSuccess: ({ id }: { id: string }) => {
          setIsConnecting(false);
          toast.success(`Successfully connected to ${appSlug}`);
          if (onSuccess) onSuccess(id);
        }
      };

      // Add OAuth app ID if provided
      if (oauthAppId) {
        connectConfig.oauthAppId = oauthAppId;
      }

      // Launch the connection flow
      await pdClient.connectAccount(connectConfig);
    } catch (err) {
      setIsConnecting(false);
      const error = err instanceof Error ? err : new Error(`Failed to connect to ${appSlug}`);
      setError(error);
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
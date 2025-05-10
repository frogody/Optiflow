import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { PipedreamService } from '@/services/PipedreamService';

interface UsePipedreamOptions {
  appName?: string;
  autoConnect?: boolean;
}

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  error?: string;
}

export function usePipedream(options: UsePipedreamOptions = {}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected',
  });

  const pipedreamService = PipedreamService.getInstance({
    environment: process.env.NODE_ENV,
    apiKey: process.env.PIPEDREAM_API_KEY,
  });

  const checkAuth = useCallback(() => {
    if (!session?.user?.id) {
      throw new Error('User must be logged in');
    }
    if (!options.appName) {
      throw new Error('App name is required');
    }
    return session.user.id;
  }, [session, options.appName]);

  const connectToApp = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus({ status: 'connecting' });

      const userId = checkAuth();
      const result = await pipedreamService.connectToApp(
        options.appName!,
        userId
      );

      setConnectionStatus({ status: result.status });
      toast.success(`Successfully connected to ${options.appName}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to app';
      setError(errorMessage);
      setConnectionStatus({ status: 'error', error: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [options.appName, checkAuth]);

  const makeRequest = useCallback(
    async <T>(endpoint: string, method: string, data?: any): Promise<T> => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = checkAuth();

        const response = await pipedreamService.makeApiRequest<T>(
          options.appName!,
          userId,
          endpoint,
          method,
          data
        );

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'API request failed';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options.appName, checkAuth]
  );

  const disconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = checkAuth();

      const result = await pipedreamService.disconnectApp(
        options.appName!,
        userId
      );
      setConnectionStatus({ status: result.status });
      toast.success(`Successfully disconnected from ${options.appName}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to disconnect from app';
      setError(errorMessage);
      setConnectionStatus({ status: 'error', error: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [options.appName, checkAuth]);

  return {
    isLoading,
    error,
    connectionStatus,
    connectToApp,
    makeRequest,
    disconnect,
  };
}

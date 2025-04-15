import { useEffect, useState } from 'react';
import { PipedreamService } from '@/services/PipedreamService';
import { pipedreamConfig } from '@/config/pipedream';
import { useUserStore } from '@/lib/userStore';

interface UsePipedreamOptions {
  appName: string;
  autoConnect?: boolean;
}

export function usePipedream({ appName, autoConnect = false }: UsePipedreamOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useUserStore();
  
  const pipedreamService = new PipedreamService(pipedreamConfig);

  useEffect(() => {
    if (autoConnect && currentUser && !isConnecting) {
      connectToApp();
    }
  }, [currentUser, autoConnect]);

  const connectToApp = async () => {
    if (!currentUser) {
      setError(new Error('User must be logged in to connect to app'));
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      await pipedreamService.connectToApp(appName, currentUser.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect to app'));
    } finally {
      setIsConnecting(false);
    }
  };

  const makeRequest = async (endpoint: string, method: string, data?: any) => {
    if (!currentUser) {
      throw new Error('User must be logged in to make requests');
    }

    return pipedreamService.makeApiRequest(appName, currentUser.id, {
      endpoint,
      method,
      data
    });
  };

  const disconnect = async () => {
    if (!currentUser) return;
    await pipedreamService.disconnectApp(appName, currentUser.id);
  };

  return {
    connect: connectToApp,
    makeRequest,
    disconnect,
    isConnecting,
    error
  };
} 
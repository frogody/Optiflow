import { useState } from 'react';
import { PipedreamBrowserService } from '@/services/PipedreamBrowserService';

interface UsePipedreamBrowserOptions {
  appName: string;
}

export function usePipedreamBrowser({ appName }: UsePipedreamBrowserOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const service = new PipedreamBrowserService();

  const connectToApp = async (token: string) => {
    try {
      setIsConnecting(true);
      setError(null);
      await service.connectToApp(appName, token);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect to app'));
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectionStatus = () => {
    return service.getConnectionStatus(appName);
  };

  return {
    connect: connectToApp,
    getStatus: getConnectionStatus,
    isConnecting,
    error
  };
} 
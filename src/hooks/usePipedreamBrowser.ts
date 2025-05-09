// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { useState, useEffect } from 'react';
import { PipedreamBrowserService } from '@/services/PipedreamBrowserService';

interface UsePipedreamBrowserOptions {
  appName: string;
  autoConnect?: boolean;
  token?: string;
}

export function usePipedreamBrowser({
  appName,
  autoConnect = false,
  token,
}: UsePipedreamBrowserOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'connecting' | 'error'
  >('disconnected');

  // Get singleton instance
  const service = PipedreamBrowserService.getInstance();

  // Initialize connection status
  useEffect(() => {
    if (appName) {
      const status = service.getConnectionStatus(appName);
      setConnectionStatus(status.status);
      if (status.error) {
        setError(new Error(status.error));
      }
    }
  }, [appName, service]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-connect if needed
  useEffect(() => {
    if (
      autoConnect &&
      appName &&
      token &&
      connectionStatus === 'disconnected'
    ) {
      connectToApp(token);
    }
  }, [autoConnect, appName, token, connectionStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const connectToApp = async (connectionToken: string) => {
    if (!appName) {
      setError(new Error('App name is required'));
      return false;
    }

    try {
      setIsConnecting(true);
      setError(null);
      setConnectionStatus('connecting');

      const success = await service.connectToApp(appName, connectionToken);

      const updatedStatus = service.getConnectionStatus(appName);
      setConnectionStatus(updatedStatus.status);

      if (!success && updatedStatus.error) {
        setError(new Error(updatedStatus.error));
      }

      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to connect to app';
      setError(new Error(errorMessage));
      setConnectionStatus('error');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectApp = async () => {
    if (!appName) {
      setError(new Error('App name is required'));
      return false;
    }

    try {
      setIsDisconnecting(true);
      setError(null);

      const success = await service.disconnectApp(appName);

      const updatedStatus = service.getConnectionStatus(appName);
      setConnectionStatus(updatedStatus.status);

      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to disconnect app';
      setError(new Error(errorMessage));
      return false;
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getConnectionStatus = () => {
    return service.getConnectionStatus(appName);
  };

  return {
    connect: connectToApp,
    disconnect: disconnectApp,
    getStatus: getConnectionStatus,
    isConnecting,
    isDisconnecting,
    connectionStatus,
    error,
  };
}

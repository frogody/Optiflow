import { useEffect, useState, useCallback } from 'react';
import { PipedreamService } from '@/services/PipedreamService';
import { pipedreamConfig } from '@/config/pipedream';
import { useUserStore } from '@/lib/userStore';
import { toast } from 'react-hot-toast';

interface UsePipedreamOptions {
  appName: string;
  autoConnect?: boolean;
}

export function usePipedream({ appName, autoConnect = false }: UsePipedreamOptions) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const { currentUser } = useUserStore();
  
  // Ensure environment is typed correctly
  const config = {
    ...pipedreamConfig,
    environment: pipedreamConfig.environment as 'development' | 'production' | undefined
  };
  
  // Get singleton instance
  const pipedreamService = PipedreamService.getInstance(config);

  // Define connectToApp function using useCallback to avoid dependency cycles
  const connectToApp = useCallback(async () => {
    if (!currentUser) {
      const error = new Error('User must be logged in to connect to app');
      setError(error);
      toast.error(error.message);
      return;
    }

    if (!appName) {
      const error = new Error('App name is required');
      setError(error);
      toast.error(error.message);
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      const status = await pipedreamService.connectToApp(appName, currentUser.id);
      setConnectionStatus(status.status);
      
      if (status.status === 'error' && status.error) {
        const error = new Error(status.error);
        setError(error);
        toast.error(`Connection error: ${status.error}`);
      } else if (status.status === 'connected') {
        toast.success(`Connected to ${appName} successfully!`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to app';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [currentUser, appName, pipedreamService]);

  // Initialize connection status
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!currentUser || !appName) return;
      
      try {
        const status = await pipedreamService.getConnectionStatus(appName, currentUser.id);
        setConnectionStatus(status.status);
        if (status.error) {
          setError(new Error(status.error));
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Failed to check connection status:', err);
        setError(err instanceof Error ? err : new Error('Failed to check connection status'));
      }
    };
    
    checkConnectionStatus();
  }, [currentUser, appName, pipedreamService]);

  // Auto-connect if needed
  useEffect(() => {
    if (autoConnect && currentUser && appName && connectionStatus === 'disconnected' && !isConnecting) {
      connectToApp();
    }
  }, [autoConnect, currentUser, appName, connectionStatus, isConnecting, connectToApp]);

  const makeRequest = async <T,>(endpoint: string, method: string, data?: any): Promise<T> => {
    if (!currentUser) {
      const error = new Error('User must be logged in to make requests');
      toast.error(error.message);
      throw error;
    }

    if (!appName) {
      const error = new Error('App name is required');
      toast.error(error.message);
      throw error;
    }

    try {
      return await pipedreamService.makeApiRequest<T>(
        appName, 
        currentUser.id, 
        endpoint, 
        method as any, 
        data
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'API request failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const disconnect = async () => {
    if (!currentUser) {
      const error = new Error('User must be logged in to disconnect app');
      setError(error);
      toast.error(error.message);
      return;
    }

    if (!appName) {
      const error = new Error('App name is required');
      setError(error);
      toast.error(error.message);
      return;
    }

    try {
      setIsDisconnecting(true);
      await pipedreamService.disconnectApp(appName, currentUser.id);
      setConnectionStatus('disconnected');
      toast.success(`Disconnected from ${appName} successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect app';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return {
    connect: connectToApp,
    makeRequest,
    disconnect,
    isConnecting,
    isDisconnecting,
    connectionStatus,
    error
  };
} 
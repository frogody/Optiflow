import { useCallback, useEffect, useState } from 'react';

import { useUserStore } from '@/lib/userStore';
import {
  MCPAppInfo,
  MCPConnection,
  PipedreamMCPConfig,
  PipedreamMCPService,
} from '@/services/PipedreamMCPService';

// Default configuration for the Pipedream MCP service - update with your values
const defaultConfig: PipedreamMCPConfig = {
  clientId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || 'your-client-id',
  clientSecret:
    process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_SECRET || 'your-client-secret',
  projectId: process.env.NEXT_PUBLIC_PIPEDREAM_PROJECT_ID || 'your-project-id',
  redirectUri:
    process.env.NEXT_PUBLIC_PIPEDREAM_REDIRECT_URI || window?.location?.origin
      ? `${window.location.origin}/api/oauth/callback`
      : 'http://localhost:3000/api/oauth/callback',
  environment:
    process.env.NODE_ENV === 'production' ? 'production' : 'development',
};

export interface UsePipedreamMCPOptions {
  config?: Partial<PipedreamMCPConfig>;
  appId?: string;
  autoConnect?: boolean;
}

export function usePipedreamMCP({
  config = {},
  appId,
  autoConnect = false,
}: UsePipedreamMCPOptions = {}) {
  const { currentUser } = useUserStore();
  const userId = currentUser?.id;

  const [mcpApps, setMcpApps] = useState<MCPAppInfo[]>([]);
  const [userConnections, setUserConnections] = useState<MCPConnection[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    appId || null
  );
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'connecting' | 'error' | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize service
  const getMCPService = useCallback(() => {
    // Merge default config with provided config
    const mergedConfig: PipedreamMCPConfig = {
      ...defaultConfig,
      ...config,
      redirectUri:
        config.redirectUri ||
        (window?.location?.origin
          ? `${window.location.origin}/api/oauth/callback`
          : defaultConfig.redirectUri),
    };

    return PipedreamMCPService.getInstance(mergedConfig);
  }, [config]);

  // Fetch available MCP apps
  const fetchAvailableApps = useCallback(
    async (forceRefresh = false) => {
      if (!userId) return [];

      try {
        setIsLoading(true);
        setError(null);

        const service = getMCPService();
        const apps = await service.getAvailableApps(forceRefresh);
        setMcpApps(apps);
        return apps;
      } catch (err) {
        console.error('Error fetching available apps:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch available apps')
        );
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [userId, getMCPService]
  );

  // Fetch user connections
  const fetchUserConnections = useCallback(async () => {
    if (!userId) return [];

    try {
      setIsLoading(true);

      const service = getMCPService();
      const connections = service.getUserConnections(userId);
      setUserConnections(connections);
      return connections;
    } catch (err) {
      console.error('Error fetching user connections:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch user connections')
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, getMCPService]);

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    if (!userId || !selectedAppId) {
      setConnectionStatus(null);
      return;
    }

    try {
      const service = getMCPService();
      const connection = service.getConnectionStatus(selectedAppId, userId);

      if (connection) {
        setConnectionStatus(connection.status);
        if (connection.error) {
          setError(new Error(connection.error));
        }
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (err) {
      console.error('Error updating connection status:', err);
      setConnectionStatus('error');
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to update connection status')
      );
    }
  }, [userId, selectedAppId, getMCPService]);

  // Initialize data on mount and when dependencies change
  useEffect(() => {
    if (userId) {
      // Fetch available apps and user connections
      fetchAvailableApps();
      fetchUserConnections();
    }
  }, [userId, fetchAvailableApps, fetchUserConnections]);

  // Update connection status when selected app or user changes
  useEffect(() => {
    updateConnectionStatus();
  }, [userId, selectedAppId, updateConnectionStatus]);

  // Initiate OAuth flow to connect an app
  const connectOAuthApp = useCallback(
    async (appIdToConnect: string) => {
      if (!userId) {
        setError(new Error('User not logged in'));
        return null;
      }

      try {
        setSelectedAppId(appIdToConnect);
        setIsConnecting(true);
        setError(null);

        const service = getMCPService();

        // Get the OAuth URL
        const oauthUrl = service.getOAuthURL(appIdToConnect, userId);

        // Update status
        setConnectionStatus('connecting');

        // In a real application, you would:
        // 1. Open a popup window with the OAuth URL
        // 2. Wait for the callback to complete the flow
        // For this demo, we'll just log the URL and simulate a connection
        console.log('OAuth URL:', oauthUrl);

        // Open the OAuth URL in a new window
        window.open(oauthUrl, 'PipedreamOAuth', 'width=800,height=600');

        // In a real app, we would listen for a message from the popup window
        // indicating the OAuth flow completed, and then update our state

        return oauthUrl;
      } catch (err) {
        console.error('Error initiating OAuth flow:', err);
        setConnectionStatus('error');
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to initiate OAuth flow')
        );
        return null;
      } finally {
        setIsConnecting(false);
      }
    },
    [userId, getMCPService]
  );

  // Connect with API Key
  const connectWithApiKey = useCallback(
    async (appIdToConnect: string, apiKey: string) => {
      if (!userId) {
        setError(new Error('User not logged in'));
        return false;
      }

      try {
        setSelectedAppId(appIdToConnect);
        setIsConnecting(true);
        setError(null);
        setConnectionStatus('connecting');

        const service = getMCPService();
        const connection = await service.connectWithApiKey(
          appIdToConnect,
          userId,
          apiKey
        );

        if (connection) {
          setConnectionStatus(connection.status);

          // Update user connections list
          await fetchUserConnections();

          return connection.status === 'connected';
        }

        setConnectionStatus('error');
        setError(new Error('Failed to connect with API key'));
        return false;
      } catch (err) {
        console.error('Error connecting with API key:', err);
        setConnectionStatus('error');
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to connect with API key')
        );
        return false;
      } finally {
        setIsConnecting(false);
      }
    },
    [userId, getMCPService, fetchUserConnections]
  );

  // Disconnect an app
  const disconnectApp = useCallback(
    async (appIdToDisconnect: string) => {
      if (!userId) {
        setError(new Error('User not logged in'));
        return false;
      }

      try {
        setSelectedAppId(appIdToDisconnect);
        setIsDisconnecting(true);
        setError(null);

        const service = getMCPService();
        const success = await service.disconnectApp(appIdToDisconnect, userId);

        if (success) {
          setConnectionStatus('disconnected');

          // Update user connections list
          await fetchUserConnections();

          return true;
        }

        return false;
      } catch (err) {
        console.error('Error disconnecting app:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to disconnect app')
        );
        return false;
      } finally {
        setIsDisconnecting(false);
      }
    },
    [userId, getMCPService, fetchUserConnections]
  );

  // Make an API request to a connected app
  const makeApiRequest = useCallback(
    async <T>(
      appIdToUse: string,
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      data?: unknown
    ): Promise<T | null> => {
      if (!userId) {
        setError(new Error('User not logged in'));
        return null;
      }

      try {
        setError(null);

        const service = getMCPService();
        const response = await service.makeApiRequest<T>(
          appIdToUse,
          userId,
          endpoint,
          method,
          data
        );

        return response;
      } catch (err) {
        console.error('Error making API request:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to make API request')
        );
        return null;
      }
    },
    [userId, getMCPService]
  );

  // Get connection status for a specific app
  const getConnectionStatusForApp = useCallback(
    (appIdToCheck: string): MCPConnection | null => {
      if (!userId) return null;

      try {
        const service = getMCPService();
        return service.getConnectionStatus(appIdToCheck, userId);
      } catch (err) {
        console.error('Error getting connection status:', err);
        return null;
      }
    },
    [userId, getMCPService]
  );

  // Get app details by ID
  const getAppById = useCallback(
    async (appIdToGet: string): Promise<MCPAppInfo | null> => {
      try {
        const service = getMCPService();
        return await service.getAppById(appIdToGet);
      } catch (err) {
        console.error('Error getting app details:', err);
        return null;
      }
    },
    [getMCPService]
  );

  return {
    // Data
    apps: mcpApps,
    userConnections,
    connectionStatus,
    selectedAppId,
    isLoading,
    isConnecting,
    isDisconnecting,
    error,

    // Actions
    setSelectedAppId,
    fetchAvailableApps,
    fetchUserConnections,
    connectOAuthApp,
    connectWithApiKey,
    disconnectApp,
    makeApiRequest,
    getConnectionStatusForApp,
    getAppById,
  };
}

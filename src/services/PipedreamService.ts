import { createBackendClient } from '@pipedream/sdk/server';

interface PipedreamConfig {
  clientId: string;
  clientSecret: string;
  projectId: string;
  environment?: 'development' | 'production';
}

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  error?: string;
}

export class PipedreamService {
  private client: ReturnType<typeof createBackendClient>;
  private connections: Map<string, ConnectionStatus>;

  constructor(config: PipedreamConfig) {
    const clientOpts = {
      environment: config.environment || 'development',
      projectId: config.projectId,
      credentials: {
        clientId: config.clientId,
        clientSecret: config.clientSecret
      }
    };
    this.client = createBackendClient(clientOpts);
    this.connections = new Map();
  }

  async getConnectionStatus(appId: string, userId: string): Promise<ConnectionStatus> {
    try {
      const key = `${appId}:${userId}`;
      const status = this.connections.get(key) || {
        status: 'disconnected'
      };
      return status;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async connectToApp(appId: string, userId: string): Promise<ConnectionStatus> {
    try {
      const key = `${appId}:${userId}`;
      
      // Attempt to establish connection
      await this.client.getAccounts({
        app: appId,
        external_user_id: userId
      });

      const status: ConnectionStatus = {
        status: 'connected',
        lastConnected: new Date()
      };
      this.connections.set(key, status);
      return status;
    } catch (error) {
      console.error('Error connecting to app:', error);
      const errorStatus: ConnectionStatus = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.connections.set(`${appId}:${userId}`, errorStatus);
      return errorStatus;
    }
  }

  async makeApiRequest<T>(
    appId: string, 
    userId: string,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown
  ): Promise<T> {
    try {
      // Check connection status first
      const status = await this.getConnectionStatus(appId, userId);
      if (status.status === 'error') {
        throw new Error(`Connection error: ${status.error}`);
      }
      if (status.status === 'disconnected') {
        await this.connectToApp(appId, userId);
      }

      // Make the API request
      const response = await this.client.runAction({
        actionId: {
          key: endpoint
        },
        configuredProps: data as Record<string, any>,
        externalUserId: userId
      });

      return response as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error instanceof Error ? error : new Error('API request failed');
    }
  }

  async disconnectApp(appId: string, userId: string): Promise<void> {
    try {
      const key = `${appId}:${userId}`;
      await this.client.deleteAccount(appId);
      this.connections.delete(key);
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error instanceof Error ? error : new Error('Failed to disconnect');
    }
  }

  async disconnectAllApps(appId: string): Promise<void> {
    try {
      await this.client.deleteAccountsByApp(appId);
      // Clear all connections for this app
      Array.from(this.connections.entries()).forEach(([key]) => {
        if (key.startsWith(`${appId}:`)) {
          this.connections.delete(key);
        }
      });
    } catch (error) {
      console.error('Error disconnecting all:', error);
      throw error instanceof Error ? error : new Error('Failed to disconnect all');
    }
  }
} 
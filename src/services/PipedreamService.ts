import { createClient } from "@pipedream/sdk";

interface PipedreamConfig {
  apiKey: string;
  apiSecret: string;
}

interface ApiRequestOptions {
  endpoint: string;
  method: string;
  data?: any;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface Connection {
  status: ConnectionStatus;
  lastConnected?: Date;
  error?: string;
  connection: any;
}

export class PipedreamService {
  private client: any;
  private connections: Map<string, Connection>;

  constructor(config: PipedreamConfig) {
    this.client = createClient({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret
    });
    this.connections = new Map();
  }

  private getConnectionKey(appName: string, userId: string): string {
    return `${appName}-${userId}`;
  }

  async getConnectionStatus(appName: string, userId: string): Promise<ConnectionStatus> {
    const key = this.getConnectionKey(appName, userId);
    return this.connections.get(key)?.status || 'disconnected';
  }

  async connectToApp(appName: string, userId: string) {
    const key = this.getConnectionKey(appName, userId);
    
    try {
      // Check if connection already exists
      const existingConnection = this.connections.get(key);
      if (existingConnection?.status === 'connected') {
        return existingConnection.connection;
      }

      // Update status to connecting
      this.connections.set(key, {
        status: 'connecting',
        connection: null
      });

      // Create new connection
      const connection = await this.client.connect({
        app: appName,
        externalUserId: userId
      });

      // Store successful connection
      this.connections.set(key, {
        status: 'connected',
        lastConnected: new Date(),
        connection
      });
      
      console.log(`Connected to ${appName} successfully for user ${userId}`);
      return connection;
    } catch (error) {
      // Store error state
      this.connections.set(key, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        connection: null
      });
      
      console.error(`Failed to connect to ${appName}:`, error);
      throw error;
    }
  }

  async makeApiRequest(appName: string, userId: string, options: ApiRequestOptions) {
    const key = this.getConnectionKey(appName, userId);
    
    try {
      const connection = await this.connectToApp(appName, userId);
      const response = await connection.makeRequest({
        endpoint: options.endpoint,
        method: options.method,
        data: options.data
      });

      return response;
    } catch (error) {
      // Update connection status on error
      this.connections.set(key, {
        status: 'error',
        error: error instanceof Error ? error.message : 'API request failed',
        connection: this.connections.get(key)?.connection
      });
      
      console.error('API request failed:', error);
      throw error;
    }
  }

  async disconnectApp(appName: string, userId: string) {
    const key = this.getConnectionKey(appName, userId);
    const connectionData = this.connections.get(key);
    
    if (connectionData?.connection) {
      try {
        // Implement any necessary cleanup for the specific app
        // For example: await connectionData.connection.disconnect();
        
        this.connections.set(key, {
          status: 'disconnected',
          connection: null
        });
        
        console.log(`Disconnected from ${appName} for user ${userId}`);
      } catch (error) {
        console.error(`Error disconnecting from ${appName}:`, error);
        throw error;
      }
    }
  }

  async disconnectAll() {
    const entries = Array.from(this.connections.entries());
    for (const [key, connectionData] of entries) {
      const [appName, userId] = key.split('-');
      await this.disconnectApp(appName, userId);
    }
  }
} 
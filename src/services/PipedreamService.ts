// PipedreamService.ts
// MOCK VERSION for development - replace with actual implementation

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
  private connections: Map<string, ConnectionStatus>;
  private static instance: PipedreamService | null = null;
  private config: PipedreamConfig;

  // Singleton pattern
  public static getInstance(config: PipedreamConfig): PipedreamService {
    if (!PipedreamService.instance) {
      PipedreamService.instance = new PipedreamService(config);
    }
    return PipedreamService.instance;
  }

  private constructor(config: PipedreamConfig) {
    this.config = config;
    // Mock client setup would happen here in a real implementation
    this.connections = new Map();
  }

  async getConnectionStatus(appId: string, userId: string): Promise<ConnectionStatus> {
    if (!appId || !userId) {
      return {
        status: 'error',
        error: 'Missing required parameters: appId and userId'
      };
    }
    
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
    if (!appId || !userId) {
      const errorStatus: ConnectionStatus = {
        status: 'error',
        error: 'Missing required parameters: appId and userId'
      };
      return errorStatus;
    }
    
    try {
      const key = `${appId}:${userId}`;
      
      // Mock connection - in a real implementation, this would use the SDK
      // Simulate a successful connection after a delay
      return new Promise((resolve) => {
        setTimeout(() => {
          const status: ConnectionStatus = {
            status: 'connected',
            lastConnected: new Date()
          };
          this.connections.set(key, status);
          resolve(status);
        }, 1500);
      });
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
    if (!appId || !userId) {
      throw new Error('Missing required parameters: appId and userId');
    }
    
    try {
      // Check connection status first
      const status = await this.getConnectionStatus(appId, userId);
      if (status.status === 'error') {
        throw new Error(`Connection error: ${status.error}`);
      }
      if (status.status === 'disconnected') {
        await this.connectToApp(appId, userId);
      }

      // Mock API request
      return new Promise((resolve) => {
        setTimeout(() => {
          // Return mock data appropriate for the endpoint
          if (endpoint === '/connections') {
            resolve({
              success: true,
              status: 'connected',
              data: [
                { id: 'conn1', name: 'Connection 1', status: 'active' },
                { id: 'conn2', name: 'Connection 2', status: 'active' }
              ]
            } as unknown as T);
          } else {
            resolve({ success: true, status: 'ok' } as unknown as T);
          }
        }, 800);
      });
    } catch (error) {
      console.error('API request failed:', error);
      throw error instanceof Error ? error : new Error('API request failed');
    }
  }

  async disconnectApp(appId: string, userId: string): Promise<void> {
    if (!appId || !userId) {
      throw new Error('Missing required parameters: appId and userId');
    }
    
    try {
      const key = `${appId}:${userId}`;
      // Mock disconnection - in a real implementation, this would use the SDK
      this.connections.delete(key);
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error instanceof Error ? error : new Error('Failed to disconnect');
    }
  }

  async disconnectAllApps(appId: string): Promise<void> {
    if (!appId) {
      throw new Error('Missing required parameter: appId');
    }
    
    try {
      // Mock disconnection - in a real implementation, this would use the SDK
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
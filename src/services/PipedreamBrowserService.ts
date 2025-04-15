import { createFrontendClient } from '@pipedream/sdk/browser';

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  error?: string;
}

export class PipedreamBrowserService {
  private client: ReturnType<typeof createFrontendClient>;
  private connections: Map<string, ConnectionStatus>;

  constructor() {
    this.client = createFrontendClient();
    this.connections = new Map();
  }

  async connectToApp(appName: string, token: string): Promise<boolean> {
    try {
      await this.client.connectAccount({
        app: appName,
        token,
        onSuccess: ({ id }) => {
          console.log(`Account successfully connected: ${id}`);
          const status: ConnectionStatus = {
            status: 'connected',
            lastConnected: new Date()
          };
          this.connections.set(appName, status);
        }
      });
      return true;
    } catch (error) {
      console.error('Error connecting to app:', error);
      const errorStatus: ConnectionStatus = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.connections.set(appName, errorStatus);
      return false;
    }
  }

  getConnectionStatus(appName: string): ConnectionStatus {
    try {
      return this.connections.get(appName) || {
        status: 'disconnected'
      };
    } catch (error) {
      console.error('Error getting connection status:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
} 
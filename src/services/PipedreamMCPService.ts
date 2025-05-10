// PipedreamMCPService.ts
// Service for integrating with Pipedream MCP Platform

import { delay, uuidv4 } from '@/lib/utils';

/**
 * Connection status for an app integrated with Pipedream
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * Configuration for Pipedream MCP service
 */
export interface PipedreamMCPConfig {
  clientId: string;
  clientSecret: string;
  projectId: string;
  redirectUri: string;
  environment: 'development' | 'production';
}

/**
 * Defines the connection between a user and an app
 */
export interface MCPConnection {
  id: string;
  userId: string;
  appId: string;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
  connectedAt?: Date;
  disconnectedAt?: Date;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  error?: string;
}

/**
 * App authentication type supported by Pipedream MCP
 */
export type MCPAuthType = 'oauth2' | 'apiKey' | 'both';

/**
 * App information structure
 */
export interface MCPAppInfo {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  publisher: string;
  authType: MCPAuthType;
  docUrl: string;
  categories: string[];
  website: string;
  endpoints: string[];
}

/**
 * Mock app data for Pipedream MCP integration
 */
const mockApps: MCPAppInfo[] = [
  { id: 'github',
    name: 'GitHub',
    description: 'Integrate with GitHub API for repository management, issues, and pull requests.',
    logoUrl: 'https://cdn.svgporn.com/logos/github-icon.svg',
    publisher: 'GitHub Inc.',
    authType: 'oauth2',
    docUrl: 'https://docs.github.com/en/rest',
    categories: ['Development', 'Version Control'],
    website: 'https://github.com',
    endpoints: ['/repos', '/issues', '/pulls']
      },
  { id: 'google_drive',
    name: 'Google Drive',
    description: 'Access and manage files stored in Google Drive.',
    logoUrl: 'https://cdn.svgporn.com/logos/google-drive.svg',
    publisher: 'Google LLC',
    authType: 'oauth2',
    docUrl: 'https://developers.google.com/drive/api/v3/reference',
    categories: ['Storage', 'Productivity'],
    website: 'https://drive.google.com',
    endpoints: ['/files', '/folders', '/comments']
      },
  { id: 'slack',
    name: 'Slack',
    description: 'Send messages, create channels, and manage your Slack workspace.',
    logoUrl: 'https://cdn.svgporn.com/logos/slack-icon.svg',
    publisher: 'Slack Technologies, Inc.',
    authType: 'both',
    docUrl: 'https://api.slack.com/methods',
    categories: ['Communication', 'Productivity'],
    website: 'https://slack.com',
    endpoints: ['/chat.postMessage', '/channels.list', '/users.info']
      },
  { id: 'stripe',
    name: 'Stripe',
    description: 'Process payments, manage subscriptions, and handle invoices with Stripe.',
    logoUrl: 'https://cdn.svgporn.com/logos/stripe.svg',
    publisher: 'Stripe, Inc.',
    authType: 'apiKey',
    docUrl: 'https://stripe.com/docs/api',
    categories: ['Payment', 'Finance'],
    website: 'https://stripe.com',
    endpoints: ['/customers', '/charges', '/subscriptions']
      },
  { id: 'dropbox',
    name: 'Dropbox',
    description: 'Store and share files in the cloud with Dropbox.',
    logoUrl: 'https://cdn.svgporn.com/logos/dropbox.svg',
    publisher: 'Dropbox, Inc.',
    authType: 'oauth2',
    docUrl: 'https://www.dropbox.com/developers/documentation/http/documentation',
    categories: ['Storage', 'Productivity'],
    website: 'https://www.dropbox.com',
    endpoints: ['/files', '/sharing', '/users']
      },
  { id: 'twitter',
    name: 'Twitter',
    description: 'Post tweets, read timelines, and manage followers on Twitter.',
    logoUrl: 'https://cdn.svgporn.com/logos/twitter.svg',
    publisher: 'Twitter, Inc.',
    authType: 'oauth2',
    docUrl: 'https://developer.twitter.com/en/docs/twitter-api',
    categories: ['Social Media', 'Communication'],
    website: 'https://twitter.com',
    endpoints: ['/tweets', '/users', '/search']
      },
  { id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Manage email marketing campaigns and subscriber lists.',
    logoUrl: 'https://cdn.svgporn.com/logos/mailchimp.svg',
    publisher: 'The Rocket Science Group LLC',
    authType: 'apiKey',
    docUrl: 'https://mailchimp.com/developer/marketing/api/root/',
    categories: ['Marketing', 'Email'],
    website: 'https://mailchimp.com',
    endpoints: ['/lists', '/campaigns', '/members']
      },
  { id: 'salesforce',
    name: 'Salesforce',
    description: 'Access CRM data, manage contacts, and automate sales processes.',
    logoUrl: 'https://cdn.svgporn.com/logos/salesforce.svg',
    publisher: 'Salesforce.com, Inc.',
    authType: 'oauth2',
    docUrl: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm',
    categories: ['CRM', 'Sales'],
    website: 'https://www.salesforce.com',
    endpoints: ['/accounts', '/contacts', '/opportunities']
      }
];

/**
 * Singleton service for interacting with the Pipedream Multi-Cloud Platform (MCP)
 * 
 * This is a mock implementation for local development and demonstration.
 * In a production environment, you would replace this with actual API calls to the Pipedream service.
 */
export class PipedreamMCPService {
  private static instance: PipedreamMCPService;
  private connectionMap: Map<string, MCPConnection> = new Map();
  private config: PipedreamMCPConfig;

  private constructor(config: PipedreamMCPConfig) { this.config = config;
    console.log('Initializing PipedreamMCPService with config:', config);
      }

  /**
   * Get singleton instance of the service
   */
  public static getInstance(config: PipedreamMCPConfig): PipedreamMCPService {
    if (!PipedreamMCPService.instance) {
      PipedreamMCPService.instance = new PipedreamMCPService(config);
    }
    return PipedreamMCPService.instance;
  }

  /**
   * Get available apps for integration
   */
  public async getAvailableApps(forceRefresh = false): Promise<MCPAppInfo[]> {
    // In a real implementation, you would fetch this from the Pipedream API
    // Simulate a network request
    await delay(500);
    return mockApps;
  }

  /**
   * Get app information by ID
   */
  public async getAppById(appId: string): Promise<MCPAppInfo | null> {
    // In a real implementation, you would fetch this from the Pipedream API
    await delay(300);
    return mockApps.find(app => app.id === appId) || null;
  }

  /**
   * Get OAuth authorization URL for the app
   */
  public getOAuthURL(appId: string, userId: string): string {
    const app = mockApps.find(a => a.id === appId);
    if (!app) {
      throw new Error(`App with ID ${appId} not found`);
    }

    if (app.authType !== 'oauth2' && app.authType !== 'both') {
      throw new Error(`App ${app.name} does not support OAuth authentication`);
    }

    // In a real implementation, this would be a URL to the Pipedream OAuth server
    const baseUrl = 'https://api.pipedream.com/oauth';
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'read write',
      state: JSON.stringify({ appId, userId }), // State is used to pass data to the callback
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Connect to an app using an API key
   */
  public async connectWithApiKey(appId: string, userId: string, apiKey: string): Promise<MCPConnection | null> {
    if (!appId || !userId || !apiKey) {
      throw new Error('App ID, user ID, and API key are required');
    }

    const app = mockApps.find(a => a.id === appId);
    if (!app) {
      throw new Error(`App with ID ${appId} not found`);
    }

    if (app.authType !== 'apiKey' && app.authType !== 'both') {
      throw new Error(`App ${app.name} does not support API key authentication`);
    }

    // Simulate validation with a delay
    await delay(1000);

    // Create a new connection record
    const connection: MCPConnection = { id: uuidv4(),
      userId,
      appId,
      status: 'connected',
      createdAt: new Date(),
      updatedAt: new Date(),
      connectedAt: new Date(),
      apiKey: apiKey // In a real app, you would encrypt this
        };

    // Store the connection (in a real app, this would be in a database)
    const connectionKey = this.getConnectionKey(appId, userId);
    this.connectionMap.set(connectionKey, connection);

    return connection;
  }

  /**
   * Handle OAuth callback and complete connection
   * This would normally be implemented on the server side
   */
  public async handleOAuthCallback(code: string, state: string): Promise<boolean> {
    try {
      // Parse state to get appId and userId
      const { appId, userId } = JSON.parse(state);
      
      if (!appId || !userId) {
        throw new Error('Invalid state parameter');
      }

      // In a real implementation, you would exchange the code for tokens
      await delay(1000);

      // Create a mock access token and refresh token
      const accessToken = `mock_access_token_${uuidv4()}`;
      const refreshToken = `mock_refresh_token_${uuidv4()}`;

      // Create a new connection record
      const connection: MCPConnection = { id: uuidv4(),
        userId,
        appId,
        status: 'connected',
        createdAt: new Date(),
        updatedAt: new Date(),
        connectedAt: new Date(),
        accessToken,
        refreshToken
          };

      // Store the connection
      const connectionKey = this.getConnectionKey(appId, userId);
      this.connectionMap.set(connectionKey, connection);

      return true;
    } catch (error) { console.error('Error handling OAuth callback:', error);
      return false;
        }
  }

  /**
   * Get connection status for an app
   */
  public getConnectionStatus(appId: string, userId: string): MCPConnection | null {
    if (!appId || !userId) {
      throw new Error('App ID and user ID are required');
    }

    const connectionKey = this.getConnectionKey(appId, userId);
    return this.connectionMap.get(connectionKey) || null;
  }

  /**
   * Get all connections for a user
   */
  public getUserConnections(userId: string): MCPConnection[] {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return Array.from(this.connectionMap.values())
      .filter(connection => connection.userId === userId);
  }

  /**
   * Disconnect from an app
   */
  public async disconnectApp(appId: string, userId: string): Promise<boolean> {
    if (!appId || !userId) {
      throw new Error('App ID and user ID are required');
    }

    const connectionKey = this.getConnectionKey(appId, userId);
    const connection = this.connectionMap.get(connectionKey);

    if (!connection) {
      return false;
    }

    // Update the connection status
    connection.status = 'disconnected';
    connection.updatedAt = new Date();
    connection.disconnectedAt = new Date();
    
    // In a real implementation, you would revoke tokens if using OAuth
    
    // Update the stored connection
    this.connectionMap.set(connectionKey, connection);

    return true;
  }

  /**
   * Make an API request to a connected app
   */
  public async makeApiRequest<T>(
    appId: string,
    userId: string,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown
  ): Promise<T | null> {
    if (!appId || !userId) {
      throw new Error('App ID and user ID are required');
    }

    const connection = this.getConnectionStatus(appId, userId);
    if (!connection || connection.status !== 'connected') {
      throw new Error(`Not connected to app ${appId}`);
    }

    // In a real implementation, you would make an API request to the Pipedream service
    // For demonstration purposes, we'll simulate a network request
    await delay(500);

    // Simulate a successful response
    return {} as T;
  }

  /**
   * Helper method to generate a unique connection key
   */
  private getConnectionKey(appId: string, userId: string): string {
    return `${appId}-${userId}`;
  }
}
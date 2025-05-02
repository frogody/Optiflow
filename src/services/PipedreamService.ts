// PipedreamService.ts
// MOCK VERSION for development - replace with actual implementation

import { Workflow, WorkflowNode, WorkflowEdge } from '@prisma/client';

export interface PipedreamConfig {
  environment?: 'development' | 'production';
  apiKey?: string;
  projectId?: string;
}

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  error?: string;
}

export interface PipedreamIntegration {
  id: string;
  name: string;
  description?: string;
  version: string;
  type: string;
}

export class PipedreamService {
  private static instance: PipedreamService;
  private mockWorkflows: Map<string, any> = new Map();
  private mockNodes: Map<string, any> = new Map();
  private mockEdges: Map<string, any> = new Map();
  private config: PipedreamConfig;

  private constructor(config?: PipedreamConfig) {
    this.config = config || {};
  }

  public static getInstance(config?: PipedreamConfig): PipedreamService {
    if (!PipedreamService.instance) {
      PipedreamService.instance = new PipedreamService(config);
    } else if (config) {
      // Update config if provided
      PipedreamService.instance.config = { ...PipedreamService.instance.config, ...config };
    }
    return PipedreamService.instance;
  }

  async getApps(): Promise<any[]> {
    try {
      const response = await fetch('https://api.pipedream.com/v1/apps', {
        headers: {
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch apps: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Pipedream apps:', error);
      return []; // Return empty array in case of error
    }
  }

  async createWorkflow(workflow: Workflow): Promise<string> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const mockWorkflow = {
          id: `mock-${Date.now()}`,
          name: workflow.name,
          description: workflow.description || '',
          organization_id: workflow.organizationId,
          status: 'active',
        };
        this.mockWorkflows.set(mockWorkflow.id, mockWorkflow);
        return mockWorkflow.id;
      }

      const response = await fetch('https://api.pipedream.com/v1/workflows', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create workflow: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  async getWorkflows(): Promise<any[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return Array.from(this.mockWorkflows.values());
      }

      const response = await fetch('https://api.pipedream.com/v1/workflows', {
        headers: {
          'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.statusText}`);
      }

      const data = await response.json();
      return data.workflows || [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return []; // Return empty array in case of error
    }
  }

  // Mock methods for development
  async addNode(workflowId: string, node: WorkflowNode): Promise<string> {
    const nodeId = `node-${Date.now()}`;
    this.mockNodes.set(nodeId, { ...node, id: nodeId });
    return nodeId;
  }

  async connectNodes(workflowId: string, edge: WorkflowEdge): Promise<string> {
    const edgeId = `edge-${Date.now()}`;
    this.mockEdges.set(edgeId, { ...edge, id: edgeId });
    return edgeId;
  }

  async configureNode(workflowId: string, nodeId: string, config: any): Promise<void> {
    const node = this.mockNodes.get(nodeId);
    if (node) {
      this.mockNodes.set(nodeId, { ...node, config });
    }
  }

  async startWorkflow(workflowId: string): Promise<void> {
    const workflow = this.mockWorkflows.get(workflowId);
    if (workflow) {
      this.mockWorkflows.set(workflowId, { ...workflow, status: 'running' });
    }
  }

  async stopWorkflow(workflowId: string): Promise<void> {
    const workflow = this.mockWorkflows.get(workflowId);
    if (workflow) {
      this.mockWorkflows.set(workflowId, { ...workflow, status: 'stopped' });
    }
  }

  async getWorkflowStatus(workflowId: string): Promise<string> {
    const workflow = this.mockWorkflows.get(workflowId);
    return workflow?.status || 'unknown';
  }

  async getNodeStatus(workflowId: string, nodeId: string): Promise<string> {
    try {
      const node = this.mockNodes.get(nodeId);
      if (node) {
        return node.status;
      }
      throw new Error('Node not found');
    } catch (error) {
      console.error('Error getting mock node status:', error);
      throw new Error('Failed to get mock node status');
    }
  }

  async getAvailableIntegrations(): Promise<Array<{ id: string; name: string }>> {
    try {
      // Mock integrations
      return [
        { id: 'hubspot', name: 'HubSpot' },
        { id: 'gmail', name: 'Gmail' },
        { id: 'slack', name: 'Slack' },
        { id: 'github', name: 'GitHub' },
        { id: 'n8n', name: 'n8n' },
      ];
    } catch (error) {
      console.error('Error getting mock integrations:', error);
      throw new Error('Failed to get mock integrations');
    }
  }

  async getIntegrationConfig(integrationId: string): Promise<Record<string, any>> {
    try {
      // Mock integration configs
      const configs: Record<string, Record<string, any>> = {
        hubspot: {
          apiKey: 'required',
          baseUrl: 'optional',
        },
        gmail: {
          clientId: 'required',
          clientSecret: 'required',
          redirectUri: 'required',
        },
        slack: {
          botToken: 'required',
          signingSecret: 'required',
        },
        github: {
          accessToken: 'required',
          webhookSecret: 'optional',
        },
        n8n: {
          apiKey: 'required',
          baseUrl: 'required',
        },
      };

      return configs[integrationId] || {};
    } catch (error) {
      console.error('Error getting mock integration config:', error);
      throw new Error('Failed to get mock integration config');
    }
  }

  // Add methods for app connection status
  async connectToApp(appName: string, userId: string) {
    return { status: 'connected' as const };
  }

  async getConnectionStatus(appName: string, userId: string) {
    return { status: 'connected' as const };
  }

  async disconnectApp(appName: string, userId: string) {
    return { status: 'disconnected' as const };
  }

  async makeApiRequest<T>(appName: string, userId: string, endpoint: string, method: string, data?: any): Promise<T> {
    try {
      // In development mode, use mock responses
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Mocking API request to ${appName}${endpoint}:`, data);
        
        // Mock response data based on app and endpoint
        return this.generateMockResponse(appName, endpoint, method, data) as T;
      }
      
      // In production, make actual API requests to Pipedream
      const pipedreamEndpoint = `https://api.pipedream.com/v1/components/${appName}${endpoint}`;
      
      const headers = {
        'Authorization': `Bearer ${process.env.PIPEDREAM_API_KEY}`,
        'Content-Type': 'application/json',
      };
      
      console.log(`Making API request to ${pipedreamEndpoint}`, { method, headers, data });
      
      const response = await fetch(pipedreamEndpoint, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pipedream API error (${response.status}): ${errorText}`);
      }
      
      const result = await response.json();
      return result as T;
    } catch (error) {
      console.error(`Error in Pipedream API request to ${appName}${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * Generate mock response for testing and development
   */
  private generateMockResponse(appName: string, endpoint: string, method: string, data?: any): unknown {
    // Mock data for different apps and endpoints
    const mockResponses: Record<string, Record<string, any>> = {
      slack: {
        '/chat.postMessage': {
          ok: true,
          channel: data?.channel || 'general',
          ts: String(Date.now() / 1000),
          message: {
            text: data?.text || 'Message content',
            user: 'U12345678',
            ts: String(Date.now() / 1000),
          }
        },
        '/channels.list': {
          ok: true,
          channels: [
            { id: 'C12345', name: 'general', is_private: false },
            { id: 'C67890', name: 'random', is_private: false }
          ]
        }
      },
      gmail: {
        '/send': {
          id: `msg_${Date.now()}`,
          threadId: `thread_${Date.now()}`,
          labelIds: ['SENT'],
          snippet: data?.subject || 'Email subject',
          status: 'sent',
          recipient: data?.to || 'recipient@example.com'
        }
      },
      office365: {
        '/mail/send': {
          id: `msg_${Date.now()}`,
          status: 'sent',
          recipient: data?.to || 'recipient@example.com',
          createdDateTime: new Date().toISOString()
        }
      }
    };
    
    // Return specific mock response or a generic one
    return mockResponses[appName]?.[endpoint] || {
      success: true,
      timestamp: new Date().toISOString(),
      appName,
      endpoint,
      method,
      data
    };
  }
} 
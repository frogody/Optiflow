// PipedreamService.ts
// MOCK VERSION for development - replace with actual implementation

import { Workflow, WorkflowEdge, WorkflowNode } from '@prisma/client';

export interface PipedreamConfig {
  environment?: 'development' | 'production';
  apiKey?: string;
  projectId?: string;
}

export interface ConnectionStatus {
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

export interface PipedreamWorkflow {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  status: 'active' | 'inactive' | 'running' | 'stopped';
}

export interface PipedreamNode {
  id: string;
  type: string;
  name: string;
  config: Record<string, unknown>;
  status?: string;
}

export interface PipedreamEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export class PipedreamService {
  private static instance: PipedreamService;
  private mockWorkflows: Map<string, PipedreamWorkflow>;
  private mockNodes: Map<string, PipedreamNode>;
  private mockEdges: Map<string, PipedreamEdge>;
  private config: PipedreamConfig;

  private constructor(config?: PipedreamConfig) {
    this.config = config || {};
    this.mockWorkflows = new Map();
    this.mockNodes = new Map();
    this.mockEdges = new Map();
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

  async getApps(): Promise<PipedreamIntegration[]> {
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
        const mockWorkflow: PipedreamWorkflow = {
          id: `mock-workflow-${Date.now()}`,
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

  async getWorkflows(): Promise<PipedreamWorkflow[]> {
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

  async addNode(workflowId: string, node: WorkflowNode): Promise<string> {
    const nodeId = `mock-node-${Date.now()}`;
    const pipedreamNode: PipedreamNode = {
      id: nodeId,
      type: node.type,
      name: node.name,
      config: node.config as Record<string, unknown>,
      status: 'created'
    };
    this.mockNodes.set(nodeId, pipedreamNode);
    return nodeId;
  }

  async connectNodes(workflowId: string, edge: WorkflowEdge): Promise<string> {
    const edgeId = `edge-${Date.now()}`;
    const pipedreamEdge: PipedreamEdge = {
      id: edgeId,
      source: edge.sourceId,
      target: edge.targetId,
      type: edge.type
    };
    this.mockEdges.set(edgeId, pipedreamEdge);
    return edgeId;
  }

  async configureNode(workflowId: string, nodeId: string, config: Record<string, unknown>): Promise<void> {
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
        return node.status || 'unknown';
      }
      throw new Error('Node not found');
    } catch (error) {
      console.error('Error getting mock node status:', error);
      throw new Error('Failed to get mock node status');
    }
  }

  async getAvailableIntegrations(): Promise<PipedreamIntegration[]> {
    try {
      // Mock integrations
      return [
        { id: 'hubspot', name: 'HubSpot', version: '1.0.0', type: 'crm' },
        { id: 'gmail', name: 'Gmail', version: '1.0.0', type: 'email' },
        { id: 'slack', name: 'Slack', version: '1.0.0', type: 'communication' },
        { id: 'github', name: 'GitHub', version: '1.0.0', type: 'development' },
        { id: 'n8n', name: 'n8n', version: '1.0.0', type: 'automation' },
      ];
    } catch (error) {
      console.error('Error getting mock integrations:', error);
      throw new Error('Failed to get mock integrations');
    }
  }

  async getIntegrationConfig(integrationId: string): Promise<Record<string, unknown>> {
    try {
      // Mock integration configs
      const configs: Record<string, Record<string, unknown>> = {
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
        },
        n8n: {
          apiKey: 'required',
          baseUrl: 'required',
        },
      };
      return configs[integrationId] || {};
    } catch (error) {
      console.error('Error getting integration config:', error);
      throw new Error('Failed to get integration config');
    }
  }

  async connectToApp(appName: string, userId: string): Promise<ConnectionStatus> {
    return {
      status: 'connected',
      lastConnected: new Date()
    };
  }

  async getConnectionStatus(appName: string, userId: string): Promise<ConnectionStatus> {
    return {
      status: 'connected',
      lastConnected: new Date()
    };
  }

  async disconnectApp(appName: string, userId: string): Promise<void> {
    // Mock implementation
  }

  async makeApiRequest<T>(
    appName: string,
    userId: string,
    endpoint: string,
    method: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    throw new Error('Not implemented in mock version');
  }
} 
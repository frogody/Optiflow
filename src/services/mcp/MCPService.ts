import axios from 'axios';
import {
  MCPRequest,
  MCPResponse,
  MCPApplication,
  Workflow,
  WorkflowNode,
  WorkflowEdge,
} from './types';
import { useUserStore } from '@/lib/userStore';
import { getMcpServers } from './config';

interface MCPConnection {
  id: string;
  type: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastUpdated: Date;
}

export class MCPService {
  private applications: Map<string, MCPApplication> = new Map();
  private connections: Map<string, MCPConnection>;

  constructor() {
    this.connections = new Map();
  }

  async registerApplication(app: MCPApplication): Promise<void> {
    this.applications.set(app.id, app);
  }

  async discoverApplications(): Promise<MCPApplication[]> {
    // TODO: Implement service discovery
    // For now, return dummy applications
    return [
      {
        id: 'app1',
        name: 'Data Processor',
        capabilities: ['process_data', 'transform_data'],
        endpoint: 'http://localhost:3001',
      },
      {
        id: 'app2',
        name: 'Data Validator',
        capabilities: ['validate_data', 'clean_data'],
        endpoint: 'http://localhost:3002',
      },
      {
        id: 'app3',
        name: 'Data Exporter',
        capabilities: ['export_data', 'format_data'],
        endpoint: 'http://localhost:3003',
      },
    ];
  }

  private async getUserConfig(userId: string, orchestratorId: string) {
    const mcpServers = getMcpServers(userId);
    const serverConfig = mcpServers[orchestratorId];
    
    if (!serverConfig) {
      throw new Error(`No MCP server configuration found for orchestrator: ${orchestratorId}`);
    }

    return serverConfig;
  }

  async sendRequest(userId: string, orchestratorId: string, method: string, params: any = {}) {
    try {
      const config = await this.getUserConfig(userId, orchestratorId);
      
      // Include user-specific configuration in the request
      const response = await fetch(`/api/mcp/${orchestratorId}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
          'X-MCP-URL': config.url // Pass the MCP server URL in the header
        },
        body: JSON.stringify({
          userId,
          ...params
        })
      });

      const data = await response.json();

      // Update connection status in user environment
      if (method === 'check_connection' || method === 'check_tools') {
        const store = useUserStore.getState();
        
        if (method === 'check_connection') {
          store.updateMcpConnection(userId, orchestratorId, {
            status: data.error ? 'error' : 'connected',
            config
          });
        }
        
        if (method === 'check_tools' && data.results) {
          data.results.forEach((result: any) => {
            store.updateToolConnection(userId, result.tool, {
              connected: result.connected,
              config: {}
            });
          });
        }
      }

      return data;
    } catch (error) {
      console.error('MCP request failed:', error);
      return { error: { message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }

  async validateWorkflow(workflow: Workflow): Promise<boolean> {
    // TODO: Implement workflow validation
    return true;
  }

  async updateWorkflow(
    workflow: Workflow,
    changes: {
      nodes?: WorkflowNode[];
      edges?: WorkflowEdge[];
    }
  ): Promise<Workflow> {
    // TODO: Implement workflow update logic
    return {
      ...workflow,
      nodes: changes.nodes || workflow.nodes,
      edges: changes.edges || workflow.edges,
    };
  }

  async getActiveConnections(): Promise<MCPConnection[]> {
    return Array.from(this.connections.values()).filter(
      conn => conn.status === 'active'
    );
  }

  async getConnection(id: string): Promise<MCPConnection> {
    const connection = this.connections.get(id);
    if (!connection) {
      throw new Error(`Connection ${id} not found`);
    }
    return connection;
  }

  async createConnection(type: string, config: Record<string, any>): Promise<MCPConnection> {
    const id = `${type}-${Date.now()}`;
    const connection: MCPConnection = {
      id,
      type,
      config,
      status: 'inactive',
      lastUpdated: new Date()
    };
    
    this.connections.set(id, connection);
    return connection;
  }

  async updateConnection(id: string, config: Partial<MCPConnection>): Promise<MCPConnection> {
    const connection = await this.getConnection(id);
    const updatedConnection = {
      ...connection,
      ...config,
      lastUpdated: new Date()
    };
    
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }

  async deleteConnection(id: string): Promise<void> {
    if (!this.connections.has(id)) {
      throw new Error(`Connection ${id} not found`);
    }
    this.connections.delete(id);
  }

  async refreshConnection(id: string): Promise<MCPConnection> {
    const connection = await this.getConnection(id);
    
    try {
      // Here we would implement the actual token refresh logic
      // For now, we just simulate a successful refresh
      return this.updateConnection(id, {
        status: 'active',
        lastUpdated: new Date()
      });
    } catch (error) {
      return this.updateConnection(id, {
        status: 'error',
        lastUpdated: new Date()
      });
    }
  }

  async restartConnection(id: string): Promise<MCPConnection> {
    const connection = await this.getConnection(id);
    
    try {
      // Here we would implement the actual connection restart logic
      // For now, we just simulate a successful restart
      return this.updateConnection(id, {
        status: 'active',
        lastUpdated: new Date()
      });
    } catch (error) {
      return this.updateConnection(id, {
        status: 'error',
        lastUpdated: new Date()
      });
    }
  }
}

export const mcpService = new MCPService(); 
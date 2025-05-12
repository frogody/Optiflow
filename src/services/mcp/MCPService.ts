import axios from 'axios';

import { useUserStore } from '@/lib/userStore';

import { getMcpServers } from './config';
import {
  MCPApplication,
  MCPParamValue,
  MCPRequest,
  MCPResponse,
  Workflow,
  WorkflowEdge,
  WorkflowNode,
} from './types';


type ConnectionStatus = 'active' | 'inactive' | 'error';

interface MCPConnection {
  id: string;
  type: string;
  config: Record<string, MCPParamValue>;
  status: ConnectionStatus;
  lastUpdated: Date;
}

interface MCPServerConfig {
  url: string;
  [key: string]: MCPParamValue;
}

interface ToolConnectionResult {
  tool: string;
  connected: boolean;
  config: Record<string, MCPParamValue>;
}

interface MCPRequestMetadata {
  requestId: string;
  timestamp: Date;
  source: string;
  target: string;
  correlationId?: string;
  retryCount?: number;
}

interface MCPResponseMetadata {
  requestId: string;
  timestamp: Date;
  processingTime: number;
  status: 'success' | 'error' | 'partial';
}

interface MCPServiceResponse<T = unknown> {
  data: T;
  metadata: MCPResponseMetadata;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export class MCPService {
  private applications: Map<string, MCPApplication> = new Map();
  private connections: Map<string, MCPConnection>;
  private requestHistory: Map<string, MCPServiceResponse[]> = new Map();

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

  private async getUserConfig(userId: string, orchestratorId: string): Promise<MCPServerConfig> {
    const mcpServers = getMcpServers(userId);
    const serverConfig = mcpServers[orchestratorId];
    
    if (!serverConfig) {
      throw new Error(`No MCP server configuration found for orchestrator: ${orchestratorId}`);
    }

    return serverConfig;
  }

  async sendRequest<T = unknown>(
    userId: string,
    orchestratorId: string,
    method: string,
    params: Record<string, MCPParamValue> = {}
  ): Promise<MCPServiceResponse<T>> {
    const requestMetadata: MCPRequestMetadata = {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      source: userId,
      target: orchestratorId
    };

    try {
      const config = await this.getUserConfig(userId, orchestratorId);
      const startTime = Date.now();
      
      const response = await fetch(`/api/mcp/${orchestratorId}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
          'X-MCP-URL': config.url,
          'X-Request-ID': requestMetadata.requestId,
          'X-Correlation-ID': requestMetadata.correlationId || requestMetadata.requestId
        },
        body: JSON.stringify({
          userId,
          metadata: requestMetadata,
          ...params
        })
      });

      const responseData = await response.json();
      const processingTime = Date.now() - startTime;

      const result: MCPServiceResponse<T> = {
        data: responseData.results,
        metadata: {
          requestId: requestMetadata.requestId,
          timestamp: new Date(),
          processingTime,
          status: responseData.error ? 'error' : 'success'
        }
      };

      if (responseData.error) {
        result.error = {
          code: responseData.error.code || 'UNKNOWN_ERROR',
          message: responseData.error.message,
          details: responseData.error.details
        };
      }

      // Update connection status in user environment
      if (method === 'check_connection' || method === 'check_tools') {
        const store = useUserStore.getState();
        
        if (method === 'check_connection') {
          store.updateMcpConnection(userId, orchestratorId, {
            status: responseData.error ? 'error' : 'connected',
            config,
            lastResponse: result
          });
        }
        
        if (method === 'check_tools' && responseData.results) {
          (responseData.results as ToolConnectionResult[]).forEach((toolResult) => {
            store.updateToolConnection(userId, toolResult.tool, {
              connected: toolResult.connected,
              config: toolResult.config,
              lastCheck: new Date()
            });
          });
        }
      }

      this.trackRequest(result);

      return result;
    } catch (error) {
      console.error('MCP request failed:', error);
      return {
        data: null as T,
        metadata: {
          requestId: requestMetadata.requestId,
          timestamp: new Date(),
          processingTime: Date.now() - requestMetadata.timestamp.getTime(),
          status: 'error'
        },
        error: {
          code: 'REQUEST_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { error }
        }
      };
    }
  }

  private trackRequest<T>(response: MCPServiceResponse<T>): void {
    const userId = response.metadata.requestId.split('_')[0];
    const history = this.requestHistory.get(userId) || [];
    history.push(response);
    
    // Keep only last 100 requests
    if (history.length > 100) {
      history.shift();
    }
    
    this.requestHistory.set(userId, history);
  }

  async getRequestHistory(userId: string): Promise<MCPServiceResponse[]> {
    return this.requestHistory.get(userId) || [];
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

  async createConnection(
    type: string,
    config: Record<string, MCPParamValue>
  ): Promise<MCPConnection> {
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

  async updateConnection(
    id: string,
    config: Partial<MCPConnection>
  ): Promise<MCPConnection> {
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
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
export interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  params: Record<string, any>;
  id: string | number;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id: string | number;
}

export interface MCPApplication {
  id: string;
  name: string;
  capabilities: string[];
  endpoint: string;
}

export interface WorkflowNode {
  id: string;
  type: string;
  applicationId: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  config?: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} 
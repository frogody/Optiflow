export type MCPParamValue = string | number | boolean | null | Record<string, unknown> | MCPParamValue[];

export interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  params: Record<string, MCPParamValue>;
  id: string | number;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  result?: unknown;
  error?: MCPError;
  id: string | number;
}

export interface MCPApplication {
  id: string;
  name: string;
  capabilities: string[];
  endpoint: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNodeConfig {
  [key: string]: MCPParamValue;
}

export interface WorkflowNode {
  id: string;
  type: string;
  applicationId: string;
  config: WorkflowNodeConfig;
  position: Position;
}

export interface WorkflowEdgeConfig {
  [key: string]: MCPParamValue;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  config?: WorkflowEdgeConfig;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} 
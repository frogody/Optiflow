// Workflow command types
export enum CommandType {
  CREATE_NODE = 'CREATE_NODE',
  CONNECT_NODES = 'CONNECT_NODES',
  DELETE_NODE = 'DELETE_NODE',
  RENAME_NODE = 'RENAME_NODE',
  CONFIGURE_NODE = 'CONFIGURE_NODE',
  SAVE_WORKFLOW = 'SAVE_WORKFLOW',
  LOAD_WORKFLOW = 'LOAD_WORKFLOW',
  RUN_WORKFLOW = 'RUN_WORKFLOW',
  STOP_WORKFLOW = 'STOP_WORKFLOW',
}

export interface WorkflowCommand {
  type: CommandType;
  nodeType?: NodeType;
  nodeName?: string;
  newName?: string;
  sourceNode?: string;
  targetNode?: string;
  workflowName?: string;
}

// Node types for the workflow editor
export type NodeType = 
  | 'trigger'
  | 'action'
  | 'condition'
  | 'loop'
  | 'delay'
  | 'http'
  | 'script'
  | 'aiAgent'
  | 'database'
  | 'transformation';

// Workflow node structure
export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description: string;
    config: Record<string, unknown>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

// Workflow status types
export type WorkflowStatus = 'active' | 'inactive' | 'draft' | 'error';

// Trigger types
export type TriggerType = 'schedule' | 'webhook' | 'event' | 'manual' | 'voice';

// Workflow execution status
export type ExecutionStatus = 'success' | 'failed' | 'running' | 'cancelled';

// Workflow execution step status
export type StepStatus = 'success' | 'failed' | 'running' | 'pending' | 'skipped';

// Main workflow interface
export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  triggerType: TriggerType;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  averageExecutionTime: number;
  creditsConsumed: number;
  tags: string[];
  folderId?: string;
}

// Workflow state management
export interface WorkflowState {
  currentWorkflow: Workflow | null;
  selectedNode: string | null;
  isRunning: boolean;
  error: string | null;
}

// Workflow execution logging
export interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  triggerInfo: string;
  creditsConsumed: number;
  steps: ExecutionStep[];
}

export interface ExecutionStep {
  id: string;
  name: string;
  type: NodeType;
  status: StepStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
}

// Workflow organization
export interface WorkflowFolder {
  id: string;
  name: string;
  description?: string;
  workflowCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  appsUsed: string[];
  popularity: number;
  previewImage: string;
  createdBy: string;
  createdAt: string;
  isOfficial: boolean;
}

// Generated workflow types
export interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowGenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  thinking?: {
    type: 'enabled';
    budget_tokens?: number;
  };
} 
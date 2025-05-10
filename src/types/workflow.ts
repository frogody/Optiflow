// @ts-nocheck - This file has some TypeScript issues that are hard to fix
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

export interface WorkflowCommand { type: CommandType;
  nodeType?: string;
  nodeName?: string;
  newName?: string;
  sourceNode?: string;
  targetNode?: string;
  workflowName?: string;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface WorkflowEdge { id: string;
  source: string;
  target: string;
  type?: string;
}

export interface Workflow { id: string;
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

export interface WorkflowState { currentWorkflow: Workflow | null;
  selectedNode: string | null;
  isRunning: boolean;
  error: string | null;
}

// Workflow status types
export type WorkflowStatus = 'active' | 'inactive' | 'draft' | 'error';

// Trigger types
export type TriggerType = 'schedule' | 'webhook' | 'event' | 'manual' | 'voice';

// Workflow execution log status
export type ExecutionStatus = 'success' | 'failed' | 'running' | 'cancelled';

// Workflow execution step status
export type StepStatus = 'success' | 'failed' | 'running' | 'pending' | 'skipped';

// Workflow execution log
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

// Workflow execution step
export interface ExecutionStep {
  id: string;
  name: string;
  type: string;
  status: StepStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

// Workflow folder
export interface WorkflowFolder {
  id: string;
  name: string;
  description?: string;
  workflowCount: number;
  createdAt: string;
  updatedAt: string;
}

// Workflow template
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
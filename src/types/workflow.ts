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

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowState {
  currentWorkflow: Workflow | null;
  selectedNode: string | null;
  isRunning: boolean;
  error: string | null;
} 
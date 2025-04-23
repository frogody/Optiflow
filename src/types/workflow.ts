export type NodeType = 'trigger' | 'action' | 'condition' | 'loop' | 'delay';

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data?: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export type WorkflowAction =
  | {
      type: 'ADD_NODE';
      nodeType: NodeType;
      position: Position;
      config?: Record<string, any>;
    }
  | {
      type: 'CONNECT_NODES';
      sourceId: string;
      targetId: string;
    }
  | {
      type: 'UPDATE_NODE';
      nodeId: string;
      config: Record<string, any>;
    }
  | {
      type: 'DELETE_NODE';
      nodeId: string;
    }; 
import { Node } from 'reactflow';

export interface NodeData {
  label: string;
  type: string;
  id: string;
}

export interface NodeProps<T extends NodeData = NodeData> {
  data: T;
  selected: boolean;
  id: string;
}

export interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  style?: React.CSSProperties;
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnect: (connection: any) => void;
}

export interface PipedreamAction {
  id: string;
  name: string;
  description: string;
  app: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required: boolean;
    default?: any;
  }>;
} 
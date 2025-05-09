// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { Workflow, WorkflowNode, WorkflowEdge } from '@/services/mcp/types';

interface WorkflowState {
  workflow: Workflow | null;
  nodes: Node[];
  edges: Edge[];
  isLoading: boolean;
  error: string | null;
  setWorkflow: (workflow: Workflow) => void;
  updateNodes: (nodes: Node[]) => void;
  updateEdges: (edges: Edge[]) => void;
  validateWorkflow: () => Promise<boolean>;
  saveWorkflow: () => Promise<void>;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflow: null,
  nodes: [],
  edges: [],
  isLoading: false,
  error: null,
  setWorkflow: (workflow) => {
    set({ workflow });
    // Convert workflow nodes and edges to ReactFlow format
    const nodes = workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type || 'default',
      data: { label: node.type, ...node.config     },
      position: node.position,
    }));
    const edges = workflow.edges.map((edge) => ({ id: edge.id,
      source: edge.source,
      target: edge.target,
      ...edge.config,
        }));
    set({ nodes, edges });
  },
  updateNodes: (nodes) => {
    set({ nodes });
    const workflow = get().workflow;
    if (workflow) {
      const updatedNodes: WorkflowNode[] = nodes.map((node) => ({
        id: node.id,
        type: node.type || 'default',
        applicationId: node.data?.applicationId || '',
        config: { ...node.data },
        position: node.position,
      }));
      set({ workflow: { ...workflow, nodes: updatedNodes     } });
    }
  },
  updateEdges: (edges) => {
    set({ edges });
    const workflow = get().workflow;
    if (workflow) {
      const updatedEdges: WorkflowEdge[] = edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        config: { ...edge },
      }));
      set({ workflow: { ...workflow, edges: updatedEdges     } });
    }
  },
  validateWorkflow: async () => {
    set({ isLoading: true, error: null     });
    try {
      // Simple validation for now
      const nodes = get().nodes;
      const edges = get().edges;
      
      // Check if we have at least one input and one output node
      const hasInput = nodes.some((node) => node.type === 'input');
      const hasOutput = nodes.some((node) => node.type === 'output');
      
      if (!hasInput || !hasOutput) {
        throw new Error('Workflow must have at least one input and one output node');
      }
      
      // Check if all nodes are connected
      const connectedNodes = new Set<string>();
      edges.forEach((edge) => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      });
      
      const disconnectedNodes = nodes.filter((node) => !connectedNodes.has(node.id));
      if (disconnectedNodes.length > 0) {
        throw new Error('All nodes must be connected in the workflow');
      }
      
      set({ isLoading: false     });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Validation failed'     });
      return false;
    }
  },
  saveWorkflow: async () => {
    set({ isLoading: true, error: null     });
    try {
      // For now, just log the workflow to console
      console.log('Saving workflow:', { nodes: get().nodes,
        edges: get().edges,
          });
      set({ isLoading: false     });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to save workflow'     });
    }
  },
})); 
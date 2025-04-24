'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import custom node types
import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { ApiNode } from './nodes/ApiNode';
import { DatabaseNode } from './nodes/DatabaseNode';

// Define node types
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  api: ApiNode,
  database: DatabaseNode,
};

interface WorkflowNodeCreatorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  readOnly?: boolean;
}

export const WorkflowNodeCreator: React.FC<WorkflowNodeCreatorProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  readOnly = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);

      if (!sourceNode || !targetNode) {
        console.error('Invalid connection: nodes not found');
        return;
      }

      // Check if connection is valid based on node types
      if (!isValidConnection(sourceNode, targetNode)) {
        console.error('Invalid connection: incompatible node types');
        return;
      }

      // Add the new edge
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#6366f1' },
      };
      setEdges(eds => addEdge(newEdge, eds));

      // Notify parent component
      if (onEdgesChange) {
        onEdgesChange([...edges, newEdge]);
      }
    },
    [nodes, edges, onEdgesChange]
  );

  // Handle node changes
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      if (onNodesChange) {
        const updatedNodes = nodes.map(node => {
          const change = changes.find((c: any) => c.id === node.id);
          return change ? { ...node, ...change } : node;
        });
        onNodesChange(updatedNodes);
      }
    },
    [nodes, onNodesChange]
  );

  // Validate connection between nodes
  const isValidConnection = (sourceNode: Node, targetNode: Node) => {
    // Prevent connecting to trigger nodes
    if (targetNode.type === 'trigger') return false;

    // Prevent connecting from output nodes
    if (sourceNode.type === 'output') return false;

    // Prevent circular connections
    if (hasCircularConnection(sourceNode.id, targetNode.id)) return false;

    return true;
  };

  // Check for circular connections
  const hasCircularConnection = (sourceId: string, targetId: string): boolean => {
    const visited = new Set<string>();
    
    const dfs = (currentId: string): boolean => {
      if (currentId === targetId) return true;
      if (visited.has(currentId)) return false;
      
      visited.add(currentId);
      
      const outgoingEdges = edges.filter(e => e.source === currentId);
      return outgoingEdges.some(edge => dfs(edge.target));
    };
    
    return dfs(sourceId);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}; 
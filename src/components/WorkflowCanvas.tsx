import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/lib/workflowStore';

interface WorkflowCanvasProps {
  isAdvancedMode: boolean;
}

const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'input',
    data: { label: 'Input Data' },
    position: { x: 250, y: 25 },
  },
  {
    id: 'processor',
    data: { label: 'Data Processor' },
    position: { x: 250, y: 125 },
  },
  {
    id: 'validator',
    data: { label: 'Data Validator' },
    position: { x: 100, y: 225 },
  },
  {
    id: 'exporter',
    type: 'output',
    data: { label: 'Data Exporter' },
    position: { x: 250, y: 325 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'input-processor',
    source: 'input',
    target: 'processor',
    animated: true,
    style: { stroke: 'url(#edge-gradient)' },
  },
  {
    id: 'processor-validator',
    source: 'processor',
    target: 'validator',
    animated: true,
    style: { stroke: 'url(#edge-gradient)' },
  },
  {
    id: 'validator-exporter',
    source: 'validator',
    target: 'exporter',
    animated: true,
    style: { stroke: 'url(#edge-gradient)' },
  },
];

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ isAdvancedMode }) => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    updateNodes,
    updateEdges,
    validateWorkflow,
    saveWorkflow,
    isLoading,
    error,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes.length ? storeNodes : initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges.length ? storeEdges : initialEdges);

  useEffect(() => {
    if (storeNodes.length) {
      setNodes(storeNodes);
    }
  }, [storeNodes, setNodes]);

  useEffect(() => {
    if (storeEdges.length) {
      setEdges(storeEdges);
    }
  }, [storeEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({
          ...params,
          animated: true,
          style: { stroke: 'url(#edge-gradient)' },
        }, eds);
        updateEdges(newEdges);
        return newEdges;
      });
    },
    [setEdges, updateEdges]
  );

  const onNodesDelete = useCallback(
    (nodesToDelete: Node[]) => {
      updateNodes(nodes.filter((node) => !nodesToDelete.find((n) => n.id === node.id)));
    },
    [nodes, updateNodes]
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      updateEdges(edges.filter((edge) => !edgesToDelete.find((e) => e.id === edge.id)));
    },
    [edges, updateEdges]
  );

  return (
    <div className="h-full w-full">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--edge-stop-1)" />
            <stop offset="100%" stopColor="var(--edge-stop-2)" />
          </linearGradient>
        </defs>
      </svg>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="rgba(60, 223, 255, 0.3)" />
        <Controls />
        <Panel position="top-right" className="space-x-2">
          <button
            onClick={() => validateWorkflow()}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading}
          >
            Validate
          </button>
          <button
            onClick={() => saveWorkflow()}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-secondary to-primary rounded-md hover:from-secondary-dark hover:to-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 transition-all duration-200"
            disabled={isLoading}
          >
            Save
          </button>
        </Panel>
        {error && (
          <Panel position="bottom-center" className="bg-red-100 text-red-700 px-4 py-2 rounded-md">
            {error}
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas; 
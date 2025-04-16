'use client';

import { useCallback, useState, useRef, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionLineType,
  Panel,
  BackgroundVariant,
  Node,
  XYPosition,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useNodeTypes from '@/components/workflow/NodeTypesFactory';
import { AIAgentConfigData } from '@/components/workflow/AIAgentConfig';
import NodePalette from '@/components/workflow/NodePalette';

// Define node data type to fix TypeScript errors
interface NodeData {
  label: string;
  description?: string;
  config?: AIAgentConfigData;
  onConfigChange?: (config: AIAgentConfigData) => void;
}

// Initial nodes for the workflow
const initialNodes = [
  {
    id: 'extract-1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Extract Webpage Text' } as NodeData,
  },
  {
    id: 'agent-1',
    type: 'aiAgent',
    position: { x: 250, y: 250 },
    data: { 
      label: 'AI Agent',
      description: 'Analyze the content to determine if it\'s a good lead',
      config: {
        name: 'Lead Analyzer',
        type: 'Conditional',
        prompt: `You are an AI assistant that helps analyze webpage content to determine if it's a good lead.
Consider the following factors:
- Relevance to our industry
- Indication of needs or pain points
- Company size and potential
- Contact information availability

Analyze the provided content and respond with:
1. Whether this is a good lead (Yes/No)
2. Confidence level (Low/Medium/High)
3. Brief justification for your assessment`,
        model: 'gpt-4o',
        temperature: 0.7,
        tools: ['web_search'],
        contextStrategy: 'all_inputs',
      }
    } as NodeData,
  },
  {
    id: 'email-1',
    type: 'default',
    position: { x: 250, y: 400 },
    data: { label: 'First Outreach Email' } as NodeData,
  },
];

// Initial edges connecting the nodes
const initialEdges = [
  {
    id: 'e1-2',
    source: 'extract-1',
    target: 'agent-1',
    animated: true,
    type: 'smoothstep',
  },
  {
    id: 'e2-3',
    source: 'agent-1',
    target: 'email-1',
    animated: true,
    type: 'smoothstep',
  },
];

// A wrapper component that provides the ReactFlow context
function WorkflowEditorContent() {
  // Get color mode manually since we don't need the theme provider
  const isDarkMode = typeof window !== 'undefined' ? 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches : 
    false;
    
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Register custom node types
  const nodeTypes = useNodeTypes();
  
  // Set up nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            animated: true,
          },
          eds
        )
      ),
    [setEdges]
  );
  
  // Handle node data updates
  const onNodeConfigChange = useCallback((nodeId: string, config: AIAgentConfigData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Make a type-safe copy of the node
          return {
            ...node,
            data: {
              ...node.data,
              config,
            } as NodeData,
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
  // Update node data change handlers
  const updatedNodes = useMemo(() => {
    return nodes.map(node => {
      if (node.type === 'aiAgent') {
        return {
          ...node,
          data: {
            ...node.data,
            onConfigChange: (config: AIAgentConfigData) => onNodeConfigChange(node.id, config),
          } as NodeData,
        };
      }
      return node;
    });
  }, [nodes, onNodeConfigChange]);
  
  // Handle drag over to allow dropping
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle dropping a new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }
      
      // Get the dropped data
      const dataStr = event.dataTransfer.getData('application/reactflow');
      if (!dataStr) return;
      
      const nodeData = JSON.parse(dataStr);
      
      // Get the position from the drop event
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) as XYPosition;
      
      // Create a unique ID based on the node type and a timestamp
      const id = `${nodeData.id}-${Date.now()}`;
      
      // Create the new node
      const newNode = {
        id,
        type: nodeData.type,
        position,
        data: { 
          label: nodeData.label,
          description: nodeData.description,
        } as NodeData,
      };
      
      // Add the new node to the flow
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-dark-50 border-b border-dark-200 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-white ml-2">Workflow Editor</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium text-dark-50 dark:text-white bg-gradient-to-r from-primary to-secondary rounded-md shadow"
            onClick={() => {
              // Export workflow logic
              const workflow = {
                nodes,
                edges,
              };
              console.log('Workflow saved:', workflow);
              alert('Workflow saved!');
            }}
          >
            Save Workflow
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <NodePalette className="w-64" />
        
        {/* Flow Editor */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={updatedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            snapToGrid={true}
            fitView
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="bg-gray-50 dark:bg-dark-100"
          >
            <Controls className="bg-white dark:bg-dark-50 border border-gray-200 dark:border-gray-700" />
            <MiniMap
              nodeStrokeWidth={3}
              className="bg-white dark:bg-dark-50 border border-gray-200 dark:border-gray-700"
            />
            <Background
              color={isDarkMode ? '#333' : '#aaa'}
              gap={16}
              size={1}
              variant={BackgroundVariant.Dots}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

// Wrap with ReactFlowProvider to provide context
export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  );
} 
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
import { DefaultNodeData } from '@/components/workflow/DefaultNodeConfig';

// Define a union type for node data
type NodeDataType = {
  id?: string;
  type?: string;
  label: string;
  description?: string;
  settings?: Record<string, any>;
  config?: AIAgentConfigData;
  onConfigChange?: (data: any) => void;
};

// Initial nodes for the workflow
const initialNodes: Node<NodeDataType>[] = [
  {
    id: 'extract-1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { 
      id: 'extract-webpage-1',
      type: 'extract-webpage',
      label: 'Extract Webpage Text',
      description: 'Extract text content from a webpage URL',
      settings: {
        url: 'https://example.com',
        includeImages: false
      }
    },
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
        description: 'Analyze the content to determine if it\'s a good lead',
      }
    },
  },
  {
    id: 'email-1',
    type: 'default',
    position: { x: 250, y: 400 },
    data: {
      id: 'first-outreach-email-1',
      type: 'first-outreach-email',
      label: 'First Outreach Email',
      description: 'Send first email in the sequence',
      settings: {
        template: 'cold-outreach',
        subject: 'Opportunity with our solution'
      }
    },
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
            },
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
          },
        };
      }
      return node;
    });
  }, [nodes, onNodeConfigChange]);

  // Handle default node configuration updates
  const onDefaultNodeConfigChange = useCallback((nodeId: string, updatedData: DefaultNodeData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...updatedData,
              onConfigChange: (data: DefaultNodeData) => onDefaultNodeConfigChange(node.id, data),
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
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
        type: nodeData.type === 'ai-agent' ? 'aiAgent' : 'default',
        position,
        data: nodeData.type === 'ai-agent' 
          ? { 
              label: nodeData.label,
              description: nodeData.description,
              config: {
                name: nodeData.label,
                type: 'Conditional',
                prompt: 'Enter your prompt here...',
                model: 'gpt-4o',
                temperature: 0.7,
                tools: [],
                contextStrategy: 'all_inputs',
                description: nodeData.description
              },
              onConfigChange: (config: AIAgentConfigData) => onNodeConfigChange(id, config)
            }
          : { 
              id,
              type: nodeData.id,
              label: nodeData.label,
              description: nodeData.description,
              settings: {},
              onConfigChange: (data: DefaultNodeData) => onDefaultNodeConfigChange(id, data)
            },
      };
      
      // Add the new node to the flow
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes, onNodeConfigChange, onDefaultNodeConfigChange]
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
            className="bg-dark-100"
            defaultEdgeOptions={{
              style: { stroke: '#6366f1', strokeWidth: 2 },
              animated: true,
              type: 'smoothstep'
            }}
            edgesFocusable={false}
            deleteKeyCode={["Backspace", "Delete"]}
            minZoom={0.2}
            maxZoom={1.5}
            elementsSelectable={true}
            nodesDraggable={true}
            style={{ backgroundColor: "#111827" }}
            onInit={(reactFlowInstance) => {
              setReactFlowInstance(reactFlowInstance);
              // Set the node element background color to transparent
              const nodeElements = document.querySelectorAll('.react-flow__node');
              nodeElements.forEach((node) => {
                (node as HTMLElement).style.backgroundColor = 'transparent';
                // Remove any background images
                (node as HTMLElement).style.backgroundImage = 'none';
              });
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Controls 
              className="bg-dark-50 border border-gray-700 rounded-md shadow-lg"
            />
            <MiniMap
              nodeStrokeWidth={3}
              className="bg-dark-50 border border-gray-700 rounded-md shadow-lg"
              nodeBorderRadius={8}
              nodeColor={(node) => {
                switch (node.type) {
                  case 'aiAgent':
                    return '#6366f1';
                  default:
                    return '#334155';
                }
              }}
            />
            <Background
              color="#333"
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
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
  MarkerType,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useNodeTypes from '@/components/workflow/NodeTypesFactory';
import { AIAgentConfigData } from '@/components/workflow/AIAgentConfig';
import NodePalette from '@/components/workflow/NodePalette';
import { DefaultNodeData } from '@/components/workflow/DefaultNodeConfig';
import CustomEdge from '@/components/workflow/CustomEdge';
import WorkflowSettingsPanel, { WorkflowSettings } from '@/components/workflow/WorkflowSettings';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import PipedreamAppNode from '@/components/workflow/PipedreamAppNode';
import DefaultNode from '@/components/workflow/DefaultNode';
import AIAgentNode from '@/components/workflow/AIAgentNode';

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

// Define the edge data type
type EdgeDataType = {
  label?: string;
  dashed?: boolean;
  onDelete?: (id: string) => void;
};

// Define custom edge types
const customEdgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Initial nodes for the workflow
const initialNodes: Node<NodeDataType>[] = [
  {
    id: 'scraper-1',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { 
      id: 'extract-webpage-1',
      type: 'extract-webpage',
      label: 'Extract Company Data',
      description: 'Scrape company information from website',
      settings: {
        url: 'https://example.com/company',
        selector: '.company-info',
        includeImages: true,
        maxDepth: 2
      }
    },
  },
  {
    id: 'process-1',
    type: 'default',
    position: { x: 100, y: 250 },
    data: {
      id: 'process-data-1',
      type: 'process-data',
      label: 'Format Company Data',
      description: 'Transform scraped data into structured format',
      settings: {
        inputFormat: 'html',
        outputFormat: 'json',
        transformation: '{\n  "name": "data.companyName",\n  "email": "data.contactEmail",\n  "phone": "data.contactPhone"\n}'
      }
    },
  },
  {
    id: 'agent-1',
    type: 'aiAgent',
    position: { x: 100, y: 400 },
    data: { 
      label: 'AI Lead Qualifier',
      description: 'Analyze company data to determine if it\'s a good lead',
      config: {
        name: 'Lead Analyzer',
        type: 'Conditional',
        prompt: `You are an AI assistant that helps analyze company data to determine if it's a good lead.
Consider the following factors:
- Company size and industry
- Recent news or events
- Contact information completeness
- Online presence

Analyze the provided data and respond with:
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
    id: 'conditional-1',
    type: 'default',
    position: { x: 100, y: 550 },
    data: {
      id: 'conditional-1',
      type: 'conditional',
      label: 'Lead Quality Check',
      description: 'Route based on AI qualification result',
      settings: {
        condition: 'result.isQualified == true',
        trueLabel: 'Good Lead',
        falseLabel: 'Poor Lead'
      }
    },
  },
  {
    id: 'email-1',
    type: 'default',
    position: { x: 300, y: 700 },
    data: {
      id: 'send-email-1',
      type: 'send-email',
      label: 'Send to Sales Team',
      description: 'Notify sales team about qualified lead',
      settings: {
        to: 'sales@company.com',
        subject: 'New Qualified Lead: {{data.company.name}}',
        body: 'A new lead has been qualified by our AI system.\n\nCompany: {{data.company.name}}\nContact: {{data.company.contact}}\nConfidence: {{result.confidence}}\n\nReason: {{result.justification}}',
        attachments: 'lead-details.pdf'
      }
    },
  },
  {
    id: 'database-1',
    type: 'default',
    position: { x: -100, y: 700 },
    data: {
      id: 'database-1',
      type: 'database',
      label: 'Save to CRM',
      description: 'Store lead information in database',
      settings: {
        connectionString: 'postgresql://user:pass@localhost:5432/crm',
        queryType: 'insert',
        query: 'INSERT INTO leads (name, email, phone, status, source) VALUES (:name, :email, :phone, :status, :source)',
        parameters: '{\n  "name": "{{data.company.name}}",\n  "email": "{{data.company.email}}",\n  "phone": "{{data.company.phone}}",\n  "status": "unqualified",\n  "source": "web-scraper"\n}'
      }
    },
  },
];

// Initial edges connecting the nodes
const initialEdges: Edge<EdgeDataType>[] = [
  {
    id: 'e1-2',
    source: 'scraper-1',
    target: 'process-1',
    type: 'custom',
    animated: true,
    data: { label: 'Raw Data' }
  },
  {
    id: 'e2-3',
    source: 'process-1',
    target: 'agent-1',
    type: 'custom',
    animated: true,
    data: { label: 'Structured Data' }
  },
  {
    id: 'e3-4',
    source: 'agent-1',
    target: 'conditional-1',
    type: 'custom',
    animated: true,
    data: { label: 'Analysis' }
  },
  {
    id: 'e4-5',
    source: 'conditional-1',
    target: 'email-1',
    type: 'custom',
    animated: true,
    data: { 
      label: 'Qualified',
      dashed: false 
    }
  },
  {
    id: 'e4-6',
    source: 'conditional-1',
    target: 'database-1',
    type: 'custom',
    animated: true,
    data: { 
      label: 'Unqualified',
      dashed: true 
    }
  },
];

// Define node types
const nodeTypes = {
  default: DefaultNode,
  aiAgent: AIAgentNode,
  pipedreamApp: PipedreamAppNode,
  // ... other node types ...
};

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
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeDataType>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Add state for workflow settings and modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [workflowSettings, setWorkflowSettings] = useState<WorkflowSettings>({
    memoryEnabled: true,
    memoryType: 'buffer',
    memorySize: 1024,
    contextWindowSize: 10,
    
    safeMode: false,
    autoSave: true,
    executionTimeout: 300,
    maxConcurrentNodes: 5,
    
    ragEnabled: false,
    knowledgeBase: '',
    similarityThreshold: 0.7,
    maxDocuments: 5,
    
    notifyOnCompletion: true,
    notifyOnError: true,
    
    debugMode: false,
    logLevel: 'error',
  });

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'custom',
            animated: true,
            data: { label: 'Connection' }
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
              // Ensure label is always defined
              label: updatedData.label || node.data.label || 'Node',
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
  // Handle edge deletion
  const onEdgeDelete = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, [setEdges]);
  
  // Update edges data with delete handler
  const updatedEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        onDelete: onEdgeDelete
      }
    }));
  }, [edges, onEdgeDelete]);
  
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
      setNodes((nds) => [...nds, newNode as Node<NodeDataType>]);
    },
    [reactFlowInstance, setNodes, onNodeConfigChange, onDefaultNodeConfigChange]
  );
  
  // Handler for saving workflow settings
  const handleSaveSettings = (settings: WorkflowSettings) => {
    setWorkflowSettings(settings);
    console.log('Workflow settings updated:', settings);
    
    // Apply any necessary changes based on new settings
    // For example, updating execution environment or context window
  };
  
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-dark-50 border-b border-dark-200 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-white ml-2">Workflow Editor</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-md text-gray-300 hover:bg-dark-200 transition-colors"
            onClick={() => setIsSettingsOpen(true)}
            title="Workflow Settings"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-dark-50 dark:text-white bg-gradient-to-r from-primary to-secondary rounded-md shadow"
            onClick={() => {
              // Export workflow logic
              const workflow = {
                nodes,
                edges,
                settings: workflowSettings,
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
            edges={updatedEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={customEdgeTypes}
            connectionLineType={ConnectionLineType.SmoothStep}
            snapToGrid={true}
            fitView
            className="bg-dark-100"
            defaultEdgeOptions={{
              type: 'custom',
              style: { stroke: '#6366f1', strokeWidth: 2 },
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#6366f1',
              },
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
            {/* Add a Panel component for workflow execution controls */}
            <Panel position="top-right" className="bg-dark-50 p-2 rounded-md border border-gray-700 shadow-lg m-2">
              <div className="flex items-center gap-2">
                {workflowSettings.safeMode && (
                  <div className="py-1 px-2 bg-yellow-600 text-xs text-white rounded-md flex items-center">
                    <span>Safe Mode</span>
                  </div>
                )}
                {workflowSettings.memoryEnabled && (
                  <div className="py-1 px-2 bg-blue-600 text-xs text-white rounded-md flex items-center">
                    <span>Memory: {workflowSettings.memoryType}</span>
                  </div>
                )}
                {workflowSettings.ragEnabled && (
                  <div className="py-1 px-2 bg-green-600 text-xs text-white rounded-md flex items-center">
                    <span>RAG: {workflowSettings.knowledgeBase || 'Enabled'}</span>
                  </div>
                )}
                {workflowSettings.debugMode && (
                  <div className="py-1 px-2 bg-purple-600 text-xs text-white rounded-md flex items-center">
                    <span>Debug</span>
                  </div>
                )}
              </div>
            </Panel>
            
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
      
      {/* Settings Dialog */}
      <WorkflowSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialSettings={workflowSettings}
        onSave={handleSaveSettings}
      />
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
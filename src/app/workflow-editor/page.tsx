'use client';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  ConnectionLineType,
  Controls,
  Edge,
  EdgeTypes,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  XYPosition,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { AIAgentConfigData } from '@/components/workflow/AIAgentConfig';
import AIAgentNode from '@/components/workflow/AIAgentNode';
import CustomEdge from '@/components/workflow/CustomEdge';
import DefaultNode from '@/components/workflow/DefaultNode';
import { DefaultNodeData } from '@/components/workflow/DefaultNodeConfig';
import { ElevenLabsAgentWidget } from '@/components/workflow/ElevenLabsAgentWidget';
import NodePalette from '@/components/workflow/NodePalette';
import useNodeTypes from '@/components/workflow/NodeTypesFactory';
import PipedreamAppNode from '@/components/workflow/PipedreamAppNode';
import WorkflowHeader from '@/components/workflow/WorkflowHeader';
import WorkflowSettingsPanel, { WorkflowSettings } from '@/components/workflow/WorkflowSettings';

// Define a union type for node data
type NodeDataType = { id?: string;
  type?: string;
  label: string;
  description?: string;
  settings?: Record<string, any>;
  config?: AIAgentConfigData;
  onConfigChange?: (data: any) => void;
    };

// Define the edge data type
type EdgeDataType = { label?: string;
  dashed?: boolean;
  onDelete?: (id: string) => void;
    };

// Define custom edge types
const customEdgeTypes: EdgeTypes = { custom: CustomEdge,
    };

// Initial workflow settings
const initialWorkflowSettings: WorkflowSettings = { name: "New Workflow",
  description: "A workflow created with the Optiflow editor",
  version: "1.0.0",
  interval: "1d",
  maxConcurrency: 5,
  isActive: true,
  
  memoryEnabled: true,
  memoryType: "buffer",
  memorySize: 1024,
  contextWindowSize: 10,
  
  safeMode: false,
  autoSave: true,
  executionTimeout: 300,
  maxConcurrentNodes: 5,
  
  ragEnabled: false,
  knowledgeBase: "",
  similarityThreshold: 0.7,
  maxDocuments: 5,
  
  notifyOnCompletion: true,
  notifyOnError: true,
  
  debugMode: false,
  logLevel: "error"
    };

// Initial nodes for the workflow
const initialNodes: Node<NodeDataType>[] = [
  {
    id: 'scraper-1',
    type: 'default',
    position: { x: 100, y: 100     },
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
    position: { x: 100, y: 250     },
    data: {
  id: 'process-data-1',
      type: 'process-data',
      label: 'Format Company Data',
      description: 'Transform scraped data into structured format',
      settings: {
  inputFormat: 'html',
        outputFormat: 'json',
        transformation: '{ \n  "name": "data.companyName",\n  "email": "data.contactEmail",\n  "phone": "data.contactPhone"\n    }'
      }
    },
  },
  {
    id: 'agent-1',
    type: 'aiAgent',
    position: { x: 100, y: 400     },
    data: {
  label: 'AI Lead Qualifier',
      description: 'Analyze company data to determine if it\'s a good lead',
      config: {
  name: 'Lead Analyzer',
        type: 'Conditional',
        prompt: `You are an AI assistant that helps analyze company data to determine if it's a good lead.\nConsider the following factors:\n- Company size and industry\n- Recent news or events\n- Contact information completeness\n- Online presence\n\nAnalyze the provided data and respond with:\n1. Whether this is a good lead (Yes/No)\n2. Confidence level (Low/Medium/High)\n3. Brief justification for your assessment`,
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
    position: { x: 100, y: 550     },
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
    position: { x: 300, y: 700     },
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
    position: { x: -100, y: 700     },
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
    data: { label: 'Raw Data'     }
  },
  {
    id: 'e2-3',
    source: 'process-1',
    target: 'agent-1',
    type: 'custom',
    animated: true,
    data: { label: 'Structured Data'     }
  },
  {
    id: 'e3-4',
    source: 'agent-1',
    target: 'conditional-1',
    type: 'custom',
    animated: true,
    data: { label: 'Analysis'     }
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
const nodeTypes = { default: DefaultNode,
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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeDataType>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeDataType>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Add state for workflow settings and modal
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<WorkflowSettings>(initialWorkflowSettings);

  // State for tracking node being dragged from palette
  const [nodeDragType, setNodeDragType] = useState<string | null>(null);
  
  // Load generated workflow from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWorkflow = sessionStorage.getItem('generatedWorkflow');
        if (savedWorkflow) {
          console.log('Found saved workflow in sessionStorage');
          
          // Parse the workflow data
          const workflow = JSON.parse(savedWorkflow);
          console.log('Loading workflow from sessionStorage:', workflow);
          
          // Validate workflow structure
          if (!workflow || !workflow.nodes || !Array.isArray(workflow.nodes)) { console.error('Invalid workflow structure:', workflow);
            return;
              }
          
          if (workflow.nodes.length === 0) {
            console.warn('Workflow has no nodes');
            return;
          }
          
          // Debug the node structure
          console.log('First node structure:', workflow.nodes[0]);
          
          // Process nodes - the format should be compatible with ReactFlow
          const formattedNodes = workflow.nodes.map((node: any) => {
            // Additional validation
            if (!node.id) {
              console.error('Node missing ID:', node);
              node.id = `node-${Math.random().toString(36).substr(2, 9)}`;
            }
            
            if (!node.data) {
              console.error('Node missing data:', node);
              node.data = { label: 'Unknown Node'     };
            }
            
            // Create a node that matches ReactFlow's expected format
            const formattedNode = {
              id: node.id,
              type: node.type || 'default',
              position: node.position || { x: 0, y: 0     },
              data: {
                ...node.data,
                // Add any required properties for node rendering
                label: node.data.label || 'Node',
                description: node.data.description || '',
                type: node.data.type || 'default',
                config: node.data.parameters || {},
                onConfigChange: null // Will be added by updatedNodes
              }
            };
            
            console.log('Formatted node:', formattedNode);
            return formattedNode;
          });
          
          // Process edges - the format should be compatible with ReactFlow
          const formattedEdges = (workflow.edges || []).map((edge: any) => {
            // Additional validation
            if (!edge.source || !edge.target) { console.error('Edge missing source or target:', edge);
              return null;
                }
            
            // Create an edge that matches ReactFlow's expected format
            const formattedEdge = {
              id: edge.id || `edge-${Math.random().toString(36).substr(2, 9)}`,
              source: edge.source,
              target: edge.target,
              type: edge.type || 'default',
              animated: edge.animated || true,
              data: {
  label: edge.label || '',
                onDelete: null // Will be added by updatedEdges
                  }
            };
            
            console.log('Formatted edge:', formattedEdge);
            return formattedEdge;
          }).filter(Boolean);
          
          console.log('Processed nodes for editor:', formattedNodes);
          console.log('Processed edges for editor:', formattedEdges);
          
          // Update workflow settings
          if (workflow.name || workflow.description) {
            setSettings(prev => ({ ...prev,
              name: workflow.name || prev.name,
              description: workflow.description || prev.description
                }));
          }
          
          // Apply the new workflow to the editor
          if (formattedNodes.length > 0) {
            setNodes(formattedNodes);
            setEdges(formattedEdges);
            console.log('Successfully loaded workflow into editor');
          } else {
            console.warn('No nodes found in the workflow');
          }
        } else {
          console.log('No saved workflow found in sessionStorage');
        }
      } catch (error) { console.error('Error loading workflow from sessionStorage:', error);
          }
    }
  }, [setNodes, setEdges, setSettings]);
  
  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'custom',
            animated: true,
            data: { label: 'Connection'     }
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
          data: { ...node.data,
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
            data: { ...updatedData,
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
      data: { ...edge.data,
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
      const position = reactFlowInstance.project({ x: event.clientX - reactFlowBounds.left,
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
  
  // Handle saving workflow settings
  const handleSaveSettings = (settings: WorkflowSettings) => {
    setSettings(settings);
    // Apply any settings that affect the workflow graph
    // For example, updating execution environment or context window
  };
  
  // Handler for applying a generated workflow from voice commands
  const handleWorkflowGenerated = useCallback((workflow: any) => {
    if (!workflow || !workflow.nodes || !workflow.edges) return;
    
    // Convert the generated workflow to the format reactflow expects
    const formattedNodes = workflow.nodes.map((node: any) => ({
      id: node.id,
      type: node.type === 'aiAgent' ? 'aiAgent' : 'default',
      position: node.position || { x: 0, y: 0     },
      data: { ...node.data,
        id: node.id,
        type: node.type,
        label: node.data.label || 'Node',
          },
    }));
    
    const formattedEdges = workflow.edges.map((edge: any) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'custom',
      animated: true,
      data: { label: edge.label || ''     },
    }));
    
    // Update workflow settings
    setSettings(prev => ({ ...prev,
      name: workflow.name || prev.name,
      description: workflow.description || prev.description,
        }));
    
    // Apply the new workflow
    setNodes(formattedNodes);
    setEdges(formattedEdges);
    
    // Notify the user
    alert(`Workflow "${workflow.name}" created successfully from voice command!`);
  }, [setNodes, setEdges]);

  const handleSaveWorkflow = useCallback(() => {
    // Save the current workflow state
    const workflowState = {
      nodes,
      edges,
      settings
    };
    
    // Save to session storage
    sessionStorage.setItem('savedWorkflow', JSON.stringify(workflowState));
    
    // TODO: Implement actual save to backend
    console.log('Saving workflow:', workflowState);
  }, [nodes, edges, settings]);

  return (
    <div className="h-screen flex flex-col">
      <WorkflowHeader 
        workflowName={settings.name}
        onOpenSettings={() => setShowSettings(true)}
        onSaveWorkflow={handleSaveWorkflow}
      />
      <div className="flex-1 flex">
        <NodePalette />
        <div className="flex-1 h-full">
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
              style: { stroke: '#6366f1', strokeWidth: 2     },
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
            style={{ backgroundColor: "#111827"     }}
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
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Panel position="top-right" className="bg-dark-50 p-2 rounded-md border border-gray-700 shadow-lg m-2">
              <div className="flex items-center gap-2">
                {settings.safeMode && (
                  <div className="py-1 px-2 bg-yellow-600 text-xs text-white rounded-md flex items-center">
                    <span>Safe Mode</span>
                  </div>
                )}
                {settings.memoryEnabled && (
                  <div className="py-1 px-2 bg-blue-600 text-xs text-white rounded-md flex items-center">
                    <span>Memory: {settings.memoryType}</span>
                  </div>
                )}
                {settings.ragEnabled && (
                  <div className="py-1 px-2 bg-green-600 text-xs text-white rounded-md flex items-center">
                    <span>RAG Enabled</span>
                  </div>
                )}
                {settings.debugMode && (
                  <div className="py-1 px-2 bg-purple-600 text-xs text-white rounded-md flex items-center">
                    <span>Debug</span>
                  </div>
                )}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
      
      {/* Add the ElevenLabsAgentWidget */}
      <ElevenLabsAgentWidget 
        agentId="i3gU7j7TnkhSqx3MNkhu" 
        onWorkflowGenerated={handleWorkflowGenerated}
      />
      
      {/* Settings Dialog */}
      <WorkflowSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        initialSettings={settings}
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
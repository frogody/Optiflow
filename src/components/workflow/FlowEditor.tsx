'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from 'reactflow';

import 'reactflow/dist/style.css';
import { AnimatedEdge, CustomEdge, DashedEdge, DottedEdge } from './edges/CustomEdge';
import ActionNode from './nodes/ActionNode';
import { aiNodeTypes } from './nodes/AINodes';
import ConditionalNode from './nodes/ConditionalNode';
import TriggerNode from './nodes/TriggerNode';
import WaitNode from './nodes/WaitNode';
import { nodeTypes as workflowNodeTypes } from './nodes/WorkflowNodes';

import PipedreamConnector from '@/components/PipedreamConnector';


// Register custom node types
const nodeTypes = { 
  action: ActionNode,
  trigger: TriggerNode,
  wait: WaitNode,
  conditional: ConditionalNode,
  // Add AI node types
  ...aiNodeTypes,
  // Add other workflow node types
  ...workflowNodeTypes
};

// Add new edge types
const edgeTypes = { 
  default: CustomEdge,
  animated: AnimatedEdge,
  dashed: DashedEdge,
  dotted: DottedEdge
};

// Define a list of node categories for better organization
const nodeCategories = [
  { id: 'triggers', name: 'Triggers', icon: '🔌' },
  { id: 'actions', name: 'Actions', icon: '⚙️' },
  { id: 'ai', name: 'AI Processing', icon: '🧠' },
  { id: 'control', name: 'Control Flow', icon: '🔀' },
  { id: 'data', name: 'Data Handling', icon: '📊' },
  { id: 'integrations', name: 'Integrations', icon: '🔄' }
];

interface ConnectionRules {
  [key: string]: {
    allowedTargets: string[];
    maxConnections: number;
  };
}

const connectionRules: ConnectionRules = {
  'extract-webpage': { allowedTargets: ['process-data', 'api', 'database', 'send-email'], maxConnections: 1 },
  'process-data': { allowedTargets: ['api', 'database', 'send-email', 'social-post'], maxConnections: 3 },
  'api': { allowedTargets: ['process-data', 'database', 'send-email', 'conditional'], maxConnections: 2 },
  'database': { allowedTargets: ['process-data', 'api', 'send-email', 'conditional'], maxConnections: 2 },
  'send-email': { allowedTargets: ['process-data', 'api', 'database'], maxConnections: 1 },
  'conditional': { allowedTargets: ['*'], maxConnections: 2 },
  // Add rules for AI nodes
  'textGeneration': { allowedTargets: ['*'], maxConnections: 1 },
  'chatCompletion': { allowedTargets: ['*'], maxConnections: 1 },
  'imageGeneration': { allowedTargets: ['*'], maxConnections: 1 },
  'documentExtraction': { allowedTargets: ['*'], maxConnections: 1 },
  'classification': { allowedTargets: ['*'], maxConnections: 2 },
  'translation': { allowedTargets: ['*'], maxConnections: 1 },
};

// Add edge customization options
interface EdgeCustomization {
  type: 'default' | 'animated' | 'dashed' | 'dotted';
  color: string;
  width: number;
  label?: string;
  animated?: boolean;
}

interface FlowEditorProps {
  initialFlow?: { nodes: Node[]; edges: Edge[] };
  onSave?: (flow: { nodes: Node[]; edges: Edge[] }) => void;
}

// Define a list of available apps that can be integrated
const availableApps = [
  { id: 'slack', name: 'Slack', category: 'messaging', icon: '🔷' },
  { id: 'gmail', name: 'Gmail', category: 'email', icon: '📧' },
  { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: '☁️' },
  { id: 'hubspot', name: 'HubSpot', category: 'crm', icon: '🟠' },
  { id: 'linkedin', name: 'LinkedIn', category: 'social', icon: '🔵' },
  { id: 'twitter', name: 'Twitter', category: 'social', icon: '🐦' },
  { id: 'github', name: 'GitHub', category: 'development', icon: '🐙' },
  { id: 'stripe', name: 'Stripe', category: 'payment', icon: '💳' },
  { id: 'shopify', name: 'Shopify', category: 'ecommerce', icon: '🛍️' },
  { id: 'notion', name: 'Notion', category: 'productivity', icon: '📝' },
  { id: 'airtable', name: 'Airtable', category: 'database', icon: '📊' },
  { id: 'google_sheets', name: 'Google Sheets', category: 'spreadsheet', icon: '📊' },
  { id: 'zapier', name: 'Zapier', category: 'automation', icon: '⚡' },
  { id: 'monday', name: 'Monday.com', category: 'project', icon: '📅' },
  { id: 'asana', name: 'Asana', category: 'project', icon: '📋' },
  // AI Services
  { id: 'openai', name: 'OpenAI', category: 'ai', icon: '🧠' },
  { id: 'anthropic', name: 'Anthropic', category: 'ai', icon: '🤖' },
  { id: 'elevenlabs', name: 'ElevenLabs', category: 'ai', icon: '🔊' },
  { id: 'huggingface', name: 'HuggingFace', category: 'ai', icon: '🤗' }
];

// Define node templates
const nodeTemplates = [
  // Triggers
  { 
    type: 'trigger',
    label: 'Extract Webpage Text',
    description: 'Extract text content from a webpage URL',
    icon: '🌐',
    category: 'triggers'
  },
  { 
    type: 'scheduleTrigger',
    label: 'Schedule',
    description: 'Trigger workflow on a schedule',
    icon: '⏰',
    category: 'triggers'
  },
  { 
    type: 'webhookTrigger',
    label: 'Webhook',
    description: 'Trigger workflow from external HTTP requests',
    icon: '🔗',
    category: 'triggers'
  },
  
  // Actions
  { 
    type: 'email',
    label: 'Send Email',
    description: 'Send an email using connected email provider',
    icon: '📧',
    category: 'actions'
  },
  { 
    type: 'httpRequest',
    label: 'HTTP Request',
    description: 'Make an HTTP request to an external API',
    icon: '🌐',
    category: 'actions'
  },
  { 
    type: 'slack',
    label: 'Slack Message',
    description: 'Send a message to a Slack channel',
    icon: '💬',
    category: 'actions'
  },
  
  // AI Nodes
  { 
    type: 'textGeneration',
    label: 'Text Generation',
    description: 'Generate text using an AI model',
    icon: '📝',
    category: 'ai',
    model: 'gpt-4-turbo'
  },
  { 
    type: 'chatCompletion',
    label: 'Chat Completion',
    description: 'Generate a response based on conversation history',
    icon: '💬',
    category: 'ai',
    model: 'claude-3-opus-20240229'
  },
  { 
    type: 'summarization',
    label: 'Text Summarization',
    description: 'Create concise summaries of longer text',
    icon: '📄',
    category: 'ai'
  },
  { 
    type: 'translation',
    label: 'Translation',
    description: 'Translate text between languages',
    icon: '🌍',
    category: 'ai'
  },
  { 
    type: 'imageGeneration',
    label: 'Image Generation',
    description: 'Generate images from text descriptions',
    icon: '🖼️',
    category: 'ai',
    model: 'dall-e-3'
  },
  { 
    type: 'textToSpeech',
    label: 'Text to Speech',
    description: 'Convert text to natural-sounding speech',
    icon: '🔊',
    category: 'ai'
  },
  { 
    type: 'documentExtraction',
    label: 'Document Extraction',
    description: 'Extract structured data from documents',
    icon: '📑',
    category: 'ai'
  },
  
  // Control Flow
  { 
    type: 'wait',
    label: 'Wait',
    description: 'Pause the workflow for a specified time period',
    icon: '⏱️',
    category: 'control'
  },
  { 
    type: 'condition',
    label: 'Condition',
    description: 'Branch workflow based on a condition',
    icon: '🔀',
    category: 'control'
  },
  { 
    type: 'loop',
    label: 'Loop',
    description: 'Repeat actions for each item in a list',
    icon: '🔄',
    category: 'control'
  },
  
  // Data Handling
  { 
    type: 'transformData',
    label: 'Transform Data',
    description: 'Modify, filter, or reformat data',
    icon: '🔄',
    category: 'data'
  },
  { 
    type: 'database',
    label: 'Database',
    description: 'Read or write data to a database',
    icon: '💾',
    category: 'data'
  }
];

// Check if an app is already connected (in development mode)
const isAppConnected = (appId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Get user ID from localStorage or use a default
    const currentUser = JSON.parse(localStorage.getItem('user_store') || '{}');
    const userId = currentUser?.state?.currentUser?.id || 'default-user';
    
    // Get connections from localStorage
    const connectionsStr = localStorage.getItem(`mock_connections_${userId}`);
    if (!connectionsStr) return false;
    
    const connections = JSON.parse(connectionsStr);
    return connections.some((conn: any) => conn.app === appId);
  } catch (error) { 
    console.error('Error checking app connection status:', error);
    return false;
  }
};

export default function FlowEditor() {
  // Initialize with empty or provided flow
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeCategory, setActiveCategory] = useState('triggers');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [edgeCustomization, setEdgeCustomization] = useState<EdgeCustomization>({ 
    type: 'default',
    color: '#6366f1',
    width: 2,
    animated: false
  });

  // Load connected apps on mount
  useEffect(() => {
    const loadConnectedApps = () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Get user ID from localStorage or use a default
        const currentUser = JSON.parse(localStorage.getItem('user_store') || '{}');
        const userId = currentUser?.state?.currentUser?.id || 'default-user';
        
        // Get connections from localStorage
        const connectionsStr = localStorage.getItem(`mock_connections_${userId}`);
        if (!connectionsStr) return;
        
        const connections = JSON.parse(connectionsStr);
        const appIds = connections.map((conn: any) => conn.app);
        
        // Update state with connected apps
        setConnectedApps(appIds);
      } catch (error) { 
        console.error('Error loading connected apps:', error);
      }
    };
    
    loadConnectedApps();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Enhanced connection validation
  const onConnect = (connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (!sourceNode?.type || !targetNode?.type) return;

    const sourceType = sourceNode.type as keyof typeof connectionRules;
    const rules = connectionRules[sourceType];
    if (!rules) return;

    // Validate connection
    if (!rules.allowedTargets.includes(targetNode.type) && !rules.allowedTargets.includes('*')) {
      console.warn(`Connection not allowed: ${sourceType} -> ${targetNode.type}`);
      return;
    }

    const existingConnections = edges.filter(
      (edge) => edge.source === connection.source
    );

    if (existingConnections.length >= rules.maxConnections) {
      console.warn(`Maximum connections reached for ${sourceType}`);
      return;
    }

    // Create new edge with customization
    const newEdge: Edge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      type: edgeCustomization.type,
      data: {
        label: edgeCustomization.label || '',
        color: edgeCustomization.color,
        width: edgeCustomization.width,
        animated: edgeCustomization.animated
      },
    };

    setEdges((eds: Edge[]) => [...eds, newEdge])
  };

  // Handle connecting an app
  const handleConnectApp = (appId: string) => {
    if (isAppConnected(appId)) {
      toast.success(`Already connected to ${appId}`);
      return;
    }

    toast.success(`Connecting to ${appId}...`);
    
    // Create a mock connection
    setTimeout(() => {
      try {
        // Get user ID from localStorage or use a default
        const currentUser = JSON.parse(localStorage.getItem('user_store') || '{}');
        const userId = currentUser?.state?.currentUser?.id || 'default-user';
        
        // Get existing connections
        const connectionsStr = localStorage.getItem(`mock_connections_${userId}`) || '[]';
        const connections = JSON.parse(connectionsStr);
        
        // Add new connection
        const app = availableApps.find(a => a.id === appId);
        const newConnection = {
          id: `mock-${appId}-${Date.now()}`,
          app: appId,
          app_name: app?.name || appId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        connections.push(newConnection);
        
        // Save updated connections
        localStorage.setItem(`mock_connections_${userId}`, JSON.stringify(connections));
        
        // Update state
        setConnectedApps(prev => [...prev, appId])
        toast.success(`Successfully connected to ${appId}!`);
      } catch (error) {
        console.error('Error connecting to app:', error);
        toast.error(`Failed to connect to ${appId}`);
      }
    }, 1500);
  };

  // Handle drag over for node drag & drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle drop for node drag & drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const templateId = event.dataTransfer.getData('application/reactflow/template');
        
        if (templateId) {
          const template = nodeTemplates.find(t => t.label === templateId);
          
          if (template) {
            const position = reactFlowInstance.screenToFlowPosition({ 
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });
            
            const newNode: Node = {
              id: `${template.type}-${Date.now()}`,
              type: template.type,
              position,
              data: {
                label: template.label,
                description: template.description,
                icon: template.icon,
                category: template.category,
                model: template.model,
                config: {}
              },
            };

            setNodes((nds) => nds.concat(newNode));
          }
        }
      }
    },
    [reactFlowInstance, setNodes, nodeTemplates]
  ) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle save flow
  const handleSaveFlow = useCallback(() => {
    if (onSave) {
      onSave({ nodes, edges });
    }
    toast.success('Workflow saved successfully!');
  }, [nodes, edges, onSave]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle drag start for node templates
  const onDragStart = (event: React.DragEvent, templateId: string) => {
    event.dataTransfer.setData('application/reactflow/template', templateId);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Get filtered templates based on active category
  const getFilteredTemplates = () => {
    return nodeTemplates.filter(template => template.category === activeCategory);
  };

  // Add edge customization controls
  const EdgeCustomizationPanel = () => (
    <div className="absolute bottom-4 right-4 bg-dark-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-white text-sm font-medium mb-2">Edge Style</h3>
      <div className="space-y-2">
        <select
          value={edgeCustomization.type}
          onChange={(e) => setEdgeCustomization(prev => ({ ...prev, type: e.target.value as any }))}
          className="w-full px-2 py-1 bg-dark-200 text-white rounded"
          title="Edge Type"
        >
          <option value="default">Default</option>
          <option value="animated">Animated</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
        <input
          type="color"
          value={edgeCustomization.color}
          onChange={(e) => setEdgeCustomization(prev => ({ ...prev, color: e.target.value }))}
          className="w-full"
          title="Edge Color"
        />
        <input
          type="number"
          value={edgeCustomization.width}
          onChange={(e) => setEdgeCustomization(prev => ({ ...prev, width: parseInt(e.target.value) }))}
          min="1"
          max="5"
          className="w-full px-2 py-1 bg-dark-200 text-white rounded"
          title="Edge Width"
          placeholder="Edge Width"
        />
        <input
          type="text"
          value={edgeCustomization.label || ''}
          onChange={(e) => setEdgeCustomization(prev => ({ ...prev, label: e.target.value }))}
          placeholder="Edge label"
          className="w-full px-2 py-1 bg-dark-200 text-white rounded"
          title="Edge Label"
        />
        <label className="flex items-center text-white">
          <input
            type="checkbox"
            checked={edgeCustomization.animated}
            onChange={(e) => setEdgeCustomization(prev => ({ ...prev, animated: e.target.checked }))}
            className="mr-2"
            title="Animate Edge"
          />
          Animate
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar with node templates and connected apps */}
      {showSidebar && (
        <div className="w-64 bg-dark-50 border-r border-dark-100 overflow-y-auto flex flex-col">
          {/* Node categories */}
          <div className="p-4 border-b border-dark-100">
            <div className="flex flex-wrap gap-2">
              {nodeCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-dark-100 text-white/80 hover:bg-dark-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Node templates */}
          <div className="p-4 overflow-y-auto">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Templates</h3>
            <div className="space-y-2">
              {getFilteredTemplates().map((template) => (
                <div
                  key={template.label}
                  className="bg-dark-100 hover:bg-dark-200 cursor-move p-3 rounded-md text-white/90"
                  draggable
                  onDragStart={(e) => onDragStart(e, template.label)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{template.icon}</span>
                    <span>{template.label}</span>
                  </div>
                  {template.description && (
                    <p className="text-white/60 text-xs mt-1">{template.description}</p>
                  )}
                  {template.model && (
                    <div className="mt-1 text-xs bg-dark-200 text-primary rounded-full px-2 py-0.5 inline-block">
                      {template.model}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connected apps */}
          <div className="p-4 border-t border-dark-100 mt-auto">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Connected Apps</h3>
            <div className="space-y-2">
              {availableApps
                .filter(app => activeCategory === 'ai' ? app.category === 'ai' : app.category !== 'ai')
                .map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between bg-dark-100 p-2 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{app.icon}</span>
                    <span className="text-white/90 text-sm">{app.name}</span>
                  </div>
                  {connectedApps.includes(app.id) ? (
                    <span className="text-green-500 text-xs">✓ Connected</span>
                  ) : (
                    <button
                      onClick={() => handleConnectApp(app.id)}
                      className="text-xs bg-primary/20 hover:bg-primary/30 text-primary rounded px-2 py-1"
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flow Editor Canvas */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between items-center p-2 bg-dark-100 border-b border-dark-200">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-white/80 hover:text-white p-1"
            >
              { showSidebar ? '◀' : '▶' }
            </button>
            <h2 className="text-white font-medium">Workflow Editor</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveFlow}
              className="text-sm bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
            >
              <Controls className="bg-dark-100 text-white border-dark-200" />
              <MiniMap
                nodeColor={(node) => {
                  switch (node.type) { 
                    case 'trigger':
                    case 'scheduleTrigger': 
                    case 'webhookTrigger':
                    case 'eventTrigger':
                      return '#FF7F50'; // Coral
                    case 'action':
                    case 'email':
                    case 'httpRequest':
                    case 'slack':
                      return '#06b6d4'; // Cyan
                    case 'wait':
                    case 'delay':
                      return '#f59e0b'; // Amber
                    case 'conditional':
                    case 'condition':
                    case 'switch':
                    case 'loop':
                      return '#a855f7'; // Purple
                    case 'textGeneration':
                    case 'chatCompletion':
                    case 'summarization':
                    case 'translation':
                    case 'imageGeneration':
                    case 'textToSpeech':
                    case 'documentExtraction':
                      return '#8b5cf6'; // Violet
                    default:
                      return '#6b7280'; // Gray
                  }
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
                className="bg-dark-100 border-dark-200"
              />
              <Background gap={20} size={1} />
              <EdgeCustomizationPanel />
              {selectedNode && (
                <Panel position="top-right" className="bg-dark-100 p-4 rounded-lg shadow-lg max-w-md">
                  <h3 className="text-white font-medium mb-2">Node Properties</h3>
                  <div className="text-white/80 text-sm">
                    <p><strong>Type:</strong> {selectedNode.type}</p>
                    <p><strong>Label:</strong> {selectedNode.data.label}</p>
                    {selectedNode.data.description && (
                      <p><strong>Description:</strong> {selectedNode.data.description}</p>
                    )}
                    {selectedNode.data.model && (
                      <p><strong>Model:</strong> {selectedNode.data.model}</p>
                    )}
                  </div>
                  <button
                    className="mt-2 bg-dark-200 text-white/80 hover:text-white px-2 py-1 rounded text-xs"
                    onClick={() => setSelectedNode(null)}
                  >
                    Close
                  </button>
                </Panel>
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
} 
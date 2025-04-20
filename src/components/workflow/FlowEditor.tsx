'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import ActionNode from './nodes/ActionNode';
import TriggerNode from './nodes/TriggerNode';
import WaitNode from './nodes/WaitNode';
import ConditionalNode from './nodes/ConditionalNode';
import PipedreamConnector from '@/components/PipedreamConnector';
import { toast } from 'react-hot-toast';
import { CustomEdge, AnimatedEdge, DashedEdge, DottedEdge } from './edges/CustomEdge';

// Register custom node types
const nodeTypes = {
  action: ActionNode,
  trigger: TriggerNode,
  wait: WaitNode,
  conditional: ConditionalNode
};

// Add new edge types
const edgeTypes = {
  default: CustomEdge,
  animated: AnimatedEdge,
  dashed: DashedEdge,
  dotted: DottedEdge
};

interface ConnectionRules {
  [key: string]: {
    allowedTargets: string[];
    maxConnections: number;
  };
}

const connectionRules: ConnectionRules = {
  'extract-webpage': {
    allowedTargets: ['process-data', 'api', 'database', 'send-email'],
    maxConnections: 1,
  },
  'process-data': {
    allowedTargets: ['api', 'database', 'send-email', 'social-post'],
    maxConnections: 3,
  },
  'api': {
    allowedTargets: ['process-data', 'database', 'send-email', 'conditional'],
    maxConnections: 2
  },
  'database': {
    allowedTargets: ['process-data', 'api', 'send-email', 'conditional'],
    maxConnections: 2
  },
  'send-email': {
    allowedTargets: ['process-data', 'api', 'database'],
    maxConnections: 1
  },
  'conditional': {
    allowedTargets: ['*'],
    maxConnections: 2
  }
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
  initialFlow?: {
    nodes: Node[];
    edges: Edge[];
  };
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
  { id: 'asana', name: 'Asana', category: 'project', icon: '📋' }
];

// Define node templates
const nodeTemplates = [
  {
    type: 'trigger',
    label: 'Extract Webpage Text',
    description: 'Extract text content from a webpage URL',
    icon: '🌐',
    category: 'data'
  },
  {
    type: 'action',
    label: 'Send Email',
    description: 'Send an email using connected email provider',
    icon: '📧',
    category: 'communication'
  },
  {
    type: 'action',
    label: 'First Outreach Email',
    description: 'Send the first outreach email in a sequence',
    icon: '✉️',
    category: 'communication'
  },
  {
    type: 'wait',
    label: 'Wait Three Days',
    description: 'Pause the workflow for a specified time period',
    icon: '⏱️',
    category: 'timing'
  },
  {
    type: 'conditional',
    label: 'AI Agent',
    description: 'Process data with an AI agent to make decisions',
    icon: '🤖',
    category: 'intelligence'
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

export default function FlowEditor({ initialFlow, onSave }: FlowEditorProps) {
  // Initialize with empty or provided flow
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
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
  }, []);

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
    if (!rules.allowedTargets.includes(targetNode.type)) {
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
      type: 'default',
      data: {
        label: '',
        color: '#b1b1b7',
        width: 2,
      },
    };

    setEdges((eds: Edge[]) => [...eds, newEdge]);
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
        setConnectedApps(prev => [...prev, appId]);
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
  }, []);

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
                category: template.category
              },
            };

            setNodes((nds) => nds.concat(newNode));
          }
        }
      }
    },
    [reactFlowInstance, setNodes, nodeTemplates]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle save flow
  const handleSaveFlow = useCallback(() => {
    if (onSave) {
      onSave({ nodes, edges });
    }
    toast.success('Workflow saved successfully!');
  }, [nodes, edges, onSave]);

  // Handle drag start for node templates
  const onDragStart = (event: React.DragEvent, templateId: string) => {
    event.dataTransfer.setData('application/reactflow/template', templateId);
    event.dataTransfer.effectAllowed = 'move';
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
        />
        <input
          type="number"
          value={edgeCustomization.width}
          onChange={(e) => setEdgeCustomization(prev => ({ ...prev, width: parseInt(e.target.value) }))}
          min="1"
          max="5"
          className="w-full px-2 py-1 bg-dark-200 text-white rounded"
        />
        <input
          type="text"
          value={edgeCustomization.label || ''}
          onChange={(e) => setEdgeCustomization(prev => ({ ...prev, label: e.target.value }))}
          placeholder="Edge label"
          className="w-full px-2 py-1 bg-dark-200 text-white rounded"
        />
        <label className="flex items-center text-white">
          <input
            type="checkbox"
            checked={edgeCustomization.animated}
            onChange={(e) => setEdgeCustomization(prev => ({ ...prev, animated: e.target.checked }))}
            className="mr-2"
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
          {/* Node templates */}
          <div className="p-4">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Actions</h3>
            <div className="space-y-2">
              {nodeTemplates.map((template) => (
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
                </div>
              ))}
            </div>
          </div>

          {/* Connected apps */}
          <div className="p-4 border-t border-dark-100 mt-auto">
            <h3 className="text-white/80 text-sm font-semibold mb-2">Connected Apps</h3>
            <div className="space-y-2">
              {availableApps.map((app) => (
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
              {showSidebar ? '◀' : '▶'}
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
                      return '#3b82f6';
                    case 'action':
                      return '#10b981';
                    case 'wait':
                      return '#f59e0b';
                    case 'conditional':
                      return '#8b5cf6';
                    default:
                      return '#6b7280';
                  }
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
                className="bg-dark-100 border-dark-200"
              />
              <Background color="#334155" gap={16} />
              <EdgeCustomizationPanel />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Node configuration panel */}
        {selectedNode && (
          <div className="w-full h-64 bg-dark-100 border-t border-dark-200 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Configure: {selectedNode.data.label}</h3>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-white/80 text-sm">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-dark-200 border border-dark-300 rounded p-2 text-white"
                  defaultValue={selectedNode.data.label}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-white/80 text-sm">Type</label>
                <select 
                  className="w-full bg-dark-200 border border-dark-300 rounded p-2 text-white"
                  defaultValue={selectedNode.type}
                >
                  <option value="trigger">Trigger</option>
                  <option value="action">Action</option>
                  <option value="wait">Wait</option>
                  <option value="conditional">Conditional</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
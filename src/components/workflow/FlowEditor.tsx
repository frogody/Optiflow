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

// Register custom node types
const nodeTypes = {
  action: ActionNode,
  trigger: TriggerNode,
  wait: WaitNode,
  conditional: ConditionalNode
};

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

export default function FlowEditor({ initialFlow, onSave }: FlowEditorProps) {
  // Initialize with empty or provided flow
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow?.edges || []);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Handle node connection
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({
        ...params,
        animated: true,
        style: { stroke: 'var(--primary-color)', strokeWidth: 2 }
      }, eds));
    },
    [setEdges]
  );

  // Handle connecting an app
  const handleConnectApp = (appId: string) => {
    toast.success(`Connecting to ${appId}...`);
    // Simulate connecting to app
    setTimeout(() => {
      setConnectedApps(prev => [...prev, appId]);
      toast.success(`Successfully connected to ${appId}!`);
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
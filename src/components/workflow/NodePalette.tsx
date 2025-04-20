'use client';

import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { 
  DocumentTextIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  WrenchScrewdriverIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  TableCellsIcon,
  BeakerIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ChartBarIcon,
  FolderIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

// Node types available in the palette
const nodeTypes = [
  {
    id: 'extract-webpage',
    type: 'default',
    label: 'Extract Webpage',
    description: 'Extract text content from a webpage URL',
    icon: DocumentTextIcon,
    category: 'Data',
  },
  {
    id: 'ai-agent',
    type: 'aiAgent',
    label: 'AI Agent',
    description: 'Use AI to analyze content or make decisions',
    icon: WrenchScrewdriverIcon,
    category: 'AI',
  },
  {
    id: 'send-email',
    type: 'default',
    label: 'Send Email',
    description: 'Send an email to a contact',
    icon: EnvelopeIcon,
    category: 'Communication',
  },
  {
    id: 'wait',
    type: 'default',
    label: 'Wait',
    description: 'Pause the workflow for a specified time',
    icon: ClockIcon,
    category: 'Flow Control',
  },
  {
    id: 'contact',
    type: 'default',
    label: 'Contact',
    description: 'Add or update contact information',
    icon: UserIcon,
    category: 'CRM',
  },
  {
    id: 'chatbot',
    type: 'default',
    label: 'Chatbot',
    description: 'Engage visitors with an AI chatbot',
    icon: ChatBubbleLeftRightIcon,
    category: 'AI',
  },
  {
    id: 'transform',
    type: 'default',
    label: 'Transform Data',
    description: 'Modify data structure or format',
    icon: ArrowPathIcon,
    category: 'Data',
  },
  {
    id: 'conditional',
    type: 'default',
    label: 'Conditional Branch',
    description: 'Split workflow based on conditions',
    icon: ArrowsPointingOutIcon,
    category: 'Flow Control',
  },
  {
    id: 'database',
    type: 'default',
    label: 'Database',
    description: 'Execute SQL queries on a database',
    icon: TableCellsIcon,
    category: 'Data',
  },
  {
    id: 'process-data',
    type: 'default',
    label: 'Process Data',
    description: 'Filter, transform, or analyze data',
    icon: BeakerIcon,
    category: 'Data',
  },
  {
    id: 'code',
    type: 'default',
    label: 'Custom Code',
    description: 'Run custom code in your workflow',
    icon: CodeBracketIcon,
    category: 'Advanced',
  },
  {
    id: 'ml-model',
    type: 'default',
    label: 'ML Model',
    description: 'Use a machine learning model for prediction',
    icon: CpuChipIcon,
    category: 'AI',
  },
  {
    id: 'analytics',
    type: 'default',
    label: 'Analytics',
    description: 'Track events and metrics in your workflow',
    icon: ChartBarIcon,
    category: 'Analytics',
  },
  {
    id: 'file-manager',
    type: 'default',
    label: 'File Manager',
    description: 'Read, write, or manipulate files',
    icon: FolderIcon,
    category: 'Data',
  },
  {
    id: 'social-post',
    type: 'default',
    label: 'Social Post',
    description: 'Post to social media platforms',
    icon: PaperAirplaneIcon,
    category: 'Communication',
  },
  {
    id: 'scheduler',
    type: 'default',
    label: 'Scheduler',
    description: 'Schedule workflow execution',
    icon: CalendarIcon,
    category: 'Flow Control',
  },
  {
    id: 'api',
    type: 'default',
    label: 'API Request',
    description: 'Make requests to external APIs',
    icon: ServerIcon,
    category: 'Integration',
  },
  {
    id: 'pipedream-app',
    type: 'pipedreamApp',
    label: 'Connect App',
    description: 'Connect and use any app from Pipedream',
    icon: ServerIcon,
    category: 'Pipedream Apps',
  },
];

interface NodePaletteProps {
  className?: string;
}

export default function NodePalette({ className = '' }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const reactFlowInstance = useReactFlow();
  
  // Get all unique categories
  const categories = Array.from(new Set(nodeTypes.map(node => node.category)));
  
  // Filter nodes based on search and category
  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? node.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Handle node drag start
  const onDragStart = (event: React.DragEvent, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div className={`bg-dark-50 border-r border-dark-200 overflow-y-auto flex flex-col ${className}`}>
      <div className="p-3 border-b border-dark-200 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="flex items-center mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v-5.5M12 5v1.5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Flow Builder</h2>
        </div>
        <h3 className="font-medium text-white mb-2">Node Palette</h3>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 text-sm bg-dark-100 border border-dark-300 rounded text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="p-2 border-b border-dark-200 flex flex-wrap gap-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-2 py-0.5 text-xs rounded-full ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={`px-2 py-0.5 text-xs rounded-full ${
              category === selectedCategory
                ? 'bg-primary text-white'
                : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-2">
          {filteredNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                draggable
                onDragStart={(event) => onDragStart(event, node)}
                className="flex items-center p-2 bg-dark-100 hover:bg-dark-200 rounded-md cursor-move border border-dark-300 group transition-all"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-primary group-hover:to-secondary mr-3">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{node.label}</h4>
                  <p className="text-xs text-gray-400">{node.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
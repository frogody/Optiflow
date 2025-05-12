'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import WorkflowList from '@/components/workflow/WorkflowList';
import { useUserStore } from '@/lib/userStore';
import { Workflow, WorkflowFolder } from '@/types/workflow';


// Define types for agents and their capabilities
interface AgentCapability { id: string;
  name: string;
  description: string;
  category: 'data' | 'automation' | 'analysis' | 'communication';
    }

interface Agent { id: string;
  name: string;
  description: string;
  modelId: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  connectedApps: string[];
  capabilities: AgentCapability[];
  activeFlows: number;
  successRate: number;
    }

// Mock data for demonstration
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Lead Qualification Workflow',
    description: 'Automatically qualify leads based on website activity and engagement metrics',
    status: 'active',
    triggerType: 'event',
    createdAt: '2023-05-15T09:30:00Z',
    updatedAt: '2023-10-20T14:45:00Z',
    lastExecuted: '2023-10-21T08:12:00Z',
    executionCount: 342,
    successCount: 328,
    failureCount: 14,
    averageExecutionTime: 1240,
    creditsConsumed: 684,
    tags: ['sales', 'lead-gen', 'automation'],
    folderId: 'sales'
  },
  {
    id: '2',
    name: 'Customer Onboarding Sequence',
    description: 'Guide new customers through product setup and initial training with personalized emails and resources',
    status: 'active',
    triggerType: 'webhook',
    createdAt: '2023-06-22T11:15:00Z',
    updatedAt: '2023-10-18T16:30:00Z',
    lastExecuted: '2023-10-21T09:45:00Z',
    executionCount: 156,
    successCount: 153,
    failureCount: 3,
    averageExecutionTime: 950,
    creditsConsumed: 312,
    tags: ['onboarding', 'customers', 'email'],
    folderId: 'customer-success'
  },
  {
    id: '3',
    name: 'Weekly Sales Report',
    description: 'Generate and distribute weekly sales performance reports to leadership team',
    status: 'active',
    triggerType: 'schedule',
    createdAt: '2023-04-05T10:00:00Z',
    updatedAt: '2023-09-30T12:00:00Z',
    lastExecuted: '2023-10-16T06:00:00Z',
    executionCount: 28,
    successCount: 28,
    failureCount: 0,
    averageExecutionTime: 3420,
    creditsConsumed: 84,
    tags: ['reporting', 'sales', 'scheduled'],
    folderId: 'reporting'
  },
  {
    id: '4',
    name: 'Support Ticket Triage',
    description: 'Analyze incoming support tickets for severity and route to appropriate team members',
    status: 'inactive',
    triggerType: 'webhook',
    createdAt: '2023-07-12T14:20:00Z',
    updatedAt: '2023-10-05T09:15:00Z',
    lastExecuted: '2023-10-04T15:30:00Z',
    executionCount: 287,
    successCount: 275,
    failureCount: 12,
    averageExecutionTime: 850,
    creditsConsumed: 574,
    tags: ['support', 'triage', 'automation'],
    folderId: 'support'
  },
  {
    id: '5',
    name: 'Data Enrichment Pipeline',
    description: 'Enhance customer profiles with third-party data from various sources',
    status: 'error',
    triggerType: 'manual',
    createdAt: '2023-08-03T08:45:00Z',
    updatedAt: '2023-10-10T11:30:00Z',
    lastExecuted: '2023-10-10T11:35:00Z',
    executionCount: 42,
    successCount: 35,
    failureCount: 7,
    averageExecutionTime: 6800,
    creditsConsumed: 210,
    tags: ['data', 'enrichment', 'customers'],
    folderId: 'data-ops'
  },
  {
    id: '6',
    name: 'Email Campaign Manager',
    description: 'Orchestrate multi-step email marketing campaigns with dynamic content',
    status: 'draft',
    triggerType: 'schedule',
    createdAt: '2023-09-18T13:10:00Z',
    updatedAt: '2023-10-19T10:45:00Z',
    executionCount: 0,
    successCount: 0,
    failureCount: 0,
    averageExecutionTime: 0,
    creditsConsumed: 0,
    tags: ['marketing', 'email', 'campaigns'],
    folderId: 'marketing'
  },
  {
    id: '7',
    name: 'Voice Order Processing',
    description: 'Process and fulfill orders received through voice commands',
    status: 'active',
    triggerType: 'voice',
    createdAt: '2023-09-05T15:25:00Z',
    updatedAt: '2023-10-15T08:30:00Z',
    lastExecuted: '2023-10-21T10:15:00Z',
    executionCount: 126,
    successCount: 120,
    failureCount: 6,
    averageExecutionTime: 1350,
    creditsConsumed: 252,
    tags: ['voice', 'orders', 'fulfillment'],
  }
];

// Mock folders
const mockFolders: WorkflowFolder[] = [
  {
    id: 'sales',
    name: 'Sales',
    description: 'Workflows for sales automation and lead processing',
    workflowCount: 3,
    createdAt: '2023-04-01T10:00:00Z',
    updatedAt: '2023-09-15T14:30:00Z'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Email campaigns and marketing automation workflows',
    workflowCount: 5,
    createdAt: '2023-04-02T11:00:00Z',
    updatedAt: '2023-10-10T09:15:00Z'
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Customer support and ticket handling workflows',
    workflowCount: 2,
    createdAt: '2023-05-15T13:45:00Z',
    updatedAt: '2023-09-20T16:00:00Z'
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    description: 'Onboarding and customer retention workflows',
    workflowCount: 4,
    createdAt: '2023-06-10T09:30:00Z',
    updatedAt: '2023-10-05T14:45:00Z'
  },
  {
    id: 'reporting',
    name: 'Reporting',
    description: 'Automated report generation workflows',
    workflowCount: 3,
    createdAt: '2023-04-20T14:15:00Z',
    updatedAt: '2023-09-12T11:30:00Z'
  },
  {
    id: 'data-ops',
    name: 'Data Operations',
    description: 'Data processing and enrichment workflows',
    workflowCount: 2,
    createdAt: '2023-07-05T10:20:00Z',
    updatedAt: '2023-10-01T08:45:00Z'
  }
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function WorkflowsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [folders, setFolders] = useState<WorkflowFolder[]>(mockFolders);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter workflows by selected folder
  const filteredWorkflows = selectedFolder 
    ? workflows.filter(w => w.folderId === selectedFolder)
    : workflows;
  
  // Handlers
  const handleActivateWorkflow = (id: string) => {
    setWorkflows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, status: 'active' } : w
      )
    );
    toast.success('Workflow activated successfully');
  };
  
  const handleDeactivateWorkflow = (id: string) => {
    setWorkflows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, status: 'inactive' } : w
      )
    );
    toast.success('Workflow deactivated successfully');
  };
  
  const handleDeleteWorkflow = (id: string) => {
    // In a real application, you'd show a confirmation dialog first
    setWorkflows(prev => prev.filter(w => w.id !== id));
    toast.success('Workflow deleted successfully');
  };
  
  const handleDuplicateWorkflow = (id: string) => {
    const workflowToDuplicate = workflows.find(w => w.id === id);
    if (!workflowToDuplicate) return;
    
    const duplicatedWorkflow: Workflow = {
      ...workflowToDuplicate,
      id: `${id}-copy-${Date.now()}`,
      name: `${workflowToDuplicate.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
      creditsConsumed: 0
    };
    
    setWorkflows(prev => [...prev, duplicatedWorkflow]);
    toast.success('Workflow duplicated successfully');
  };
  
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    const newFolder: WorkflowFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      description: '',
      workflowCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setIsModalOpen(false);
    toast.success('Folder created successfully');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#111111]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22D3EE]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Workflows</h1>
            <p className="text-[#9CA3AF]">Design, manage, and monitor your automation workflows</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center px-4 py-2 border border-[#374151] rounded-md bg-[#18181B] text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
            >
              <Icon name="document-text-" className="mr-2 h-5 w-5" />
              Templates
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-[#374151] rounded-md bg-[#18181B] text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
            >
              <Icon name="folder-plus-" className="mr-2 h-5 w-5" />
              New Folder
            </button>
            <Link
              href="/workflow-editor"
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#22D3EE] text-[#111111] hover:bg-[#06B6D4] transition-colors"
            >
              <Icon name="plus-" className="mr-2 h-5 w-5" />
              Create Workflow
            </Link>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row">
          {/* Folders Sidebar */}
          <div className="w-full lg:w-64 mb-6 lg:mb-0 lg:mr-6">
            <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4">
              <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Folders</h2>
              
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedFolder(null)}
                    className={`w-full text-left flex items-center px-3 py-2 rounded-md ${
                      selectedFolder === null ? 'bg-[#1E293B] text-[#E5E7EB]' : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-[#E5E7EB]'
                    } transition-colors`}
                  >
                    <Icon name="folder-" className="h-5 w-5 mr-2" />
                    <span>All Workflows</span>
                    <span className="ml-auto text-xs bg-[#374151] px-2 py-0.5 rounded-full">
                      {workflows.length}
                    </span>
                  </button>
                </li>
                
                {folders.map((folder) => (
                  <li key={folder.id}>
                    <button
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md ${
                        selectedFolder === folder.id ? 'bg-[#1E293B] text-[#E5E7EB]' : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-[#E5E7EB]'
                      } transition-colors`}
                    >
                      <Icon name="folder-" className="h-5 w-5 mr-2" />
                      <span className="truncate">{folder.name}</span>
                      <span className="ml-auto text-xs bg-[#374151] px-2 py-0.5 rounded-full">
                        {folder.workflowCount}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Workflows List */}
          <div className="flex-1">
            <WorkflowList
              workflows={filteredWorkflows}
              onActivate={handleActivateWorkflow}
              onDeactivate={handleDeactivateWorkflow}
              onDelete={handleDeleteWorkflow}
              onDuplicate={handleDuplicateWorkflow}
            />
          </div>
        </div>
      </div>
      
      {/* Create Folder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Create New Folder</h3>
            
            <div className="mb-4">
              <label htmlFor="folderName" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Folder Name
              </label>
              <input
                type="text"
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                placeholder="Enter folder name"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
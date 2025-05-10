'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlayCircleIcon, 
  PencilSquareIcon, 
  DocumentDuplicateIcon,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';
import { 
  StarIcon as StarIconOutline,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  lastRun?: string;
  status: 'active' | 'draft' | 'paused';
  executions: number;
  isFavorite: boolean;
  lastEdited: string;
}

// Mock data for development - would be replaced with API data in production
const mockWorkflows: Workflow[] = [
  {
    id: 'wf-123',
    name: 'Lead Nurturing Sequence',
    description: 'Automated email campaign for new leads',
    lastRun: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    status: 'active',
    executions: 342,
    isFavorite: true,
    lastEdited: new Date(Date.now() - 2 * 86400000).toISOString() // 2 days ago
  },
  {
    id: 'wf-456',
    name: 'Customer Feedback Collection',
    description: 'Collects and processes customer survey responses',
    lastRun: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    status: 'active',
    executions: 128,
    isFavorite: true,
    lastEdited: new Date(Date.now() - 5 * 86400000).toISOString() // 5 days ago
  },
  {
    id: 'wf-789',
    name: 'Email Campaign Sender',
    description: 'Scheduled email campaigns with analytics',
    lastRun: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
    status: 'paused',
    executions: 267,
    isFavorite: false,
    lastEdited: new Date(Date.now() - 1 * 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'wf-101',
    name: 'New Support Ticket Alert',
    description: 'Notify team of high priority support tickets',
    lastRun: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    status: 'active',
    executions: 76,
    isFavorite: false,
    lastEdited: new Date(Date.now() - 6 * 3600000).toISOString() // 6 hours ago
  },
  {
    id: 'wf-102',
    name: 'Social Media Post Scheduler',
    description: 'Schedule and post to multiple platforms',
    lastRun: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
    status: 'draft',
    executions: 0,
    isFavorite: false,
    lastEdited: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
  }
];

interface WorkflowsWidgetProps {
  showFavorites?: boolean;
}

export default function WorkflowsWidget({ showFavorites = true }: WorkflowsWidgetProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>(showFavorites ? 'favorites' : 'recent');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchWorkflows() {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/workflows');
        // const data = await response.json();
        
        // For now, use mock data with a simulated delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setWorkflows(mockWorkflows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWorkflows();
  }, []);
  
  const toggleFavorite = (workflowId: string) => {
    setWorkflows(prevWorkflows => 
      prevWorkflows.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, isFavorite: !workflow.isFavorite } 
          : workflow
      )
    );
  };
  
  // Get workflows for the active tab
  const displayedWorkflows = activeTab === 'favorites' 
    ? workflows.filter(workflow => workflow.isFavorite)
    : [...workflows].sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
  
  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get status indicator color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#10B981]';
      case 'paused':
        return 'bg-[#F59E0B]';
      case 'draft':
        return 'bg-[#9CA3AF]';
      default:
        return 'bg-[#9CA3AF]';
    }
  };
  
  if (isLoading) {
    return <WorkflowsWidgetSkeleton />;
  }
  
  if (error) {
    return <WorkflowsWidgetError error={error} />;
  }
  
  return (
    <div className="workflows-widget">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#22D3EE]">Your Workflows</h2>
        
        {/* Tabs */}
        <div className="flex bg-[#111111] border border-[#374151] rounded-md overflow-hidden">
          <button
            className={`py-1.5 px-3 text-sm ${
              activeTab === 'favorites' 
                ? 'bg-[#1E293B] text-[#E5E7EB]' 
                : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#18181B]'
            } transition-colors`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button
            className={`py-1.5 px-3 text-sm ${
              activeTab === 'recent' 
                ? 'bg-[#1E293B] text-[#E5E7EB]' 
                : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#18181B]'
            } transition-colors`}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </button>
        </div>
      </div>
      
      {displayedWorkflows.length > 0 ? (
        <div className="bg-[#18181B] border border-[#374151] rounded-lg divide-y divide-[#374151]">
          {displayedWorkflows.slice(0, 5).map((workflow) => (
            <div key={workflow.id} className="p-4 hover:bg-[#1E293B] transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)} mr-2`}></div>
                    <h3 className="text-[#E5E7EB] font-medium">{workflow.name}</h3>
                    <button 
                      className="ml-2 text-[#9CA3AF] hover:text-[#F59E0B] transition-colors"
                      onClick={() => toggleFavorite(workflow.id)}
                      aria-label={workflow.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {workflow.isFavorite ? (
                        <StarIconSolid className="h-4 w-4 text-[#F59E0B]" />
                      ) : (
                        <StarIconOutline className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[#9CA3AF] text-sm mt-1">{workflow.description}</p>
                  
                  {workflow.lastRun && (
                    <div className="flex items-center text-[#9CA3AF] text-xs mt-2">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>Last run: {formatRelativeTime(workflow.lastRun)}</span>
                      
                      {workflow.status === 'active' && (
                        <span className="ml-3">
                          <span className="text-[#E5E7EB]">{workflow.executions}</span> executions
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {workflow.status !== 'draft' && (
                    <Link 
                      href={`/workflow-editor/run/${workflow.id}`} 
                      className="p-1.5 text-[#E5E7EB] bg-[#0F172A] hover:bg-[#1E293B] border border-[#374151] rounded-md transition-colors"
                      aria-label="Run workflow"
                    >
                      <PlayCircleIcon className="h-4 w-4" />
                    </Link>
                  )}
                  
                  <Link 
                    href={`/workflow-editor/${workflow.id}`} 
                    className="p-1.5 text-[#E5E7EB] bg-[#0F172A] hover:bg-[#1E293B] border border-[#374151] rounded-md transition-colors"
                    aria-label="Edit workflow"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </Link>
                  
                  <button 
                    className="p-1.5 text-[#E5E7EB] bg-[#0F172A] hover:bg-[#1E293B] border border-[#374151] rounded-md transition-colors"
                    aria-label="Duplicate workflow"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-8 text-center">
          {activeTab === 'favorites' ? (
            <p className="text-[#9CA3AF]">You don't have any favorite workflows yet.</p>
          ) : (
            <p className="text-[#9CA3AF]">You haven't created any workflows yet.</p>
          )}
          
          <Link 
            href="/workflow-editor" 
            className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0F172A] font-medium rounded-md transition-colors"
          >
            Create a Workflow
          </Link>
        </div>
      )}
      
      <div className="flex justify-between mt-4">
        <Link 
          href="/workflows" 
          className="text-sm text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center transition-colors"
        >
          View all workflows
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
        
        <Link 
          href="/workflow-editor" 
          className="text-sm text-[#22D3EE] hover:text-[#06B6D4] inline-flex items-center transition-colors"
        >
          Create new workflow
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}

function WorkflowsWidgetSkeleton() {
  return (
    <div className="workflows-widget">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-36 bg-[#374151] rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-[#374151] rounded animate-pulse"></div>
      </div>
      
      <div className="bg-[#18181B] border border-[#374151] rounded-lg divide-y divide-[#374151]">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="h-5 w-2/3 bg-[#374151] rounded mb-2"></div>
                <div className="h-4 w-full bg-[#374151] rounded mb-2"></div>
                <div className="h-3 w-1/3 bg-[#374151] rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-[#374151] rounded"></div>
                <div className="h-8 w-8 bg-[#374151] rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowsWidgetError({ error }: { error: string }) {
  return (
    <div className="bg-[#18181B] border border-[#F87171] rounded-lg p-5 shadow-lg text-center">
      <h3 className="text-[#F87171] font-medium mb-2">Error Loading Workflows</h3>
      <p className="text-[#9CA3AF]">{error}</p>
      <button 
        className="mt-3 px-4 py-2 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
} 
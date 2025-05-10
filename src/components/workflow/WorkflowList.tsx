'use client';

import { 
  ArrowDownIcon, 
  ArrowUpIcon,
  FunnelIcon, 
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

import WorkflowCard from './WorkflowCard';

import { TriggerType, Workflow, WorkflowStatus } from '@/types/workflow';

interface WorkflowListProps {
  workflows: Workflow[];
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

type SortField = 'name' | 'updatedAt' | 'createdAt' | 'executionCount' | 'averageExecutionTime';
type SortDirection = 'asc' | 'desc';

export default function WorkflowList({ 
  workflows, 
  onActivate, 
  onDeactivate, 
  onDelete, 
  onDuplicate 
}: WorkflowListProps) {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');
  const [triggerFilter, setTriggerFilter] = useState<TriggerType | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // State for sorting
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Helper for toggling sort direction or changing sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Get all unique tags from workflows
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    workflows.forEach(workflow => {
      workflow.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [workflows]);
  
  // Filter and sort workflows
  const filteredAndSortedWorkflows = useMemo(() => {
    // First, filter the workflows
    const filtered = workflows.filter(workflow => {
      // Filter by search query
      const matchesSearch = 
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      
      // Filter by trigger type
      const matchesTrigger = triggerFilter === 'all' || workflow.triggerType === triggerFilter;
      
      // Filter by tag
      const matchesTag = !tagFilter || workflow.tags.includes(tagFilter);
      
      return matchesSearch && matchesStatus && matchesTrigger && matchesTag;
    });
    
    // Then, sort the filtered workflows
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'executionCount':
          comparison = a.executionCount - b.executionCount;
          break;
        case 'averageExecutionTime':
          comparison = a.averageExecutionTime - b.averageExecutionTime;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [
    workflows, 
    searchQuery, 
    statusFilter, 
    triggerFilter, 
    tagFilter, 
    sortField, 
    sortDirection
  ]);
  
  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-[#374151] rounded-md py-2 pl-10 pr-4 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap lg:flex-nowrap">
            {/* Status Filter */}
            <select
              aria-label="Filter by status"
              title="Status filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
              className="bg-[#111111] border border-[#374151] rounded-md py-2 px-3 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="error">Error</option>
            </select>
            
            {/* Trigger Filter */}
            <select
              aria-label="Filter by trigger type"
              title="Trigger type filter"
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value as TriggerType | 'all')}
              className="bg-[#111111] border border-[#374151] rounded-md py-2 px-3 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            >
              <option value="all">All Triggers</option>
              <option value="schedule">Schedule</option>
              <option value="webhook">Webhook</option>
              <option value="event">Event</option>
              <option value="manual">Manual</option>
              <option value="voice">Voice</option>
            </select>
            
            {/* Tag Filter */}
            <select
              aria-label="Filter by tag"
              title="Tag filter"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-[#111111] border border-[#374151] rounded-md py-2 px-3 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex bg-[#111111] border border-[#374151] rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 flex items-center ${viewMode === 'grid' ? 'bg-[#22D3EE] text-[#111111]' : 'text-[#E5E7EB]'}`}
                aria-label="Grid view"
                title="Grid view"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 flex items-center ${viewMode === 'table' ? 'bg-[#22D3EE] text-[#111111]' : 'text-[#E5E7EB]'}`}
                aria-label="Table view"
                title="Table view"
              >
                <TableCellsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Sort Controls */}
        <div className="mt-4 flex items-center text-[#9CA3AF]">
          <FunnelIcon className="h-4 w-4 mr-2" />
          <span className="text-sm mr-3">Sort by:</span>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center text-xs px-2 py-1 rounded-md ${sortField === 'name' ? 'bg-[#374151] text-[#E5E7EB]' : 'hover:bg-[#374151]'}`}
            >
              Name
              {sortField === 'name' && (
                sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('updatedAt')}
              className={`flex items-center text-xs px-2 py-1 rounded-md ${sortField === 'updatedAt' ? 'bg-[#374151] text-[#E5E7EB]' : 'hover:bg-[#374151]'}`}
            >
              Last Modified
              {sortField === 'updatedAt' && (
                sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('createdAt')}
              className={`flex items-center text-xs px-2 py-1 rounded-md ${sortField === 'createdAt' ? 'bg-[#374151] text-[#E5E7EB]' : 'hover:bg-[#374151]'}`}
            >
              Created Date
              {sortField === 'createdAt' && (
                sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('executionCount')}
              className={`flex items-center text-xs px-2 py-1 rounded-md ${sortField === 'executionCount' ? 'bg-[#374151] text-[#E5E7EB]' : 'hover:bg-[#374151]'}`}
            >
              Execution Count
              {sortField === 'executionCount' && (
                sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('averageExecutionTime')}
              className={`flex items-center text-xs px-2 py-1 rounded-md ${sortField === 'averageExecutionTime' ? 'bg-[#374151] text-[#E5E7EB]' : 'hover:bg-[#374151]'}`}
            >
              Avg. Execution Time
              {sortField === 'averageExecutionTime' && (
                sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 ml-1" /> : <ArrowDownIcon className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="text-[#9CA3AF] text-sm">
        {filteredAndSortedWorkflows.length} workflow{filteredAndSortedWorkflows.length !== 1 ? 's' : ''} found
      </div>
      
      {/* Workflows List */}
      {filteredAndSortedWorkflows.length === 0 ? (
        <div className="py-12 text-center bg-[#18181B] border border-[#374151] rounded-lg">
          <div className="text-[#9CA3AF] mb-2">No workflows found</div>
          <div className="text-[#E5E7EB] text-sm">Try adjusting your filters or create a new workflow</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedWorkflows.map(workflow => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#18181B] border border-[#374151] rounded-lg">
            <thead>
              <tr className="border-b border-[#374151]">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Trigger
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Modified
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Executions (24h)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Avg. Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {filteredAndSortedWorkflows.map(workflow => (
                <tr key={workflow.id} className="hover:bg-[#1E293B]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`h-3 w-3 rounded-full ${
                      workflow.status === 'active' ? 'bg-green-500' :
                      workflow.status === 'inactive' ? 'bg-gray-500' :
                      workflow.status === 'draft' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/workflows/${workflow.id}`} 
                      className="text-[#E5E7EB] hover:text-[#22D3EE] transition-colors"
                    >
                      {workflow.name}
                    </Link>
                    <div className="text-xs text-[#9CA3AF] mt-1 line-clamp-1">{workflow.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-[#E5E7EB] text-sm capitalize">
                      {workflow.triggerType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-green-500">{workflow.successCount}</span> / 
                    <span className="text-red-500">{workflow.failureCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                    {workflow.averageExecutionTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-[#374151] text-xs text-[#E5E7EB] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {workflow.tags.length > 2 && (
                        <span className="px-2 py-0.5 bg-[#374151] text-xs text-[#E5E7EB] rounded-full">
                          +{workflow.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/workflows/${workflow.id}/edit`}
                        className="p-1 text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
                        aria-label="Edit workflow"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      
                      {workflow.status === 'active' ? (
                        <button
                          onClick={() => onDeactivate(workflow.id)}
                          className="p-1 text-[#9CA3AF] hover:text-[#F87171] transition-colors"
                          aria-label="Deactivate workflow"
                        >
                          <StopIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate(workflow.id)}
                          className="p-1 text-[#9CA3AF] hover:text-[#10B981] transition-colors"
                          aria-label="Activate workflow"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Workflow, WorkflowStatus } from '@/types/workflow';
import { 
  PlayIcon, 
  StopIcon, 
  PencilIcon, 
  DocumentDuplicateIcon, 
  TrashIcon,
  ClockIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface WorkflowCardProps {
  workflow: Workflow;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const statusColors: Record<WorkflowStatus, string> = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  draft: 'bg-blue-500',
  error: 'bg-red-500',
};

const triggerIcons: Record<string, JSX.Element> = {
  schedule: <ClockIcon className="h-4 w-4" />,
  webhook: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  event: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 17H20L18 13H15V9H21L19 5H15V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 5V9H5L7 13H9V17H3L5 5H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  manual: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 9L12 5L16 9M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  voice: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
};

export default function WorkflowCard({ workflow, onActivate, onDeactivate, onDelete, onDuplicate }: WorkflowCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden hover:border-[#22D3EE] transition-colors duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${statusColors[workflow.status]} mr-2`} />
            <Link 
              href={`/workflows/${workflow.id}`} 
              className="text-lg font-medium text-[#E5E7EB] hover:text-[#22D3EE] transition-colors"
            >
              {workflow.name}
            </Link>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-md hover:bg-[#374151] text-[#9CA3AF]"
              aria-label="More options"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-[#374151] rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link
                    href={`/workflows/${workflow.id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                  <Link
                    href={`/workflows/${workflow.id}/logs`}
                    className="flex items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]"
                  >
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    View Logs
                  </Link>
                  <button
                    onClick={() => {
                      onDuplicate(workflow.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#374151]"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onDelete(workflow.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-[#F87171] hover:bg-[#374151]"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{workflow.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-[#9CA3AF] mb-1">Trigger</div>
            <div className="flex items-center text-[#E5E7EB]">
              {triggerIcons[workflow.triggerType]}
              <span className="ml-1 text-sm capitalize">{workflow.triggerType}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-[#9CA3AF] mb-1">Last Modified</div>
            <div className="text-sm text-[#E5E7EB]">{formatDate(workflow.updatedAt)}</div>
          </div>
          
          <div>
            <div className="text-xs text-[#9CA3AF] mb-1">Executions (24h)</div>
            <div className="text-sm text-[#E5E7EB]">
              <span className="text-green-500">{workflow.successCount}</span> / 
              <span className="text-red-500">{workflow.failureCount}</span>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-[#9CA3AF] mb-1">Avg. Time</div>
            <div className="text-sm text-[#E5E7EB]">{workflow.averageExecutionTime}ms</div>
          </div>
        </div>
        
        {workflow.tags.length > 0 && (
          <div className="flex items-center text-xs mb-4">
            <TagIcon className="h-3 w-3 text-[#9CA3AF] mr-1" />
            <div className="flex flex-wrap gap-1">
              {workflow.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 bg-[#374151] text-[#E5E7EB] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <Link
            href={`/workflows/${workflow.id}/edit`}
            className="text-[#22D3EE] text-sm hover:text-[#06B6D4] transition-colors"
          >
            Edit Workflow
          </Link>
          
          {workflow.status === 'active' ? (
            <button
              onClick={() => onDeactivate(workflow.id)}
              className="flex items-center px-3 py-1 bg-[#371520] text-[#F87171] rounded-md hover:bg-[#4B1D29] transition-colors text-sm"
            >
              <StopIcon className="h-4 w-4 mr-1" />
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => onActivate(workflow.id)}
              className="flex items-center px-3 py-1 bg-[#022c22] text-[#10B981] rounded-md hover:bg-[#064e3b] transition-colors text-sm"
            >
              <PlayIcon className="h-4 w-4 mr-1" />
              Activate
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 
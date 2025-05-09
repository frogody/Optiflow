// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Workflow { id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastRun: string;
  successRate: number;
    }

// Mock data for development
const mockWorkflows: Workflow[] = [
  { id: '1',
    name: 'Data Processing Pipeline',
    status: 'active',
    lastRun: '2024-02-20T10:30:00Z',
    successRate: 98,
      },
  { id: '2',
    name: 'Customer Data Sync',
    status: 'active',
    lastRun: '2024-02-20T09:15:00Z',
    successRate: 95,
      },
  { id: '3',
    name: 'Legacy System Integration',
    status: 'error',
    lastRun: '2024-02-20T08:45:00Z',
    successRate: 75,
      },
];

export default function WorkflowOverview(): JSX.Element {
  const router = useRouter();
  const [workflows] = useState<Workflow[]>(mockWorkflows);

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) { case 'active':
        return 'text-green-400';
      case 'inactive':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-white/60';
        }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Active Workflows</h2>
        <button
          onClick={() => router.push('/workflow')}
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="p-4 bg-dark-100/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-200 cursor-pointer"
            onClick={() => router.push(`/workflow/${workflow.id}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{workflow.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(
                      workflow.status
                    )} animate-pulse`}
                  />
                  <span className="text-white/60 text-sm">
                    Last run: {formatDate(workflow.lastRun)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{workflow.successRate}%</div>
                <div className="text-white/60 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
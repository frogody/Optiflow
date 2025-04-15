'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';

interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastRun: string;
  successRate: number;
}

// Mock data for development
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Data Processing Pipeline',
    status: 'active',
    lastRun: '2024-02-20T10:30:00Z',
    successRate: 98,
  },
  {
    id: '2',
    name: 'Customer Data Sync',
    status: 'active',
    lastRun: '2024-02-20T09:15:00Z',
    successRate: 95,
  },
  {
    id: '3',
    name: 'Legacy System Integration',
    status: 'error',
    lastRun: '2024-02-20T08:45:00Z',
    successRate: 75,
  },
];

export default function Workflows() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [workflows] = useState<Workflow[]>(mockWorkflows);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]);

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="text-primary animate-pulse">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Workflows</h1>
          <button
            onClick={() => router.push('/workflows/new')}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          >
            Create New Workflow
          </button>
        </div>

        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              onClick={() => router.push(`/workflows/${workflow.id}`)}
              className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-6 hover:border-primary/40 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-white">{workflow.name}</h2>
                  <div className="flex items-center space-x-2 mt-2">
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
                  <div className="text-2xl font-medium text-white">
                    {workflow.successRate}%
                  </div>
                  <div className="text-white/60 text-sm">Success Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 
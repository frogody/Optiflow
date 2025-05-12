'use client';

import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export interface KpiData {
  workflowActivity: {
    activeWorkflows: number;
    successfulExecutions: number;
    failedExecutions: number;
    totalExecutionsThisMonth: number;
  };
  creditUsage: {
    currentBalance: number;
    estimatedDaysRemaining: number;
  };
  jarvisActivity: {
    commandsProcessed: number;
    commonActions: string[];
  };
  integrationStatus: {
    connectedApps: number;
    healthyApps: number;
  };
}

// Mock data for development - would be replaced with API data in production
const mockKpiData: KpiData = {
  workflowActivity: {
    activeWorkflows: 12,
    successfulExecutions: 842,
    failedExecutions: 23,
    totalExecutionsThisMonth: 865
  },
  creditUsage: {
    currentBalance: 6750,
    estimatedDaysRemaining: 28
  },
  jarvisActivity: {
    commandsProcessed: 143,
    commonActions: [
      "Run workflow",
      "Update workflow",
      "Connect integration"
    ]
  },
  integrationStatus: {
    connectedApps: 8,
    healthyApps: 7
  }
};

export default function KpiWidget() {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchKpiData() {
      try {
        // In production, this would be an API call
        // const response = await fetch('/api/dashboard/metrics');
        // const data = await response.json();
        
        // For now, use mock data with a simulated delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setKpiData(mockKpiData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchKpiData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchKpiData, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (isLoading) {
    return <KpiWidgetSkeleton />;
  }
  
  if (error) {
    return <KpiWidgetError error={error} />;
  }
  
  if (!kpiData) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Workflow Activity */}
      <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
        <div className="flex items-start mb-4">
          <ChartBarIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
          <h3 className="text-[#E5E7EB] font-medium">Workflow Activity</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold text-white">{kpiData.workflowActivity.activeWorkflows}</div>
            <div className="text-sm text-[#9CA3AF]">Active Workflows</div>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-white">{kpiData.workflowActivity.totalExecutionsThisMonth}</div>
            <div className="text-sm text-[#9CA3AF]">Total Executions</div>
          </div>
        </div>
      </div>
      
      {/* Success Rate */}
      <div className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5">
        <div className="flex items-start mb-4">
          <ArrowTrendingUpIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
          <h3 className="text-[#E5E7EB] font-medium">Success Rate</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold text-[#10B981]">{kpiData.workflowActivity.successfulExecutions}</div>
            <div className="text-sm text-[#9CA3AF]">Successful</div>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-[#EF4444]">{kpiData.workflowActivity.failedExecutions}</div>
            <div className="text-sm text-[#9CA3AF]">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiWidgetSkeleton() {
  // Skeleton loading state
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="bg-[#18181B] border border-[#2A2A35] rounded-lg p-5 animate-pulse">
          <div className="flex items-center mb-3">
            <div className="h-5 w-5 bg-[#374151] rounded mr-2"></div>
            <div className="h-4 w-32 bg-[#374151] rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-8 w-20 bg-[#374151] rounded"></div>
              <div className="h-4 w-24 bg-[#374151] rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 bg-[#374151] rounded"></div>
              <div className="h-4 w-24 bg-[#374151] rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function KpiWidgetError({ error }: { error: string }) {
  // Error state
  return (
    <div className="bg-[#18181B] border border-[#F87171] rounded-lg p-5 text-center">
      <h3 className="text-[#F87171] font-medium mb-2">Error Loading Metrics</h3>
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
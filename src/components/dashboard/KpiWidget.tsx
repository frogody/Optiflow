'use client';

import { 
  ChartBarIcon, 
  CreditCardIcon, 
  MicrophoneIcon, 
  PuzzlePieceIcon 
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
        await new Promise(resolve => setTimeout(resolve, 800));
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
    <div className="kpi-widget">
      <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Key Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Workflow Activity */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-5 shadow-lg">
          <div className="flex items-center mb-3">
            <ChartBarIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
            <h3 className="text-[#E5E7EB] font-medium">Workflow Activity</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#E5E7EB]">{kpiData.workflowActivity.activeWorkflows}</span>
              <span className="text-[#9CA3AF] text-sm">Active Workflows</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#E5E7EB]">{kpiData.workflowActivity.totalExecutionsThisMonth}</span>
              <span className="text-[#9CA3AF] text-sm">Executions This Month</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#10B981]">{kpiData.workflowActivity.successfulExecutions}</span>
              <span className="text-[#9CA3AF] text-sm">Successful</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#F87171]">{kpiData.workflowActivity.failedExecutions}</span>
              <span className="text-[#9CA3AF] text-sm">Failed</span>
            </div>
          </div>
        </div>
        
        {/* Credit Usage */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-5 shadow-lg">
          <div className="flex items-center mb-3">
            <CreditCardIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
            <h3 className="text-[#E5E7EB] font-medium">Credit Usage</h3>
          </div>
          <div className="flex flex-col">
            <div className="mb-3">
              <span className="text-2xl font-bold text-[#E5E7EB]">{kpiData.creditUsage.currentBalance.toLocaleString()}</span>
              <span className="text-[#9CA3AF] text-sm ml-2">Credits Remaining</span>
            </div>
            <div className="mb-3">
              <span className="text-lg text-[#E5E7EB]">~{kpiData.creditUsage.estimatedDaysRemaining} days remaining</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-[#374151] rounded-full mb-3">
              <div 
                className="h-full bg-[#22D3EE] rounded-full" 
                style={{ width: `${Math.min(kpiData.creditUsage.estimatedDaysRemaining / 30 * 100, 100)}%` }} 
              ></div>
            </div>
            
            <a href="/billing" className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors mt-1">
              View billing details →
            </a>
          </div>
        </div>
        
        {/* Integration Status */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-5 shadow-lg">
          <div className="flex items-center mb-3">
            <PuzzlePieceIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
            <h3 className="text-[#E5E7EB] font-medium">Integration Status</h3>
          </div>
          <div className="flex items-center mb-3">
            <span className="text-2xl font-bold text-[#E5E7EB]">{kpiData.integrationStatus.connectedApps}</span>
            <span className="text-[#9CA3AF] text-sm ml-2">Apps Connected</span>
          </div>
          <div className="flex items-center mb-4">
            <div className={`w-2 h-2 rounded-full ${
              kpiData.integrationStatus.healthyApps === kpiData.integrationStatus.connectedApps 
                ? 'bg-[#10B981]' 
                : 'bg-[#F59E0B]'
            } mr-2`}></div>
            <span className="text-[#E5E7EB]">
              {kpiData.integrationStatus.healthyApps} of {kpiData.integrationStatus.connectedApps} healthy
            </span>
          </div>
          <a href="/connections" className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
            Manage connections →
          </a>
        </div>
        
        {/* Jarvis Agent Activity */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-5 shadow-lg">
          <div className="flex items-center mb-3">
            <MicrophoneIcon className="h-5 w-5 text-[#22D3EE] mr-2" />
            <h3 className="text-[#E5E7EB] font-medium">Jarvis Agent Activity</h3>
          </div>
          <div className="mb-3">
            <span className="text-2xl font-bold text-[#E5E7EB]">{kpiData.jarvisActivity.commandsProcessed}</span>
            <span className="text-[#9CA3AF] text-sm ml-2">Commands Processed</span>
          </div>
          {kpiData.jarvisActivity.commonActions.length > 0 && (
            <div>
              <span className="text-[#E5E7EB] text-sm block mb-2">Most Common Actions:</span>
              <ul className="text-[#9CA3AF] text-sm space-y-1">
                {kpiData.jarvisActivity.commonActions.slice(0, 3).map((action, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mr-2"></div>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiWidgetSkeleton() {
  // Skeleton loading state
  return (
    <div className="kpi-widget">
      <h2 className="text-xl font-bold text-[#22D3EE] mb-4">Key Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-[#18181B] border border-[#374151] rounded-lg p-5 shadow-lg animate-pulse">
            <div className="flex items-center mb-3">
              <div className="h-5 w-5 bg-[#374151] rounded mr-2"></div>
              <div className="h-4 w-32 bg-[#374151] rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 w-24 bg-[#374151] rounded"></div>
              <div className="h-4 w-32 bg-[#374151] rounded"></div>
              <div className="h-4 w-40 bg-[#374151] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiWidgetError({ error }: { error: string }) {
  // Error state
  return (
    <div className="bg-[#18181B] border border-[#F87171] rounded-lg p-5 shadow-lg text-center">
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
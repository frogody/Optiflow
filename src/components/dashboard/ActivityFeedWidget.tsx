'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export interface ActivityEvent {
  id: string;
  type: 'workflow_success' | 'workflow_failure' | 'integration_connected' | 'system_notification';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    workflowId?: string;
    workflowName?: string;
    integrationId?: string;
    integrationName?: string;
    notificationLevel?: 'info' | 'warning' | 'error';
  };
}

// Mock data for development - would be replaced with API data in production
const mockActivityEvents: ActivityEvent[] = [
  {
    id: 'evt-001',
    type: 'workflow_success',
    title: 'Workflow Execution Completed',
    description: 'Lead nurturing sequence completed successfully',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    metadata: {
      workflowId: 'wf-123',
      workflowName: 'Lead Nurturing Sequence'
    }
  },
  {
    id: 'evt-002',
    type: 'integration_connected',
    title: 'New Integration Connected',
    description: 'Successfully connected Slack integration',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    metadata: {
      integrationId: 'int-456',
      integrationName: 'Slack'
    }
  },
  {
    id: 'evt-003',
    type: 'workflow_failure',
    title: 'Workflow Execution Failed',
    description: 'Email campaign workflow failed due to API error',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    metadata: {
      workflowId: 'wf-789',
      workflowName: 'Email Campaign Sender'
    }
  },
  {
    id: 'evt-004',
    type: 'system_notification',
    title: 'Credit Usage Alert',
    description: 'Your credit usage is 80% of your monthly allocation',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    metadata: {
      notificationLevel: 'warning'
    }
  },
  {
    id: 'evt-005',
    type: 'workflow_success',
    title: 'Workflow Execution Completed',
    description: 'Customer feedback collection completed successfully',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    metadata: {
      workflowId: 'wf-456',
      workflowName: 'Customer Feedback Collection'
    }
  },
  {
    id: 'evt-006',
    type: 'system_notification',
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    metadata: {
      notificationLevel: 'info'
    }
  },
];

export default function ActivityFeedWidget() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Activity' },
    { id: 'workflow_success', label: 'Successful Workflows' },
    { id: 'workflow_failure', label: 'Failed Workflows' },
    { id: 'integration_connected', label: 'Integration Activities' },
    { id: 'system_notification', label: 'System Notifications' },
  ];
  
  useEffect(() => {
    async function fetchActivityEvents() {
      try {
        // In production, this would be an API call
        // const response = await fetch('/api/dashboard/activity');
        // const data = await response.json();
        
        // For now, use mock data with a simulated delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setEvents(mockActivityEvents);
        setFilteredEvents(mockActivityEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchActivityEvents();
    
    // Polling for real-time updates (could be replaced with WebSockets)
    const intervalId = setInterval(fetchActivityEvents, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Apply filter when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.type === activeFilter));
    }
  }, [activeFilter, events]);
  
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
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get icon based on event type
  const getEventIcon = (event: ActivityEvent) => {
    switch (event.type) {
      case 'workflow_success':
        return <CheckCircleIcon className="h-6 w-6 text-[#10B981]" />;
      case 'workflow_failure':
        return <ExclamationCircleIcon className="h-6 w-6 text-[#F87171]" />;
      case 'integration_connected':
        return <CheckCircleIcon className="h-6 w-6 text-[#22D3EE]" />;
      case 'system_notification':
        if (event.metadata?.notificationLevel === 'warning') {
          return <ExclamationCircleIcon className="h-6 w-6 text-[#F59E0B]" />;
        } else if (event.metadata?.notificationLevel === 'error') {
          return <ExclamationCircleIcon className="h-6 w-6 text-[#F87171]" />;
        }
        return <InformationCircleIcon className="h-6 w-6 text-[#22D3EE]" />;
      default:
        return <CalendarIcon className="h-6 w-6 text-[#9CA3AF]" />;
    }
  };
  
  if (isLoading) {
    return <ActivityFeedSkeleton />;
  }
  
  if (error) {
    return <ActivityFeedError error={error} />;
  }
  
  return (
    <div className="activity-feed-widget">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#22D3EE]">Recent Activity</h2>
        
        {/* Filter dropdown */}
        <div className="relative">
          <button 
            className="flex items-center text-[#E5E7EB] bg-[#18181B] border border-[#374151] px-3 py-1.5 rounded-md hover:bg-[#1E293B] transition-colors"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            <span>{filterOptions.find(opt => opt.id === activeFilter)?.label}</span>
          </button>
          
          {showFilterMenu && (
            <div className="absolute right-0 mt-1 z-10 w-56 bg-[#18181B] border border-[#374151] rounded-md shadow-lg">
              <div className="py-1">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    className={`block w-full text-left px-4 py-2 ${
                      activeFilter === option.id 
                        ? 'bg-[#1E293B] text-[#22D3EE]' 
                        : 'text-[#E5E7EB] hover:bg-[#1E293B]'
                    }`}
                    onClick={() => {
                      setActiveFilter(option.id);
                      setShowFilterMenu(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-[#18181B] border border-[#374151] rounded-lg divide-y divide-[#374151] max-h-80 overflow-y-auto">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="p-4 hover:bg-[#1E293B] transition-colors">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  {getEventIcon(event)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#E5E7EB] font-medium">{event.title}</p>
                  <p className="text-[#9CA3AF] text-sm">{event.description}</p>
                  
                  {/* Show workflow or integration name if available */}
                  {event.metadata?.workflowName && (
                    <p className="text-[#9CA3AF] text-sm mt-1">
                      Workflow: <span className="text-[#22D3EE]">{event.metadata.workflowName}</span>
                    </p>
                  )}
                  
                  {event.metadata?.integrationName && (
                    <p className="text-[#9CA3AF] text-sm mt-1">
                      Integration: <span className="text-[#22D3EE]">{event.metadata.integrationName}</span>
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-[#9CA3AF] text-sm">{formatRelativeTime(event.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-[#9CA3AF]">No activity found matching your filter.</p>
          </div>
        )}
      </div>
      
      {events.length > 5 && (
        <div className="text-center mt-3">
          <a href="/activity" className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
            View all activity →
          </a>
        </div>
      )}
    </div>
  );
}

function ActivityFeedSkeleton() {
  return (
    <div className="activity-feed-widget">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-36 bg-[#374151] rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-[#374151] rounded animate-pulse"></div>
      </div>
      
      <div className="bg-[#18181B] border border-[#374151] rounded-lg divide-y divide-[#374151]">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="p-4 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="h-6 w-6 bg-[#374151] rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-2/3 bg-[#374151] rounded mb-2"></div>
                <div className="h-3 w-full bg-[#374151] rounded mb-2"></div>
                <div className="h-3 w-1/3 bg-[#374151] rounded"></div>
              </div>
              <div className="flex-shrink-0">
                <div className="h-3 w-16 bg-[#374151] rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeedError({ error }: { error: string }) {
  return (
    <div className="bg-[#18181B] border border-[#F87171] rounded-lg p-5 shadow-lg text-center">
      <h3 className="text-[#F87171] font-medium mb-2">Error Loading Activity</h3>
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
'use client';

import { 
  ArrowLeftIcon,
  ArrowPathIcon, 
  CheckCircleIcon, 
  CheckIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PipedreamConnectButton from '@/components/PipedreamConnectButton';

// Interfaces for our data models
interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  account: string;
  status: 'healthy' | 'needs-attention' | 'error';
  connectedAt: string;
  lastValidated: string;
  workflowsCount: number;
  lastUsed: string;
  permissions: string[];
}

interface WorkflowUsingApp {
  id: string;
  name: string;
  lastRun: string;
  status: string;
}

// Mock data - in a real app, this would be fetched from an API
const mockConnectedApps: Record<string, ConnectedApp> = {
  'slack-1': {
    id: 'slack-1',
    name: 'Slack',
    icon: '/icons/slack.svg',
    account: 'acme-workspace',
    status: 'healthy',
    connectedAt: '2023-08-15T10:30:00Z',
    lastValidated: '2023-10-05T14:20:00Z',
    workflowsCount: 3,
    lastUsed: '2023-10-05T14:20:00Z',
    permissions: [
      'channels:read',
      'channels:write',
      'chat:write',
      'users:read'
    ]
  },
  'gmail-1': {
    id: 'gmail-1',
    name: 'Gmail',
    icon: '/icons/gmail.svg',
    account: 'user@example.com',
    status: 'needs-attention',
    connectedAt: '2023-07-22T08:45:00Z',
    lastValidated: '2023-09-18T09:15:00Z',
    workflowsCount: 2,
    lastUsed: '2023-09-18T09:15:00Z',
    permissions: [
      'gmail.readonly',
      'gmail.compose',
      'gmail.labels'
    ]
  },
  'github-1': {
    id: 'github-1',
    name: 'GitHub',
    icon: '/icons/github.svg',
    account: 'acmecorp',
    status: 'error',
    connectedAt: '2023-09-10T16:20:00Z',
    lastValidated: '2023-09-12T11:30:00Z',
    workflowsCount: 1,
    lastUsed: '2023-09-12T11:30:00Z',
    permissions: [
      'repo',
      'workflow',
      'read:user'
    ]
  }
};

// Mock workflows using the app
const mockWorkflows: Record<string, WorkflowUsingApp[]> = {
  'slack-1': [
    {
      id: 'workflow-1',
      name: 'New Lead Notification',
      lastRun: '2023-10-04T15:30:00Z',
      status: 'active'
    },
    {
      id: 'workflow-2',
      name: 'Daily Report Summary',
      lastRun: '2023-10-05T08:00:00Z',
      status: 'active'
    },
    {
      id: 'workflow-3',
      name: 'Support Ticket Escalation',
      lastRun: '2023-09-28T11:45:00Z',
      status: 'active'
    }
  ],
  'gmail-1': [
    {
      id: 'workflow-4',
      name: 'Email Lead Responder',
      lastRun: '2023-09-18T09:15:00Z',
      status: 'active'
    },
    {
      id: 'workflow-5',
      name: 'Weekly Newsletter',
      lastRun: '2023-09-15T10:00:00Z',
      status: 'paused'
    }
  ],
  'github-1': [
    {
      id: 'workflow-6',
      name: 'PR Review Reminder',
      lastRun: '2023-09-12T11:30:00Z',
      status: 'error'
    }
  ]
};

// Sample recent activity logs
const mockActivityLogs: Record<string, any[]> = {
  'slack-1': [
    {
      id: 'log-1',
      timestamp: '2023-10-05T14:20:00Z',
      type: 'api_call',
      details: 'Sent message to #general channel',
      workflow: 'New Lead Notification'
    },
    {
      id: 'log-2',
      timestamp: '2023-10-05T08:00:00Z',
      type: 'api_call',
      details: 'Retrieved channel list',
      workflow: 'Daily Report Summary'
    },
    {
      id: 'log-3',
      timestamp: '2023-10-04T15:30:00Z',
      type: 'api_call',
      details: 'Sent message to @jane',
      workflow: 'New Lead Notification'
    }
  ],
  'gmail-1': [
    {
      id: 'log-4',
      timestamp: '2023-09-18T09:15:00Z',
      type: 'api_call',
      details: 'Sent email to customer',
      workflow: 'Email Lead Responder'
    },
    {
      id: 'log-5',
      timestamp: '2023-09-15T10:00:00Z',
      type: 'api_call',
      details: 'Retrieved email templates',
      workflow: 'Weekly Newsletter'
    }
  ],
  'github-1': [
    {
      id: 'log-6',
      timestamp: '2023-09-12T11:30:00Z',
      type: 'error',
      details: 'Authentication failed',
      workflow: 'PR Review Reminder'
    }
  ]
};

export default function IntegrationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [app, setApp] = useState<ConnectedApp | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowUsingApp[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  
  // Fetch app data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const appData = mockConnectedApps[params.id];
        if (!appData) {
          toast.error('Integration not found');
          router.push('/integrations');
          return;
        }
        
        setApp(appData);
        setWorkflows(mockWorkflows[params.id] || []);
        setActivityLogs(mockActivityLogs[params.id] || []);
      } catch (error) {
        console.error('Error fetching integration data:', error);
        toast.error('Failed to load integration details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id, router]);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Get time ago from date
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHr = Math.round(diffMin / 60);
    const diffDays = Math.round(diffHr / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHr < 24) return `${diffHr} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    
    return formatDate(dateString);
  };
  
  // Get status badge
  const getStatusBadge = (status: ConnectedApp['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Healthy
          </span>
        );
      case 'needs-attention':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
            Needs Attention
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Error
          </span>
        );
      default:
        return null;
    }
  };
  
  // Handle refresh connection
  const handleRefreshConnection = async () => {
    if (!app) return;
    
    setIsChecking(true);
    // In a real app, this would call an API to check the connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demonstration, let's simulate improvement for error status
    if (app.status === 'error') {
      setApp({
        ...app,
        status: 'needs-attention',
        lastValidated: new Date().toISOString()
      });
      toast.success('Connection partially restored. Re-authentication recommended.');
    } else {
      setApp({
        ...app,
        lastValidated: new Date().toISOString()
      });
      toast.success('Connection validated successfully');
    }
    
    setIsChecking(false);
  };
  
  // Handle disconnect
  const handleDisconnect = async () => {
    if (!app) return;
    
    setIsDisconnecting(true);
    // In a real app, this would call an API to disconnect the integration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Successfully disconnected ${app.name}`);
    setIsDisconnecting(false);
    setShowDisconnectModal(false);
    
    // Redirect back to integrations page
    router.push('/integrations');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#E5E7EB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22D3EE]"></div>
      </div>
    );
  }
  
  if (!app) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#E5E7EB] flex flex-col items-center justify-center">
        <XCircleIcon className="h-16 w-16 text-[#F87171] mb-4" />
        <h1 className="text-2xl font-bold mb-2">Integration Not Found</h1>
        <p className="text-[#9CA3AF] mb-4">The integration you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/integrations"
          className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
        >
          Back to Integrations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/integrations" 
            className="inline-flex items-center text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Integrations
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-[#1E293B] rounded-lg flex items-center justify-center mr-4">
              <Image 
                src={app.icon} 
                alt={app.name} 
                width={32} 
                height={32} 
                className="h-8 w-8"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#22D3EE]">{app.name}</h1>
              <div className="flex items-center mt-1">
                <p className="text-[#9CA3AF] mr-3">Connected as {app.account}</p>
                {getStatusBadge(app.status)}
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            {app.status === 'error' || app.status === 'needs-attention' ? (
              <PipedreamConnectButton
                appSlug={app.name.toLowerCase()}
                buttonText="Re-authenticate"
                onSuccess={(accountId) => {
                  toast.success(`Successfully reconnected ${app.name}`);
                  setApp({
                    ...app,
                    status: 'healthy',
                    lastValidated: new Date().toISOString()
                  });
                }}
                onError={(error) => toast.error(`Failed to reconnect: ${error.message}`)}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
              />
            ) : (
              <button
                onClick={handleRefreshConnection}
                className="inline-flex items-center px-4 py-2 border border-[#374151] rounded-md bg-[#18181B] text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                disabled={isChecking}
              >
                <ArrowPathIcon className={`mr-2 h-5 w-5 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Checking...' : 'Check Connection'}
              </button>
            )}
            
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#371520] text-[#F87171] hover:bg-[#4B1D29] transition-colors"
              disabled={isDisconnecting}
            >
              <XMarkIcon className="mr-2 h-5 w-5" />
              Disconnect
            </button>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Details */}
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
            <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Connection Details</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[#9CA3AF]">Status</div>
                <div className="mt-1">{getStatusBadge(app.status)}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#9CA3AF]">Connected On</div>
                <div className="text-[#E5E7EB]">{formatDate(app.connectedAt)}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#9CA3AF]">Last Validated</div>
                <div className="text-[#E5E7EB]">{getTimeAgo(app.lastValidated)}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#9CA3AF]">Last Used</div>
                <div className="text-[#E5E7EB]">{getTimeAgo(app.lastUsed)}</div>
              </div>
              
              <div>
                <div className="text-sm text-[#9CA3AF]">Workflows Using This Connection</div>
                <div className="text-[#E5E7EB]">{app.workflowsCount}</div>
              </div>
            </div>
            
            {/* Connection Health Card */}
            {app.status === 'needs-attention' && (
              <div className="mt-6 p-4 bg-[#422006] border border-[#F59E0B] rounded-lg">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-[#F59E0B] mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-[#E5E7EB]">Attention Required</h3>
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      This connection may require re-authentication soon. Click the "Re-authenticate" button to refresh your credentials.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {app.status === 'error' && (
              <div className="mt-6 p-4 bg-[#371520] border border-[#F87171] rounded-lg">
                <div className="flex items-start">
                  <XCircleIcon className="h-5 w-5 text-[#F87171] mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-[#E5E7EB]">Connection Error</h3>
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      This connection is no longer working. Please re-authenticate to restore functionality.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Permissions Section */}
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
            <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Permissions</h2>
            
            <div className="space-y-2">
              {app.permissions.map((permission, index) => (
                <div key={index} className="flex items-center p-2 rounded-md bg-[#1E293B]">
                  <CheckIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                  <span className="text-sm text-[#E5E7EB]">{permission}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-[#1E293B] rounded-lg">
              <div className="flex items-start">
                <KeyIcon className="h-5 w-5 text-[#9CA3AF] mr-3 mt-0.5" />
                <div className="text-xs text-[#9CA3AF]">
                  <p>These permissions were granted when you connected {app.name}. To modify permissions, you need to disconnect and reconnect with different scopes.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Workflows Using This Connection */}
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6">
            <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Workflows Using This Connection</h2>
            
            {workflows.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#9CA3AF]">No workflows are using this connection yet.</p>
                <Link
                  href="/workflows/new"
                  className="mt-4 inline-block text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                >
                  Create a workflow
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div key={workflow.id} className="p-3 bg-[#1E293B] rounded-lg">
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="text-[#E5E7EB] hover:text-[#22D3EE] transition-colors font-medium"
                      >
                        {workflow.name}
                      </Link>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        workflow.status === 'active' ? 'bg-[#022c22] text-[#10B981]' :
                        workflow.status === 'paused' ? 'bg-[#374151] text-[#9CA3AF]' :
                        'bg-[#371520] text-[#F87171]'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-[#9CA3AF]">
                      Last run: {getTimeAgo(workflow.lastRun)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-6 bg-[#18181B] border border-[#374151] rounded-lg p-6">
          <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Recent Activity</h2>
          
          {activityLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#9CA3AF]">No recent activity for this connection.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#374151]">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Workflow
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1E293B] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                        {getTimeAgo(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                        {log.workflow}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.type === 'error' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Error
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Success
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activityLogs.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href={`/analytics?integration=${app.id}`}
                className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
              >
                View Full Activity History
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <h3 className="text-xl font-bold text-[#E5E7EB] mb-4">Disconnect {app.name}?</h3>
            
            <p className="text-[#9CA3AF] mb-4">
              Are you sure you want to disconnect {app.name}? This will affect {app.workflowsCount} workflow{app.workflowsCount !== 1 ? 's' : ''} that use this connection.
            </p>
            
            <div className="p-4 mb-4 bg-[#371520] border border-[#F87171] rounded-lg">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-[#F87171] mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-[#F87171]">Warning</h4>
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Disconnecting will immediately stop all workflows that use this connection from functioning properly. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                disabled={isDisconnecting}
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-[#F87171] text-[#111111] font-medium rounded-md hover:bg-[#EF4444] transition-colors flex items-center"
                disabled={isDisconnecting}
              >
                {isDisconnecting && (
                  <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                )}
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
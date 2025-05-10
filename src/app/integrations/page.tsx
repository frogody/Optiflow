'use client';

import { 
  ArrowPathIcon, 
  BoltIcon, 
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import PipedreamConnectButton from '@/components/PipedreamConnectButton';

// Interface for integration items
interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  popular: boolean;
}

// Interface for connected app
interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  account: string;
  status: 'healthy' | 'needs-attention' | 'error';
  connectedAt: string;
  workflowsCount: number;
  lastUsed: string;
  // Added more detailed health information
  healthDetails?: {
    lastChecked: string;
    responseTime?: number;
    errorMessage?: string;
    authExpiration?: string;
  };
}

// Mock data - in a real app this would come from an API
const mockConnectedApps: ConnectedApp[] = [
  {
    id: 'slack-1',
    name: 'Slack',
    icon: '/icons/slack.svg',
    account: 'acme-workspace',
    status: 'healthy',
    connectedAt: '2023-08-15T10:30:00Z',
    workflowsCount: 3,
    lastUsed: '2023-10-05T14:20:00Z',
    healthDetails: {
      lastChecked: '2023-10-10T08:45:00Z',
      responseTime: 320,
      authExpiration: '2024-08-15T10:30:00Z'
    }
  },
  {
    id: 'gmail-1',
    name: 'Gmail',
    icon: '/icons/gmail.svg',
    account: 'user@example.com',
    status: 'needs-attention',
    connectedAt: '2023-07-22T08:45:00Z',
    workflowsCount: 2,
    lastUsed: '2023-09-18T09:15:00Z',
    healthDetails: {
      lastChecked: '2023-10-10T08:45:00Z',
      responseTime: 450,
      authExpiration: '2023-10-22T08:45:00Z' // Expiring soon
    }
  },
  {
    id: 'github-1',
    name: 'GitHub',
    icon: '/icons/github.svg',
    account: 'acmecorp',
    status: 'error',
    connectedAt: '2023-09-10T16:20:00Z',
    workflowsCount: 1,
    lastUsed: '2023-09-12T11:30:00Z',
    healthDetails: {
      lastChecked: '2023-10-10T08:45:00Z',
      responseTime: 0,
      errorMessage: 'Authentication token expired',
      authExpiration: '2023-10-01T16:20:00Z' // Already expired
    }
  }
];

// Categories with friendly names
const categories = [
  { id: 'all', name: 'All' },
  { id: 'crm', name: 'CRM' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'communication', name: 'Communication' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'development', name: 'Development' },
  { id: 'finance', name: 'Finance' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'social-media', name: 'Social Media' }
];

// Mock integrations data
const mockAvailableIntegrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Connect your workflow with Slack channels and messages.',
    icon: '/icons/slack.svg',
    popular: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    description: 'Automate email communication and notifications.',
    icon: '/icons/gmail.svg',
    popular: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    description: 'Sync customer data and automate CRM workflows.',
    icon: '/icons/hubspot.svg',
    popular: true
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    category: 'Productivity',
    description: 'Automate data entry and reporting in spreadsheets.',
    icon: '/icons/sheets.svg',
    popular: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Development',
    description: 'Connect with thousands of apps through Zapier.',
    icon: '/icons/zapier.svg',
    popular: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Finance',
    description: 'Automate payment processing and financial workflows.',
    icon: '/icons/stripe.svg',
    popular: false
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'Productivity',
    description: 'Streamline task management and project workflows.',
    icon: '/icons/asana.svg',
    popular: false
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Development',
    description: 'Automate development workflows and code reviews.',
    icon: '/icons/github.svg',
    popular: true
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Finance',
    description: 'Connect accounting data with your automation workflows.',
    icon: '/icons/quickbooks.svg',
    popular: false
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Marketing',
    description: 'Automate email marketing campaigns and subscriber management.',
    icon: '/icons/mailchimp.svg',
    popular: true
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    description: 'Connect your CRM data with other business tools.',
    icon: '/icons/salesforce.svg',
    popular: true
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'Analytics',
    description: 'Automate reporting and data collection for web analytics.',
    icon: '/icons/analytics.svg',
    popular: false
  },
  {
    id: 'twitter',
    name: 'Twitter',
    category: 'Social Media',
    description: 'Schedule posts and monitor engagement automatically.',
    icon: '/icons/twitter.svg',
    popular: false
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'Productivity',
    description: 'Automate board updates and task management.',
    icon: '/icons/trello.svg',
    popular: false
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Productivity',
    description: 'Automate file management and document workflows.',
    icon: '/icons/dropbox.svg',
    popular: false
  }
];

// Connection Health Indicator Component
const ConnectionHealthIndicator = ({ app }: { app: ConnectedApp }) => {
  const getHealthMessage = () => {
    if (!app.healthDetails) return null;
    
    const formattedDate = new Date(app.healthDetails.lastChecked).toLocaleString();
    
    if (app.status === 'healthy') {
      return (
        <div className="flex flex-col text-xs">
          <span className="text-[#9CA3AF]">Last checked: {formattedDate}</span>
          {app.healthDetails.responseTime && (
            <span className="text-[#9CA3AF]">Response time: {app.healthDetails.responseTime}ms</span>
          )}
          {app.healthDetails.authExpiration && (
            <span className="text-[#9CA3AF]">
              Auth valid until: {new Date(app.healthDetails.authExpiration).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    }
    
    if (app.status === 'needs-attention') {
      return (
        <div className="flex flex-col text-xs">
          <span className="text-[#F59E0B]">Authentication expiring soon</span>
          <span className="text-[#9CA3AF]">Expires on: {new Date(app.healthDetails.authExpiration).toLocaleDateString()}</span>
          <span className="text-[#9CA3AF]">Please re-authenticate to maintain connection</span>
        </div>
      );
    }
    
    if (app.status === 'error') {
      return (
        <div className="flex flex-col text-xs">
          <span className="text-[#F87171]">{app.healthDetails.errorMessage || 'Connection error'}</span>
          <span className="text-[#9CA3AF]">Last checked: {formattedDate}</span>
          <span className="text-[#9CA3AF]">Please reconnect to fix this issue</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="my-2">
      {getHealthMessage()}
    </div>
  );
};

export default function IntegrationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>(mockConnectedApps);
  const [availableIntegrations, setAvailableIntegrations] = useState<Integration[]>(mockAvailableIntegrations);
  const [showHealthDetails, setShowHealthDetails] = useState<string | null>(null);
  
  // Filter integrations based on search and category
  const filteredIntegrations = availableIntegrations.filter(integration => {
    const matchesQuery = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      integration.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesQuery && matchesCategory;
  });
  
  // Get popular integrations for the featured section
  const popularIntegrations = availableIntegrations.filter(integration => integration.popular);
  
  // Handle successful connection
  const handleSuccessfulConnection = (integrationId: string, accountId: string) => {
    toast.success(`Successfully connected to ${integrationId}`);
    // In a real app, you would fetch the updated list of connected apps from the server
    // For the demo, we'll add a mock entry
    const newlyConnected = mockAvailableIntegrations.find(i => i.id === integrationId);
    if (newlyConnected) {
      const newConnectedApp: ConnectedApp = {
        id: `${integrationId}-${Date.now()}`,
        name: newlyConnected.name,
        icon: newlyConnected.icon,
        account: 'demo-account',
        status: 'healthy',
        connectedAt: new Date().toISOString(),
        workflowsCount: 0,
        lastUsed: new Date().toISOString()
      };
      setConnectedApps([...connectedApps, newConnectedApp]);
    }
  };
  
  // Enhanced refresh connections with more detailed health checks
  const refreshConnections = () => {
    setIsRefreshing(true);
    // In a real app, this would call an API to refresh the connection statuses
    setTimeout(() => {
      // Simulate updating the health details
      const updatedApps = connectedApps.map(app => {
        const updatedHealthDetails = {
          ...app.healthDetails,
          lastChecked: new Date().toISOString(),
          responseTime: Math.floor(Math.random() * 500) + 100
        };
        
        return {
          ...app,
          healthDetails: updatedHealthDetails
        };
      });
      
      setConnectedApps(updatedApps);
      setIsRefreshing(false);
      toast.success('Connection health checks completed');
    }, 1500);
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Get status badge for connected app
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

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Integrations Hub</h1>
            <p className="text-[#9CA3AF]">Connect your digital toolkit with Optiflow</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={refreshConnections}
              className="inline-flex items-center px-4 py-2 border border-[#374151] rounded-md bg-[#18181B] text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
              disabled={isRefreshing}
            >
              <ArrowPathIcon className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Running Health Checks...' : 'Refresh Status'}
            </button>
            <button
              onClick={() => router.push('/integrations/connect')}
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#22D3EE] text-[#111111] hover:bg-[#06B6D4] transition-colors"
            >
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Connect New App
            </button>
          </div>
        </div>
        
        {/* Enhanced Stats Overview with more details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4">
            <div className="flex items-center text-[#9CA3AF] mb-1">
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              <div className="text-sm">Connected Apps</div>
            </div>
            <div className="text-2xl font-bold text-[#E5E7EB]">{connectedApps.length}</div>
          </div>
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4">
            <div className="flex items-center text-[#9CA3AF] mb-1">
              <BoltIcon className="h-4 w-4 mr-1" />
              <div className="text-sm">Available Integrations</div>
            </div>
            <div className="text-2xl font-bold text-[#E5E7EB]">{availableIntegrations.length}</div>
          </div>
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4">
            <div className="flex items-center text-[#9CA3AF] mb-1">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              <div className="text-sm">Workflows Using Integrations</div>
            </div>
            <div className="text-2xl font-bold text-[#E5E7EB]">
              {connectedApps.reduce((sum, app) => sum + app.workflowsCount, 0)}
            </div>
          </div>
          <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4">
            <div className="flex items-center text-[#9CA3AF] mb-1">
              <ClockIcon className="h-4 w-4 mr-1" />
              <div className="text-sm">Connection Health</div>
            </div>
            <div className="flex items-center">
              <div 
                className="h-2 w-2 rounded-full mr-1" 
                style={{
                  backgroundColor: connectedApps.filter(a => a.status === 'healthy').length > 0 ? '#10B981' : '#6B7280'
                }}
              ></div>
              <div 
                className="h-2 w-2 rounded-full mr-1" 
                style={{
                  backgroundColor: connectedApps.filter(a => a.status === 'needs-attention').length > 0 ? '#F59E0B' : '#6B7280'
                }}
              ></div>
              <div 
                className="h-2 w-2 rounded-full mr-1" 
                style={{
                  backgroundColor: connectedApps.filter(a => a.status === 'error').length > 0 ? '#F87171' : '#6B7280'
                }}
              ></div>
              <div className="ml-2 text-sm text-[#E5E7EB]">
                {connectedApps.filter(a => a.status === 'healthy').length}/{connectedApps.length} healthy
              </div>
            </div>
          </div>
        </div>
        
        {/* Connected Apps Section with Enhanced Health Details */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-[#374151]">
            <h2 className="text-xl font-medium text-[#E5E7EB]">Connected Apps</h2>
          </div>
          
          {connectedApps.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[#9CA3AF]">You haven't connected any apps yet.</p>
              <button
                onClick={() => router.push('/integrations/connect')}
                className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-[#22D3EE] text-[#111111] hover:bg-[#06B6D4] transition-colors"
              >
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Connect Your First App
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#374151]">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      App
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Connected Account
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Connected On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Workflows
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Last Used
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {connectedApps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#1E293B] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#1E293B] rounded-md flex items-center justify-center">
                            <Image 
                              src={app.icon} 
                              alt={app.name} 
                              width={24} 
                              height={24} 
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#E5E7EB]">{app.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                        {app.account}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {getStatusBadge(app.status)}
                          <div>
                            <button 
                              onClick={() => setShowHealthDetails(showHealthDetails === app.id ? null : app.id)}
                              className="text-xs text-[#9CA3AF] hover:text-[#E5E7EB] mt-2 underline"
                            >
                              {showHealthDetails === app.id ? 'Hide details' : 'Show details'}
                            </button>
                            {showHealthDetails === app.id && (
                              <ConnectionHealthIndicator app={app} />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                        {formatDate(app.connectedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                        {app.workflowsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                        {formatDate(app.lastUsed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        {app.status === 'error' && (
                          <button
                            onClick={() => {
                              toast.success(`Attempting to reconnect ${app.name}...`);
                              setTimeout(() => {
                                router.push(`/integrations/${app.id}`);
                              }, 1000);
                            }}
                            className="text-[#F87171] hover:text-[#FCA5A5] transition-colors"
                          >
                            Reconnect
                          </button>
                        )}
                        <Link
                          href={`/integrations/${app.id}`}
                          className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Issue Alerts Section (only show if there are issues) */}
        {connectedApps.some(app => app.status === 'needs-attention' || app.status === 'error') && (
          <div className="bg-[#18181B] border border-[#374151] rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-[#374151]">
              <h2 className="text-xl font-medium text-[#E5E7EB]">Connection Alerts</h2>
            </div>
            <div className="p-6 space-y-4">
              {connectedApps
                .filter(app => app.status === 'needs-attention' || app.status === 'error')
                .map(app => (
                  <div 
                    key={`alert-${app.id}`} 
                    className={`p-4 rounded-md flex items-start ${
                      app.status === 'error' ? 'bg-[#371520] border border-[#F87171]' : 'bg-[#422006] border border-[#F59E0B]'
                    }`}
                  >
                    {app.status === 'error' ? (
                      <XCircleIcon className="h-5 w-5 text-[#F87171] mt-0.5 mr-3" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-[#F59E0B] mt-0.5 mr-3" />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-[#E5E7EB]">
                        {app.status === 'error' ? 'Connection Error' : 'Attention Required'}
                      </h3>
                      <p className="mt-1 text-sm text-[#9CA3AF]">
                        {app.status === 'error' 
                          ? `Your ${app.name} connection has encountered an error and needs to be reconnected.`
                          : `Your ${app.name} connection requires re-authentication soon.`
                        }
                      </p>
                      <div className="mt-2">
                        <Link
                          href={`/integrations/${app.id}`}
                          className={`text-sm font-medium ${
                            app.status === 'error' ? 'text-[#F87171] hover:text-[#FCA5A5]' : 'text-[#F59E0B] hover:text-[#FBBF24]'
                          } transition-colors`}
                        >
                          {app.status === 'error' ? 'Reconnect' : 'Fix Now'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {/* Popular Integrations */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-[#374151]">
            <h2 className="text-xl font-medium text-[#E5E7EB]">Popular Integrations</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularIntegrations.map(integration => (
              <motion.div
                key={integration.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#1E293B] rounded-lg p-4 border border-[#374151]"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#111111] rounded-md">
                    <Image 
                      src={integration.icon} 
                      alt={integration.name} 
                      width={24} 
                      height={24} 
                      className="w-6 h-6"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#E5E7EB]">{integration.name}</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mb-4 line-clamp-2">{integration.description}</p>
                <PipedreamConnectButton
                  appSlug={integration.id}
                  buttonText={`Connect ${integration.name}`}
                  onSuccess={(accountId) => handleSuccessfulConnection(integration.id, accountId)}
                  onError={(error) => toast.error(`Failed to connect ${integration.name}: ${error.message}`)}
                  className="w-full"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Browse All Integrations */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg">
          <div className="px-6 py-4 border-b border-[#374151] flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-medium text-[#E5E7EB] mb-4 md:mb-0">All Available Integrations</h2>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#111111] border border-[#374151] rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#111111] border border-[#374151] rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-[#9CA3AF]">No integrations found matching your search criteria.</p>
              </div>
            ) : (
              filteredIntegrations.map(integration => (
                <motion.div
                  key={integration.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1E293B] rounded-lg p-4 border border-[#374151]"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#111111] rounded-md">
                      <Image 
                        src={integration.icon} 
                        alt={integration.name} 
                        width={24} 
                        height={24} 
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-[#E5E7EB]">{integration.name}</h3>
                      <p className="text-xs text-[#9CA3AF]">{integration.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-4">{integration.description}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/integrations/${integration.id}`}
                      className="text-xs text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                    >
                      Learn more
                    </Link>
                    <PipedreamConnectButton
                      appSlug={integration.id}
                      buttonText="Connect"
                      onSuccess={(accountId) => handleSuccessfulConnection(integration.id, accountId)}
                      onError={(error) => toast.error(`Failed to connect ${integration.name}: ${error.message}`)}
                      className="ml-auto"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {/* Request Integration Section */}
          <div className="px-6 py-4 border-t border-[#374151] text-center">
            <p className="text-[#9CA3AF] mb-2">Can't find the integration you're looking for?</p>
            <Link
              href="/integrations/request"
              className="inline-flex items-center text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
            >
              Request a new integration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
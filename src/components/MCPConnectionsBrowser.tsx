import { useState, useEffect } from 'react';
import { usePipedreamBrowser } from '@/hooks/usePipedreamBrowser';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ConnectionModal from './ConnectionModal';
import { useRouter } from 'next/navigation';

interface MCPApp {
  name: string;
  icon: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  error?: string;
}

export default function MCPConnectionsBrowser() {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [dummyToken, setDummyToken] = useState('dummy-token-for-browser-client');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apps, setApps] = useState<MCPApp[]>([
    {
      name: 'Clay',
      icon: '/icons/clay.svg',
      description: 'Automated lead enrichment and data validation',
      category: 'Data',
      status: 'disconnected'
    },
    {
      name: 'HubSpot',
      icon: '/icons/hubspot.svg',
      description: 'CRM and marketing automation platform',
      category: 'CRM',
      status: 'disconnected'
    },
    {
      name: 'n8n',
      icon: '/icons/n8n.svg',
      description: 'Workflow automation and integration',
      category: 'Automation',
      status: 'disconnected'
    },
    {
      name: 'Gmail',
      icon: '/icons/gmail_logo.svg',
      description: 'Email communication and management',
      category: 'Communication',
      status: 'disconnected'
    },
    {
      name: 'Oneflow',
      icon: '/icons/document.svg',
      description: 'Contract management and signatures',
      category: 'Documents',
      status: 'disconnected'
    }
  ]);

  const { 
    connect, 
    disconnect,
    isConnecting,
    isDisconnecting, 
    connectionStatus,
    error 
  } = usePipedreamBrowser({
    appName: selectedApp || '',
  });

  // Update app status when connection status changes
  useEffect(() => {
    if (selectedApp && connectionStatus) {
      setApps(currentApps => 
        currentApps.map(app => 
          app.name === selectedApp 
            ? { ...app, status: connectionStatus, error: error?.message } 
            : app
        )
      );

      // Show toast notifications for status changes
      if (connectionStatus === 'connected') {
        toast.success(`Connected to ${selectedApp} successfully!`);
      } else if (connectionStatus === 'error' && error) {
        toast.error(`Connection error: ${error.message}`);
      }
    }
  }, [selectedApp, connectionStatus, error]);

  const handleConnect = async (appName: string) => {
    const app = apps.find(a => a.name === appName);
    if (!app) return;

    // Special handling for Oneflow
    if (appName === 'Oneflow') {
      // Redirect to Oneflow connection page
      router.push('/connections/oneflow');
      return;
    }

    setSelectedApp(appName);
    
    // Update UI immediately to show connecting state
    setApps(currentApps => 
      currentApps.map(a => 
        a.name === appName 
          ? { ...a, status: 'connecting' } 
          : a
      )
    );
    
    try {
      const success = await connect(dummyToken);
      if (!success) {
        console.error("Connection failed but no error was thrown");
      }
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const handleDisconnect = async (appName: string) => {
    const app = apps.find(a => a.name === appName);
    if (!app) return;

    setSelectedApp(appName);
    
    try {
      await disconnect();
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  const handleAddNewConnection = (appId: string) => {
    // In a real implementation, you would typically:
    // 1. Fetch the app details from an API
    // 2. Add the app to the list of apps
    // 3. Initiate the connection flow

    // For this demo, we'll mock adding a new app
    const newAppMap: {[key: string]: MCPApp} = {
      'salesforce': {
        name: 'Salesforce',
        icon: '/icons/salesforce.svg',
        description: 'CRM and customer engagement platform',
        category: 'CRM',
        status: 'disconnected'
      },
      'mailchimp': {
        name: 'Mailchimp',
        icon: '/icons/mailchimp.svg',
        description: 'Email marketing platform',
        category: 'Marketing',
        status: 'disconnected'
      },
      'stripe': {
        name: 'Stripe',
        icon: '/icons/stripe.svg',
        description: 'Payment processing platform',
        category: 'Payments',
        status: 'disconnected'
      },
      'dropbox': {
        name: 'Dropbox',
        icon: '/icons/dropbox.svg',
        description: 'Cloud storage and file sharing',
        category: 'Storage',
        status: 'disconnected'
      },
      'twitter': {
        name: 'Twitter',
        icon: '/icons/twitter.svg',
        description: 'Social media platform',
        category: 'Social Media',
        status: 'disconnected'
      },
      'oneflow': {
        name: 'Oneflow',
        icon: '/icons/document.svg',
        description: 'Contract management and signatures',
        category: 'Documents',
        status: 'disconnected'
      }
    };

    if (newAppMap[appId]) {
      // Check if app already exists
      const appExists = apps.some(app => app.name === newAppMap[appId].name);
      
      if (!appExists) {
        setApps(currentApps => [...currentApps, newAppMap[appId]]);
        toast.success(`Added ${newAppMap[appId].name} to your connections`);
      } else {
        toast.error(`${newAppMap[appId].name} is already in your connections`);
      }
    } else {
      toast.error('App not found');
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">MCP Connections</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-200"
        >
          Add New Connection
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                  <p className="text-sm text-white/60">{app.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${app.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                    app.status === 'connecting' ? 'bg-yellow-500/10 text-yellow-400' :
                    app.status === 'error' ? 'bg-red-500/10 text-red-400' :
                    'bg-white/10 text-white/60'}`}>
                  {app.status === 'connecting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting
                    </>
                  ) : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                <button
                  onClick={() => app.status === 'connected' ? handleDisconnect(app.name) : handleConnect(app.name)}
                  disabled={app.status === 'connecting' || (selectedApp === app.name && (isConnecting || isDisconnecting))}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200
                    ${app.status === 'connected'
                      ? 'border border-white/10 text-white hover:bg-white/5'
                      : 'bg-primary text-white hover:bg-primary-dark'} 
                    ${(app.status === 'connecting' || (selectedApp === app.name && (isConnecting || isDisconnecting))) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''}`}
                >
                  {app.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">{app.description}</p>
            {app.status === 'error' && app.error && (
              <p className="mt-2 text-xs text-red-400">{app.error}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleAddNewConnection}
      />
    </div>
  );
} 
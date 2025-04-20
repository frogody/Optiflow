'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/lib/userStore';
import { usePipedream } from '@/hooks/usePipedream';
import toast from 'react-hot-toast';

export default function ToolsPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // List of available tools/integrations
  const [tools, setTools] = useState([
    {
      id: 'clay',
      name: 'Clay',
      description: 'Automated lead enrichment and data validation',
      icon: '/icons/clay.svg',
      category: 'Data',
      status: 'disconnected'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM and marketing automation platform',
      icon: '/icons/hubspot.svg',
      category: 'CRM',
      status: 'disconnected'
    },
    {
      id: 'n8n',
      name: 'n8n',
      description: 'Workflow automation and integration',
      icon: '/icons/n8n.svg',
      category: 'Automation',
      status: 'disconnected'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Email communication and management',
      icon: '/icons/gmail_logo.svg',
      category: 'Communication',
      status: 'disconnected'
    }
  ]);

  const { connectionStatus } = usePipedream({ appName: 'pipedream' });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [currentUser, router]);

  const handleConnectTool = (toolId: string) => {
    // This would connect to the actual tool in a real implementation
    toast.success(`Initiating connection to ${toolId}...`);
    router.push(`/connections`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading tools...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Integration Tools
              </h1>
              <p className="text-gray-400">
                Connect your favorite tools and services for seamless automation
              </p>
            </div>
            <Link href="/dashboard" className="action-button px-4 py-2 rounded-lg">
              Back to Dashboard
            </Link>
          </div>
          
          {/* Connection Status */}
          <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">API Connection Status</h2>
                <p className="text-gray-400">
                  {connectionStatus === 'connected' 
                    ? 'Your API connections are active and ready to use' 
                    : 'Connect to the Pipedream API to manage your tools'}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <span className="text-gray-300">{connectionStatus === 'connected' ? 'Connected' : 'Not Connected'}</span>
              </div>
            </div>
          </div>
          
          {/* Tool Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Available Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div 
                  key={tool.id}
                  className="tech-card p-6 hover:cursor-pointer"
                  onClick={() => handleConnectTool(tool.id)}
                >
                  <div className="flex items-start mb-4">
                    <div className="relative w-14 h-14 mr-4">
                      <Image
                        src={tool.icon}
                        alt={tool.name}
                        width={56}
                        height={56}
                        className="rounded-lg floating-icon"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                      <span className="text-sm text-gray-400">{tool.category}</span>
                    </div>
                  </div>
                  <p className="text-white/80 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tool.status === 'connected' ? 'bg-green-500/10 text-green-400' :
                        'bg-white/10 text-white/60'}`}>
                      {tool.status === 'connected' ? 'Connected' : 'Not Connected'}
                    </span>
                    <button className="px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm rounded-md">
                      {tool.status === 'connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/connections" className="action-button p-4 rounded-lg text-left block">
                <span className="block text-lg font-semibold mb-1">Manage Connections</span>
                <span className="text-sm text-gray-400">View and configure your existing connections</span>
              </Link>
              
              <Link href="/connections-browser" className="action-button p-4 rounded-lg text-left block">
                <span className="block text-lg font-semibold mb-1">Browser View</span>
                <span className="text-sm text-gray-400">Alternative connection management interface</span>
              </Link>
              
              <Link href="/dashboard" className="action-button p-4 rounded-lg text-left block">
                <span className="block text-lg font-semibold mb-1">Return to Dashboard</span>
                <span className="text-sm text-gray-400">Go back to main dashboard view</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
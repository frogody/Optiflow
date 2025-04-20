import { useState } from 'react';
import { usePipedream } from '@/hooks/usePipedream';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface MCPApp {
  name: string;
  icon: string;
  description: string;
  category: string;
  status: 'connected' | 'disconnected' | 'connecting';
}

export default function MCPConnections() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  
  const apps: MCPApp[] = [
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
    }
  ];

  const { connect, disconnect, isConnecting, error } = usePipedream({
    appName: selectedApp || '',
    autoConnect: false
  });

  const handleConnect = async (appName: string) => {
    setSelectedApp(appName);
    await connect();
  };

  const handleDisconnect = async (appName: string) => {
    setSelectedApp(appName);
    await disconnect();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">MCP Connections</h2>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-200">
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
                    'bg-white/10 text-white/60'}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                <button
                  onClick={() => app.status === 'connected' ? handleDisconnect(app.name) : handleConnect(app.name)}
                  disabled={app.status === 'connecting' || (selectedApp === app.name && isConnecting)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200
                    ${app.status === 'connected'
                      ? 'border border-white/10 text-white hover:bg-white/5'
                      : 'bg-primary text-white hover:bg-primary-dark'}`}
                >
                  {app.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">{app.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
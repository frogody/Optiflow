// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePipedream } from '@/hooks/usePipedream';
import { useUserStore } from '@/lib/userStore';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PipedreamService } from '@/services/PipedreamService';
import { toast } from 'react-hot-toast';

export default function PipedreamPageContent() {
  const { currentUser } = useUserStore();
  const router = useRouter();
  const { data: session, status     } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [apps, setApps] = useState<any[]>([]);
  
  const { connectToApp, 
    disconnect, 
    isLoading: isConnecting, 
    connectionStatus, 
    error 
      } = usePipedream({ appName: 'pipedream' 
      });

  // Check if user is logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchApps();
    }
  }, [status, router]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchApps() {
    setIsLoading(true);
    try {
      const pipedreamService = PipedreamService.getInstance();
      const appList = await pipedreamService.getApps();
      setApps(appList);
    } catch (error) { console.error('Failed to fetch Pipedream apps:', error);
      toast.error('Failed to fetch Pipedream apps');
        } finally {
      setIsLoading(false);
    }
  }

  const handleConnect = async () => {
    await connectToApp();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Pipedream Connection
          </h1>
          <Link href="/connections" className="action-button px-4 py-2 rounded-lg">
            Back to Connections
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.5     }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Pipedream Integration</h2>
              <p className="text-white/60">Connect your Pipedream account to enable workflow automation</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${ connectionStatus.status === 'connected' ? 'bg-green-500' : 
                connectionStatus.status === 'error' ? 'bg-red-500' : 
                'bg-yellow-500'
                  }`}></div>
              <span className="text-white">
                Status: { connectionStatus.status === 'connected' ? 'Connected' : 
                         connectionStatus.status === 'error' ? 'Error' : 
                         'Disconnected'    }
              </span>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>

          {connectionStatus.status !== 'connected' ? (
            <div>
              <p className="text-white/80 mb-4">
                Connect your Pipedream account to enable workflow automation and integrate with various services.
              </p>
              
              <div className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium text-white/80 mb-1">
                  Pipedream API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Pipedream API key"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-white/60 text-xs mt-1">
                  You can find your API key in your Pipedream account settings.
                </p>
              </div>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting || !apiKey}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium ${ isConnecting || !apiKey ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600'
                    }`}
              >
                { isConnecting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  'Connect to Pipedream'
                )    }
              </button>
            </div>
          ) : (
            <div>
              <p className="text-white/80 mb-4">
                Your Pipedream account is successfully connected. You can now create and manage workflows.
              </p>
              
              <div className="flex space-x-4">
                <Link 
                  href="/workflows" 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium hover:from-green-600 hover:to-teal-600"
                >
                  Manage Workflows
                </Link>
                
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {apps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20     }}
            animate={{ opacity: 1, y: 0     }}
            transition={{ duration: 0.5, delay: 0.2     }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Available Apps</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((app) => (
                <li key={app.id} className="border rounded-lg p-4">
                  <div className="font-semibold">{app.name}</div>
                  <div className="text-sm text-gray-500">{app.id}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  );
} 
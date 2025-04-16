'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePipedream } from '@/hooks/usePipedream';
import { useUserStore } from '@/lib/userStore';
import Link from 'next/link';
import Image from 'next/image';

export default function PipedreamConnectionPage() {
  const { currentUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  
  const { 
    connect, 
    disconnect, 
    isConnecting, 
    connectionStatus, 
    error 
  } = usePipedream({ 
    appName: 'pipedream',
    autoConnect: false
  });

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]);

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  if (isLoading) {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
              <div className={`w-3 h-3 rounded-full mr-2 ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'error' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`}></div>
              <span className="text-white">
                Status: {connectionStatus === 'connected' ? 'Connected' : 
                         connectionStatus === 'error' ? 'Error' : 
                         'Disconnected'}
              </span>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error.message}</p>
            )}
          </div>

          {connectionStatus !== 'connected' ? (
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
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium ${
                  isConnecting || !apiKey ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600'
                }`}
              >
                {isConnecting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  'Connect to Pipedream'
                )}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">What you can do with Pipedream</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Create Workflows</h3>
              <p className="text-white/60">Build powerful automation workflows connecting multiple apps and services.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Connect Services</h3>
              <p className="text-white/60">Integrate with hundreds of apps and services without writing complex code.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 5a1 1 0 11-1.414 1.414L13 5.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707L12.586 3A1 1 0 0112 2zm0 10a1 1 0 01.707.293l.707.707L15.414 15a1 1 0 11-1.414 1.414L13 15.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707L12.586 13A1 1 0 0112 12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Custom Logic</h3>
              <p className="text-white/60">Add custom JavaScript code to transform data and create complex automation logic.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
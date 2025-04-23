'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardCard from '@/components/DashboardCard';
import { usePipedream } from '@/hooks/usePipedream';
import AgentDashboard from '@/components/AgentDashboard';
import { OrchestratorInput } from '@/components/OrchestratorInput';
import { useVoiceStore } from '@/stores/voiceStore';

export default function DashboardPage() {
  const { currentUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [commandText, setCommandText] = useState('');
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents'>('overview');
  const { connectionStatus, makeRequest } = usePipedream({ appName: "pipedream" });
  const { isProcessing, setProcessing } = useVoiceStore();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]);

  // Handle command input
  const handleCommand = async (command: string) => {
    try {
      setProcessing(true);
      
      // Your existing command handling logic
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error('Failed to process command');
      }

      const data = await response.json();
      
      // Handle the response
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast.error('Failed to process command. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Dashboard card data
  const dashboardCards = [
    {
      title: 'Connections',
      description: 'Manage your API connections and integrations',
      icon: '🔌',
      link: '/connections',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Workflows',
      description: 'Create and manage automated workflows',
      icon: '⚙️',
      link: '/workflows',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Analytics',
      description: 'Track your workflow performance and API usage',
      icon: '📊',
      link: '/analytics',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Settings',
      description: 'Configure your account and notification preferences',
      icon: '⚙️',
      link: '/settings',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const fetchConnectionStatus = async () => {
    if (connectionStatus === 'connected') {
      try {
        const response = await makeRequest<any>(
          '/connections',
          'GET'
        );
        
        if (response) {
          toast.success('Successfully retrieved connection status');
          return true;
        }
      } catch (error) {
        console.error('Error fetching connection status:', error);
        toast.error('Failed to retrieve connection status');
      }
    } else {
      toast.success('Please connect to Pipedream first');
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Orchestrator Dashboard
            </h2>
            
            <div className="mb-6">
              <OrchestratorInput
                onCommand={handleCommand}
                disabled={isProcessing}
              />
            </div>

            {/* Your existing dashboard content */}
            <div className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold gradient-text mb-2">
                  Welcome, {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-gray-400 mb-8">
                  Manage your connections and workflows from one place
                </p>

                {/* Command Input */}
                <div className="mb-8">
                  <form onSubmit={(e) => { e.preventDefault(); }} className="command-input p-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-xl backdrop-blur-sm shadow-lg">
                    <div className="flex flex-col">
                      <label className="text-white/80 text-sm mb-2 font-medium">Tell the orchestrator what to do:</label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={commandText}
                          onChange={(e) => setCommandText(e.target.value)}
                          placeholder="Tell the orchestrator what needs to change in workflows..."
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                          disabled={isProcessingCommand}
                        />
                        <button 
                          type="submit" 
                          className="ml-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg flex-shrink-0 font-medium shadow-glow hover:from-primary-dark hover:to-secondary-dark transition-all duration-300 hover:shadow-glow-intense"
                          disabled={!commandText.trim() || isProcessingCommand}
                        >
                          {isProcessingCommand ? 'Processing...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                
                {/* Connection Status */}
                <div className="bg-opacity-20 bg-black backdrop-blur-lg rounded-lg p-4 mb-8 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Connection Status</h2>
                      <p className="text-gray-400">
                        {connectionStatus === 'connected' 
                          ? 'Your API connections are active and ready to use'
                          : 'Connect to the Pipedream API to manage your workflows'}
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
                
                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8">
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'overview' 
                        ? 'text-white border-b-2 border-primary' 
                        : 'text-white/60 hover:text-white/80'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'agents' 
                        ? 'text-white border-b-2 border-primary' 
                        : 'text-white/60 hover:text-white/80'
                    }`}
                    onClick={() => setActiveTab('agents')}
                  >
                    AI Agents
                  </button>
                </div>
                
                {/* Tab Content */}
                {activeTab === 'overview' ? (
                  <>
                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {dashboardCards.map((card, index) => (
                        <DashboardCard
                          key={index}
                          title={card.title}
                          description={card.description}
                          icon={card.icon}
                          link={card.link}
                          color={card.color}
                        />
                      ))}
                    </div>
                    
                    {/* Quick Actions */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                          onClick={() => router.push('/connections')}
                          className="action-button p-4 rounded-lg text-left"
                        >
                          <span className="block text-lg font-semibold mb-1">Manage Connections</span>
                          <span className="text-sm text-gray-400">View and configure your API connections</span>
                        </button>
                        
                        <button
                          onClick={fetchConnectionStatus}
                          className="action-button p-4 rounded-lg text-left"
                        >
                          <span className="block text-lg font-semibold mb-1">Check Connection Status</span>
                          <span className="text-sm text-gray-400">Verify your current connection status</span>
                        </button>
                        
                        <Link href="/profile" className="action-button p-4 rounded-lg text-left block">
                          <span className="block text-lg font-semibold mb-1">Profile Settings</span>
                          <span className="text-sm text-gray-400">Update your account information</span>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <AgentDashboard />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
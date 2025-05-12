'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useOneflow } from '@/hooks/useOneflow';
import { useUserStore } from '@/lib/userStore';


export default function OneflowConnectionPage(): JSX.Element {
  const { currentUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [contractId, setContractId] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);
  const [showCloseForm, setShowCloseForm] = useState(false);
  
  const { 
    connect, 
    disconnect, 
    closeContract,
    listContracts,
    isConnecting, 
    isProcessing,
    connectionStatus, 
    error 
  } = useOneflow({ autoConnect: true
      });

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnect = async () => {
    await connect(apiKey, accountId);
  };

  const handleDisconnect = async () => {
    await disconnect();
    setContracts([]) // eslint-disable-line react-hooks/exhaustive-deps
    setShowCloseForm(false);
  };

  const handleListContracts = async () => {
    if (connectionStatus !== 'connected') {
      toast.error('Please connect to Oneflow first');
      return;
    }
    
    const result = await listContracts({ limit: 10     });
    if (result && result.data) {
      setContracts(result.data);
    }
  };

  const handleCloseContract = async () => {
    if (!contractId) {
      toast.error('Please enter a contract ID');
      return;
    }
    
    await closeContract(contractId, closeReason || undefined);
    setContractId('');
    setCloseReason('');
    
    // Refresh contracts list
    handleListContracts();
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
            Oneflow Integration
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Oneflow Integration</h2>
              <p className="text-white/60">Connect to Oneflow API to manage contracts</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${ connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'error' ? 'bg-red-500' : 
                'bg-yellow-500'
                  }`}></div>
              <span className="text-white">
                Status: { connectionStatus === 'connected' ? 'Connected' : 
                         connectionStatus === 'error' ? 'Error' : 
                         'Disconnected'    }
              </span>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-1">{error.message}</p>
            )}
          </div>

          {connectionStatus !== 'connected' ? (
            <div>
              <p className="text-white/80 mb-4">
                Connect to Oneflow API to manage your contracts and use the close flow.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-white/80 mb-1">
                    Oneflow API Key
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Oneflow API key"
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="accountId" className="block text-sm font-medium text-white/80 mb-1">
                    Oneflow Account ID
                  </label>
                  <input
                    type="text"
                    id="accountId"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Enter your Oneflow Account ID"
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <p className="text-white/60 text-xs mb-4">
                You can find your API key and Account ID in your Oneflow developer account settings at 
                <a href="https://developer.oneflow.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                  developer.oneflow.com
                </a>.
              </p>
              
              <button
                onClick={handleConnect}
                disabled={isConnecting || !apiKey || !accountId}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium ${ isConnecting || !apiKey || !accountId ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-600'
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
                  'Connect to Oneflow'
                )    }
              </button>
            </div>
          ) : (
            <div>
              <p className="text-white/80 mb-4">
                Your Oneflow account is successfully connected. You can now manage your contracts.
              </p>
              
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleListContracts}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium hover:from-green-600 hover:to-teal-600"
                >
                  { isProcessing ? 'Loading...' : 'List Contracts'    }
                </button>
                
                <button
                  onClick={() => setShowCloseForm(!showCloseForm)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600"
                >
                  { showCloseForm ? 'Hide Close Form' : 'Close a Contract'    }
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                >
                  Disconnect
                </button>
              </div>
              
              {showCloseForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0     }}
                  animate={{ opacity: 1, height: 'auto'     }}
                  exit={{ opacity: 0, height: 0     }}
                  className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Close a Contract</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="contractId" className="block text-sm font-medium text-white/80 mb-1">
                        Contract ID
                      </label>
                      <input
                        type="text"
                        id="contractId"
                        value={contractId}
                        onChange={(e) => setContractId(e.target.value)}
                        placeholder="Enter contract ID to close"
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="closeReason" className="block text-sm font-medium text-white/80 mb-1">
                        Close Reason (Optional)
                      </label>
                      <input
                        type="text"
                        id="closeReason"
                        value={closeReason}
                        onChange={(e) => setCloseReason(e.target.value)}
                        placeholder="Reason for closing the contract"
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCloseContract}
                    disabled={isProcessing || !contractId}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium ${ isProcessing || !contractId ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-600 hover:to-orange-600'
                        }`}
                  >
                    { isProcessing ? 'Processing...' : 'Close Contract'    }
                  </button>
                </motion.div>
              )}
              
              {contracts.length > 0 && (
                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Contracts</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-white/80">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-2 px-4 text-left">Contract ID</th>
                          <th className="py-2 px-4 text-left">Name</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.map((contract) => (
                          <tr key={contract.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4">{contract.id}</td>
                            <td className="py-3 px-4">{contract.name || 'Untitled'}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ contract.status === 'signed' ? 'bg-green-500/20 text-green-400' :
                                contract.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                contract.status === 'closed' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                                  }`}>
                                {contract.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {contract.status !== 'closed' && (
                                <button
                                  onClick={() => {
                                    setContractId(contract.id);
                                    setShowCloseForm(true);
                                    // Scroll to the form
                                    document.getElementById('contractId')?.scrollIntoView({ behavior: 'smooth'     });
                                  }}
                                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                >
                                  Close
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.5, delay: 0.2     }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">What you can do with Oneflow API</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Manage Contracts</h3>
              <p className="text-white/60">Create, update, and close contracts programmatically through the API.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Automate Workflows</h3>
              <p className="text-white/60">Automate your contract processes with webhooks and API integrations.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Access Contract Data</h3>
              <p className="text-white/60">Retrieve contract data, status, and event history for analytics and reporting.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
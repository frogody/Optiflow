'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  createdAt: string;
  permissions: string[];
}

export default function ApiKeys() {
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Development Key',
      key: '••••••••••••••••',
      lastUsed: '2 hours ago',
      createdAt: 'Dec 10, 2023',
      permissions: ['read', 'write']
    },
    {
      id: '2',
      name: 'Production Key',
      key: '••••••••••••••••',
      lastUsed: '2 days ago',
      createdAt: 'Nov 5, 2023',
      permissions: ['read']
    }
  ]);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    setIsGeneratingKey(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would come from the backend
      const generatedKey = `opt_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      setNewApiKey(generatedKey);
      
      // Add to list (in a real app, this would happen after successful API response)
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: '••••••••••••••••',
        lastUsed: 'Never',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        permissions: ['read', 'write']
      };
      
      setApiKeys(prev => [newKey, ...prev]);
      
      toast.success('API key generated successfully');
    } catch (error) {
      toast.error('Failed to generate API key');
      console.error(error);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const revokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.filter(key => key.id !== id));
      toast.success('API key revoked successfully');
    }
  };

  return (
    <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">API Keys</h2>
          <p className="text-white/60 text-sm">Manage your API keys for programmatic access</p>
        </div>
        <button
          onClick={() => setShowNewKeyModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all duration-300 hover:opacity-90"
        >
          Generate New Key
        </button>
      </div>
      
      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/60">You don't have any API keys yet.</p>
          </div>
        ) : (
          apiKeys.map(key => (
            <div key={key.id} className="bg-black/30 rounded-lg border border-white/5 p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-medium">{key.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-white/60 text-sm mr-2">Key:</span>
                    <code className="bg-white/5 px-2 py-1 rounded text-white/80 text-sm font-mono">
                      {key.key}
                    </code>
                    <button
                      onClick={() => copyToClipboard(key.key)}
                      className="ml-2 text-primary hover:text-primary-light"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center mt-3 md:mt-0">
                  <div className="flex flex-col text-right mr-4">
                    <span className="text-white/40 text-xs">Created</span>
                    <span className="text-white/80 text-sm">{key.createdAt}</span>
                  </div>
                  <div className="flex flex-col text-right mr-4">
                    <span className="text-white/40 text-xs">Last used</span>
                    <span className="text-white/80 text-sm">{key.lastUsed}</span>
                  </div>
                  <button
                    onClick={() => revokeKey(key.id)}
                    className="ml-4 text-red-400 hover:text-red-300"
                    title="Revoke key"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                  <span className="text-white/60 text-xs">Permissions:</span>
                  {key.permissions.map(perm => (
                    <span key={perm} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => newApiKey ? setShowNewKeyModal(false) : null}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-dark-100 border border-white/10 rounded-xl p-6 w-full max-w-md"
          >
            <button
              onClick={() => newApiKey ? setShowNewKeyModal(false) : null}
              className="absolute top-3 right-3 text-white/60 hover:text-white"
              disabled={isGeneratingKey && !newApiKey}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-semibold text-white mb-4">
              {newApiKey ? 'Your New API Key' : 'Generate New API Key'}
            </h3>
            
            {newApiKey ? (
              <div>
                <p className="text-white/60 mb-3">
                  <strong className="text-white">Important:</strong> This is the only time your API key will be displayed. Make sure to copy it now!
                </p>
                
                <div className="bg-black/40 p-3 rounded-lg font-mono text-sm text-white/90 mb-4 break-all select-all">
                  {newApiKey}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => copyToClipboard(newApiKey)}
                    className="px-4 py-2 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setShowNewKeyModal(false)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey}>
                <div className="mb-4">
                  <label className="block text-white/80 text-sm mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    placeholder="e.g. Development Key"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewKeyModal(false)}
                    className="px-4 py-2 text-white/80 hover:text-white transition-colors"
                    disabled={isGeneratingKey}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingKey}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all duration-300 hover:opacity-90"
                  >
                    {isGeneratingKey ? 'Generating...' : 'Generate Key'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
} 
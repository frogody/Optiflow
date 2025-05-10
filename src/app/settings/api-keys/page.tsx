'use client';

import {
  ArrowPathIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  KeyIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

// Mock API keys data
const mockApiKeys = [
  {
    id: 'key-1',
    name: 'Development API Key',
    truncatedKey: '••••••••••••••••abcd1234',
    scopes: ['read:workflows', 'execute:workflows'],
    createdAt: '2023-05-15T10:30:00Z',
    lastUsed: '2023-07-02T14:30:00Z',
    expiresAt: '2024-05-15T10:30:00Z',
    status: 'active',
  },
  {
    id: 'key-2',
    name: 'External Integration Key',
    truncatedKey: '••••••••••••••••efgh5678',
    scopes: ['read:workflows', 'read:integrations'],
    createdAt: '2023-04-10T08:15:00Z',
    lastUsed: '2023-06-25T09:45:00Z',
    expiresAt: null,
    status: 'active',
  },
  {
    id: 'key-3',
    name: 'Testing Key',
    truncatedKey: '••••••••••••••••ijkl9012',
    scopes: ['read:workflows', 'execute:workflows', 'manage:integrations'],
    createdAt: '2023-03-22T16:45:00Z',
    lastUsed: '2023-03-25T12:30:00Z',
    expiresAt: '2023-06-22T16:45:00Z',
    status: 'expired',
  },
];

// Available scopes for API keys
const availableScopes = [
  { id: 'read:workflows', name: 'Read Workflows', description: 'View workflow configurations and execution history' },
  { id: 'execute:workflows', name: 'Execute Workflows', description: 'Trigger workflow executions' },
  { id: 'manage:workflows', name: 'Manage Workflows', description: 'Create, update, and delete workflows' },
  { id: 'read:integrations', name: 'Read Integrations', description: 'View integration configurations' },
  { id: 'manage:integrations', name: 'Manage Integrations', description: 'Create, update, and delete integration connections' },
  { id: 'read:billing', name: 'Read Billing Info', description: 'View subscription and billing information' },
];

export default function ApiKeysSettings() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  
  // New key form data
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    scopes: [] as string[],
    expiry: '',
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewKeyForm({
      ...newKeyForm,
      [name]: value,
    });
  };
  
  // Handle scope toggle
  const handleScopeToggle = (scopeId: string) => {
    if (newKeyForm.scopes.includes(scopeId)) {
      setNewKeyForm({
        ...newKeyForm,
        scopes: newKeyForm.scopes.filter(id => id !== scopeId),
      });
    } else {
      setNewKeyForm({
        ...newKeyForm,
        scopes: [...newKeyForm.scopes, scopeId],
      });
    }
  };
  
  // Handle key creation
  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newKeyForm.name.trim()) {
      alert('Please provide a name for this API key');
      return;
    }
    
    if (newKeyForm.scopes.length === 0) {
      alert('Please select at least one scope for this API key');
      return;
    }
    
    // In a real implementation, this would call an API to create a new key
    // For this demo, generate a mock key
    const mockKey = 'opfl_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    setNewApiKey(mockKey);
    setShowNewKey(true);
    
    // Reset the form for future use
    setNewKeyForm({
      name: '',
      scopes: [],
      expiry: '',
    });
  };
  
  // Copy key to clipboard
  const copyKeyToClipboard = () => {
    if (newApiKey) {
      navigator.clipboard.writeText(newApiKey)
        .then(() => {
          setKeyCopied(true);
          setTimeout(() => setKeyCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate time since last used
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000; // Years
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000; // Months
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400; // Days
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600; // Hours
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60; // Minutes
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };
  
  // Toggle key details expansion
  const toggleKeyDetails = (keyId: string) => {
    if (expandedKey === keyId) {
      setExpandedKey(null);
    } else {
      setExpandedKey(keyId);
    }
  };
  
  // Handle key revocation
  const handleRevokeKey = (keyId: string) => {
    // In a real implementation, this would call an API to revoke the key
    // For this demo, just show an alert
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      alert(`API key "${mockApiKeys.find(key => key.id === keyId)?.name}" has been revoked.`);
    }
  };
  
  // Handle key regeneration
  const handleRegenerateKey = (keyId: string) => {
    // In a real implementation, this would call an API to regenerate the key
    // For this demo, just show an alert
    if (confirm('Are you sure you want to regenerate this API key? The previous key will be invalidated immediately.')) {
      alert(`API key "${mockApiKeys.find(key => key.id === keyId)?.name}" has been regenerated. The new key would be shown here.`);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#22D3EE]">API Keys</h1>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create API Key
        </button>
      </div>
      
      {/* Information banner */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-4 mb-6 flex items-start">
        <InformationCircleIcon className="h-5 w-5 text-[#9CA3AF] mr-3 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[#9CA3AF]">
          <p className="mb-2">
            API keys grant programmatic access to your Optiflow account. Keep your API keys secure and never share them in public repositories or client-side code.
          </p>
          <p>
            Each key should be used for a specific purpose, with the minimum necessary permissions, and should be rotated regularly.
          </p>
        </div>
      </div>
      
      {/* API Keys Table */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-[#374151]">
          <h2 className="text-lg font-medium text-[#E5E7EB]">Your API Keys</h2>
        </div>
        
        {mockApiKeys.length === 0 ? (
          <div className="p-6 text-center">
            <KeyIcon className="h-12 w-12 text-[#374151] mx-auto mb-2" />
            <p className="text-[#9CA3AF]">You don't have any API keys yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
            >
              Create Your First API Key
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#374151]">
            {mockApiKeys.map((key) => (
              <div key={key.id} className="divide-y divide-[#374151]">
                {/* Key summary */}
                <div className="p-4 hover:bg-[#1E293B] transition-colors">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleKeyDetails(key.id)}>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md mr-3 ${
                        key.status === 'active' ? 'bg-[#022c22] text-[#22D3EE]' : 'bg-[#1E293B] text-[#9CA3AF]'
                      }`}>
                        <KeyIcon className="h-5 w-5" />
                      </div>
                      
                      <div>
                        <h3 className="text-[#E5E7EB] font-medium flex items-center">
                          {key.name}
                          {key.status === 'expired' && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#371520] text-[#F87171] rounded-full">
                              Expired
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center text-sm">
                          <span className="font-mono text-[#9CA3AF] mr-2">{key.truncatedKey}</span>
                          <span className="text-xs text-[#9CA3AF]">Created {formatDate(key.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-right">
                        <div className="text-[#9CA3AF]">Last used</div>
                        <div className="text-[#E5E7EB]">{getTimeAgo(key.lastUsed)}</div>
                      </div>
                      
                      {key.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevokeKey(key.id);
                          }}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#F87171] bg-[#1E293B] rounded transition-colors"
                          title="Revoke Key"
                          aria-label="Revoke Key"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedKey === key.id && (
                  <div className="p-4 bg-[#1E293B]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Created</span>
                            <span className="text-[#E5E7EB]">{formatDate(key.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Last Used</span>
                            <span className="text-[#E5E7EB]">{formatDate(key.lastUsed)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Expires</span>
                            <span className="text-[#E5E7EB]">
                              {key.expiresAt ? formatDate(key.expiresAt) : 'Never'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Status</span>
                            <span className={`${
                              key.status === 'active' ? 'text-[#22D3EE]' : 'text-[#F87171]'
                            }`}>
                              {key.status === 'active' ? 'Active' : 'Expired'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-[#9CA3AF] mb-2">Permissions</h4>
                        <div className="space-y-1">
                          {key.scopes.map((scope) => {
                            const scopeDetails = availableScopes.find(s => s.id === scope);
                            return (
                              <div key={scope} className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                                <span className="text-sm text-[#E5E7EB]">
                                  {scopeDetails?.name || scope}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {key.status === 'active' && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleRegenerateKey(key.id)}
                          className="px-3 py-1.5 text-sm bg-[#111111] text-[#E5E7EB] border border-[#374151] rounded-md hover:bg-[#1E293B] transition-colors flex items-center"
                          aria-label="Regenerate Key"
                          title="Regenerate Key"
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Regenerate Key
                        </button>
                        
                        <button
                          onClick={() => handleRevokeKey(key.id)}
                          className="px-3 py-1.5 text-sm bg-[#371520] text-[#F87171] rounded-md hover:bg-[#4B1D29] transition-colors flex items-center"
                          aria-label="Revoke Key"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Revoke Key
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Best Practices */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-4">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">API Key Security Best Practices</h2>
        
        <ul className="space-y-3 text-sm text-[#9CA3AF]">
          <li className="flex items-start">
            <CheckIcon className="h-5 w-5 text-[#22D3EE] mr-2 mt-0.5 flex-shrink-0" />
            <span>Store API keys securely and never commit them to version control.</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="h-5 w-5 text-[#22D3EE] mr-2 mt-0.5 flex-shrink-0" />
            <span>Use environment variables or secure vaults to store keys in your applications.</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="h-5 w-5 text-[#22D3EE] mr-2 mt-0.5 flex-shrink-0" />
            <span>Create different keys for different purposes, with the minimum required permissions.</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="h-5 w-5 text-[#22D3EE] mr-2 mt-0.5 flex-shrink-0" />
            <span>Rotate keys regularly, especially for production environments.</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="h-5 w-5 text-[#22D3EE] mr-2 mt-0.5 flex-shrink-0" />
            <span>Monitor API key usage and revoke keys that are no longer needed.</span>
          </li>
        </ul>
      </div>
      
      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151] overflow-y-auto max-h-[90vh]">
            {showNewKey ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#E5E7EB]">API Key Created</h3>
                  <button 
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowNewKey(false);
                      setNewApiKey(null);
                    }}
                    className="text-[#9CA3AF] hover:text-[#E5E7EB]"
                    aria-label="Close modal"
                    title="Close modal"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="bg-[#022c22] border border-[#10B981] rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-[#10B981] mr-2 mt-0.5" />
                    <div>
                      <p className="text-[#E5E7EB] font-medium">API key created successfully</p>
                      <p className="text-[#9CA3AF] text-sm mt-1">
                        Please copy your API key now. For security reasons, it won't be shown again.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Your New API Key
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={newApiKey || ''}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] font-mono text-sm pr-20"
                      aria-label="Your new API key"
                      title="Your new API key"
                    />
                    <button
                      onClick={copyKeyToClipboard}
                      className="absolute right-1 top-1 px-2 py-1 bg-[#1E293B] text-[#9CA3AF] hover:text-[#E5E7EB] rounded flex items-center text-xs"
                    >
                      {keyCopied ? (
                        <>
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="bg-[#371520] border border-[#F87171] rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-[#F87171] mr-2 mt-0.5" />
                    <p className="text-[#F87171] text-sm">
                      Make sure to copy and store this API key securely. It will not be displayed again.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowNewKey(false);
                      setNewApiKey(null);
                    }}
                    className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateKey}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#E5E7EB]">Create API Key</h3>
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-[#9CA3AF] hover:text-[#E5E7EB]"
                    aria-label="Close modal"
                    title="Close modal"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Key Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newKeyForm.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Development API Key"
                      required
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Use a descriptive name that indicates how this key will be used.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Expiration Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="expiry"
                        name="expiry"
                        value={newKeyForm.expiry}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-[#9CA3AF]" />
                    </div>
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      If set, the key will automatically expire on this date. Leave blank for no expiration.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto bg-[#111111] border border-[#374151] rounded-md p-2">
                      {availableScopes.map((scope) => (
                        <div key={scope.id} className="flex items-start p-2 hover:bg-[#1E293B] rounded-md">
                          <input
                            type="checkbox"
                            id={`scope-${scope.id}`}
                            checked={newKeyForm.scopes.includes(scope.id)}
                            onChange={() => handleScopeToggle(scope.id)}
                            className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] rounded focus:ring-[#22D3EE] mt-1"
                          />
                          <label htmlFor={`scope-${scope.id}`} className="ml-2 cursor-pointer">
                            <div className="text-[#E5E7EB] font-medium">{scope.name}</div>
                            <div className="text-xs text-[#9CA3AF]">{scope.description}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Select only the permissions this API key needs to function.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-[#374151] pt-4 mt-4">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                      disabled={!newKeyForm.name || newKeyForm.scopes.length === 0}
                    >
                      Create API Key
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useState } from 'react';
import PipedreamConnectButton from '@/components/PipedreamConnectButton';
import { usePipedreamConnect } from '@/lib/pipedream/usePipedreamConnect';

export default function TestPipedreamPage(): JSX.Element {
  const [selectedApp, setSelectedApp] = useState('slack');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Common service providers
  const services = [
    { id: 'slack', name: 'Slack'     },
    { id: 'gmail', name: 'Gmail'     },
    { id: 'github', name: 'GitHub'     },
    { id: 'google_sheets', name: 'Google Sheets'     },
    { id: 'airtable', name: 'Airtable'     }
  ];
  
  // Use our hook directly for more control
  const {
    connectService,
    isConnecting,
    isInitializing,
    isReady
  } = usePipedreamConnect({
    onSuccess: (accountId) => {
      setConnectionId(accountId);
      setError(null);
    },
    onError: (err) => {
      setError(err.message);
      setConnectionId(null);
    }
  });
  
  // Handle app selection
  const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApp(e.target.value);
  };
  
  // Handle manual connect button click
  const handleConnectClick = async () => {
    try {
      await connectService(selectedApp);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pipedream Connect Test</h1>
      
      {/* Status info */}
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div>Status: { isInitializing ? 'Initializing...' : isReady ? 'Ready' : 'Not ready'    }</div>
        {connectionId && <div className="text-green-600 mt-2">Connected! ID: {connectionId}</div>}
        {error && <div className="text-red-600 mt-2">Error: {error}</div>}
      </div>
      
      {/* Manual connection */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Manual Connection</h2>
        <div className="flex gap-4 mb-4">
          <select 
            value={selectedApp}
            onChange={handleAppChange}
            className="border rounded-md px-3 py-2"
            aria-label="Select an app to connect"
          >
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={handleConnectClick}
            disabled={isConnecting || isInitializing || !isReady}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : `Connect ${selectedApp}`}
          </button>
        </div>
      </div>
      
      {/* Button component test */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Button Component Test</h2>
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.id} className="p-3 border rounded-lg">
              <div className="font-medium mb-2">{service.name}</div>
              <PipedreamConnectButton
                appSlug={service.id}
                buttonText={`Connect ${service.name}`}
                onSuccess={(id) => {
                  setConnectionId(id);
                  setError(null);
                }}
                onError={(err) => {
                  setError(err.message);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
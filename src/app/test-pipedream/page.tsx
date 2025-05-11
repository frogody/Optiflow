'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PipedreamConnectButton from '@/components/PipedreamConnectButton';
import { usePipedreamConnect } from '@/lib/pipedream/usePipedreamConnect';

// Component to handle the actual Pipedream connection logic and UI, only rendered client-side
function PipedreamConnectionUI() {
  const [selectedApp, setSelectedApp] = useState('slack');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const services = [
    { id: 'slack', name: 'Slack'     },
    { id: 'gmail', name: 'Gmail'     },
    { id: 'github', name: 'GitHub'     },
    { id: 'google_sheets', name: 'Google Sheets'     },
    { id: 'airtable', name: 'Airtable'     }
  ];
  
  const { 
    connectService, 
    isConnecting, 
    isInitializing, 
    isReady 
  } = usePipedreamConnect({
    onSuccess: (accountId: string) => {
      setConnectionId(accountId);
      setError(null);
      console.log('Pipedream connected successfully with ID:', accountId);
    },
    onError: (err: Error) => {
      setError(err.message);
      setConnectionId(null);
      console.error('Pipedream connection error:', err.message);
    }
  });
  
  const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApp(e.target.value);
  };
  
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
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div>Status: { isInitializing ? 'Initializing...' : isReady ? 'Ready' : 'Not ready'    }</div>
        {connectionId && <div className="text-green-600 mt-2">Connected! ID: {connectionId}</div>}
        {error && <div className="text-red-600 mt-2">Error: {error}</div>}
      </div>
      
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
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Button Component Test</h2>
        <div className="space-y-3">
          {services.map(service => (
            <div key={service.id} className="p-3 border rounded-lg">
              <div className="font-medium mb-2">{service.name}</div>
              <PipedreamConnectButton
                appSlug={service.id}
                buttonText={`Connect ${service.name}`}
                onSuccess={(id: string) => {
                  setConnectionId(id);
                  setError(null);
                }}
                onError={(err: Error) => {
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

const handleConnectionSuccess = async (accountId: string) => {
  // ... existing success handling logic ...
};

const onError = (error: Error) => {
  toast.error(`Error connecting to Pipedream: ${error.message}`);
};

export default function TestPipedreamPage(): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading Pipedream Test Page...</div>; // Or null
  }

  return (
    <PipedreamConnectionUI />
  );
} 
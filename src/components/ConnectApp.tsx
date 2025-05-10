import { useState } from 'react';

import { usePipedream } from '@/hooks/usePipedream';

interface ConnectAppProps { appName: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
    }

export default function ConnectApp({ appName, onConnect, onDisconnect }: ConnectAppProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const { connect, disconnect, makeRequest, isConnecting, error } = usePipedream({ appName,
    autoConnect: false
      });

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await connect();
      onConnect?.();
    } catch (err) { console.error('Failed to connect:', err);
        } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      onDisconnect?.();
    } catch (err) { console.error('Failed to disconnect:', err);
        } finally {
      setIsLoading(false);
    }
  };

  const handleTestRequest = async () => {
    try { setIsLoading(true);
      // Example API request - adjust endpoint and method based on the app
      const response = await makeRequest('/test-endpoint', 'GET');
      console.log('API Response:', response);
        } catch (err) { console.error('API request failed:', err);
        } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Connect to {appName}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error.message}
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={handleConnect}
          disabled={isLoading || isConnecting}
          className={`px-4 py-2 rounded-full text-sm font-medium ${ isLoading || isConnecting
              ? 'bg-white/5 text-white/50 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
              }`}
        >
          { isConnecting ? 'Connecting...' : 'Connect'    }
        </button>
        
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/5"
        >
          Disconnect
        </button>
        
        <button
          onClick={handleTestRequest}
          disabled={isLoading}
          className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/5"
        >
          Test Connection
        </button>
      </div>
    </div>
  );
} 
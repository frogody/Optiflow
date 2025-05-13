import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isListening: boolean;
  isAgentSpeaking: boolean;
  roomName: string;
  error: string | null;
  isLoading: boolean;
}

const ConnectionDebugger: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isListening,
  isAgentSpeaking,
  roomName,
  error,
  isLoading,
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 w-full max-w-md text-sm">
      <h3 className="text-lg font-semibold mb-2 text-cyan-400">Connection Status</h3>
      
      <div className="space-y-2">
        <StatusItem 
          label="Room Connection" 
          status={isConnected ? 'connected' : (isLoading ? 'connecting' : 'disconnected')}
          details={roomName ? `Room: ${roomName}` : undefined}
        />
        
        <StatusItem 
          label="Microphone" 
          status={isListening ? 'active' : (isConnected ? 'inactive' : 'disconnected')}
          details={isListening ? "Capturing audio" : (isConnected ? "Permission granted but not capturing" : "Not connected")}
        />
        
        <StatusItem 
          label="Agent" 
          status={isAgentSpeaking ? 'speaking' : (isConnected ? 'listening' : 'disconnected')}
        />

        {error && (
          <div className="mt-3 p-2 bg-red-900/50 border border-red-800 rounded text-red-300">
            <div className="font-semibold">Error:</div>
            <div className="text-xs overflow-auto max-h-24">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  status: 'connected' | 'disconnected' | 'active' | 'inactive' | 'connecting' | 'speaking' | 'listening';
  details?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, status, details }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'speaking':
        return 'bg-green-500';
      case 'connecting':
      case 'listening':
        return 'bg-blue-500';
      case 'inactive':
        return 'bg-yellow-500';
      case 'disconnected':
      default:
        return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex items-center">
      <div className="mr-2 font-medium w-28 text-gray-300">{label}:</div>
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()} mr-2`}></div>
        <span className="text-gray-200">{getStatusText()}</span>
        {details && (
          <span className="ml-2 text-gray-400 text-xs">{details}</span>
        )}
      </div>
    </div>
  );
};

export default ConnectionDebugger; 
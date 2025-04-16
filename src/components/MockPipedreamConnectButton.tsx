import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MockPipedreamConnectButtonProps {
  appSlug: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * A mock button component that simulates Pipedream OAuth connections
 * for development and testing purposes
 */
export default function MockPipedreamConnectButton({
  appSlug,
  buttonText,
  className = '',
  onSuccess,
  onError
}: MockPipedreamConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Create default button text
  const defaultButtonText = `Connect ${appSlug}`;
  const displayText = buttonText || defaultButtonText;
  
  // Handle mock connection
  const handleConnect = () => {
    setIsConnecting(true);
    toast.success(`Connecting to ${appSlug}...`);
    
    // Simulate connection process with a delay
    setTimeout(() => {
      const mockAccountId = `mock-${appSlug}-${Date.now()}`;
      
      // Simulate occasional failures for testing
      const success = Math.random() > 0.1;
      
      if (success) {
        toast.success(`Successfully connected to ${appSlug}!`);
        if (onSuccess) onSuccess(mockAccountId);
      } else {
        const error = new Error(`Failed to connect to ${appSlug}`);
        toast.error(error.message);
        if (onError) onError(error);
      }
      
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`
        w-full px-4 py-2 rounded-lg font-medium
        bg-gradient-to-r from-primary to-secondary
        hover:from-primary/90 hover:to-secondary/90
        text-dark-50 dark:text-white
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 ease-in-out
        shadow-neon hover:shadow-neon-strong
        ${className}
      `}
    >
      {isConnecting ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
          Connecting...
        </div>
      ) : (
        displayText
      )}
    </button>
  );
}

import React from 'react';
import { usePipedreamConnect } from '@/lib/pipedream/usePipedreamConnect';

interface PipedreamConnectButtonProps {
  appSlug: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * A simple button component that handles Pipedream OAuth connections
 * using the usePipedreamConnect hook
 */
export default function PipedreamConnectButton({
  appSlug,
  buttonText,
  className = '',
  onSuccess,
  onError
}: PipedreamConnectButtonProps) {
  // Get OAuth App ID from environment
  const oauthAppId = process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID;
  
  // Use the Pipedream connect hook
  const { connectService, isConnecting, isInitializing, isReady } = usePipedreamConnect({
    onSuccess,
    onError
  });
  
  // Create default button text
  const defaultButtonText = `Connect ${appSlug}`;
  const displayText = buttonText || defaultButtonText;
  
  // Handle button click
  const handleConnect = () => {
    connectService(appSlug, oauthAppId);
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || isInitializing || !isReady}
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
      ) : isInitializing ? (
        <div className="flex items-center justify-center">
          <div className="animate-pulse h-5 w-5 mr-2 bg-white rounded-full opacity-75" />
          Initializing...
        </div>
      ) : (
        displayText
      )}
    </button>
  );
} 
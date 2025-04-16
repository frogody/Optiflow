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
      className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 ${className}`}
    >
      {isConnecting ? 'Connecting...' : isInitializing ? 'Initializing...' : displayText}
    </button>
  );
} 
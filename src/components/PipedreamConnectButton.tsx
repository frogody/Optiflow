import React, { useState, useEffect } from 'react';
import { usePipedreamConnect } from '@/lib/pipedream/usePipedreamConnect';
import { toast } from 'react-hot-toast';

interface PipedreamConnectButtonProps {
  appSlug: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
  retryOnError?: boolean;
}

// For development, in case the env variable is missing or malformed
const FALLBACK_CLIENT_ID = 'kWYR9dn6Vmk7MnLuVfoXx4jsedOcp83vBg6st3rWuiM';

/**
 * A button component that handles Pipedream OAuth connections
 * using the usePipedreamConnect hook with improved error handling
 */
export default function PipedreamConnectButton({
  appSlug,
  buttonText,
  className = '',
  onSuccess,
  onError,
  retryOnError = false
}: PipedreamConnectButtonProps) {
  // Get OAuth App ID from environment and ensure it's properly formatted
  const envClientId = process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID?.trim();
  const oauthAppId = envClientId || FALLBACK_CLIENT_ID;
  const [hasErrored, setHasErrored] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isDirectConnecting, setIsDirectConnecting] = useState(false);
  
  // Use the Pipedream connect hook
  const { 
    connectService, 
    isConnecting, 
    isInitializing, 
    isReady,
    error 
  } = usePipedreamConnect({
    onSuccess,
    onError: (err) => {
      setHasErrored(true);
      if (onError) onError(err);
    }
  });
  
  // Create default button text
  const defaultButtonText = `Connect ${appSlug}`;
  const displayText = buttonText || defaultButtonText;

  // Effect to handle automatic retry on error
  useEffect(() => {
    if (retryOnError && hasErrored && retryCount < 2) {
      const timer = setTimeout(() => {
        setRetryCount(count => count + 1);
        setHasErrored(false);
        toast.info(`Retrying connection to ${appSlug}...`);
        handleConnect();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasErrored, retryCount, retryOnError, appSlug]);
  
  // Handle button click
  const handleConnect = async () => {
    if (!oauthAppId) {
      console.error('Missing OAuth App ID. Check your environment variables.');
      toast.error('Configuration error. Please contact support.');
      return;
    }
    
    let validatedSlug = appSlug;
    if (typeof validatedSlug !== 'string' || !validatedSlug) {
      console.warn(`Invalid app slug: ${validatedSlug}, using "generic" instead`);
      validatedSlug = 'generic';
    }
    
    validatedSlug = validatedSlug.replace(/[^\w-]/g, '');
    
    setHasErrored(false);
    
    // Temporarily bypass the /api/pipedream/test call to unblock main flow testing
    console.log('Bypassing /api/pipedream/test for now. Proceeding with connectService.');
    connectService(validatedSlug, oauthAppId);

    /* Original code with /api/pipedream/test call:
    // First try the direct test endpoint to check for server-side issues
    try {
      setIsDirectConnecting(true);
      const response = await fetch('/api/pipedream/test');
      const data = await response.json();
      
      if (data.status !== 'success') {
        console.error('Pipedream test failed:', data);
        toast.error('Server configuration issue. Please try again later.');
        setHasErrored(true);
        setIsDirectConnecting(false);
        return;
      }
      
      setIsDirectConnecting(false);
      // If test passes, proceed with normal connection
      connectService(validatedSlug, oauthAppId);
    } catch (err) {
      console.error('Error testing Pipedream connection:', err);
      setIsDirectConnecting(false);
      // Fall back to direct connection attempt
      connectService(validatedSlug, oauthAppId);
    }
    */
  };

  // Display error message if max retries exceeded
  useEffect(() => {
    if (retryOnError && hasErrored && retryCount >= 2) {
      toast.error(`Connection to ${appSlug} failed after multiple attempts. Please try again later.`);
    }
  }, [hasErrored, retryCount, retryOnError, appSlug]);

  // Check for configuration issues
  useEffect(() => {
    if (!oauthAppId) {
      console.warn('NEXT_PUBLIC_PIPEDREAM_CLIENT_ID is not set in environment variables');
    }
  }, [oauthAppId]);

  return (
    <div className="flex flex-col">
      <button
        onClick={handleConnect}
        disabled={isConnecting || isInitializing || !isReady || isDirectConnecting || (hasErrored && retryOnError && retryCount < 2)}
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
        {isConnecting || isDirectConnecting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
            {isDirectConnecting ? 'Testing connection...' : 'Connecting...'}
          </div>
        ) : isInitializing ? (
          <div className="flex items-center justify-center">
            <div className="animate-pulse h-5 w-5 mr-2 bg-white rounded-full opacity-75" />
            Initializing...
          </div>
        ) : hasErrored && retryOnError && retryCount < 2 ? (
          <div className="flex items-center justify-center">
            <div className="animate-pulse h-5 w-5 mr-2 bg-red-500 rounded-full" />
            Retrying...
          </div>
        ) : hasErrored && (!retryOnError || retryCount >= 2) ? (
          <div className="flex items-center justify-center">
            <div className="h-5 w-5 mr-2 bg-red-500 rounded-full" />
            Try Again
          </div>
        ) : (
          displayText
        )}
      </button>
      {error && (!retryOnError || retryCount >= 2) && (
        <div className="text-red-500 text-sm mt-1">
          {error.message.includes('Failed to fetch') 
            ? 'Network error. Please check your connection.' 
            : error.message.includes('string did not match')
            ? 'Configuration error. Please contact support.'
            : error.message.includes('ran out of attempts')
            ? 'OAuth error. Please try again later or contact support.'
            : 'Connection failed. Please try again later.'}
        </div>
      )}
    </div>
  );
} 
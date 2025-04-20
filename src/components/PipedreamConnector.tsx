'use client';

import { useState, useEffect } from 'react';
import { createFrontendClient } from '@pipedream/sdk/browser';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/lib/userStore';

interface PipedreamConnectorProps {
  appName: string;
  className?: string;
  buttonText?: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
}

export default function PipedreamConnector({
  appName,
  className = '',
  buttonText = `Connect ${appName}`,
  onSuccess,
  onError
}: PipedreamConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [pdClient, setPdClient] = useState<any>(null);
  const { currentUser } = useUserStore();
  const userId = currentUser?.id || '';

  useEffect(() => {
    // Initialize the Pipedream client
    const origin = window.location.origin;
    try {
      const pd = createFrontendClient({
        frontendHost: process.env.NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST || 'pipedream.com'
      });
      console.log('Pipedream client initialized successfully');
      setPdClient(pd);
    } catch (error) {
      console.error('Error initializing Pipedream client:', error);
      toast.error('Failed to initialize Pipedream connection');
    }
  }, []);

  // Check if a connection was successful on component mount
  // This handles redirects back from OAuth flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connection = params.get('connection');
    const appParam = params.get('app');
    
    if (connection === 'success' && appParam && appParam.toLowerCase() === appName.toLowerCase()) {
      toast.success(`Successfully connected to ${appName}!`);
      
      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('connection');
      url.searchParams.delete('app');
      window.history.replaceState({}, document.title, url.toString());
      
      // Trigger success callback with a mock ID
      if (onSuccess) {
        onSuccess(`${appName.toLowerCase()}-${Date.now()}`);
      }
    } else if (connection === 'error' && appParam && appParam.toLowerCase() === appName.toLowerCase()) {
      toast.error(`Failed to connect to ${appName}`);
      
      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('connection');
      url.searchParams.delete('app');
      url.searchParams.delete('reason');
      window.history.replaceState({}, document.title, url.toString());
      
      // Trigger error callback
      if (onError) {
        onError(new Error(`Failed to connect to ${appName}`));
      }
    }
  }, [appName, onSuccess, onError]);

  const handleConnect = async () => {
    if (!pdClient) {
      toast.error('Pipedream client not initialized');
      return;
    }
    
    if (!userId) {
      toast.error('User not logged in');
      return;
    }
    
    setIsConnecting(true);
    try {
      // Current URL to redirect back to
      const returnUrl = window.location.pathname + window.location.search;
      
      // State to pass through the OAuth flow
      const state = JSON.stringify({
        appId: appName.toLowerCase(),
        userId,
        returnUrl
      });
      
      console.log('Connecting to Pipedream with client ID:', process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID);
      
      await pdClient.connectAccount({
        app: appName.toLowerCase(),
        token: process.env.NEXT_PUBLIC_PIPEDREAM_TOKEN || '',
        redirectUri: `${window.location.origin}/api/oauth/callback`,
        oauthAppId: process.env.NEXT_PUBLIC_PIPEDREAM_CLIENT_ID || '',
        state,
        onSuccess: ({ id }: { id: string }) => {
          setIsConnecting(false);
          console.log(`Account connection initiated: ${id}`);
        }
      });
    } catch (error) {
      setIsConnecting(false);
      console.error('Error connecting account:', error);
      toast.error(`Error connecting to ${appName}`);
      if (onError && error instanceof Error) onError(error);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || !pdClient}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 ${className}`}
    >
      {isConnecting ? 'Connecting...' : buttonText}
    </button>
  );
} 
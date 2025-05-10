'use client';

import { createFrontendClient } from '@pipedream/sdk/browser';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { getAppInfo, serverConnectTokenCreate } from '@/lib/pipedream/server';
import { useUserStore } from '@/lib/userStore';


export interface ConnectResult { id: string;
    }

interface PipedreamManagedConnectorProps { appSlug: string;
  onSuccess?: (accountId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  buttonText?: string;
  oauthAppId?: string;
    }

export default function PipedreamManagedConnector(props: PipedreamManagedConnectorProps) {
  const { appSlug, onSuccess, onError, className, buttonText, oauthAppId } = props;
  const { currentUser } = useUserStore();
  const userId = currentUser?.id || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [pdClient, setPdClient] = useState<any>(null);
  const [appInfo, setAppInfo] = useState<any>(null);
  const [customButtonText, setCustomButtonText] = useState(buttonText || '');

  // Initialize the Pipedream frontend client
  useEffect(() => {
    async function loadClient() {
      try {
        const { createFrontendClient } = await import('@pipedream/sdk/browser');
        setPdClient(createFrontendClient());
      } catch (error) { console.error('Error initializing Pipedream client:', error);
        if (onError) onError(new Error('Failed to initialize Pipedream client'));
          }
    }
    loadClient();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Get app info when app slug changes
  useEffect(() => {
    if (!appSlug) return;

    async function fetchAppInfo() {
      try {
        setIsLoading(true);
        const info = await getAppInfo(appSlug);
        setAppInfo(info);
        
        // Set default button text if not provided
        if (!buttonText) {
          setCustomButtonText(`Connect ${info.display_name || appSlug}`);
        }
      } catch (error) {
        console.error(`Error fetching app info for ${appSlug}:`, error);
        if (onError) onError(new Error(`Failed to get information for ${appSlug}`));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppInfo();
  }, [appSlug, buttonText]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get a token for the current user
  useEffect(() => {
    if (!userId) return;

    async function createToken() {
      try {
        setIsLoading(true);
        const { token } = await serverConnectTokenCreate({ external_user_id: userId,
            });
        setToken(token);
      } catch (error) { console.error('Error creating token:', error);
        if (onError) onError(new Error('Failed to create authentication token'));
          } finally {
        setIsLoading(false);
      }
    }

    createToken();
  }, [userId, onError]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleConnect = async () => {
    if (!pdClient || !token || !appSlug) { toast.error('Unable to connect: client not initialized or missing token');
      return;
        }

    try {
      setIsLoading(true);
      
      // Prepare connect config
      const connectConfig: any = {
        app: appSlug,
        token,
        onSuccess: ({ id }: ConnectResult) => {
          setIsLoading(false);
          toast.success(`Successfully connected ${appInfo?.display_name || appSlug}`);
          if (onSuccess) onSuccess(id);
        }
      };

      // Add OAuth app ID if provided
      if (oauthAppId) {
        connectConfig.oauthAppId = oauthAppId;
      }

      // Launch Pipedream Connect flow
      await pdClient.connectAccount(connectConfig);
    } catch (error) {
      setIsLoading(false);
      console.error('Error connecting account:', error);
      toast.error(`Error connecting to ${appInfo?.display_name || appSlug}`);
      if (onError && error instanceof Error) onError(error);
    }
  };

  // Determine button disabled state
  const isDisabled = isLoading || !pdClient || !token || !appSlug;

  return (
    <button
      onClick={handleConnect}
      disabled={isDisabled}
      className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 ${className}`}
    >
      { isLoading ? 'Connecting...' : customButtonText    }
    </button>
  );
} 
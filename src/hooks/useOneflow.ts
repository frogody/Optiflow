import { useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/lib/userStore';
import { toast } from 'react-hot-toast';

interface UseOneflowOptions {
  autoConnect?: boolean;
}

type ConnectionStatus = 'connected' | 'disconnected' | 'error';

interface OneflowCredentials {
  apiKey: string;
  accountId: string;
}

// Safe localStorage wrapper
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Failed to write to localStorage:', e);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  }
};

export function useOneflow({ autoConnect = false }: UseOneflowOptions = {}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [credentials, setCredentials] = useState<OneflowCredentials | null>(null);
  const { currentUser } = useUserStore();

  // Base URL for Oneflow API
  const baseUrl = 'https://api.oneflow.com/v1';

  // Load saved credentials on mount
  useEffect(() => {
    const savedCredentials = safeStorage.getItem('oneflow_credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        setCredentials(parsed);
        setConnectionStatus('connected');
        if (autoConnect) {
          testConnection(parsed.apiKey, parsed.accountId).catch(() => {
            setConnectionStatus('error');
            setCredentials(null);
            safeStorage.removeItem('oneflow_credentials');
          });
        }
      } catch (e) {
        console.warn('Failed to parse saved credentials:', e);
        safeStorage.removeItem('oneflow_credentials');
      }
    }
  }, [autoConnect]);

  // Function to test credentials by making a simple API call
  const testConnection = useCallback(async (apiKey: string, accountId: string): Promise<boolean> => {
    try {
      // Make a simple API call to verify credentials
      const response = await fetch(`${baseUrl}/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Connection failed: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (err) {
      console.error('Error testing Oneflow connection:', err);
      throw err;
    }
  }, []);

  // Function to connect to Oneflow
  const connect = useCallback(async (apiKey: string, accountId: string) => {
    if (!currentUser) {
      const error = new Error('User must be logged in to connect to Oneflow');
      setError(error);
      toast.error(error.message);
      return false;
    }

    if (!apiKey || !accountId) {
      const error = new Error('API Key and Account ID are required');
      setError(error);
      toast.error(error.message);
      return false;
    }

    try {
      setIsConnecting(true);
      setError(null);
      
      // Test the connection
      await testConnection(apiKey, accountId);
      
      // Store credentials
      const newCredentials = { apiKey, accountId };
      setCredentials(newCredentials);
      setConnectionStatus('connected');
      
      // Save to storage using safe wrapper
      safeStorage.setItem('oneflow_credentials', JSON.stringify(newCredentials));
      
      toast.success('Connected to Oneflow successfully!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Oneflow';
      setError(new Error(errorMessage));
      setConnectionStatus('error');
      toast.error(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [currentUser, testConnection]);

  // Function to disconnect from Oneflow
  const disconnect = useCallback(async () => {
    try {
      setCredentials(null);
      setConnectionStatus('disconnected');
      safeStorage.removeItem('oneflow_credentials');
      
      toast.success('Disconnected from Oneflow successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect from Oneflow';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Function to close a contract in Oneflow
  const closeContract = useCallback(async (contractId: string, closeReason?: string) => {
    if (!credentials) {
      const error = new Error('Not connected to Oneflow');
      setError(error);
      toast.error(error.message);
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // Make API call to close the contract
      const response = await fetch(`${baseUrl}/contracts/${contractId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: closeReason || 'Closed via integration'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to close contract: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(`Contract ${contractId} closed successfully`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error closing contract';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [credentials]);

  // Function to list contracts
  const listContracts = useCallback(async (params?: { status?: string, limit?: number, offset?: number }) => {
    if (!credentials) {
      const error = new Error('Not connected to Oneflow');
      setError(error);
      toast.error(error.message);
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      
      // Make API call to list contracts
      const response = await fetch(`${baseUrl}/contracts?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to list contracts: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error listing contracts';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [credentials]);

  return {
    connect,
    disconnect,
    closeContract,
    listContracts,
    isConnecting,
    isProcessing,
    connectionStatus,
    error
  };
} 
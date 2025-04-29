import React, { useState } from 'react';
import { connectAccount } from '@pipedream/sdk';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';

interface PipedreamConnectProps {
  onSuccess?: (connection: any) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const PipedreamConnect: React.FC<PipedreamConnectProps> = ({
  onSuccess,
  onError,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/pipedream/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch connect token');
      }

      const { token } = await response.json();

      if (!token) {
        throw new Error('Connect token not received');
      }

      connectAccount({
        token,
        onSuccess: (connection) => {
          toast.success('Account connected successfully!');
          onSuccess?.(connection);
          setIsLoading(false);
        },
        onClose: () => {
          setIsLoading(false);
        },
        onError: (errorData) => {
          console.error('Connect flow error:', errorData);
          toast.error('Failed to connect account. Please try again.');
          onError?.(new Error(errorData.message || 'Connection failed'));
          setIsLoading(false);
        },
      });
    } catch (err) {
      console.error('Error during connect process:', err);
      toast.error('An unexpected error occurred');
      onError?.(err as Error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Connecting...
        </>
      ) : (
        'Connect Account via Pipedream'
      )}
    </button>
  );
}; 
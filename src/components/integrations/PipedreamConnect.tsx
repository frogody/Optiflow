import React, { useState } from 'react';
import { connectAccount } from '@pipedream/sdk';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { useSession, signIn } from 'next-auth/react';

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
  const { data: session, status } = useSession();

  const handleConnect = async () => {
    // Check if user is authenticated
    if (!session) {
      toast.error('Please sign in to connect your Pipedream account');
      signIn();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/pipedream/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch connect token');
      }

      const { token, connect_link_url } = await response.json();

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
          toast.error('Connection cancelled');
        },
        onError: (errorData) => {
          console.error('Connect flow error:', errorData);
          toast.error(errorData.message || 'Failed to connect account. Please try again.');
          onError?.(new Error(errorData.message || 'Connection failed'));
          setIsLoading(false);
        },
      });
    } catch (err) {
      console.error('Error during connect process:', err);
      toast.error(err instanceof Error ? err.message : 'An unexpected error occurred');
      onError?.(err instanceof Error ? err : new Error('Connection failed'));
      setIsLoading(false);
    }
  };

  // Show loading state if session is loading
  if (status === 'loading') {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 opacity-50 cursor-not-allowed ${className}`}
      >
        <Spinner size="sm" className="mr-2" />
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading || !session}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-2" />
          Connecting...
        </>
      ) : !session ? (
        'Sign in to Connect'
      ) : (
        'Connect Account via Pipedream'
      )}
    </button>
  );
}; 
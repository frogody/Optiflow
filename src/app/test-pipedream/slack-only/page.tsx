"use client";


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import { useState } from 'react';

import PipedreamConnectButton from '@/components/PipedreamConnectButton';

export default function SlackOnlyPipedreamTest() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Test Slack Pipedream Connect</h1>
      <PipedreamConnectButton
        appSlug="slack"
        buttonText="Connect Slack"
        onSuccess={(id) => {
          setConnectionId(id);
          setError(null);
        }}
        onError={(err) => {
          setError(err.message);
        }}
      />
      {connectionId && (
        <div className="text-green-600 mt-4">Connected! ID: {connectionId}</div>
      )}
      {error && (
        <div className="text-red-600 mt-4">Error: {error}</div>
      )}
    </div>
  );
} 
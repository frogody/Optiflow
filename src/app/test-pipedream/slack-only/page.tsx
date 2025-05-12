"use client";


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useState } from 'react';

import PipedreamConnectButton from '@/components/PipedreamConnectButton';

export default function SlackOnlyPipedreamTest(): JSX.Element {
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import SlackConnector from '@/components/SlackConnector';

export default function SlackIntegrationPage(): JSX.Element {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountConnected = () => {
    toast.success('Slack connected successfully!');
    // In a real app, you would save this connection to your backend
    savingConnectionDemo();
  };

  const handleConnectionError = (error: Error) => {
    toast.error(`Error connecting to Slack: ${error.message}`);
  };
  
  // Demo function to simulate saving connection to backend
  const savingConnectionDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Connection saved to your account');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Slack Integration</h1>
      <p className="text-gray-500 mb-8">Connect your Slack workspace to enable automated workflows</p>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Connect Your Slack Workspace</h2>
        
        {!connectedAccount ? (
          <div className="space-y-6">
            <p className="text-gray-600">
              Connecting your Slack workspace allows Optiflow to send messages, create channels, 
              and interact with your team on your behalf. 
            </p>
            
            <div className="flex justify-center">
              <SlackConnector 
                onSuccess={handleAccountConnected}
                onError={handleConnectionError}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Connection successful</h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>Your Slack workspace is connected! (Account ID: {connectedAccount})</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-pulse text-blue-600">Saving connection...</div>
              </div>
            ) : (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setConnectedAccount(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Disconnect
                </button>
                <Link
                  href="/workflows/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Create Workflow
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-medium mb-3">What you can do with Slack integration:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Send automated messages to channels or users</li>
          <li>Create new channels programmatically</li>
          <li>Respond to Slack events (messages, reactions, etc.)</li>
          <li>Build custom Slack bots</li>
          <li>Set up notifications from other services</li>
        </ul>
      </div>
    </div>
  );
} 
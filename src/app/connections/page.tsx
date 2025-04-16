'use client';

import { useState } from 'react';
import PipedreamConnectButton from '@/components/PipedreamConnectButton';
import { getUserAccounts } from '@/lib/pipedream/server';
import { useUserStore } from '@/lib/userStore';
import { useEffect } from 'react';

export default function ConnectionsPage() {
  const { currentUser } = useUserStore();
  const userId = currentUser?.id || '';
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const commonApps = [
    { slug: 'slack', name: 'Slack' },
    { slug: 'gmail', name: 'Gmail' },
    { slug: 'github', name: 'GitHub' },
    { slug: 'google_sheets', name: 'Google Sheets' },
    { slug: 'airtable', name: 'Airtable' },
    { slug: 'stripe', name: 'Stripe' }
  ];

  // Load user connections
  useEffect(() => {
    if (!userId) return;

    async function loadConnections() {
      try {
        setIsLoading(true);
        const accounts = await getUserAccounts(userId);
        setConnections(accounts.data || []);
      } catch (error) {
        console.error('Error loading connections:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConnections();
  }, [userId]);

  const handleConnectionSuccess = async (accountId: string) => {
    // Refresh connections after successful connection
    if (!userId) return;
    
    try {
      const accounts = await getUserAccounts(userId);
      setConnections(accounts.data || []);
    } catch (error) {
      console.error('Error refreshing connections:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Connect Your Services</h1>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Connected Accounts</h2>
            {connections.length > 0 ? (
              <ul className="space-y-2">
                {connections.map((connection) => (
                  <li key={connection.id} className="flex items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">{connection.app_name || connection.app}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Connected</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No connected accounts yet. Connect your first service below.</p>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Available Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commonApps.map((app) => (
                <div key={app.slug} className="border p-4 rounded-lg flex flex-col items-center">
                  <h3 className="font-medium mb-2">{app.name}</h3>
                  <PipedreamConnectButton
                    appSlug={app.slug}
                    buttonText={`Connect ${app.name}`}
                    className="mt-2 w-full"
                    onSuccess={handleConnectionSuccess}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 
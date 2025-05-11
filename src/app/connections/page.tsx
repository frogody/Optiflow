'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PipedreamConnectButton from '../../components/PipedreamConnectButton';
import { useUserStore } from '../../lib/userStore';

// Define a more specific type for the setConnections function
interface Connection {
  id: string;
  app: string;
  app_name: string;
  created_at: string;
  updated_at: string;
}

interface CommonApp {
  slug: string;
  name: string;
}

const handleConnectionSuccess = async (
  accountId: string,
  userId: string,
  connections: Connection[],
  setConnections: (connections: Connection[]) => void,
  commonApps: CommonApp[],
) => {
  // For development, store in localStorage
  if (!userId) return;

  try {
    // Find the app that was just connected
    const [, appSlugRaw] = accountId.split('-');
    const appSlug = appSlugRaw ?? '';
    const app = commonApps.find((a) => a.slug === appSlug);

    if (!app) return;

    // Create a mock connection record
    const newConnection: Connection = {
      id: accountId,
      app: appSlug,
      app_name: app.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to state
    const updatedConnections = [...connections, newConnection];
    setConnections(updatedConnections);

    // Save to localStorage
    localStorage.setItem(`mock_connections_${userId}`, JSON.stringify(updatedConnections));

    toast.success(`Successfully connected to ${app.name}!`);
  } catch (error) {
    console.error('Error saving mock connection:', error);
    toast.error('Failed to save connection');
  }
};

const onError = (error: Error) => {
  toast.error(`Error connecting to Pipedream: ${error.message}`);
};

export default function ConnectionsPage(): JSX.Element {
  const { currentUser } = useUserStore();
  const userId = currentUser?.id ?? '';
  const [connections, setConnections] = useState<Connection[]>([]);

  const commonApps: CommonApp[] = [
    { slug: 'slack', name: 'Slack' },
    { slug: 'gmail', name: 'Gmail' },
    { slug: 'github', name: 'GitHub' },
    { slug: 'google_sheets', name: 'Google Sheets' },
    { slug: 'airtable', name: 'Airtable' },
    { slug: 'stripe', name: 'Stripe' },
  ];

  // Use local storage for development to store mock connections
  useEffect(() => {
    if (!userId) return;

    const loadMockConnections = () => {
      try {
        const stored = localStorage.getItem(`mock_connections_${userId}`);
        if (stored) {
          setConnections(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading mock connections:', error);
      }
    };

    loadMockConnections();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-dark-50 dark:text-white">
        Connect Your Services
      </h1>

      {/* Loading state removed as isLoading is unused */}

      <div className="bg-white dark:bg-dark-50 shadow-lg dark:shadow-neon rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-dark-50 dark:text-white">
          Your Connected Accounts
        </h2>
        {connections.length > 0 ? (
          <ul className="space-y-4">
            {connections.map((connection) => (
              <li
                key={connection.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-100 rounded-lg border border-gray-100 dark:border-dark-200"
              >
                <div className="flex items-center">
                  <span className="font-medium text-dark-50 dark:text-white">
                    {connection.app_name || connection.app}
                  </span>
                </div>
                <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full font-medium">
                  Connected
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No connected accounts yet. Connect your first service below.
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-dark-50 shadow-lg dark:shadow-neon rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-dark-50 dark:text-white">
          Available Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonApps.map((app) => (
            <div
              key={app.slug}
              className="border dark:border-dark-200 p-6 rounded-xl bg-gray-50 dark:bg-dark-100 flex flex-col items-center hover:shadow-lg dark:hover:shadow-neon transition-all duration-200"
            >
              <h3 className="text-lg font-semibold mb-4 text-dark-50 dark:text-white">
                {app.name}
              </h3>
              <PipedreamConnectButton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PipedreamConnectButton from '../../components/PipedreamConnectButton';
import { getUserAccounts } from '../../lib/pipedream/server';
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
  if (!userId) return;

  try {
    // Find the app that was just connected
    const [, appSlugRaw] = accountId.split('-');
    const appSlug = appSlugRaw ?? '';
    const app = commonApps.find((a) => a.slug === appSlug);
    if (!app) return;

    // Call backend to add a new connection
    const response = await fetch('/api/livekit/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        app: appSlug,
        app_name: app.name,
      }),
    });
    if (!response.ok) throw new Error('Failed to add connection');
    const newConnection = await response.json();
    setConnections([...connections, newConnection]);
    toast.success(`Successfully connected to ${app.name}!`);
  } catch (error) {
    console.error('Error saving connection:', error);
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
  const [accountStatuses, setAccountStatuses] = useState<Record<string, any>>({});
  const [loadingStatus, setLoadingStatus] = useState(false);

  const commonApps: CommonApp[] = [
    { slug: 'hubspot', name: 'Hubspot' },
    { slug: 'salesforce', name: 'Salesforce' },
    { slug: 'zoho_crm', name: 'ZohoCRM' },
    { slug: 'pipedrive', name: 'Pipedrive' },
    { slug: 'notion', name: 'Notion' },
    { slug: 'slack', name: 'Slack' },
    { slug: 'microsoft_teams', name: 'Microsoft Teams' },
    { slug: 'google_drive', name: 'Google Drive' },
    { slug: 'gmail', name: 'Gmail' },
    { slug: 'outlook', name: 'Outlook' },
    { slug: 'one_drive', name: 'One Drive' },
    { slug: 'google_sheets', name: 'Google Sheets' },
    { slug: 'google_calendar', name: 'Google Calendar' },
    { slug: 'outlook_calendar', name: 'Outlook Calendar' },
    { slug: 'google_forms', name: 'Google Forms' },
    { slug: 'trello', name: 'Trello' },
    { slug: 'google', name: 'Google' },
    { slug: 'jira', name: 'Jira' },
    { slug: 'mailchimp', name: 'Mailchimp' },
    { slug: 'linkedin', name: 'LinkedIn' },
    { slug: 'activecampaign', name: 'ActiveCampaign' },
    { slug: 'slack_bot', name: 'Slack Bot' },
    { slug: 'calendly', name: 'Calendly' },
    { slug: 'monday', name: 'Monday' },
    { slug: 'people_data_labs', name: 'People Data Labs' },
    { slug: 'figma', name: 'Figma' },
    { slug: 'microsoft_dynamics_365', name: 'Microsoft Dynamics 365' },
    { slug: 'product_hunt', name: 'Product Hunt' },
    { slug: 'whatsapp_business', name: 'Whatsapp Business' },
    { slug: 'clearbit', name: 'Clearbit' },
    { slug: 'zoho_mail', name: 'Zoho Mail' },
    { slug: 'invoice_ninja', name: 'Invoice Ninja' },
    { slug: 'rocket_reach', name: 'Rocket Reach' },
  ];

  // Use local storage for development to store mock connections
  useEffect(() => {
    if (!userId) return;
    const fetchConnections = async () => {
      try {
        const response = await fetch(`/api/livekit/connections?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch connections');
        const data = await response.json();
        setConnections(data);
      } catch (error) {
        console.error('Error loading connections:', error);
      }
    };
    fetchConnections();
  }, [userId]);

  // Fetch Pipedream account statuses for richer info
  useEffect(() => {
    if (!userId) return;
    setLoadingStatus(true);
    getUserAccounts(userId)
      .then((accounts) => {
        let accountList: any[] = [];
        if (Array.isArray(accounts)) {
          accountList = accounts;
        } else if (accounts && Array.isArray(accounts.data)) {
          accountList = accounts.data;
        } else if (accounts && typeof accounts === 'object') {
          accountList = Object.values(accounts).flat().filter(Boolean);
        }
        const statusMap: Record<string, any> = {};
        for (const acc of accountList) {
          statusMap[acc.app] = acc;
        }
        setAccountStatuses(statusMap);
      })
      .catch((err) => {
        console.error('Failed to fetch Pipedream account statuses:', err);
      })
      .finally(() => setLoadingStatus(false));
  }, [userId, connections]);

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
        {loadingStatus ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading account statuses...</div>
        ) : connections.length > 0 ? (
          <ul className="space-y-4">
            {connections.map((connection) => {
              const status = accountStatuses[connection.app] || {};
              let statusLabel = 'Connected';
              let statusColor = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
              let errorMsg = '';
              let needsReauth = false;
              if (status.error) {
                statusLabel = 'Error';
                statusColor = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
                errorMsg = status.error;
                needsReauth = true;
              } else if (status.status && status.status !== 'connected') {
                statusLabel = status.status;
                statusColor = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100';
                if (status.status === 'needs_reauth' || status.status === 'expired') {
                  needsReauth = true;
                }
              }
              return (
                <li
                  key={connection.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-100 rounded-lg border border-gray-100 dark:border-dark-200"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-dark-50 dark:text-white">
                      {connection.app_name || connection.app}
                    </span>
                    {status.lastConnected && (
                      <span className="text-xs text-gray-400 mt-1">
                        Last connected: {new Date(status.lastConnected).toLocaleString()}
                      </span>
                    )}
                    {errorMsg && (
                      <span className="text-xs text-red-500 mt-1">{errorMsg}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${statusColor}`}>
                      {statusLabel}
                    </span>
                    {needsReauth && (
                      <button
                        className="ml-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                        onClick={() => {
                          // TODO: Implement re-auth flow (e.g., open connect modal)
                          toast('Re-authenticate flow coming soon!');
                        }}
                      >
                        Reconnect
                      </button>
                    )}
                    <button
                      className="ml-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full font-medium hover:bg-red-200 dark:hover:bg-red-800 transition"
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/connections', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: connection.id }),
                          });
                          if (!res.ok) throw new Error('Failed to disconnect');
                          setConnections(connections.filter((c) => c.id !== connection.id));
                          toast.success(`Disconnected from ${connection.app_name || connection.app}`);
                        } catch (err) {
                          toast.error('Failed to disconnect');
                        }
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                </li>
              );
            })}
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
              <PipedreamConnectButton
                appSlug={app.slug}
                onSuccess={(accountId: string) =>
                  handleConnectionSuccess(accountId, userId, connections, setConnections, commonApps)
                }
                onError={onError}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
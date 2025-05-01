'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Account Settings - Optiflow',
  description: 'Manage your account preferences and security settings',
};

export default function AccountSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    workflow_updates: true,
    security_alerts: true,
    newsletter: false,
    marketing: false,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Preferences */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Preferences</h2>
          <div className="space-y-4">
            {Object.entries(emailNotifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {key.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getNotificationDescription(key)}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onChange={(value) => setEmailNotifications(prev => ({ ...prev, [key]: value }))}
                  className={cn(
                    enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                  )}
                >
                  <span
                    className={cn(
                      enabled ? 'translate-x-5' : 'translate-x-0',
                      'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>
            ))}
          </div>
        </section>

        {/* Security Settings */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Settings</h2>
          
          {/* Two-Factor Authentication */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onChange={setTwoFactorEnabled}
                className={cn(
                  twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                )}
              >
                <span
                  className={cn(
                    twoFactorEnabled ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                  )}
                />
              </Switch>
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Two-factor authentication is enabled. Use an authenticator app to generate codes.
                </p>
              </div>
            )}
          </div>

          {/* Session Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Session Timeout</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Choose how long you want to stay logged in
            </p>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
        </section>

        {/* Connected Accounts */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Connected Accounts</h2>
          <div className="space-y-4">
            {connectedAccounts.map((account) => (
              <div key={account.name} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-center">
                  <account.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{account.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{account.status}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={cn(
                    account.connected
                      ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                      : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
                    'text-sm font-medium'
                  )}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    workflow_updates: 'Get notified about changes and updates to your workflows',
    security_alerts: 'Receive alerts about security-related events and suspicious activities',
    newsletter: 'Stay updated with our monthly newsletter featuring tips and best practices',
    marketing: 'Receive occasional updates about new features and promotional offers',
  };
  return descriptions[key] || '';
}

const connectedAccounts = [
  {
    name: 'Google',
    status: 'Connected',
    connected: true,
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    status: 'Not connected',
    connected: false,
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Slack',
    status: 'Connected',
    connected: true,
    icon: (props: any) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M19.712 10.907c.195.551-.097 1.16-.648 1.354l-2.193.778.715 2.136c.194.551-.097 1.16-.648 1.354-.551.195-1.16-.097-1.354-.648l-.715-2.136-4.04 1.436.715 2.136c.194.551-.097 1.16-.648 1.354-.551.195-1.16-.097-1.354-.648l-.715-2.136-2.193.778c-.551.195-1.16-.097-1.354-.648-.195-.551.097-1.16.648-1.354l2.193-.778-.715-2.136c-.194-.551.097-1.16.648-1.354.551-.195 1.16.097 1.354.648l.715 2.136 4.04-1.436-.715-2.136c-.194-.551.097-1.16.648-1.354.551-.195 1.16.097 1.354.648l.715 2.136 2.193-.778c.551-.195 1.16.097 1.354.648zM9.662 14.907l4.04-1.436-1.436-4.04-4.04 1.436 1.436 4.04z" clipRule="evenodd" />
      </svg>
    ),
  },
]; 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings - Optiflow',
  description: 'Manage your account preferences and security settings',
};

export default function AccountSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Preferences</h2>
          {/* Add email preferences form here */}
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Security Settings</h2>
          {/* Add security settings form here */}
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Connected Accounts</h2>
          {/* Add connected accounts section here */}
        </section>
      </div>
    </div>
  );
} 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usage & Analytics - Optiflow',
  description: 'View your resource consumption and analytics',
};

export default function UsagePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Usage & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor your resource consumption and analytics
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resource Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">API Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">123,456</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3 GB</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">of 10 GB</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usage History</h2>
          {/* Add usage history chart here */}
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usage Breakdown</h2>
          {/* Add usage breakdown table here */}
        </section>
      </div>
    </div>
  );
} 
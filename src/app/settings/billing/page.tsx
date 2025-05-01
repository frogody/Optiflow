import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Plans - Optiflow',
  description: 'Manage your subscription and billing settings',
};

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your subscription and billing settings
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Plan</h2>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-600 dark:text-blue-400">Pro Plan</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">$49/month</p>
              </div>
              <button className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30">
                Change Plan
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Method</h2>
          {/* Add payment method form here */}
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Billing History</h2>
          {/* Add billing history table here */}
        </section>
      </div>
    </div>
  );
} 
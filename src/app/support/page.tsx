import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help & Support - Optiflow',
  description: 'Get help and support for Optiflow',
};

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get help and support for using Optiflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Help</h2>
          <div className="space-y-4">
            <Link
              href="/docs/getting-started"
              className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">Getting Started</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Learn the basics of Optiflow</p>
            </Link>
            <Link
              href="/docs/tutorials"
              className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">Tutorials</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step guides</p>
            </Link>
            <Link
              href="/docs/api"
              className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">API Documentation</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Technical API references</p>
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Support</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-600 dark:text-blue-400">Premium Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get priority support from our team
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full">
                Contact Support
              </button>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Community Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Get help from the Optiflow community
              </p>
              <Link
                href="https://community.optiflow.ai"
                className="mt-3 block px-4 py-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Visit Community
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 md:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">FAQs</h2>
          <div className="space-y-4">
            {/* Add FAQ items here */}
          </div>
        </section>
      </div>
    </div>
  );
} 
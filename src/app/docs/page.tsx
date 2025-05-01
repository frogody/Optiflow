import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Documentation - Optiflow',
  description: 'Documentation and guides for Optiflow',
};

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Everything you need to know about using Optiflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/docs/getting-started/introduction"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Introduction to Optiflow
              </Link>
            </li>
            <li>
              <Link
                href="/docs/getting-started/quickstart"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Quick Start Guide
              </Link>
            </li>
            <li>
              <Link
                href="/docs/getting-started/core-concepts"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Core Concepts
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Guides</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/docs/guides/voice-workflows"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voice Workflows
              </Link>
            </li>
            <li>
              <Link
                href="/docs/guides/conversational-ai"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Conversational AI
              </Link>
            </li>
            <li>
              <Link
                href="/docs/guides/integrations"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Integrations
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Reference</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/docs/api/authentication"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Authentication
              </Link>
            </li>
            <li>
              <Link
                href="/docs/api/endpoints"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                API Endpoints
              </Link>
            </li>
            <li>
              <Link
                href="/docs/api/webhooks"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Webhooks
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Best Practices</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/docs/best-practices/security"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Security Guidelines
              </Link>
            </li>
            <li>
              <Link
                href="/docs/best-practices/performance"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Performance Optimization
              </Link>
            </li>
            <li>
              <Link
                href="/docs/best-practices/architecture"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Architecture Patterns
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tutorials</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/docs/tutorials/basic-workflow"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create Your First Workflow
              </Link>
            </li>
            <li>
              <Link
                href="/docs/tutorials/custom-integration"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Build a Custom Integration
              </Link>
            </li>
            <li>
              <Link
                href="/docs/tutorials/advanced-features"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Advanced Features
              </Link>
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resources</h2>
          <ul className="space-y-3">
            <li>
              <Link
                href="/docs/resources/faq"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/docs/resources/troubleshooting"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Troubleshooting
              </Link>
            </li>
            <li>
              <Link
                href="/docs/resources/community"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Community Resources
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
} 
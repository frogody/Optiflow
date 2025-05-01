import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles & Permissions - Optiflow',
  description: 'Configure access controls and permissions',
};

export default function RolesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure access controls and role-based permissions
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Custom Roles</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Role
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Admin</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Full access to all resources</p>
                </div>
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Edit
                </button>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Editor</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Can edit but not delete resources</p>
                </div>
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Edit
                </button>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Viewer</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Can only view resources</p>
                </div>
                <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Default Permissions</h2>
          {/* Add default permissions settings here */}
        </section>
      </div>
    </div>
  );
} 
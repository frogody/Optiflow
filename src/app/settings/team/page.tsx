import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Management - Optiflow',
  description: 'Invite and manage your team members',
};

export default function TeamManagementPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Invite and manage your team members
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Team Members</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Invite Member
            </button>
          </div>
          {/* Add team members list here */}
        </section>

        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pending Invitations</h2>
          {/* Add pending invitations list here */}
        </section>
      </div>
    </div>
  );
} 
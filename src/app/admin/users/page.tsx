'use client';

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts

// Define User type
interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  plan: string;
  workflows: number;
  signupDate: string;
  lastActive: string;
}

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function UserManagement() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // Dummy user data
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      status: 'active',
      plan: 'Enterprise',
      workflows: 12,
      signupDate: '2023-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.org',
      status: 'active',
      plan: 'Professional',
      workflows: 8,
      signupDate: '2023-03-22',
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Alex Wong',
      email: 'alex.wong@tech.co',
      status: 'active',
      plan: 'Professional',
      workflows: 5,
      signupDate: '2023-05-10',
      lastActive: '3 days ago',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@startup.io',
      status: 'suspended',
      plan: 'Basic',
      workflows: 3,
      signupDate: '2023-06-18',
      lastActive: '2 weeks ago',
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@corp.com',
      status: 'active',
      plan: 'Enterprise',
      workflows: 25,
      signupDate: '2022-11-05',
      lastActive: '5 minutes ago',
    },
  ];

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.plan.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterStatus ? user.status.toLowerCase() === filterStatus.toLowerCase() : true) &&
    (filterPlan ? user.plan === filterPlan : true)
  ).sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'workflows':
        return b.workflows - a.workflows;
      case 'signupDate':
        return new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime();
      case 'lastActive':
        // For simplicity, comparing strings here
        return a.lastActive.localeCompare(b.lastActive);
      default:
        return 0;
    }
  });

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#22D3EE]">User Management</h1>
        <button className="flex items-center px-4 py-2 bg-[#A855F7] hover:bg-[#C026D3] text-white rounded-md transition-colors text-sm font-medium">
          <Icon name="user-plus-" className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg p-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="magnifying-glass-" className="h-5 w-5 text-[#6B7280]" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              placeholder="Search users by name, email, or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-3 py-2 flex items-center bg-[#1E293B] text-[#E5E7EB] rounded-md hover:bg-[#2D3748] transition-colors"
            >
              <Icon name="funnel-" className="h-5 w-5 mr-2" />
              <span>Filters</span>
            </button>
            <button
              className="px-3 py-2 flex items-center bg-[#1E293B] text-[#E5E7EB] rounded-md hover:bg-[#2D3748] transition-colors"
              title="Refresh users"
            >
              <Icon name="arrow-path-" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {filterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#374151]">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Status</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-[#374151] bg-[#111111] rounded-md shadow-sm focus:outline-none focus:ring-[#22D3EE] focus:border-[#22D3EE] text-[#E5E7EB]"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
                title="Filter by status"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="invited">Invited</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Plan</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-[#374151] bg-[#111111] rounded-md shadow-sm focus:outline-none focus:ring-[#22D3EE] focus:border-[#22D3EE] text-[#E5E7EB]"
                value={filterPlan}
                onChange={e => setFilterPlan(e.target.value)}
                aria-label="Filter by plan"
                title="Filter by plan"
              >
                <option value="">All Plans</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Professional">Professional</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9CA3AF] mb-1">Sort By</label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-[#374151] bg-[#111111] rounded-md shadow-sm focus:outline-none focus:ring-[#22D3EE] focus:border-[#22D3EE] text-[#E5E7EB]"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort by field"
                title="Sort by field"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="workflows">Number of Workflows</option>
                <option value="signupDate">Signup Date</option>
                <option value="lastActive">Last Active</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users table */}
      <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#374151]">
            <thead className="bg-[#111111]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Plan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Workflows
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Signup Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-[#9CA3AF]">
                    No users found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-[#1E293B] cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-[#1E293B]' : ''}`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2D3748] flex items-center justify-center text-[#22D3EE]">
                          <Icon name="user-circle-" className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#E5E7EB]">{user.name}</div>
                          <div className="text-sm text-[#9CA3AF]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-[#022c22] text-[#22D3EE]'
                            : user.status === 'suspended'
                            ? 'bg-[#371520] text-[#F87171]'
                            : 'bg-[#422006] text-[#F59E0B]'
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                      {user.plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E5E7EB]">
                      {user.workflows}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {user.signupDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                          title="Edit user"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit user
                          }}
                        >
                          <Icon name="pencil-" className="h-5 w-5" />
                        </button>
                        <button
                          className="text-[#A855F7] hover:text-[#C026D3] transition-colors"
                          title="Impersonate user"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle impersonate user
                          }}
                        >
                          <Icon name="eye-" className="h-5 w-5" />
                        </button>
                        <button
                          className={`${
                            user.status === 'active' ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#22D3EE] hover:text-[#06B6D4]'
                          } transition-colors`}
                          title={user.status === 'active' ? 'Suspend user' : 'Activate user'}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle suspend/activate user
                          }}
                        >
                          {user.status === 'active' ? (
                            <Icon name="no-symbol-" className="h-5 w-5" />
                          ) : (
                            <Icon name="check-badge-" className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-[#111111] border-t border-[#374151] flex items-center justify-between">
          <div className="text-sm text-[#9CA3AF]">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-[#1E293B] text-[#E5E7EB] rounded-md hover:bg-[#2D3748] transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-[#1E293B] text-[#E5E7EB] rounded-md hover:bg-[#2D3748] transition-colors disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User detail panel (shown when a user is selected) */}
      {selectedUser && (
        <div className="bg-[#18181B] border border-[#374151] rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-[#2D3748] flex items-center justify-center text-[#22D3EE] mr-4">
                <Icon name="user-circle-" className="h-12 w-12" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#E5E7EB]">{selectedUser.name}</h2>
                <p className="text-[#9CA3AF]">{selectedUser.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 bg-[#1E293B] hover:bg-[#2D3748] text-[#E5E7EB] rounded-md transition-colors text-sm font-medium">
                <Icon name="key-" className="h-4 w-4 mr-2" />
                Reset Password
              </button>
              <button className="flex items-center px-3 py-2 bg-[#371520] hover:bg-[#4B1D29] text-[#F87171] rounded-md transition-colors text-sm font-medium">
                <Icon name="trash-" className="h-4 w-4 mr-2" />
                Delete User
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-[#22D3EE] border-b border-[#374151] pb-2">Account Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-[#9CA3AF]">Status:</div>
                <div className="text-[#E5E7EB] font-medium">{selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}</div>
                
                <div className="text-[#9CA3AF]">Plan:</div>
                <div className="text-[#E5E7EB] font-medium">{selectedUser.plan}</div>
                
                <div className="text-[#9CA3AF]">Signup Date:</div>
                <div className="text-[#E5E7EB] font-medium">{selectedUser.signupDate}</div>
                
                <div className="text-[#9CA3AF]">Last Active:</div>
                <div className="text-[#E5E7EB] font-medium">{selectedUser.lastActive}</div>
              </div>
            </div>

            {/* Billing */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-[#22D3EE] border-b border-[#374151] pb-2">Billing Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-[#9CA3AF]">Plan:</div>
                <div className="text-[#E5E7EB] font-medium">{selectedUser.plan}</div>
                
                <div className="text-[#9CA3AF]">Billing Cycle:</div>
                <div className="text-[#E5E7EB] font-medium">Monthly</div>
                
                <div className="text-[#9CA3AF]">Next Invoice:</div>
                <div className="text-[#E5E7EB] font-medium">July 15, 2023</div>
                
                <div className="text-[#9CA3AF]">Payment Method:</div>
                <div className="text-[#E5E7EB] font-medium">Visa ending in 4242</div>
              </div>
              <button className="mt-2 text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
                Manage Billing
              </button>
            </div>

            {/* Activity */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-[#22D3EE] border-b border-[#374151] pb-2">Recent Activity</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-[#E5E7EB]">
                  <span className="text-[#9CA3AF]">2 hours ago:</span> Logged in
                </li>
                <li className="text-[#E5E7EB]">
                  <span className="text-[#9CA3AF]">Yesterday:</span> Updated workflow "Email Campaign"
                </li>
                <li className="text-[#E5E7EB]">
                  <span className="text-[#9CA3AF]">3 days ago:</span> Connected Google Calendar
                </li>
              </ul>
              <button className="mt-2 text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
                View Full Activity Log
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#374151] grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workflows */}
            <div>
              <h3 className="text-md font-medium text-[#22D3EE] mb-4">User Workflows</h3>
              <div className="bg-[#111111] border border-[#374151] rounded-md p-4 max-h-60 overflow-y-auto">
                {Array.from({ length: selectedUser.workflows }).map((_, i) => (
                  <div key={i} className="mb-2 pb-2 border-b border-[#374151] last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="text-[#E5E7EB]">Workflow {i + 1}</span>
                      <span className={`text-xs font-medium ${
                        i % 3 === 0 ? 'text-[#F87171]' : 'text-[#22D3EE]'
                      }`}>
                        {i % 3 === 0 ? 'Error' : 'Active'}
                      </span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1">Last run: {Math.floor(Math.random() * 24) + 1} hours ago</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h3 className="text-md font-medium text-[#22D3EE] mb-4">Connected Integrations</h3>
              <div className="bg-[#111111] border border-[#374151] rounded-md p-4 max-h-60 overflow-y-auto">
                {['Google Calendar', 'Slack', 'Asana', 'Gmail'].map((integration, i) => (
                  <div key={i} className="mb-2 pb-2 border-b border-[#374151] last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="text-[#E5E7EB]">{integration}</span>
                      <span className="text-xs text-[#22D3EE] font-medium">Connected</span>
                    </div>
                    <div className="text-xs text-[#9CA3AF] mt-1">Connected on: June {10 + i}, 2023</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSelectedUser(null)}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#2D3748] text-[#E5E7EB] rounded-md transition-colors text-sm font-medium"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
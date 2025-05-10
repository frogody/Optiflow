'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  ShieldCheckIcon,
  PencilIcon,
  CameraIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Mock organization data
const mockOrg = {
  name: 'Acme Corporation',
  logo: null, // This would be a URL to the organization's logo
  email: 'admin@acmecorp.com',
  billingAddress: {
    line1: '123 Main Street',
    line2: 'Suite 456',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States'
  },
  billingContact: {
    name: 'Jane Smith',
    email: 'finance@acmecorp.com',
    phone: '+1 (555) 123-4567'
  },
  plan: 'Enterprise',
  membersCount: 25,
  createdAt: '2022-01-15T10:30:00Z',
};

// Mock members data (would be fetched in a real implementation)
const mockMembers = [
  {
    id: 'user-1',
    name: 'Jane Smith',
    email: 'jane.smith@acmecorp.com',
    avatar: null,
    role: 'Owner',
    status: 'Active',
    lastActive: '2023-07-02T14:30:00Z',
  },
  {
    id: 'user-2',
    name: 'John Doe',
    email: 'john.doe@acmecorp.com',
    avatar: null,
    role: 'Admin',
    status: 'Active',
    lastActive: '2023-07-01T10:15:00Z',
  },
  {
    id: 'user-3',
    name: 'Alice Johnson',
    email: 'alice.johnson@acmecorp.com',
    avatar: null,
    role: 'Member',
    status: 'Active',
    lastActive: '2023-06-29T08:45:00Z',
  }
];

// Role definitions
const mockRoles = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all resources and billing information.',
    canBeChanged: false,
    permissions: [
      { id: 'manage:members', name: 'Manage Members', granted: true },
      { id: 'manage:billing', name: 'Manage Billing', granted: true },
      { id: 'manage:workflows', name: 'Manage Workflows', granted: true },
      { id: 'manage:integrations', name: 'Manage Integrations', granted: true },
      { id: 'view:analytics', name: 'View Analytics', granted: true },
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administrative access without billing management.',
    canBeChanged: true,
    permissions: [
      { id: 'manage:members', name: 'Manage Members', granted: true },
      { id: 'manage:billing', name: 'Manage Billing', granted: false },
      { id: 'manage:workflows', name: 'Manage Workflows', granted: true },
      { id: 'manage:integrations', name: 'Manage Integrations', granted: true },
      { id: 'view:analytics', name: 'View Analytics', granted: true },
    ]
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Can create and manage their own workflows.',
    canBeChanged: true,
    permissions: [
      { id: 'manage:members', name: 'Manage Members', granted: false },
      { id: 'manage:billing', name: 'Manage Billing', granted: false },
      { id: 'manage:workflows', name: 'Manage Workflows', granted: true },
      { id: 'manage:integrations', name: 'Manage Integrations', granted: true },
      { id: 'view:analytics', name: 'View Analytics', granted: false },
    ]
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to assigned resources.',
    canBeChanged: true,
    permissions: [
      { id: 'manage:members', name: 'Manage Members', granted: false },
      { id: 'manage:billing', name: 'Manage Billing', granted: false },
      { id: 'manage:workflows', name: 'Manage Workflows', granted: false },
      { id: 'manage:integrations', name: 'Manage Integrations', granted: false },
      { id: 'view:analytics', name: 'View Analytics', granted: false },
    ]
  }
];

// Invitation status options
const invitationStatuses = ['Pending', 'Expired', 'Accepted', 'Declined'];

export default function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  // Organization profile form data
  const [orgFormData, setOrgFormData] = useState({
    name: mockOrg.name,
    email: mockOrg.email,
    billingAddress: {
      ...mockOrg.billingAddress
    },
    billingContact: {
      ...mockOrg.billingContact
    }
  });
  
  // Invitation form data
  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    role: 'member',
    message: ''
  });
  
  // Handle organization form input changes
  const handleOrgInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setOrgFormData({
        ...orgFormData,
        [section]: {
          ...orgFormData[section as keyof typeof orgFormData],
          [field]: value
        }
      });
    } else {
      setOrgFormData({
        ...orgFormData,
        [name]: value
      });
    }
  };
  
  // Handle invitation form input changes
  const handleInviteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInviteFormData({
      ...inviteFormData,
      [name]: value
    });
  };
  
  // Handle organization form submission
  const handleOrgFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to update the organization
    alert('Organization details updated!');
  };
  
  // Handle invitation submission
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to send the invitation
    alert(`Invitation sent to ${inviteFormData.email} for the ${inviteFormData.role} role.`);
    
    // Reset the form and close the modal
    setInviteFormData({
      email: '',
      role: 'member',
      message: ''
    });
    setShowInviteModal(false);
  };
  
  // Handle member role edit
  const handleEditRole = (member: any) => {
    setSelectedMember(member);
    setShowEditRoleModal(true);
  };
  
  // Handle role change
  const handleRoleChange = (newRole: string) => {
    // In a real implementation, this would call an API to update the member's role
    alert(`Changed ${selectedMember.name}'s role to ${newRole}.`);
    setShowEditRoleModal(false);
  };
  
  // Handle member removal
  const handleRemoveMember = (member: any) => {
    if (member.role === 'Owner') {
      alert('Cannot remove the organization owner.');
      return;
    }
    
    if (confirm(`Are you sure you want to remove ${member.name} from the organization?`)) {
      // In a real implementation, this would call an API to remove the member
      alert(`${member.name} has been removed from the organization.`);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, this would upload the file to an API
    // and get back a URL to display the logo
    alert('Logo upload functionality would be implemented here.');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#22D3EE] mb-6">Organization Settings</h1>
      
      {/* Tabs */}
      <div className="border-b border-[#374151] mb-6">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab('profile')}
            className={`mr-6 py-2 border-b-2 font-medium ${
              activeTab === 'profile'
                ? 'border-[#22D3EE] text-[#22D3EE]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280]'
            }`}
          >
            <BuildingOffice2Icon className="inline-block h-5 w-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`mr-6 py-2 border-b-2 font-medium ${
              activeTab === 'members'
                ? 'border-[#22D3EE] text-[#22D3EE]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280]'
            }`}
          >
            <UserGroupIcon className="inline-block h-5 w-5 mr-2" />
            Members
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 border-b-2 font-medium ${
              activeTab === 'roles'
                ? 'border-[#22D3EE] text-[#22D3EE]'
                : 'border-transparent text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280]'
            }`}
          >
            <ShieldCheckIcon className="inline-block h-5 w-5 mr-2" />
            Roles
          </button>
        </div>
      </div>
      
      {/* Organization Profile */}
      {activeTab === 'profile' && (
        <div>
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-6">
            <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Organization Information</h2>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Organization Logo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {mockOrg.logo ? (
                    <Image
                      src={mockOrg.logo}
                      alt="Organization Logo"
                      width={100}
                      height={100}
                      className="rounded-lg border-2 border-[#374151]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#9CA3AF]">
                      <BuildingOffice2Icon className="w-16 h-16" />
                    </div>
                  )}
                  
                  <label htmlFor="logo-upload" className="absolute bottom-0 right-0 p-1.5 bg-[#22D3EE] rounded-full cursor-pointer hover:bg-[#06B6D4] transition-colors">
                    <CameraIcon className="w-4 h-4 text-[#111111]" />
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      aria-label="Upload organization logo"
                      title="Upload organization logo"
                    />
                  </label>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-2">Upload logo (3:2 ratio recommended)</p>
              </div>
              
              {/* Organization Details */}
              <div className="flex-1">
                <form onSubmit={handleOrgFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={orgFormData.name}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Organization Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={orgFormData.email}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Billing Information */}
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#E5E7EB]">Billing Information</h2>
              <span className="px-3 py-1 bg-[#022c22] text-[#22D3EE] rounded-full text-xs font-medium">
                {mockOrg.plan} Plan
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billing Address */}
              <div>
                <h3 className="text-[#9CA3AF] text-sm font-medium mb-3">Billing Address</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="billingAddress.line1" className="block text-xs text-[#9CA3AF] mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="billingAddress.line1"
                      name="billingAddress.line1"
                      value={orgFormData.billingAddress.line1}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="billingAddress.line2" className="block text-xs text-[#9CA3AF] mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      id="billingAddress.line2"
                      name="billingAddress.line2"
                      value={orgFormData.billingAddress.line2}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingAddress.city" className="block text-xs text-[#9CA3AF] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="billingAddress.city"
                        name="billingAddress.city"
                        value={orgFormData.billingAddress.city}
                        onChange={handleOrgInputChange}
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="billingAddress.state" className="block text-xs text-[#9CA3AF] mb-1">
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="billingAddress.state"
                        name="billingAddress.state"
                        value={orgFormData.billingAddress.state}
                        onChange={handleOrgInputChange}
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingAddress.zip" className="block text-xs text-[#9CA3AF] mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="billingAddress.zip"
                        name="billingAddress.zip"
                        value={orgFormData.billingAddress.zip}
                        onChange={handleOrgInputChange}
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="billingAddress.country" className="block text-xs text-[#9CA3AF] mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        id="billingAddress.country"
                        name="billingAddress.country"
                        value={orgFormData.billingAddress.country}
                        onChange={handleOrgInputChange}
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Billing Contact */}
              <div>
                <h3 className="text-[#9CA3AF] text-sm font-medium mb-3">Billing Contact</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="billingContact.name" className="block text-xs text-[#9CA3AF] mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      id="billingContact.name"
                      name="billingContact.name"
                      value={orgFormData.billingContact.name}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="billingContact.email" className="block text-xs text-[#9CA3AF] mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      id="billingContact.email"
                      name="billingContact.email"
                      value={orgFormData.billingContact.email}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="billingContact.phone" className="block text-xs text-[#9CA3AF] mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="billingContact.phone"
                      name="billingContact.phone"
                      value={orgFormData.billingContact.phone}
                      onChange={handleOrgInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    />
                  </div>
                </form>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#374151] flex justify-end">
              <button
                onClick={handleOrgFormSubmit}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Save Billing Information
              </button>
            </div>
          </div>
          
          {/* Subscription Information */}
          <div className="bg-[#111111] border border-[#374151] rounded-lg p-5">
            <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Subscription Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#1E293B] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">Current Plan</div>
                <div className="text-lg font-medium text-[#E5E7EB]">{mockOrg.plan}</div>
              </div>
              
              <div className="p-4 bg-[#1E293B] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">Members</div>
                <div className="text-lg font-medium text-[#E5E7EB]">{mockOrg.membersCount}</div>
              </div>
              
              <div className="p-4 bg-[#1E293B] rounded-lg">
                <div className="text-sm text-[#9CA3AF]">Organization Created</div>
                <div className="text-lg font-medium text-[#E5E7EB]">{formatDate(mockOrg.createdAt)}</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.location.href = '/billing/plans'}
                className="px-4 py-2 bg-[#1E293B] text-[#E5E7EB] font-medium rounded-md hover:bg-[#2D3748] transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
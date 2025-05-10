'use client';

import {
  ArrowRightOnRectangleIcon,
  CameraIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  PencilIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

// Mock user data for demonstration
const mockUser = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: null, // This would be a URL to the user's avatar
  timezone: 'America/New_York',
  language: 'en-US',
  created: '2023-04-15',
  lastLogin: '2023-07-02T14:30:00Z',
};

// Mock active sessions
const mockActiveSessions = [
  {
    id: 'session-1',
    device: 'Desktop',
    browser: 'Chrome',
    os: 'macOS',
    ip: '192.168.1.1',
    location: 'San Francisco, CA',
    lastActive: '2023-07-02T14:30:00Z',
    current: true,
  },
  {
    id: 'session-2',
    device: 'Mobile',
    browser: 'Safari',
    os: 'iOS',
    ip: '192.168.1.2',
    location: 'San Francisco, CA',
    lastActive: '2023-07-01T10:15:00Z',
    current: false,
  },
  {
    id: 'session-3',
    device: 'Tablet',
    browser: 'Firefox',
    os: 'iPadOS',
    ip: '192.168.1.3',
    location: 'New York, NY',
    lastActive: '2023-06-29T08:45:00Z',
    current: false,
  },
];

// Mock API usage data
const apiUsageData = {
  totalRequests: 1245,
  successRate: 98.7,
  avgResponseTime: 0.28,
  quotaUsed: 65,
  quotaLimit: 5000,
  lastWeekUsage: [120, 95, 150, 180, 200, 310, 190]
};

// Mock connected services
const connectedServices = [
  {
    id: 'service-1',
    name: 'Slack',
    icon: '/images/integrations/slack.svg',
    status: 'connected',
    lastUsed: '2023-07-02T10:30:00Z',
    scopes: ['channels:read', 'chat:write', 'users:read']
  },
  {
    id: 'service-2',
    name: 'Google Drive',
    icon: '/images/integrations/google-drive.svg',
    status: 'connected',
    lastUsed: '2023-07-01T14:15:00Z',
    scopes: ['drive.file', 'drive.metadata.readonly']
  },
  {
    id: 'service-3',
    name: 'Salesforce',
    icon: '/images/integrations/salesforce.svg',
    status: 'expired',
    lastUsed: '2023-06-25T09:45:00Z',
    scopes: ['api', 'refresh_token']
  }
];

// Mock API keys
const apiKeys = [
  {
    id: 'key-1',
    name: 'Production API Key',
    prefix: 'op_prod_',
    suffix: 'Xx7z',
    created: '2023-05-15T10:00:00Z',
    lastUsed: '2023-07-02T14:30:00Z',
    permissions: ['read', 'write']
  },
  {
    id: 'key-2',
    name: 'Development API Key',
    prefix: 'op_dev_',
    suffix: 'Yz3a',
    created: '2023-06-01T11:30:00Z',
    lastUsed: '2023-06-30T08:45:00Z',
    permissions: ['read']
  }
];

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function ProfileSettings() {
  // State for form values
  const [formData, setFormData] = useState({
    name: mockUser.name,
    timezone: mockUser.timezone,
    language: mockUser.language,
  });
  
  // State for the active tab
  const [activeTab, setActiveTab] = useState('personal');

  // State for the current password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // State for showing password
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  // State for expanding session details
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  
  // Ref for the quota progress bar
  const quotaProgressBarRef = useRef<HTMLDivElement>(null);
  
  // Password visibility toggle
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle password form input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
    
    // Simple password strength calculation for demonstration
    if (name === 'newPassword') {
      let score = 0;
      let feedback = '';
      
      if (value.length >= 8) score += 1;
      if (value.length >= 12) score += 1;
      if (/[A-Z]/.test(value)) score += 1;
      if (/[0-9]/.test(value)) score += 1;
      if (/[^A-Za-z0-9]/.test(value)) score += 1;
      
      if (score < 2) feedback = 'Weak password';
      else if (score < 4) feedback = 'Moderate password';
      else feedback = 'Strong password';
      
      setPasswordStrength({ score, feedback });
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to an API
    alert('Profile updated!');
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // In a real implementation, this would call an API to change the password
    alert('Password changed successfully!');
    
    // Reset the form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  // Toggle session details
  const toggleSessionDetails = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };
  
  // Handle logout from session
  const handleLogoutSession = (sessionId: string, current: boolean) => {
    if (current) {
      alert('You cannot log out from your current session through this interface.');
      return;
    }
    
    // In a real implementation, this would call an API to invalidate the session
    alert(`Session ${sessionId} has been terminated.`);
  };
  
  // Calculate time since last active
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000; // Years
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000; // Months
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400; // Days
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600; // Hours
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60; // Minutes
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
  };
  
  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, this would upload the file to an API
    // and get back a URL to display the avatar
    alert('Avatar upload functionality would be implemented here.');
  };

  // Effect to update progress bar width
  useEffect(() => {
    if (quotaProgressBarRef.current) {
      quotaProgressBarRef.current.style.setProperty('--dynamic-width', `${apiUsageData.quotaUsed}%`);
    }
  }, [apiUsageData.quotaUsed]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#22D3EE] mb-6">Profile Settings</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-[#374151] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'personal'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          Personal Information
        </button>
        
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'password'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          Password
        </button>
        
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'sessions'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          Active Sessions
        </button>
        
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'api'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          API & Integrations
        </button>
      </div>
      
      {/* Personal Information */}
      {activeTab === 'personal' && (
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="flex items-center space-x-8">
            <div className="relative">
              {mockUser.avatar ? (
                <Image
                  src={mockUser.avatar}
                  alt="Profile Avatar"
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-[#374151]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#1E293B] flex items-center justify-center text-[#9CA3AF]">
                  <UserCircleIcon className="w-16 h-16" />
                </div>
              )}
              
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-[#22D3EE] rounded-full cursor-pointer hover:bg-[#06B6D4] transition-colors">
                <CameraIcon className="w-4 h-4 text-[#111111]" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  aria-label="Upload profile avatar"
                  title="Upload profile avatar"
                />
              </label>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-[#E5E7EB]">{mockUser.name}</h2>
              <p className="text-[#9CA3AF]">{mockUser.email}</p>
              <p className="text-[#9CA3AF] text-xs mt-1">Member since {new Date(mockUser.created).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={mockUser.email}
                  disabled
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#9CA3AF] cursor-not-allowed"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#9CA3AF]">
                  Contact support to change email
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Password Section */}
      {activeTab === 'password' && (
        <div>
          <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">Change Password</h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#E5E7EB]"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#E5E7EB]"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-[#374151] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength.score < 2 ? 'bg-[#F87171] w-[20%]' : 
                        passwordStrength.score < 4 ? 'bg-[#F59E0B] w-[60%]' : 
                        'bg-[#10B981] w-[100%]'
                      }`}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    passwordStrength.score < 2 ? 'text-[#F87171]' : 
                    passwordStrength.score < 4 ? 'text-[#F59E0B]' : 
                    'text-[#10B981]'
                  }`}>
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
              
              <p className="text-xs text-[#9CA3AF] mt-2">
                Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#E5E7EB]"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {/* Password match indicator */}
              {passwordForm.confirmPassword && (
                <div className="flex items-center mt-2">
                  {passwordForm.newPassword === passwordForm.confirmPassword ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-[#10B981] mr-1" />
                      <span className="text-xs text-[#10B981]">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XMarkIcon className="h-4 w-4 text-[#F87171] mr-1" />
                      <span className="text-xs text-[#F87171]">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                disabled={
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  !passwordForm.confirmPassword ||
                  passwordForm.newPassword !== passwordForm.confirmPassword ||
                  passwordStrength.score < 2
                }
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Active Sessions */}
      {activeTab === 'sessions' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#E5E7EB]">Active Sessions</h2>
            <button
              className="text-sm text-[#F87171] hover:text-[#FCA5A5] transition-colors font-medium"
              onClick={() => alert('This would terminate all other sessions in a real implementation.')}
            >
              Log out all other sessions
            </button>
          </div>
          
          <div className="space-y-4">
            {mockActiveSessions.map((session) => (
              <div
                key={session.id}
                className={`border rounded-lg overflow-hidden ${
                  session.current ? 'border-[#22D3EE] bg-[#18181B]' : 'border-[#374151] bg-[#111111]'
                }`}
              >
                {/* Session summary */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSessionDetails(session.id)}
                >
                  <div className="flex items-center">
                    {session.device === 'Desktop' ? (
                      <ComputerDesktopIcon className="h-6 w-6 text-[#9CA3AF] mr-3" />
                    ) : (
                      <DevicePhoneMobileIcon className="h-6 w-6 text-[#9CA3AF] mr-3" />
                    )}
                    
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-[#E5E7EB]">
                          {session.browser} on {session.os}
                        </span>
                        {session.current && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-[#022c22] text-[#22D3EE] rounded-full">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#9CA3AF]">
                        {session.location} • Last active {getTimeAgo(session.lastActive)}
                      </div>
                    </div>
                  </div>
                  
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-[#9CA3AF] transition-transform ${
                      expandedSession === session.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
                
                {/* Expanded details */}
                {expandedSession === session.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#374151]">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-[#9CA3AF]">IP Address</span>
                        <span className="text-[#E5E7EB]">{session.ip}</span>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-[#9CA3AF]">Device</span>
                        <span className="text-[#E5E7EB]">{session.device}</span>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-[#9CA3AF]">Browser</span>
                        <span className="text-[#E5E7EB]">{session.browser}</span>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-[#9CA3AF]">Operating System</span>
                        <span className="text-[#E5E7EB]">{session.os}</span>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-[#9CA3AF]">Location</span>
                        <span className="text-[#E5E7EB]">{session.location}</span>
                      </div>
                      <div className="grid grid-cols-2 text-sm">
                        <span className="text-[#9CA3AF]">Last Active</span>
                        <span className="text-[#E5E7EB]">
                          {new Date(session.lastActive).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {!session.current && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleLogoutSession(session.id, session.current)}
                          className="flex items-center text-sm text-[#F87171] hover:text-[#FCA5A5] transition-colors"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                          Terminate Session
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* API & Integrations */}
      {activeTab === 'api' && (
        <div className="space-y-8">
          {/* API Usage Overview */}
          <div>
            <h2 className="text-lg font-medium text-[#E5E7EB] mb-4">API Usage Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111111] border border-[#374151] rounded-lg p-4">
                <div className="text-[#9CA3AF] text-sm mb-1">Total Requests (30 days)</div>
                <div className="text-2xl font-semibold text-[#E5E7EB]">{apiUsageData.totalRequests.toLocaleString()}</div>
              </div>
              
              <div className="bg-[#111111] border border-[#374151] rounded-lg p-4">
                <div className="text-[#9CA3AF] text-sm mb-1">Success Rate</div>
                <div className="text-2xl font-semibold text-[#E5E7EB]">{apiUsageData.successRate}%</div>
              </div>
              
              <div className="bg-[#111111] border border-[#374151] rounded-lg p-4">
                <div className="text-[#9CA3AF] text-sm mb-1">Avg. Response Time</div>
                <div className="text-2xl font-semibold text-[#E5E7EB]">{apiUsageData.avgResponseTime}s</div>
              </div>
            </div>
            
            <div className="bg-[#111111] border border-[#374151] rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[#9CA3AF] text-sm">Monthly Quota Usage</div>
                <div className="text-[#9CA3AF] text-sm">
                  {apiUsageData.quotaUsed}% of {apiUsageData.quotaLimit.toLocaleString()}
                </div>
              </div>
              
              <div className="h-2 w-full bg-[#374151] rounded-full overflow-hidden">
                <div 
                  ref={quotaProgressBarRef}
                  className="h-full bg-[#22D3EE] width-from-var"
                />
              </div>
              
              <div className="text-xs text-[#9CA3AF] mt-2">
                Your quota resets on July 31, 2023
              </div>
            </div>
          </div>
          
          {/* API Keys */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#E5E7EB]">API Keys</h2>
              <button
                className="px-3 py-1.5 text-sm bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
                onClick={() => alert('This would open a dialog to create a new API key')}
              >
                Create New Key
              </button>
            </div>
            
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="bg-[#111111] border border-[#374151] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[#E5E7EB] font-medium">{key.name}</div>
                      <div className="text-sm text-[#9CA3AF]">Created on {new Date(key.created).toLocaleDateString()}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                        onClick={() => alert('This would copy the full API key to clipboard')}
                      >
                        Copy
                      </button>
                      <button
                        className="text-sm text-[#F87171] hover:text-[#FCA5A5] transition-colors"
                        onClick={() => alert(`This would revoke the API key: ${key.id}`)}
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#18181B] rounded px-3 py-2 font-mono text-sm text-[#9CA3AF] mb-3">
                    {key.prefix}•••••••••••••{key.suffix}
                  </div>
                  
                  <div className="flex items-center text-xs">
                    <span className="text-[#9CA3AF] mr-2">Permissions:</span>
                    {key.permissions.map((perm) => (
                      <span 
                        key={perm} 
                        className="mr-2 px-2 py-0.5 bg-[#1E293B] text-[#9CA3AF] rounded"
                      >
                        {perm}
                      </span>
                    ))}
                    <span className="ml-auto text-[#9CA3AF]">
                      Last used: {getTimeAgo(key.lastUsed)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-[#9CA3AF]">
              <p>API keys provide full access to your Optiflow account. Keep them secure and never share them in public repositories or client-side code.</p>
            </div>
          </div>
          
          {/* Connected Services */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#E5E7EB]">Connected Services</h2>
              <Link 
                href="/connections-browser"
                className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
              >
                Browse All Services
              </Link>
            </div>
            
            <div className="space-y-4">
              {connectedServices.map((service) => (
                <div key={service.id} className="bg-[#111111] border border-[#374151] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1E293B] p-1 flex items-center justify-center mr-4">
                        <Image 
                          src={service.icon}
                          alt={service.name}
                          width={24}
                          height={24}
                        />
                      </div>
                      
                      <div>
                        <div className="text-[#E5E7EB] font-medium">{service.name}</div>
                        <div className="flex items-center text-xs">
                          {service.status === 'connected' ? (
                            <span className="text-[#10B981] flex items-center">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Connected
                            </span>
                          ) : (
                            <span className="text-[#F87171] flex items-center">
                              <XMarkIcon className="h-3 w-3 mr-1" />
                              Connection Expired
                            </span>
                          )}
                          <span className="mx-2 text-[#4B5563]">•</span>
                          <span className="text-[#9CA3AF]">
                            Last used {getTimeAgo(service.lastUsed)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {service.status === 'connected' ? (
                        <button
                          className="text-sm text-[#F87171] hover:text-[#FCA5A5] transition-colors"
                          onClick={() => alert(`This would disconnect ${service.name}`)}
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          className="text-sm text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                          onClick={() => alert(`This would reconnect ${service.name}`)}
                        >
                          Reconnect
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-[#374151]">
                    <div className="text-xs text-[#9CA3AF] mb-1">Authorized Scopes</div>
                    <div className="flex flex-wrap gap-2">
                      {service.scopes.map((scope) => (
                        <span 
                          key={scope} 
                          className="px-2 py-0.5 bg-[#1E293B] text-[#9CA3AF] rounded text-xs"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Webhook Endpoints */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#E5E7EB]">Webhook Endpoints</h2>
              <button
                className="px-3 py-1.5 text-sm bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
                onClick={() => alert('This would open a dialog to create a new webhook endpoint')}
              >
                Add Endpoint
              </button>
            </div>
            
            <div className="bg-[#18181B] border border-dashed border-[#374151] rounded-lg p-8 text-center">
              <p className="text-[#9CA3AF] mb-4">You haven't set up any webhook endpoints yet</p>
              <button
                className="px-4 py-2 bg-[#1E293B] text-[#E5E7EB] rounded-md hover:bg-[#374151] transition-colors"
                onClick={() => alert('This would open a dialog to create a new webhook endpoint')}
              >
                Configure Your First Webhook
              </button>
            </div>
            
            <div className="mt-4 text-xs text-[#9CA3AF]">
              <p>Webhooks allow Optiflow to send real-time updates to your application whenever specific events occur in your account.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
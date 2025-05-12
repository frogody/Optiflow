'use client';

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

// Heroicons removed to prevent React version conflicts
import { useState } from 'react';

// Mock data export history
const mockExports = [
  {
    id: 'export-1',
    status: 'completed',
    format: 'JSON',
    requested: '2023-06-10T14:30:00Z',
    completed: '2023-06-10T14:45:00Z',
    size: '2.3 MB',
    downloadUrl: '#'
  },
  {
    id: 'export-2',
    status: 'processing',
    format: 'CSV',
    requested: '2023-07-02T10:15:00Z',
    completed: null,
    size: null,
    downloadUrl: null
  }
];

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

export default function DataPrivacySettings() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [exportFormat, setExportFormat] = useState('json');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteStep, setDeleteStep] = useState(1);
  
  // Handle export request
  const handleExportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would call an API to request a data export
    alert(`Data export requested in ${exportFormat.toUpperCase()} format. You will be notified when it's ready for download.`);
    
    setShowExportModal(false);
    setExportFormat('json');
  };
  
  // Handle delete account request
  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deleteStep === 1) {
      // Advance to final confirmation step
      setDeleteStep(2);
      return;
    }
    
    if (deleteConfirmation !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion.');
      return;
    }
    
    if (!deletePassword) {
      alert('Please enter your password to confirm account deletion.');
      return;
    }
    
    // In a real implementation, this would call an API to request account deletion
    alert('Account deletion request submitted. Your account will be deleted according to our data retention policy.');
    
    setShowDeleteModal(false);
    setDeleteConfirmation('');
    setDeleteReason('');
    setDeletePassword('');
    setDeleteStep(1);
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#22D3EE] mb-6">Data & Privacy</h1>
      
      {/* Data Export Section */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#E5E7EB] mb-2">Export Your Data</h2>
            <p className="text-[#9CA3AF] mb-4">
              Request a copy of your personal data from Optiflow. The export will include your profile information, workflow definitions, and execution logs.
            </p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors flex items-center"
          >
            <Icon name="document-arrow-down-" className="h-5 w-5 mr-2" />
            Request Data Export
          </button>
        </div>
        
        {/* Previous exports */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-[#9CA3AF] mb-3">Previous Exports</h3>
          
          {mockExports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#374151]">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Date Requested
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Format
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#374151]">
                  {mockExports.map((exportItem) => (
                    <tr key={exportItem.id} className="hover:bg-[#1E293B] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#E5E7EB]">
                        {formatDate(exportItem.requested)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#E5E7EB]">
                        {exportItem.format}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {exportItem.status === 'completed' ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-[#022c22] text-[#22D3EE]">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-[#1E293B] text-[#9CA3AF] flex items-center">
                            <Icon name="arrow-path-" className="h-3 w-3 mr-1 animate-spin" />
                            Processing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#E5E7EB]">
                        {exportItem.size || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {exportItem.status === 'completed' ? (
                          <a
                            href={exportItem.downloadUrl}
                            className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors inline-flex items-center"
                          >
                            <Icon name="document-arrow-down-" className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        ) : (
                          <span className="text-[#9CA3AF]">Not available yet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 bg-[#111111] rounded-lg border border-[#374151]">
              <p className="text-[#9CA3AF]">No previous exports</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Data Retention */}
      <div className="bg-[#111111] border border-[#374151] rounded-lg p-5 mb-8">
        <h2 className="text-lg font-medium text-[#E5E7EB] mb-2">Data Retention</h2>
        <p className="text-[#9CA3AF] mb-4">
          Information about how long we store your data and how it's used.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Icon name="clock-" className="h-5 w-5 text-[#9CA3AF] mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-[#E5E7EB] font-medium">Workflow Execution Logs</h3>
              <p className="text-sm text-[#9CA3AF]">
                Workflow execution logs are stored for 90 days, after which they are automatically deleted.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Icon name="document-text-" className="h-5 w-5 text-[#9CA3AF] mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-[#E5E7EB] font-medium">Account Information</h3>
              <p className="text-sm text-[#9CA3AF]">
                Your account information is stored for as long as you maintain an active account with us.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Icon name="document-duplicate-" className="h-5 w-5 text-[#9CA3AF] mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-[#E5E7EB] font-medium">Workflow Definitions</h3>
              <p className="text-sm text-[#9CA3AF]">
                Workflow definitions and configurations are stored for as long as you keep them in your account.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Account */}
      <div className="bg-[#371520] border border-[#F87171] rounded-lg p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-[#E5E7EB] mb-2">Delete Your Account</h2>
            <p className="text-[#9CA3AF] mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-[#F87171] text-[#111111] font-medium rounded-md hover:bg-[#EF4444] transition-colors flex items-center"
          >
            <Icon name="trash-" className="h-5 w-5 mr-2" />
            Delete Account
          </button>
        </div>
        
        <div className="mt-4 flex items-start bg-[#451524] p-3 rounded-md">
          <Icon name="exclamation-triangle-" className="h-5 w-5 text-[#F87171] mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#F87171]">
            <p className="font-medium mb-1">Warning: This action is permanent</p>
            <p>
              Deleting your account will permanently remove all your data, including workflows, integrations, and execution history. 
              Active subscriptions will be canceled, and you will lose access to all Optiflow services.
            </p>
          </div>
        </div>
      </div>
      
      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#E5E7EB]">Export Your Data</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-[#9CA3AF] hover:text-[#E5E7EB]"
                aria-label="Close export data modal"
              >
                <Icon name="xmark-" className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-[#9CA3AF] mb-6">
              Request a copy of your personal data from Optiflow. You will receive an email notification when your export is ready for download.
            </p>
            
            <form onSubmit={handleExportRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="format-json"
                      name="format"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={() => setExportFormat('json')}
                      className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] focus:ring-[#22D3EE]"
                    />
                    <label htmlFor="format-json" className="ml-2 block text-[#E5E7EB]">
                      JSON (Recommended for developers)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="format-csv"
                      name="format"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4 text-[#22D3EE] bg-[#111111] border-[#374151] focus:ring-[#22D3EE]"
                    />
                    <label htmlFor="format-csv" className="ml-2 block text-[#E5E7EB]">
                      CSV (Easier to view in spreadsheet applications)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111111] p-4 rounded-lg border border-[#374151] mb-4">
                <h4 className="text-[#E5E7EB] font-medium mb-2">What's included in your export:</h4>
                <ul className="space-y-1 text-sm text-[#9CA3AF]">
                  <li className="flex items-center">
                    <Icon name="check-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    Your profile information
                  </li>
                  <li className="flex items-center">
                    <Icon name="check-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    Workflow definitions
                  </li>
                  <li className="flex items-center">
                    <Icon name="check-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    Integration connections (without credentials)
                  </li>
                  <li className="flex items-center">
                    <Icon name="check-" className="h-4 w-4 text-[#22D3EE] mr-2" />
                    Execution history (last 90 days)
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                >
                  Request Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg p-6 max-w-md w-full border border-[#374151]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#E5E7EB]">Delete Account</h3>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteStep(1);
                  setDeleteConfirmation('');
                  setDeleteReason('');
                  setDeletePassword('');
                }}
                className="text-[#9CA3AF] hover:text-[#E5E7EB]"
                aria-label="Close delete account modal"
              >
                <Icon name="xmark-" className="h-6 w-6" />
              </button>
            </div>
            
            {deleteStep === 1 ? (
              <form onSubmit={handleDeleteRequest} className="space-y-4">
                <div className="bg-[#371520] border border-[#F87171] rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <Icon name="exclamation-triangle-" className="h-5 w-5 text-[#F87171] mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#F87171]">
                      <p className="font-medium mb-1">Warning: This action cannot be undone</p>
                      <p>
                        Deleting your account will permanently remove all of your data and cancel any active subscriptions. 
                        This process cannot be reversed.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Why are you deleting your account? (Optional)
                  </label>
                  <select
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    title="Reason for account deletion"
                  >
                    <option value="">Select a reason</option>
                    <option value="not-useful">I don't find Optiflow useful</option>
                    <option value="too-expensive">It's too expensive</option>
                    <option value="too-complicated">It's too complicated to use</option>
                    <option value="missing-features">Missing features I need</option>
                    <option value="moving-to-competitor">Moving to a competitor</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>
                
                {deleteReason === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                      Please specify your reason
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      placeholder="Tell us why you're leaving..."
                    ></textarea>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteStep(1);
                      setDeleteConfirmation('');
                      setDeleteReason('');
                      setDeletePassword('');
                    }}
                    className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F87171] text-[#111111] font-medium rounded-md hover:bg-[#EF4444] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleDeleteRequest} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="h-16 w-16 bg-[#371520] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="trash-" className="h-8 w-8 text-[#F87171]" />
                  </div>
                  <h4 className="text-lg font-bold text-[#F87171]">Final Confirmation</h4>
                  <p className="text-[#9CA3AF]">
                    This will permanently delete your account and all associated data.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    To confirm deletion, type "DELETE"
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    placeholder="DELETE"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    placeholder="Your current password"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteStep(1);
                    }}
                    className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F87171] text-[#111111] font-medium rounded-md hover:bg-[#EF4444] transition-colors"
                    disabled={deleteConfirmation !== 'DELETE' || !deletePassword}
                  >
                    Permanently Delete Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
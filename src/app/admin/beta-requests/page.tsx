'use client';

import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type BetaRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  isAiConsultant: boolean;
  intendedUse: string;
  usageFrequency: string;
  useCase: string;
  additionalInfo: string;
  joinReason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  approvalDate?: string;
  inviteCode?: string;
  inviteCodeUsed?: boolean;
  adminNotes?: string;
};

export default function BetaRequestsAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<BetaRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BetaRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<BetaRequest | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch beta access requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/beta-access/list');
        if (!response.ok) {
          throw new Error('Failed to fetch beta access requests');
        }
        
        const data = await response.json();
        setRequests(data.requests);
        setFilteredRequests(data.requests);
      } catch (error) {
        console.error('Error fetching beta requests:', error);
        setError('Failed to load beta access requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && (session?.user?.isAdmin || session?.user?.role === 'admin')) {
      console.log('Admin user authenticated, fetching beta requests', {
        role: session?.user?.role,
        isAdmin: session?.user?.isAdmin
      });
      fetchRequests();
    } else if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to login');
      router.push('/admin-login');
    } else if (status === 'authenticated') {
      console.log('User authenticated but not admin, redirecting', {
        role: session?.user?.role,
        isAdmin: session?.user?.isAdmin
      });
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Filter requests based on search term and status filter
  useEffect(() => {
    if (!requests.length) return;

    let filtered = [...requests];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        request =>
          request.firstName.toLowerCase().includes(term) ||
          request.lastName.toLowerCase().includes(term) ||
          request.email.toLowerCase().includes(term) ||
          request.companyName.toLowerCase().includes(term)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  // Handle approving a beta request
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    setIsApproving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/beta-access/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          adminNotes,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve beta request');
      }
      
      // Update the request in the list
      const updatedRequests = requests.map(request => 
        request.id === selectedRequest.id
          ? { 
              ...request, 
              status: 'APPROVED', 
              inviteCode: data.inviteCode,
              approvalDate: new Date().toISOString(),
              adminNotes: adminNotes || undefined,
            }
          : request
      );
      
      setRequests(updatedRequests);
      setSuccessMessage(`Request approved! Invite code: ${data.inviteCode}`);
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve request. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  // Handle rejecting a beta request
  const handleReject = async () => {
    if (!selectedRequest) return;
    
    setIsApproving(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/beta-access/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          adminNotes,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject beta request');
      }
      
      // Update the request in the list
      const updatedRequests = requests.map(request => 
        request.id === selectedRequest.id
          ? { 
              ...request, 
              status: 'REJECTED', 
              adminNotes: adminNotes || undefined,
            }
          : request
      );
      
      setRequests(updatedRequests);
      setSuccessMessage('Request has been rejected');
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-pulse text-[#22D3EE] text-xl">Loading beta requests...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Beta Access Requests</h1>
        <p className="text-gray-400">Manage beta program applications and approve users for early access.</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-900/20 border border-red-700 text-red-500 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-900/20 border border-green-700 text-green-500 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <select
            className="block w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            title="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="text-right">
          <span className="text-sm text-gray-400">
            Total: <span className="font-medium text-white">{filteredRequests.length}</span> requests
          </span>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#374151] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#374151]">
            <thead className="bg-[#1E293B]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    {isLoading ? 'Loading requests...' : 'No beta access requests found'}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr 
                    key={request.id} 
                    className="hover:bg-[#1E293B]/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#3CDFFF]/10 flex items-center justify-center">
                          <span className="text-[#3CDFFF] font-medium">
                            {request.firstName.charAt(0) + request.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            {request.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">{request.companyName}</div>
                      <div className="text-xs text-gray-400">{request.industry}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.isAiConsultant 
                          ? 'bg-purple-900/20 text-purple-400' 
                          : 'bg-blue-900/20 text-blue-400'
                      }`}>
                        {request.isAiConsultant ? 'AI Consultant' : 'End User'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'PENDING' 
                          ? 'bg-yellow-900/20 text-yellow-400' 
                          : request.status === 'APPROVED'
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-red-900/20 text-red-400'
                      }`}>
                        {request.status === 'PENDING' && <ClockIcon className="mr-1 h-3 w-3" />}
                        {request.status === 'APPROVED' && <CheckCircleIcon className="mr-1 h-3 w-3" />}
                        {request.status === 'REJECTED' && <XMarkIcon className="mr-1 h-3 w-3" />}
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button
                        className="text-[#22D3EE] hover:text-[#06B6D4]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#374151] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  Beta Access Request
                  <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedRequest.status === 'PENDING' 
                      ? 'bg-yellow-900/20 text-yellow-400' 
                      : selectedRequest.status === 'APPROVED'
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-red-900/20 text-red-400'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedRequest(null)}
                  aria-label="Close details"
                  title="Close details"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="bg-[#1E293B]/50 rounded-lg divide-y divide-[#374151]">
                    <div className="flex flex-wrap p-3">
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="font-medium">{`${selectedRequest.firstName} ${selectedRequest.lastName}`}</p>
                      </div>
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Email</p>
                        <div className="flex items-center">
                          <p className="font-medium truncate">{selectedRequest.email}</p>
                          <a 
                            href={`mailto:${selectedRequest.email}`} 
                            className="ml-2 text-[#3CDFFF] hover:text-[#4AFFD4]"
                            title="Send email"
                          >
                            <EnvelopeIcon className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Company Information</h3>
                  <div className="bg-[#1E293B]/50 rounded-lg divide-y divide-[#374151]">
                    <div className="flex flex-wrap p-3">
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Company</p>
                        <p className="font-medium">{selectedRequest.companyName}</p>
                      </div>
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Website</p>
                        <div className="flex items-center">
                          <a 
                            href={selectedRequest.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[#3CDFFF] hover:underline truncate"
                          >
                            {selectedRequest.companyWebsite.replace(/^https?:\/\//, '')}
                          </a>
                          <GlobeAltIcon className="ml-1 h-4 w-4 text-[#3CDFFF]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap p-3">
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Size</p>
                        <p className="font-medium">{selectedRequest.companySize}</p>
                      </div>
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Industry</p>
                        <p className="font-medium">{selectedRequest.industry}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Usage Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Usage Information</h3>
                  <div className="bg-[#1E293B]/50 rounded-lg divide-y divide-[#374151]">
                    <div className="flex flex-wrap p-3">
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Intended Use</p>
                        <p className="font-medium capitalize">{selectedRequest.intendedUse}</p>
                      </div>
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Usage Frequency</p>
                        <p className="font-medium">{selectedRequest.usageFrequency}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap p-3">
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Is AI Consultant</p>
                        <p className="font-medium">{selectedRequest.isAiConsultant ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Use Case</p>
                        <p className="font-medium">{selectedRequest.useCase}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Additional Information</h3>
                  <div className="bg-[#1E293B]/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedRequest.additionalInfo}</p>
                  </div>
                </div>
                
                {/* Reason for Joining Beta */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Reason for Joining Beta</h3>
                  <div className="bg-[#1E293B]/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedRequest.joinReason}</p>
                  </div>
                </div>
                
                {/* Request Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Request Information</h3>
                  <div className="bg-[#1E293B]/50 rounded-lg divide-y divide-[#374151]">
                    <div className="flex flex-wrap p-3">
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Request Date</p>
                        <p className="font-medium">{format(new Date(selectedRequest.requestDate), 'PPP')} ({format(new Date(selectedRequest.requestDate), 'p')})</p>
                      </div>
                      <div className="w-full md:w-1/2 p-2">
                        <p className="text-sm text-gray-400">Status</p>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedRequest.status === 'PENDING' 
                              ? 'bg-yellow-900/20 text-yellow-400' 
                              : selectedRequest.status === 'APPROVED'
                              ? 'bg-green-900/20 text-green-400'
                              : 'bg-red-900/20 text-red-400'
                          }`}>
                            {selectedRequest.status}
                            {selectedRequest.status === 'PENDING' && <ClockIcon className="ml-1 h-3 w-3" />}
                            {selectedRequest.status === 'APPROVED' && <CheckCircleIcon className="ml-1 h-3 w-3" />}
                            {selectedRequest.status === 'REJECTED' && <XMarkIcon className="ml-1 h-3 w-3" />}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedRequest.status === 'APPROVED' && (
                      <div className="p-3">
                        <div className="bg-green-900/20 border border-green-700/30 rounded-md p-3 text-sm">
                          <p className="text-gray-400 mb-1">Invite Code</p>
                          <div className="flex items-center justify-between">
                            <code className="font-mono text-green-400">{selectedRequest.inviteCode}</code>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              selectedRequest.inviteCodeUsed
                                ? 'bg-blue-900/20 text-blue-400'
                                : 'bg-green-900/20 text-green-400'
                            }`}>
                              {selectedRequest.inviteCodeUsed ? 'Used' : 'Not Used'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRequest.status === 'PENDING' && (
                  <>
                    <div className="mb-6">
                      <label htmlFor="admin-notes" className="block text-sm font-medium text-gray-400 mb-2">
                        Admin Notes (Optional)
                      </label>
                      <textarea
                        id="admin-notes"
                        rows={3}
                        className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                        placeholder="Add notes about this request..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-4">
                      <button
                        className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-md hover:bg-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        onClick={handleReject}
                        disabled={isApproving}
                      >
                        {isApproving ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-black font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50"
                        onClick={handleApprove}
                        disabled={isApproving}
                      >
                        {isApproving ? 'Processing...' : 'Approve & Generate Invite Code'}
                      </button>
                    </div>
                  </>
                )}

                {selectedRequest.status !== 'PENDING' && selectedRequest.adminNotes && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Admin Notes</h3>
                    <div className="bg-[#1E293B]/50 p-4 rounded-lg">
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {selectedRequest.adminNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';

import {
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
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
  useCase: string;
  additionalInfo: string;
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

    if (status === 'authenticated' && session?.user?.isAdmin) {
      fetchRequests();
    } else if (status === 'unauthenticated') {
      router.push('/admin-login');
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Applicant Information</h3>
                  <div className="bg-[#1E293B]/50 p-4 rounded-lg">
                    <p className="text-white font-medium">
                      {selectedRequest.firstName} {selectedRequest.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">{selectedRequest.email}</p>
                    <div className="mt-2 pt-2 border-t border-[#374151]">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedRequest.isAiConsultant 
                          ? 'bg-purple-900/20 text-purple-400' 
                          : 'bg-blue-900/20 text-blue-400'
                      }`}>
                        {selectedRequest.isAiConsultant ? 'AI Consultant' : 'End User'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Company Information</h3>
                  <div className="bg-[#1E293B]/50 p-4 rounded-lg">
                    <p className="text-white font-medium">{selectedRequest.companyName}</p>
                    <p className="text-gray-400 text-sm">
                      <a 
                        href={selectedRequest.companyWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#22D3EE] hover:underline"
                      >
                        {selectedRequest.companyWebsite}
                      </a>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#374151] text-gray-300">
                        {selectedRequest.industry}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#374151] text-gray-300">
                        {selectedRequest.companySize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Use Case</h3>
                <div className="bg-[#1E293B]/50 p-4 rounded-lg">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#374151] text-gray-300">
                      {selectedRequest.useCase}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {selectedRequest.additionalInfo}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Request Details</h3>
                <div className="bg-[#1E293B]/50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-xs text-gray-400">Request Date</p>
                      <p className="text-sm text-white">
                        {new Date(selectedRequest.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedRequest.status === 'APPROVED' && selectedRequest.approvalDate && (
                      <div>
                        <p className="text-xs text-gray-400">Approval Date</p>
                        <p className="text-sm text-white">
                          {new Date(selectedRequest.approvalDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {selectedRequest.status === 'APPROVED' && selectedRequest.inviteCode && (
                    <div className="mt-3 pt-3 border-t border-[#374151]">
                      <p className="text-xs text-gray-400">Invite Code</p>
                      <div className="mt-1 flex items-center">
                        <code className="bg-black/50 text-[#3CDFFF] px-2 py-1 rounded font-mono text-sm">
                          {selectedRequest.inviteCode}
                        </code>
                        <span className={`ml-3 text-xs ${selectedRequest.inviteCodeUsed ? 'text-green-400' : 'text-yellow-400'}`}>
                          {selectedRequest.inviteCodeUsed ? 'Used' : 'Not used yet'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin notes and actions */}
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
      )}
    </div>
  );
} 
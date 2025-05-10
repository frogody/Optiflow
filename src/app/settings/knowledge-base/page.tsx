'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  PlusIcon, 
  FolderIcon, 
  UserIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  GlobeAltIcon, 
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Types
interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'team' | 'organization';
  ownerId?: string;
  teamId?: string;
  organizationId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    documents: number;
  };
}

interface Team {
  id: string;
  name: string;
}

interface Organization {
  id: string;
  name: string;
}

// Mock teams and organizations for development
const mockTeams: Team[] = [
  { id: 'team-1', name: 'Engineering' },
  { id: 'team-2', name: 'Marketing' },
  { id: 'team-3', name: 'Product' },
];

const mockOrganizations: Organization[] = [
  { id: 'org-1', name: 'Acme Inc.' },
];

// Mock knowledge bases for development
const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: 'Personal Notes',
    description: 'My personal knowledge base for notes and documents',
    type: 'personal',
    ownerId: 'current-user',
    isPublic: false,
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-07-20T15:30:00Z',
    _count: { documents: 12 }
  },
  {
    id: 'kb-2',
    name: 'Engineering Documentation',
    description: 'Technical documentation for engineering team',
    type: 'team',
    teamId: 'team-1',
    isPublic: false,
    createdAt: '2023-05-10T09:00:00Z',
    updatedAt: '2023-07-25T11:45:00Z',
    _count: { documents: 35 }
  },
  {
    id: 'kb-3',
    name: 'Company Policies',
    description: 'Official company policies and procedures',
    type: 'organization',
    organizationId: 'org-1',
    isPublic: true,
    createdAt: '2023-04-05T14:00:00Z',
    updatedAt: '2023-07-15T16:20:00Z',
    _count: { documents: 28 }
  }
];

export default function KnowledgeBasePage() {
  const { data: session } = useSession();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedType, setSelectedType] = useState<'personal' | 'team' | 'organization'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedKb, setExpandedKb] = useState<string | null>(null);
  
  // Form state for creating a new KB
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'personal',
    teamId: '',
    organizationId: '',
    isPublic: false
  });
  
  // Load knowledge bases and related data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // For now, using mock data
        setKnowledgeBases(mockKnowledgeBases);
        setTeams(mockTeams);
        setOrganizations(mockOrganizations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching knowledge bases:', error);
        toast.error('Failed to load knowledge bases');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter knowledge bases by selected type
  const filteredKnowledgeBases = knowledgeBases.filter(kb => kb.type === selectedType);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Reset team/org ID when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        teamId: value === 'team' ? prev.teamId : '',
        organizationId: value === 'organization' ? prev.organizationId : ''
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    
    if (formData.type === 'team' && !formData.teamId) {
      toast.error('Team is required for team knowledge bases');
      return;
    }
    
    if (formData.type === 'organization' && !formData.organizationId) {
      toast.error('Organization is required for organization knowledge bases');
      return;
    }
    
    try {
      // In a real implementation, this would be an API call
      // For now, simulate created knowledge base
      const newKb: KnowledgeBase = {
        id: `kb-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        type: formData.type as 'personal' | 'team' | 'organization',
        ownerId: formData.type === 'personal' ? session?.user?.id : undefined,
        teamId: formData.type === 'team' ? formData.teamId : undefined,
        organizationId: formData.type === 'organization' ? formData.organizationId : undefined,
        isPublic: formData.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { documents: 0 }
      };
      
      setKnowledgeBases([...knowledgeBases, newKb]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        type: 'personal',
        teamId: '',
        organizationId: '',
        isPublic: false
      });
      
      toast.success('Knowledge base created successfully');
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      toast.error('Failed to create knowledge base');
    }
  };
  
  // Handle KB deletion
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge base? This action cannot be undone.')) {
      try {
        // In a real implementation, this would be an API call
        setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== id));
        toast.success('Knowledge base deleted successfully');
      } catch (error) {
        console.error('Error deleting knowledge base:', error);
        toast.error('Failed to delete knowledge base');
      }
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Toggle expanded KB
  const toggleExpandKb = (id: string) => {
    if (expandedKb === id) {
      setExpandedKb(null);
    } else {
      setExpandedKb(id);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#22D3EE]">Knowledge Base Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Create Knowledge Base
        </button>
      </div>
      
      {/* Tab navigation for KB types */}
      <div className="flex border-b border-[#374151] mb-6">
        <button
          onClick={() => setSelectedType('personal')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            selectedType === 'personal'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Personal
        </button>
        
        <button
          onClick={() => setSelectedType('team')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            selectedType === 'team'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          <UserGroupIcon className="h-4 w-4 mr-2" />
          Team
        </button>
        
        <button
          onClick={() => setSelectedType('organization')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            selectedType === 'organization'
              ? 'text-[#22D3EE] border-b-2 border-[#22D3EE]'
              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
          }`}
        >
          <BuildingOfficeIcon className="h-4 w-4 mr-2" />
          Organization
        </button>
      </div>
      
      {/* Knowledge Base List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-[#22D3EE] border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredKnowledgeBases.length === 0 ? (
            <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#374151]">
              <FolderIcon className="h-12 w-12 mx-auto text-[#9CA3AF] mb-4" />
              <h3 className="text-xl font-medium text-[#E5E7EB] mb-2">No Knowledge Bases</h3>
              <p className="text-[#9CA3AF] mb-6">
                {selectedType === 'personal'
                  ? "You haven't created any personal knowledge bases yet."
                  : selectedType === 'team'
                  ? "Your teams don't have any knowledge bases yet."
                  : "Your organization doesn't have any knowledge bases yet."}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
              >
                Create Your First Knowledge Base
              </button>
            </div>
          ) : (
            filteredKnowledgeBases.map((kb) => (
              <div 
                key={kb.id} 
                className="bg-[#1E293B] border border-[#374151] rounded-lg overflow-hidden hover:border-[#22D3EE] transition-colors"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpandKb(kb.id)}
                >
                  <div className="flex items-center">
                    <div className="bg-[#111111] p-2 rounded-lg mr-4">
                      {kb.type === 'personal' ? (
                        <UserIcon className="h-6 w-6 text-[#22D3EE]" />
                      ) : kb.type === 'team' ? (
                        <UserGroupIcon className="h-6 w-6 text-[#22D3EE]" />
                      ) : (
                        <BuildingOfficeIcon className="h-6 w-6 text-[#22D3EE]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-[#E5E7EB]">{kb.name}</h3>
                        {kb.isPublic && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-[#1E293B] text-[#22D3EE] border border-[#22D3EE] rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#9CA3AF] flex items-center mt-1">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        <span>{kb._count.documents} documents</span>
                        <span className="mx-2">•</span>
                        <span>Updated {formatDate(kb.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Link
                      href={`/settings/knowledge-base/${kb.id}`}
                      className="text-[#9CA3AF] hover:text-[#22D3EE] p-1 rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      className="text-[#9CA3AF] hover:text-[#F87171] p-1 rounded-md ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(kb.id);
                      }}
                      title="Delete knowledge base"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    {expandedKb === kb.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-[#9CA3AF] ml-2" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-[#9CA3AF] ml-2" />
                    )}
                  </div>
                </div>
                
                {/* Expanded section */}
                {expandedKb === kb.id && (
                  <div className="border-t border-[#374151] p-4">
                    {kb.description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-[#9CA3AF] mb-1">Description</h4>
                        <p className="text-[#E5E7EB]">{kb.description}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#9CA3AF] mb-1">Type</h4>
                        <p className="text-[#E5E7EB] capitalize">{kb.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#9CA3AF] mb-1">Created</h4>
                        <p className="text-[#E5E7EB]">{formatDate(kb.createdAt)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#9CA3AF] mb-1">Last Updated</h4>
                        <p className="text-[#E5E7EB]">{formatDate(kb.updatedAt)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/settings/knowledge-base/${kb.id}`}
                        className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                      >
                        Manage Documents
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Create Knowledge Base Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E293B] border border-[#374151] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#E5E7EB] mb-4">Create Knowledge Base</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Name <span className="text-[#F87171]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    placeholder="Knowledge Base Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                    Type <span className="text-[#F87171]">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    required
                  >
                    <option value="personal">Personal</option>
                    <option value="team">Team</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
                
                {/* Team selection, shown only when team type is selected */}
                {formData.type === 'team' && (
                  <div>
                    <label htmlFor="teamId" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Team <span className="text-[#F87171]">*</span>
                    </label>
                    <select
                      id="teamId"
                      name="teamId"
                      value={formData.teamId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      required
                    >
                      <option value="">Select a team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Organization selection, shown only when organization type is selected */}
                {formData.type === 'organization' && (
                  <div>
                    <label htmlFor="organizationId" className="block text-sm font-medium text-[#9CA3AF] mb-1">
                      Organization <span className="text-[#F87171]">*</span>
                    </label>
                    <select
                      id="organizationId"
                      name="organizationId"
                      value={formData.organizationId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      required
                    >
                      <option value="">Select an organization</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="rounded border-[#374151] text-[#22D3EE] focus:ring-[#22D3EE]"
                  />
                  <label htmlFor="isPublic" className="ml-2 text-sm text-[#E5E7EB]">
                    Make this knowledge base public
                  </label>
                </div>
                
                {formData.isPublic && (
                  <div className="bg-[#111111] p-3 rounded-md border border-[#374151]">
                    <div className="flex items-start">
                      <GlobeAltIcon className="h-5 w-5 text-[#22D3EE] mr-2 mt-0.5" />
                      <div className="text-xs text-[#9CA3AF]">
                        <p>Public knowledge bases are accessible to all users who have access to your team or organization. For personal knowledge bases, make them public to share with your teams.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#374151] text-[#E5E7EB] rounded-md hover:bg-[#374151] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
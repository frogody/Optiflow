'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { WorkflowTemplate } from '@/types/workflow';

// Mock templates data
const mockTemplates: WorkflowTemplate[] = [
  {
    id: 'lead-qualification',
    name: 'Lead Qualification Workflow',
    description: 'Automatically qualify leads based on website activity and engagement metrics. This template uses AI to analyze lead data and determine quality scores.',
    category: 'sales',
    tags: ['lead-gen', 'sales', 'ai'],
    appsUsed: ['crm', 'email', 'ai-agent'],
    popularity: 256,
    previewImage: '/workflow-templates/lead-qualification.svg',
    createdBy: 'Optiflow',
    createdAt: '2023-05-01T00:00:00Z',
    isOfficial: true
  },
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding Sequence',
    description: 'Guide new customers through product setup with personalized emails and training resources. Includes automatic check-ins and feedback collection.',
    category: 'customer-success',
    tags: ['onboarding', 'email', 'customer-success'],
    appsUsed: ['email', 'crm', 'scheduler'],
    popularity: 189,
    previewImage: '/workflow-templates/customer-onboarding.svg',
    createdBy: 'Optiflow',
    createdAt: '2023-05-15T00:00:00Z',
    isOfficial: true
  },
  {
    id: 'auto-meeting-scheduler',
    name: 'Automated Meeting Scheduler',
    description: 'Streamline meeting scheduling with prospects and clients. This workflow handles availability checking, sending calendar invites, and reminders.',
    category: 'productivity',
    tags: ['meetings', 'calendar', 'productivity'],
    appsUsed: ['calendar', 'email', 'crm'],
    popularity: 342,
    previewImage: '/workflow-templates/meeting-scheduler.svg',
    createdBy: 'Optiflow',
    createdAt: '2023-04-10T00:00:00Z',
    isOfficial: true
  },
  {
    id: 'sales-follow-up',
    name: 'Sales Follow-Up Sequence',
    description: 'Maintain consistent follow-up with prospects using this automated sequence with timing rules and engagement-based branching logic.',
    category: 'sales',
    tags: ['sales', 'email', 'follow-up'],
    appsUsed: ['email', 'crm', 'slack'],
    popularity: 217,
    previewImage: '/workflow-templates/sales-follow-up.svg',
    createdBy: 'Optiflow',
    createdAt: '2023-06-05T00:00:00Z',
    isOfficial: true
  },
  {
    id: 'content-approval',
    name: 'Content Approval Workflow',
    description: 'Streamline the content creation and approval process with automated routing, notifications, and version tracking.',
    category: 'marketing',
    tags: ['content', 'approval', 'marketing'],
    appsUsed: ['slack', 'asana', 'google-docs'],
    popularity: 124,
    previewImage: '/workflow-templates/content-approval.svg',
    createdBy: 'Marketing Team',
    createdAt: '2023-07-12T00:00:00Z',
    isOfficial: false
  },
  {
    id: 'support-ticket-triage',
    name: 'Support Ticket Triage',
    description: 'Automatically categorize and route support tickets based on content, urgency, and customer tier with AI analysis.',
    category: 'support',
    tags: ['support', 'ticketing', 'ai'],
    appsUsed: ['zendesk', 'slack', 'ai-agent'],
    popularity: 176,
    previewImage: '/workflow-templates/support-triage.svg',
    createdBy: 'Optiflow',
    createdAt: '2023-05-22T00:00:00Z',
    isOfficial: true
  },
  {
    id: 'social-media-scheduler',
    name: 'Social Media Content Scheduler',
    description: 'Plan, schedule and publish content across multiple social media platforms with approval workflows and analytics tracking.',
    category: 'marketing',
    tags: ['social-media', 'content', 'scheduling'],
    appsUsed: ['buffer', 'canva', 'google-analytics'],
    popularity: 201,
    previewImage: '/workflow-templates/social-scheduler.svg',
    createdBy: 'Digital Marketing',
    createdAt: '2023-06-18T00:00:00Z',
    isOfficial: false
  },
  {
    id: 'invoice-processing',
    name: 'Automated Invoice Processing',
    description: 'Extract data from invoices, route for approval, and sync with accounting software for payment processing.',
    category: 'finance',
    tags: ['finance', 'invoices', 'automation'],
    appsUsed: ['docparser', 'quickbooks', 'slack'],
    popularity: 152,
    previewImage: '/workflow-templates/invoice-processing.svg',
    createdBy: 'Finance Ops',
    createdAt: '2023-07-05T00:00:00Z',
    isOfficial: false
  },
  {
    id: 'lead-enrichment',
    name: 'Lead Data Enrichment',
    description: 'Automatically enrich lead data from multiple sources including LinkedIn, company databases, and third-party data providers.',
    category: 'sales',
    tags: ['lead-gen', 'data', 'enrichment'],
    appsUsed: ['clearbit', 'linkedin', 'crm'],
    popularity: 230,
    previewImage: '/workflow-templates/lead-enrichment.svg',
    createdBy: 'Optiflow',
    createdAt: '2023-05-10T00:00:00Z',
    isOfficial: true
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Collection',
    description: 'Automated system to collect, categorize, and route customer feedback from multiple channels including surveys, support tickets, and reviews.',
    category: 'customer-success',
    tags: ['feedback', 'surveys', 'voice-of-customer'],
    appsUsed: ['survey-monkey', 'slack', 'airtable'],
    popularity: 118,
    previewImage: '/workflow-templates/customer-feedback.svg',
    createdBy: 'Customer Success',
    createdAt: '2023-06-25T00:00:00Z',
    isOfficial: false
  },
  {
    id: 'website-monitoring',
    name: 'Website Performance Monitoring',
    description: 'Monitor website uptime, performance metrics, and error rates with automated alerts and incident response workflows.',
    category: 'development',
    tags: ['monitoring', 'alerts', 'website'],
    appsUsed: ['pingdom', 'pagerduty', 'slack'],
    popularity: 89,
    previewImage: '/workflow-templates/website-monitoring.svg',
    createdBy: 'DevOps',
    createdAt: '2023-07-15T00:00:00Z',
    isOfficial: false
  },
  {
    id: 'employee-onboarding',
    name: 'New Employee Onboarding',
    description: 'Streamline the employee onboarding process with automated tasks, resource provision, and scheduled check-ins.',
    category: 'human-resources',
    tags: ['hr', 'onboarding', 'employees'],
    appsUsed: ['bamboo-hr', 'slack', 'google-workspace'],
    popularity: 143,
    previewImage: '/workflow-templates/employee-onboarding.svg',
    createdBy: 'HR Operations',
    createdAt: '2023-06-10T00:00:00Z',
    isOfficial: false
  }
];

// Available categories
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'sales', name: 'Sales' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'customer-success', name: 'Customer Success' },
  { id: 'support', name: 'Support' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'finance', name: 'Finance' },
  { id: 'development', name: 'Development' },
  { id: 'human-resources', name: 'Human Resources' }
];

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'newest'>('popularity');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter templates
  const filteredTemplates = mockTemplates.filter(template => {
    // Filter by search query
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.popularity - a.popularity;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  // Handle template selection
  const handleTemplateClick = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setIsDetailModalOpen(true);
  };
  
  // Handle using a template
  const handleUseTemplate = (templateId: string) => {
    setIsDetailModalOpen(false);
    toast.success('Template selected. Creating new workflow...');
    
    // In a real app, this would create a new workflow from the template
    // Then redirect to the workflow editor
    setTimeout(() => {
      router.push('/workflow-editor');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Link 
              href="/workflows" 
              className="inline-flex items-center text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors mb-4"
            >
              <Icon name="arrow-left-" className="mr-2 h-4 w-4" />
              Back to Workflows
            </Link>
            <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Workflow Templates</h1>
            <p className="text-[#9CA3AF]">Pre-built workflow templates to get you started quickly</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111111] border border-[#374151] rounded-md py-2 pl-10 pr-4 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                aria-label="Filter by category"
                title="Category filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#111111] border border-[#374151] rounded-md py-2 px-3 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <select
                aria-label="Sort templates"
                title="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'newest')}
                className="bg-[#111111] border border-[#374151] rounded-md py-2 px-3 text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              >
                <option value="popularity">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        {sortedTemplates.length === 0 ? (
          <div className="text-center py-12 bg-[#18181B] border border-[#374151] rounded-lg">
            <p className="text-[#9CA3AF] mb-2">No templates found</p>
            <p className="text-sm text-[#9CA3AF]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <div 
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="bg-[#18181B] border border-[#374151] rounded-lg overflow-hidden cursor-pointer hover:border-[#22D3EE] transition-colors group"
              >
                {/* Template Preview Image */}
                <div className="h-48 bg-[#1E293B] relative">
                  {/* Placeholder for template preview - in a real app, this would be actual diagrams */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-[#374151]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#111111] bg-opacity-80 rounded-full p-1">
                    <Icon name="arrow-top-right-on-square-" className="h-5 w-5 text-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {template.isOfficial && (
                    <div className="absolute top-2 left-2 bg-[#111111] bg-opacity-80 rounded-full p-1">
                      <Icon name="check-badge-" className="h-5 w-5 text-[#22D3EE]" />
                    </div>
                  )}
                </div>
                
                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[#E5E7EB] font-medium">{template.name}</h3>
                    <div className="flex items-center text-[#9CA3AF] text-xs">
                      <Icon name="star-" className="h-4 w-4 mr-1" />
                      {template.popularity}
                    </div>
                  </div>
                  
                  <p className="text-[#9CA3AF] text-sm mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center text-xs">
                    <Icon name="tag-" className="h-3 w-3 text-[#9CA3AF] mr-1" />
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-[#374151] text-[#E5E7EB] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Template Detail Modal */}
      {isDetailModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#18181B] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#374151]">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-[#E5E7EB] mr-2">{selectedTemplate.name}</h2>
                    {selectedTemplate.isOfficial && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#022c22] text-[#10B981]">
                        <Icon name="check-badge-" className="mr-1 h-4 w-4" />
                        Official
                      </span>
                    )}
                  </div>
                  <p className="text-[#9CA3AF] mt-1">Created by {selectedTemplate.createdBy}</p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="rounded-full p-1 hover:bg-[#374151] text-[#9CA3AF]"
                  aria-label="Close template details"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Preview Image */}
              <div className="h-64 bg-[#1E293B] rounded-lg mb-6 flex items-center justify-center">
                {/* Placeholder for template preview */}
                <svg className="w-32 h-32 text-[#374151]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              
              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-sm text-[#9CA3AF] mb-1">Category</h3>
                  <p className="text-[#E5E7EB] capitalize">{selectedTemplate.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-[#9CA3AF] mb-1">Popularity</h3>
                  <div className="flex items-center text-[#E5E7EB]">
                    <Icon name="star-" className="h-4 w-4 text-[#F59E0B] mr-1" />
                    <span>{selectedTemplate.popularity} users</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm text-[#9CA3AF] mb-1">Created</h3>
                  <p className="text-[#E5E7EB]">
                    {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-medium text-[#E5E7EB] mb-2">Description</h3>
                <p className="text-[#9CA3AF]">{selectedTemplate.description}</p>
              </div>
              
              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-medium text-[#E5E7EB] mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-[#374151] text-sm text-[#E5E7EB] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Apps Used */}
              <div className="mb-6">
                <h3 className="font-medium text-[#E5E7EB] mb-2">Connected Apps</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.appsUsed.map(app => (
                    <span 
                      key={app} 
                      className="px-2 py-1 bg-[#1E293B] text-sm text-[#22D3EE] rounded-full border border-[#374151]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-[#374151] text-[#9CA3AF] rounded-md hover:text-[#E5E7EB] hover:border-[#6B7280] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUseTemplate(selectedTemplate.id)}
                  className="px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
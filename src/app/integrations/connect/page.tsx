'use client';

import { 
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import PipedreamConnectButton from '@/components/PipedreamConnectButton';

// Interface for integration items
interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  popular: boolean;
  featured: boolean;
}

// Mock integrations data - in a real app, this would come from an API
const mockIntegrations: Integration[] = [
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Connect your workflow with Slack channels and messages.',
    icon: '/icons/slack.svg',
    popular: true,
    featured: true
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    description: 'Automate email communication and notifications.',
    icon: '/icons/gmail.svg',
    popular: true,
    featured: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    description: 'Sync customer data and automate CRM workflows.',
    icon: '/icons/hubspot.svg',
    popular: true,
    featured: false
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    category: 'Productivity',
    description: 'Automate data entry and reporting in spreadsheets.',
    icon: '/icons/sheets.svg',
    popular: true,
    featured: true
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Development',
    description: 'Connect with thousands of apps through Zapier.',
    icon: '/icons/zapier.svg',
    popular: true,
    featured: false
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Finance',
    description: 'Automate payment processing and financial workflows.',
    icon: '/icons/stripe.svg',
    popular: false,
    featured: false
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'Productivity',
    description: 'Streamline task management and project workflows.',
    icon: '/icons/asana.svg',
    popular: false,
    featured: false
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Development',
    description: 'Automate development workflows and code reviews.',
    icon: '/icons/github.svg',
    popular: true,
    featured: true
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Finance',
    description: 'Connect accounting data with your automation workflows.',
    icon: '/icons/quickbooks.svg',
    popular: false,
    featured: false
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Marketing',
    description: 'Automate email marketing campaigns and subscriber management.',
    icon: '/icons/mailchimp.svg',
    popular: true,
    featured: false
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    description: 'Connect your CRM data with other business tools.',
    icon: '/icons/salesforce.svg',
    popular: true,
    featured: false
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'Analytics',
    description: 'Automate reporting and data collection for web analytics.',
    icon: '/icons/analytics.svg',
    popular: false,
    featured: false
  },
  {
    id: 'twitter',
    name: 'Twitter',
    category: 'Social Media',
    description: 'Schedule posts and monitor engagement automatically.',
    icon: '/icons/twitter.svg',
    popular: false,
    featured: false
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'Productivity',
    description: 'Automate board updates and task management.',
    icon: '/icons/trello.svg',
    popular: false,
    featured: false
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Productivity',
    description: 'Automate file management and document workflows.',
    icon: '/icons/dropbox.svg',
    popular: false,
    featured: false
  }
];

// Categories
const categories = [
  { id: 'all', name: 'All' },
  { id: 'communication', name: 'Communication' },
  { id: 'crm', name: 'CRM' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'development', name: 'Development' },
  { id: 'finance', name: 'Finance' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'social-media', name: 'Social Media' }
];

export default function ConnectIntegrationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  
  // Filtered integrations based on search query and category
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      integration.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  // Featured integrations
  const featuredIntegrations = integrations.filter(integration => integration.featured);
  
  // Group integrations by category
  const integrationsByCategory = categories.slice(1).map(category => ({
    ...category,
    integrations: filteredIntegrations.filter(
      integration => integration.category.toLowerCase() === category.id.toLowerCase()
    )
  })).filter(category => category.integrations.length > 0);
  
  // Handle successful connection
  const handleSuccessfulConnection = (integrationId: string, accountId: string) => {
    toast.success(`Successfully connected to ${integrationId}`);
    // In a real app, this would redirect to the integration detail page
    // or update the UI to show the connection was successful
    router.push('/integrations');
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/integrations" 
            className="inline-flex items-center text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Integrations Hub
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Connect a New Integration</h1>
          <p className="text-[#9CA3AF]">
            Select an app to connect with Optiflow and extend your workflow capabilities.
          </p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Search Box */}
            <div className="col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for an integration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111111] border border-[#374151] rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#111111] border border-[#374151] rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Featured Integrations */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <div className="mb-8">
            <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">Featured Integrations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredIntegrations.map(integration => (
                <motion.div
                  key={integration.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#18181B] border border-[#374151] rounded-lg p-4"
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-[#1E293B] rounded-md flex items-center justify-center mr-3">
                      <Image 
                        src={integration.icon} 
                        alt={integration.name} 
                        width={24} 
                        height={24} 
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#E5E7EB]">{integration.name}</h3>
                      <p className="text-xs text-[#9CA3AF]">{integration.category}</p>
                    </div>
                  </div>
                  <PipedreamConnectButton
                    appSlug={integration.id}
                    buttonText={`Connect ${integration.name}`}
                    onSuccess={(accountId) => handleSuccessfulConnection(integration.id, accountId)}
                    onError={(error) => toast.error(`Failed to connect ${integration.name}: ${error.message}`)}
                    className="w-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* All or Filtered Integrations by Category */}
        <div className="space-y-8">
          {selectedCategory === 'all' && filteredIntegrations.length > 0 ? (
            integrationsByCategory.map(category => (
              <div key={category.id}>
                <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.integrations.map(integration => (
                    <motion.div
                      key={integration.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-[#18181B] border border-[#374151] rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-[#1E293B] rounded-md flex items-center justify-center mr-3">
                            <Image 
                              src={integration.icon} 
                              alt={integration.name} 
                              width={24} 
                              height={24} 
                              className="h-6 w-6"
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-[#E5E7EB]">{integration.name}</h3>
                          </div>
                        </div>
                        {integration.popular && (
                          <div className="flex items-center text-xs text-[#F59E0B]">
                            <StarIcon className="h-3 w-3 mr-1" />
                            Popular
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#9CA3AF] mb-4 line-clamp-2">{integration.description}</p>
                      <PipedreamConnectButton
                        appSlug={integration.id}
                        buttonText="Connect"
                        onSuccess={(accountId) => handleSuccessfulConnection(integration.id, accountId)}
                        onError={(error) => toast.error(`Failed to connect ${integration.name}: ${error.message}`)}
                        className="w-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#18181B] border border-[#374151] rounded-lg">
              {filteredIntegrations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[#9CA3AF] mb-4">No integrations found matching your search criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-[#22D3EE] hover:text-[#06B6D4] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <h2 className="text-xl font-medium text-[#E5E7EB] mb-4">
                    {selectedCategory === 'all' ? 'All Integrations' : categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIntegrations.map(integration => (
                      <motion.div
                        key={integration.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#1E293B] border border-[#374151] rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-[#111111] rounded-md flex items-center justify-center mr-3">
                              <Image 
                                src={integration.icon} 
                                alt={integration.name} 
                                width={24} 
                                height={24} 
                                className="h-6 w-6"
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-[#E5E7EB]">{integration.name}</h3>
                            </div>
                          </div>
                          {integration.popular && (
                            <div className="flex items-center text-xs text-[#F59E0B]">
                              <StarIcon className="h-3 w-3 mr-1" />
                              Popular
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#9CA3AF] mb-4 line-clamp-2">{integration.description}</p>
                        <PipedreamConnectButton
                          appSlug={integration.id}
                          buttonText="Connect"
                          onSuccess={(accountId) => handleSuccessfulConnection(integration.id, accountId)}
                          onError={(error) => toast.error(`Failed to connect ${integration.name}: ${error.message}`)}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* CTA for Integration Request */}
        <div className="mt-8 bg-[#1E293B] border border-[#374151] rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-[#E5E7EB] mb-2">Can't find what you're looking for?</h2>
          <p className="text-[#9CA3AF] mb-4">
            We're constantly adding new integrations to Optiflow. Let us know what you need!
          </p>
          <Link
            href="/integrations/request"
            className="inline-block px-4 py-2 bg-[#22D3EE] text-[#111111] rounded-md hover:bg-[#06B6D4] transition-colors"
          >
            Request a New Integration
          </Link>
        </div>
      </div>
    </div>
  );
} 
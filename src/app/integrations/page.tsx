'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

// Interface for integration items
interface Integration {
  name: string;
  category: string;
  description: string;
  icon: string;
  popular: boolean;
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Categories
  const categories = [
    'All',
    'CRM',
    'Marketing',
    'Communication',
    'Productivity',
    'Development',
    'Finance',
    'Analytics',
    'Social Media'
  ];
  
  // Mock integrations data
  const integrations: Integration[] = [
    {
      name: 'Slack',
      category: 'Communication',
      description: 'Connect your workflow with Slack channels and messages.',
      icon: '/icons/slack.svg',
      popular: true
    },
    {
      name: 'Gmail',
      category: 'Communication',
      description: 'Automate email communication and notifications.',
      icon: '/icons/gmail.svg',
      popular: true
    },
    {
      name: 'HubSpot',
      category: 'CRM',
      description: 'Sync customer data and automate CRM workflows.',
      icon: '/icons/hubspot.svg',
      popular: true
    },
    {
      name: 'Google Sheets',
      category: 'Productivity',
      description: 'Automate data entry and reporting in spreadsheets.',
      icon: '/icons/sheets.svg',
      popular: true
    },
    {
      name: 'Zapier',
      category: 'Development',
      description: 'Connect with thousands of apps through Zapier.',
      icon: '/icons/zapier.svg',
      popular: false
    },
    {
      name: 'Stripe',
      category: 'Finance',
      description: 'Automate payment processing and financial workflows.',
      icon: '/icons/stripe.svg',
      popular: true
    },
    {
      name: 'Asana',
      category: 'Productivity',
      description: 'Streamline task management and project workflows.',
      icon: '/icons/asana.svg',
      popular: false
    },
    {
      name: 'GitHub',
      category: 'Development',
      description: 'Automate development workflows and code reviews.',
      icon: '/icons/github.svg',
      popular: true
    },
    {
      name: 'QuickBooks',
      category: 'Finance',
      description: 'Connect accounting data with your automation workflows.',
      icon: '/icons/quickbooks.svg',
      popular: false
    },
    {
      name: 'Mailchimp',
      category: 'Marketing',
      description: 'Automate email marketing campaigns and subscriber management.',
      icon: '/icons/mailchimp.svg',
      popular: true
    },
    {
      name: 'Salesforce',
      category: 'CRM',
      description: 'Connect your CRM data with other business tools.',
      icon: '/icons/salesforce.svg',
      popular: true
    },
    {
      name: 'Google Analytics',
      category: 'Analytics',
      description: 'Automate reporting and data collection for web analytics.',
      icon: '/icons/analytics.svg',
      popular: false
    },
    {
      name: 'Twitter',
      category: 'Social Media',
      description: 'Schedule posts and monitor engagement automatically.',
      icon: '/icons/twitter.svg',
      popular: false
    },
    {
      name: 'Trello',
      category: 'Productivity',
      description: 'Automate board updates and task management.',
      icon: '/icons/trello.svg',
      popular: false
    },
    {
      name: 'Dropbox',
      category: 'Productivity',
      description: 'Automate file management and document workflows.',
      icon: '/icons/dropbox.svg',
      popular: false
    }
  ];
  
  // Filter integrations by search query and category
  const filteredIntegrations = integrations.filter(integration => {
    const matchesQuery = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });
  
  // Group popular integrations
  const popularIntegrations = integrations.filter(integration => integration.popular);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute w-[300px] h-[300px] rounded-full left-1/4 top-1/4 bg-[#3CDFFF] opacity-10 blur-[100px]"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full right-1/4 bottom-1/3 bg-[#4AFFD4] opacity-10 blur-[100px]"></div>
        
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              700+ <span className="text-gradient">Integrations</span> for Your Workflow
            </h1>
            
            <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
              Connect all your favorite tools and services with our extensive library of integrations. Streamline your workflow and boost productivity.
            </p>
            
            {/* Search box */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-white/5 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CDFFF]/50 focus:border-transparent"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Popular Integrations Section */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Popular Integrations</h2>
            
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {popularIntegrations.map((integration, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="feature-card p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <div className="text-2xl">
                      {integration.name.charAt(0)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1">{integration.name}</h3>
                  <p className="text-xs text-gray-400">{integration.category}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Categories Tabs */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#3CDFFF]/20 text-[#3CDFFF] border border-[#3CDFFF]/30'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Integrations */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredIntegrations.length > 0 ? (
              filteredIntegrations.map((integration, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="feature-card p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden group hover:border-[#3CDFFF]/30 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                      <div className="text-xl">
                        {integration.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{integration.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">{integration.category}</p>
                      <p className="text-sm text-gray-300">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Link
                      href="#"
                      className="text-sm text-[#3CDFFF] hover:underline"
                    >
                      Learn more about this integration
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-400">No integrations found matching your criteria.</p>
                <button
                  className="mt-4 text-[#3CDFFF] hover:underline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#3CDFFF]/10 to-[#4AFFD4]/10 rounded-2xl p-10 border border-white/10">
            <h2 className="text-3xl font-bold mb-4">
              Need a Custom Integration?
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
              Our team can build custom integrations for your specific business needs. Contact us to learn more.
            </p>
            
            <Link 
              href="/enterprise" 
              className="px-8 py-3 bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] rounded-lg text-black font-medium hover:opacity-90 transition-opacity inline-block"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 
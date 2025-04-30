'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineCube, HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import PipedreamConnectButton from '@/components/PipedreamConnectButton';
import { toast } from 'react-hot-toast';

// Interface for integration items
interface Integration {
  name: string;
  category: string;
  description: string;
  icon: string;
  popular: boolean;
}

// Enhanced floating particle component
const FloatingParticle = ({ delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        y: [-20, 0, -20],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        width: '2px',
        height: '2px',
        background: 'radial-gradient(circle at center, #1E90FF, #00BFFF)',
        boxShadow: '0 0 8px #1E90FF',
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        willChange: 'transform, opacity',
      }}
    />
  );
};

// Enhanced aurora effect component
const AuroraEffect = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(60,223,255,0.1), rgba(74,255,212,0.1), transparent)',
          filter: 'blur(100px)',
        }}
      />
    </motion.div>
  );
};

// Enhanced gradient orb component
const GradientOrb = ({ delay = 0, size = 600, color = 'blue' }) => {
  const gradients = {
    blue: 'from-[#3CDFFF]/20 to-[#4AFFD4]/20',
    purple: 'from-[#4AFFD4]/20 to-[#3CDFFF]/20',
    mixed: 'from-[#3CDFFF]/20 via-[#4AFFD4]/20 to-[#3CDFFF]/20'
  };

  return (
    <motion.div
      className={`absolute w-[${size}px] h-[${size}px] rounded-full blur-[120px] bg-gradient-to-r ${gradients[color]}`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0.1, 0.2, 0.1],
        scale: [1, 1.2, 1],
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        rotate: [0, Math.random() * 90 - 45, 0],
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    />
  );
};

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-gray-200/20 shadow-lg"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg">
          <Image
            src={integration.icon}
            alt={integration.name}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
          <p className="text-sm text-gray-400">{integration.category}</p>
        </div>
      </div>
      <p className="text-gray-300 mb-4">{integration.description}</p>
      <div className="flex justify-between items-center">
        {integration.popular && (
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
            Popular
          </span>
        )}
        <PipedreamConnectButton
          appSlug={integration.name.toLowerCase().replace(/\s+/g, '_')}
          buttonText={`Connect ${integration.name}`}
          onSuccess={(accountId) => {
            console.log(`Successfully connected ${integration.name}:`, accountId);
            toast.success(`Successfully connected ${integration.name}`);
          }}
          onError={(error) => {
            console.error(`Error connecting ${integration.name}:`, error);
            toast.error(`Failed to connect ${integration.name}`);
          }}
          className="ml-auto"
        />
      </div>
    </motion.div>
  );
};

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  // Categories with icons
  const categories = [
    { name: 'All', icon: HiOutlineCube },
    { name: 'CRM', icon: HiOutlineSparkles },
    { name: 'Marketing', icon: HiOutlineLightningBolt },
    { name: 'Communication', icon: HiOutlineCube },
    { name: 'Productivity', icon: HiOutlineSparkles },
    { name: 'Development', icon: HiOutlineLightningBolt },
    { name: 'Finance', icon: HiOutlineCube },
    { name: 'Analytics', icon: HiOutlineSparkles },
    { name: 'Social Media', icon: HiOutlineLightningBolt }
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
      popular: true
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
      popular: true
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
      popular: true
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
      popular: true
    },
    {
      name: 'Twitter',
      category: 'Social Media',
      description: 'Schedule posts and monitor engagement automatically.',
      icon: '/icons/twitter.svg',
      popular: true
    },
    {
      name: 'Trello',
      category: 'Productivity',
      description: 'Automate board updates and task management.',
      icon: '/icons/trello.svg',
      popular: true
    },
    {
      name: 'Dropbox',
      category: 'Productivity',
      description: 'Automate file management and document workflows.',
      icon: '/icons/dropbox.svg',
      popular: true
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
  
  // Generate particles
  const particles = Array.from({ length: 50 }).map((_, i) => (
    <FloatingParticle key={i} delay={i * 0.1} />
  ));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h1>
          
          <div className="space-y-6">
            {/* Main Pipedream Connect Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Pipedream Connect</h2>
              <p className="text-gray-600 mb-4">
                Connect your third-party accounts through Pipedream to enable seamless integration with various services.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Popular Integrations */}
                {popularIntegrations.slice(0, 6).map((integration) => (
                  <div 
                    key={integration.name}
                    className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-gray-200/20"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded">
                        <Image
                          src={integration.icon}
                          alt={integration.name}
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{integration.name}</span>
                    </div>
                    <PipedreamConnectButton
                      appSlug={integration.name.toLowerCase().replace(/\s+/g, '_')}
                      buttonText={`Connect ${integration.name}`}
                      onSuccess={(accountId) => {
                        console.log(`Successfully connected ${integration.name}:`, accountId);
                        toast.success(`Successfully connected ${integration.name}`);
                      }}
                      onError={(error) => {
                        console.error(`Error connecting ${integration.name}:`, error);
                        toast.error(`Failed to connect ${integration.name}`);
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* All Integrations Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Integrations</h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search integrations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                  <IntegrationCard key={integration.name} integration={integration} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
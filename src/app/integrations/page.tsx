'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineCube, HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import { PipedreamConnect } from '@/components/integrations/PipedreamConnect';

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
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Pipedream Connect</h2>
              <p className="text-gray-600 mb-4">
                Connect your third-party accounts through Pipedream to enable seamless integration with various services.
              </p>
              <PipedreamConnect
                onSuccess={(connection) => {
                  console.log('Connection successful:', connection);
                  // Handle successful connection (e.g., update UI, store connection info)
                }}
                onError={(error) => {
                  console.error('Connection error:', error);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { useUserStore } from '@/lib/userStore';
import MCPConnections from '@/components/MCPConnections';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Integration {
  name: string;
  icon: string;
  description: string;
  features: string[];
  category: string;
}

export default function ConnectionsPage() {
  const { currentUser } = useUserStore();
  
  const integrations: Integration[] = [
    {
      name: 'Clay',
      icon: '/icons/clay.svg',
      description: 'Automate lead enrichment and validation with Clay\'s powerful data platform.',
      category: 'Data Enrichment',
      features: [
        'Automated lead enrichment',
        'Real-time data validation',
        'Custom data mapping',
        'Bulk processing capabilities'
      ]
    },
    {
      name: 'HubSpot',
      icon: '/icons/hubspot.svg',
      description: 'Seamlessly integrate with HubSpot\'s CRM and marketing automation tools.',
      category: 'CRM & Marketing',
      features: [
        'Bi-directional sync',
        'Contact management',
        'Deal tracking',
        'Marketing automation'
      ]
    },
    {
      name: 'n8n',
      icon: '/icons/n8n.svg',
      description: 'Build powerful automation workflows with n8n\'s flexible integration platform.',
      category: 'Workflow Automation',
      features: [
        'Visual workflow builder',
        'Custom triggers',
        'Error handling',
        'Webhook support'
      ]
    },
    {
      name: 'Gmail',
      icon: '/icons/gmail.svg',
      description: 'Connect your email workflows with Gmail\'s comprehensive API integration.',
      category: 'Communication',
      features: [
        'Email automation',
        'Template management',
        'Attachment handling',
        'Thread tracking'
      ]
    }
  ];

  // If user is logged in, show the management interface
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Connected Services</h1>
              <p className="mt-2 text-lg text-white/60">
                Manage your MCP server connections and integrate with various services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-medium text-white/60">Connected Services</p>
                <p className="mt-2 text-3xl font-bold text-white">4</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-medium text-white/60">Active Flows</p>
                <p className="mt-2 text-3xl font-bold text-white">12</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm font-medium text-white/60">Total API Calls</p>
                <p className="mt-2 text-3xl font-bold text-white">1,234</p>
              </div>
            </div>

            <MCPConnections />
          </div>
        </main>
      </div>
    );
  }

  // Public-facing connections page
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Connect Your Stack with
              <span className="gradient-text block">Model Context Protocol</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Integrate with over 2,500 apps and APIs through our powerful MCP server connections.
              Build, automate, and scale your workflows with enterprise-grade reliability.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 text-base font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-200"
              >
                Start Building
              </Link>
              <Link
                href="/docs/mcp"
                className="px-6 py-3 text-base font-medium text-white border border-white/10 rounded-full hover:bg-white/5 transition-all duration-200"
              >
                View Documentation
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Universal Compatibility',
                description: 'Connect to any service with our standardized MCP protocol.',
                icon: '🔌'
              },
              {
                title: 'Secure by Design',
                description: 'Enterprise-grade security with encrypted connections and key management.',
                icon: '🔒'
              },
              {
                title: 'Real-time Sync',
                description: 'Keep your data in sync with real-time bi-directional updates.',
                icon: '⚡'
              }
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Integrations */}
          <div>
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Popular Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={integration.icon}
                        alt={integration.name}
                        layout="fill"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                        <span className="px-2 py-1 text-xs font-medium text-white/60 bg-white/5 rounded-full">
                          {integration.category}
                        </span>
                      </div>
                      <p className="mt-2 text-white/80">{integration.description}</p>
                      <ul className="mt-4 grid grid-cols-2 gap-2">
                        {integration.features.map((feature) => (
                          <li key={feature} className="flex items-center text-sm text-white/60">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Connect Your Stack?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Join thousands of companies using our MCP server connections to build powerful integrations.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 text-base font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 text-base font-medium text-white border border-white/10 rounded-full hover:bg-white/5 transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
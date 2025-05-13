'use client';

import {
  ArrowRightIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  DocumentTextIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  // Categories matching those in layout for consistency
  const categories = [
    {
      name: 'Getting Started',
      href: '/help/getting-started',
      icon: RocketLaunchIcon,
      description: 'Learn the basics of Sync and set up your account',
    },
    {
      name: 'Workflows',
      href: '/help/workflows',
      icon: WrenchScrewdriverIcon,
      description: 'Create, configure, and monitor your automation workflows',
    },
    {
      name: 'Voice Agent (Jarvis)',
      href: '/help/voice-agent',
      icon: MicrophoneIcon,
      description: 'Set up and use Jarvis, your AI voice assistant',
    },
    {
      name: 'Integrations',
      href: '/help/integrations',
      icon: PuzzlePieceIcon,
      description: 'Connect with apps and services you already use',
    },
    {
      name: 'Troubleshooting',
      href: '/help/troubleshooting',
      icon: QuestionMarkCircleIcon,
      description: 'Solve common problems and find answers to your questions',
    },
    {
      name: 'API Reference',
      href: '/help/api',
      icon: BookOpenIcon,
      description: 'Detailed documentation for developers',
    },
  ];

  // Featured article content
  const featuredArticles = [
    {
      title: 'Creating Your First Workflow',
      href: '/help/getting-started/first-workflow',
      description: 'Learn how to create a simple workflow in just a few minutes',
      icon: RocketLaunchIcon,
      category: 'Getting Started',
      readTime: '5 min read',
    },
    {
      title: 'Setting Up Jarvis Voice Commands',
      href: '/help/voice-agent/commands',
      description: 'Configure your voice agent to respond to custom commands',
      icon: MicrophoneIcon,
      category: 'Voice Agent',
      readTime: '7 min read',
    },
    {
      title: 'Connecting to Third-Party Applications',
      href: '/help/integrations/connecting',
      description: 'Step-by-step guide to integrating external services',
      icon: PuzzlePieceIcon,
      category: 'Integrations',
      readTime: '4 min read',
    },
    {
      title: 'Using Conditional Logic in Workflows',
      href: '/help/workflows/conditional-logic',
      description: 'Create dynamic workflows with if/then branches and conditions',
      icon: WrenchScrewdriverIcon,
      category: 'Workflows',
      readTime: '8 min read',
    },
  ];

  // Recent articles for recent updates section
  const recentArticles = [
    {
      title: 'New: Voice Analytics Dashboard',
      href: '/help/voice-agent/analytics',
      date: 'Updated 2 days ago',
    },
    {
      title: 'Workflow Debugging Best Practices',
      href: '/help/workflows/debugging',
      date: 'Updated 4 days ago',
    },
    {
      title: 'Understanding Sync Rate Limits',
      href: '/help/api/rate-limits',
      date: 'Updated 1 week ago',
    },
    {
      title: 'Security & Compliance Guide',
      href: '/help/account/security',
      date: 'Updated 1 week ago',
    },
    {
      title: 'Upgrading to Enterprise Plan',
      href: '/help/billing/enterprise',
      date: 'Updated 2 weeks ago',
    },
  ];

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would navigate to a search results page
    console.log(`Searching for: ${searchQuery}`);
  };

  return (
    <div>
      {/* Hero section with main search */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#22D3EE] mb-4">Sync Help Center</h1>
        <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-8">
          Find guides, tutorials, and answers to help you get the most out of Sync
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-[#6B7280]" />
            </div>
            <input
              type="text"
              placeholder="What can we help you with?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent text-lg"
            />
            <button
              type="submit"
              className="absolute inset-y-1 right-1 px-4 bg-[#22D3EE] text-[#111111] font-medium rounded-md hover:bg-[#06B6D4] transition-colors"
            >
              Search
            </button>
          </div>
          <div className="mt-2 text-sm text-[#9CA3AF] flex justify-center space-x-2">
            <span>Popular:</span>
            <Link href="/help/getting-started/first-workflow" className="text-[#22D3EE] hover:text-[#06B6D4]">
              First workflow
            </Link>
            <Link href="/help/voice-agent/setup" className="text-[#22D3EE] hover:text-[#06B6D4]">
              Jarvis setup
            </Link>
            <Link href="/help/integrations/connecting" className="text-[#22D3EE] hover:text-[#06B6D4]">
              Connecting apps
            </Link>
          </div>
        </form>
      </div>
      
      {/* Support options section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link 
          href="/help/contact-support" 
          className="flex flex-col items-center p-6 bg-[#111111] border border-[#374151] rounded-lg hover:border-[#22D3EE] transition-colors"
        >
          <LifebuoyIcon className="h-12 w-12 text-[#22D3EE] mb-4" />
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Contact Support</h3>
          <p className="text-sm text-[#9CA3AF] text-center">
            Get help from our support team
          </p>
        </Link>
        
        <Link 
          href="/help/community" 
          className="flex flex-col items-center p-6 bg-[#111111] border border-[#374151] rounded-lg hover:border-[#A855F7] transition-colors"
        >
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-[#A855F7] mb-4" />
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">Community Forum</h3>
          <p className="text-sm text-[#9CA3AF] text-center">
            Join discussions and share solutions
          </p>
        </Link>
        
        <Link 
          href="https://status.sync.com" 
          className="flex flex-col items-center p-6 bg-[#111111] border border-[#374151] rounded-lg hover:border-[#22D3EE] transition-colors"
          target="_blank"
        >
          <DocumentTextIcon className="h-12 w-12 text-[#22D3EE] mb-4" />
          <h3 className="text-lg font-medium text-[#E5E7EB] mb-2">System Status</h3>
          <p className="text-sm text-[#9CA3AF] text-center">
            Check current operational status
          </p>
        </Link>
      </div>
      
      {/* Categories section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex p-6 bg-[#111111] border border-[#374151] rounded-lg hover:border-[#22D3EE] transition-colors"
            >
              <div className="mr-4">
                <div className="p-3 bg-[#1E293B] rounded-md group-hover:bg-[#134e4a] transition-colors">
                  <category.icon className="h-6 w-6 text-[#22D3EE]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-1 group-hover:text-[#22D3EE] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-[#9CA3AF]">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured articles section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#E5E7EB]">Featured Articles</h2>
          <Link href="/help/featured" className="text-[#22D3EE] hover:text-[#06B6D4] flex items-center text-sm font-medium">
            <span>View all featured</span>
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="flex flex-col bg-[#111111] border border-[#374151] rounded-lg overflow-hidden hover:border-[#22D3EE] transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-[#1E293B] rounded-md">
                      <article.icon className="h-5 w-5 text-[#22D3EE]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-xs font-medium text-[#A855F7]">{article.category}</span>
                    <h3 className="mt-1 text-lg font-medium text-[#E5E7EB] hover:text-[#22D3EE] transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#9CA3AF]">
                      {article.description}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-[#6B7280]">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent updates and popular sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Recent updates */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#E5E7EB]">Recent Updates</h2>
            <Link href="/help/recent" className="text-[#22D3EE] hover:text-[#06B6D4] flex items-center text-sm font-medium">
              <span>View all</span>
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-[#111111] border border-[#374151] rounded-lg overflow-hidden">
            <ul className="divide-y divide-[#374151]">
              {recentArticles.map((article) => (
                <li key={article.title}>
                  <Link 
                    href={article.href}
                    className="block p-4 hover:bg-[#1E293B] transition-colors"
                  >
                    <h3 className="text-[#E5E7EB] font-medium hover:text-[#22D3EE]">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {article.date}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Popular topics */}
        <div>
          <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">Popular Topics</h2>
          <div className="bg-[#111111] border border-[#374151] rounded-lg overflow-hidden">
            <ul className="divide-y divide-[#374151]">
              {[
                { title: 'How to reset your password', href: '/help/account/reset-password' },
                { title: 'Connecting to Slack', href: '/help/integrations/slack' },
                { title: 'Troubleshooting API errors', href: '/help/api/troubleshooting' },
                { title: 'Voice agent not responding', href: '/help/voice-agent/troubleshooting' },
                { title: 'Billing FAQ', href: '/help/billing/faq' },
              ].map((topic) => (
                <li key={topic.title}>
                  <Link 
                    href={topic.href}
                    className="flex items-center p-4 hover:bg-[#1E293B] transition-colors"
                  >
                    <BookmarkIcon className="h-4 w-4 text-[#22D3EE] mr-2" />
                    <span className="text-[#E5E7EB] hover:text-[#22D3EE]">
                      {topic.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Community CTA */}
      <div className="mt-12 bg-gradient-to-r from-[#134e4a] to-[#1e1b4b] rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
        <p className="text-[#D1D5DB] mb-6 max-w-2xl mx-auto">
          Connect with other Sync users, share your workflows, and get help from the community.
        </p>
        <Link
          href="/help/community"
          className="inline-block px-6 py-3 bg-[#22D3EE] text-[#111111] font-bold rounded-md hover:bg-[#06B6D4] transition-colors"
        >
          Visit Community Forum
        </Link>
      </div>
    </div>
  );
} 
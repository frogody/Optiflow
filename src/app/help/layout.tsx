'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  BookOpenIcon, 
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  MicrophoneIcon,
  PuzzlePieceIcon,
  CreditCardIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Define help center categories and their subcategories
const helpCategories = [
  {
    name: 'Getting Started',
    href: '/help/getting-started',
    icon: RocketLaunchIcon,
    children: [
      { name: 'Platform Overview', href: '/help/getting-started/overview' },
      { name: 'Creating Your Account', href: '/help/getting-started/account-setup' },
      { name: 'First Workflow Guide', href: '/help/getting-started/first-workflow' },
      { name: 'Optiflow Dashboard', href: '/help/getting-started/dashboard' },
    ]
  },
  {
    name: 'Workflows',
    href: '/help/workflows',
    icon: WrenchScrewdriverIcon,
    children: [
      { name: 'Workflow Basics', href: '/help/workflows/basics' },
      { name: 'Building Workflows', href: '/help/workflows/building' },
      { name: 'Triggers & Actions', href: '/help/workflows/triggers-actions' },
      { name: 'Conditional Logic', href: '/help/workflows/conditional-logic' },
      { name: 'Testing & Debugging', href: '/help/workflows/testing' },
    ]
  },
  {
    name: 'Voice Agent (Jarvis)',
    href: '/help/voice-agent',
    icon: MicrophoneIcon,
    children: [
      { name: 'Setting Up Jarvis', href: '/help/voice-agent/setup' },
      { name: 'Voice Commands', href: '/help/voice-agent/commands' },
      { name: 'Voice Workflows', href: '/help/voice-agent/workflows' },
      { name: 'Troubleshooting', href: '/help/voice-agent/troubleshooting' },
    ]
  },
  {
    name: 'Integrations',
    href: '/help/integrations',
    icon: PuzzlePieceIcon,
    children: [
      { name: 'Available Integrations', href: '/help/integrations/available' },
      { name: 'Connecting Apps', href: '/help/integrations/connecting' },
      { name: 'API Connections', href: '/help/integrations/api-connections' },
      { name: 'Managing Connections', href: '/help/integrations/managing' },
    ]
  },
  {
    name: 'Billing & Plans',
    href: '/help/billing',
    icon: CreditCardIcon,
    children: [
      { name: 'Subscription Plans', href: '/help/billing/plans' },
      { name: 'Payment Methods', href: '/help/billing/payment' },
      { name: 'Usage & Limits', href: '/help/billing/usage' },
      { name: 'Invoices & Receipts', href: '/help/billing/invoices' },
    ]
  },
  {
    name: 'Account Management',
    href: '/help/account',
    icon: UserCircleIcon,
    children: [
      { name: 'Profile Settings', href: '/help/account/profile' },
      { name: 'Security', href: '/help/account/security' },
      { name: 'Teams & Permissions', href: '/help/account/teams' },
      { name: 'Notifications', href: '/help/account/notifications' },
    ]
  },
  {
    name: 'Troubleshooting',
    href: '/help/troubleshooting',
    icon: QuestionMarkCircleIcon,
    children: [
      { name: 'Common Issues', href: '/help/troubleshooting/common-issues' },
      { name: 'Error Messages', href: '/help/troubleshooting/errors' },
      { name: 'FAQ', href: '/help/troubleshooting/faq' },
      { name: 'System Status', href: '/help/troubleshooting/status' },
    ]
  },
  {
    name: 'API Reference',
    href: '/help/api',
    icon: BookOpenIcon,
    children: [
      { name: 'Getting Started with API', href: '/help/api/getting-started' },
      { name: 'Authentication', href: '/help/api/authentication' },
      { name: 'Endpoints', href: '/help/api/endpoints' },
      { name: 'Rate Limits', href: '/help/api/rate-limits' },
    ]
  },
];

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set the open category based on the current path
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/');
      if (pathSegments.length > 2) {
        const currentCategory = pathSegments[2]; // e.g., /help/workflows/basics -> "workflows"
        const matchingCategory = helpCategories.find(cat => 
          cat.href.includes(`/${currentCategory}`)
        );
        
        if (matchingCategory) {
          setOpenCategory(matchingCategory.name);
        }
      }
    }
  }, [pathname]);

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(prev => prev === categoryName ? null : categoryName);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#18181B] border-b border-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#22D3EE]">Optiflow</span>
                <span className="text-lg text-[#9CA3AF] ml-1.5">Help Center</span>
              </Link>
            </div>
            
            {/* Search bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-[#6B7280]" />
                </div>
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/help" 
                className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/help/contact-support" 
                className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/help/community" 
                className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
              >
                Community
              </Link>
              <Link 
                href="https://status.optiflow.com" 
                className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
                target="_blank"
              >
                Status
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile search (appears below header) */}
        <div className="md:hidden px-4 py-3 bg-[#111111] border-t border-[#374151]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-[#6B7280]" />
            </div>
            <input
              type="text"
              placeholder="Search help articles..."
              className="block w-full pl-10 pr-3 py-2 bg-[#18181B] border border-[#374151] rounded-md text-[#E5E7EB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 border-b border-[#374151]">
            <Link 
              href="/help" 
              className="block px-4 py-2 text-base font-medium text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/help/contact-support" 
              className="block px-4 py-2 text-base font-medium text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Support
            </Link>
            <Link 
              href="/help/community" 
              className="block px-4 py-2 text-base font-medium text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              href="https://status.optiflow.com" 
              className="block px-4 py-2 text-base font-medium text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
            >
              Status
            </Link>
          </div>
          
          {/* Mobile category navigation */}
          <div className="pt-2 pb-3">
            {helpCategories.map((category) => (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="flex items-center justify-between w-full px-4 py-2 text-base font-medium text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]"
                >
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 mr-3" />
                    {category.name}
                  </div>
                  {openCategory === category.name ? (
                    <ChevronDownIcon className="h-5 w-5" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                  )}
                </button>
                
                {openCategory === category.name && category.children && (
                  <div className="pl-12 pr-4 space-y-1">
                    {category.children.map((subcategory) => (
                      <Link
                        key={subcategory.name}
                        href={subcategory.href}
                        className="block py-2 text-sm text-[#9CA3AF] hover:text-[#E5E7EB]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content area with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar navigation (hidden on mobile) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <nav className="space-y-1 sticky top-24">
              {helpCategories.map((category) => (
                <div key={category.name} className="mb-4">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname.includes(category.href)
                        ? 'bg-[#1E293B] text-[#22D3EE]'
                        : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-center">
                      <category.icon className="h-5 w-5 mr-2" />
                      {category.name}
                    </div>
                    {openCategory === category.name ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  
                  {openCategory === category.name && category.children && (
                    <div className="mt-1 ml-5 pl-4 border-l border-[#374151] space-y-1">
                      {category.children.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          href={subcategory.href}
                          className={`block py-2 text-sm ${
                            pathname === subcategory.href
                              ? 'text-[#22D3EE]'
                              : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
                          } transition-colors`}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>
          
          {/* Main content */}
          <main className="flex-1">
            <div className="bg-[#18181B] border border-[#374151] rounded-lg p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#18181B] border-t border-[#374151] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link href="/help/contact-support" className="text-[#9CA3AF] hover:text-[#E5E7EB]">
                Contact Support
              </Link>
              <Link href="/help/community" className="text-[#9CA3AF] hover:text-[#E5E7EB]">
                Community
              </Link>
              <Link href="https://status.optiflow.com" className="text-[#9CA3AF] hover:text-[#E5E7EB]" target="_blank">
                Status
              </Link>
            </div>
            <p className="mt-8 text-base text-[#9CA3AF] md:mt-0 md:order-1">
              &copy; {new Date().getFullYear()} Optiflow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
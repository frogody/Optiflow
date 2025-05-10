'use client';

import {
  Bars3Icon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  CubeIcon,
  KeyIcon,
  RocketLaunchIcon,
  ServerIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Overview', href: '/developer' },
  { 
    name: 'Documentation', 
    href: '/developer/docs', 
    children: [
      { name: 'Getting Started', href: '/developer/docs/getting-started' },
      { name: 'Authentication', href: '/developer/docs/authentication' },
      { name: 'Workflows API', href: '/developer/docs/api/workflows' },
      { name: 'Webhooks', href: '/developer/docs/webhooks' },
      { name: 'Rate Limits', href: '/developer/docs/rate-limits' },
    ]
  },
  { 
    name: 'API Reference', 
    href: '/developer/api',
    children: [
      { name: 'REST API', href: '/developer/api/rest' },
      { name: 'GraphQL API', href: '/developer/api/graphql' },
      { name: 'OpenAPI Spec', href: '/developer/api/openapi' },
    ]
  },
  { 
    name: 'SDKs', 
    href: '/developer/sdks',
    children: [
      { name: 'JavaScript', href: '/developer/sdks/javascript' },
      { name: 'Python', href: '/developer/sdks/python' },
      { name: 'Ruby', href: '/developer/sdks/ruby' },
      { name: 'Go', href: '/developer/sdks/go' },
    ]
  },
  { name: 'Sandbox', href: '/developer/sandbox' },
  { name: 'Community', href: '/developer/community' },
];

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Set the active dropdown based on the current path
  useEffect(() => {
    if (pathname) {
      const activeParent = navigation.find(item => 
        item.children && item.children.some(child => pathname.startsWith(child.href))
      );
      
      if (activeParent) {
        setOpenDropdown(activeParent.name);
      }
    }
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prevState => prevState === name ? null : name);
  };

  const isActive = (href: string) => {
    if (href === '/developer' && pathname === '/developer') {
      return true;
    }
    return (pathname?.startsWith(href) ?? false) && href !== '/developer';
  };

  return (
    <div className="bg-[#111111] text-[#E5E7EB] min-h-screen">
      {/* Navigation bar */}
      <header className="sticky top-0 z-10 bg-[#18181B] border-b border-[#374151]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-[#22D3EE]">Optiflow</span>
                <span className="text-lg text-[#9CA3AF] ml-1.5">Developers</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          isActive(item.href)
                            ? 'text-[#22D3EE] bg-[#1E293B]'
                            : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                        } transition-colors`}
                      >
                        {item.name}
                        <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.name && (
                        <div className="absolute left-0 mt-2 w-48 bg-[#18181B] border border-[#374151] rounded-md shadow-lg z-10">
                          <div className="py-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={`block px-4 py-2 text-sm ${
                                  pathname === child.href
                                    ? 'text-[#22D3EE] bg-[#1E293B]'
                                    : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                                } transition-colors`}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? 'text-[#22D3EE] bg-[#1E293B]'
                          : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                      } transition-colors`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            <div className="hidden md:flex md:items-center space-x-4">
              <Link
                href="/developer/apps"
                className="px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors"
              >
                My Apps
              </Link>
              <Link
                href="/developer/signup"
                className="px-4 py-2 text-sm font-medium text-[#111111] bg-[#22D3EE] hover:bg-[#06B6D4] rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 border-b border-[#374151]">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-md ${
                          isActive(item.href)
                            ? 'text-[#22D3EE] bg-[#1E293B]'
                            : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                        } transition-colors`}
                      >
                        {item.name}
                        <ChevronDownIcon className={`ml-1 h-5 w-5 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.name && (
                        <div className="pl-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`block px-3 py-2 text-base font-medium rounded-md ${
                                pathname === child.href
                                  ? 'text-[#22D3EE] bg-[#1E293B]'
                                  : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                              } transition-colors`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-base font-medium rounded-md ${
                        isActive(item.href)
                          ? 'text-[#22D3EE] bg-[#1E293B]'
                          : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B]'
                      } transition-colors`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-[#374151]">
              <div className="px-2 space-y-1">
                <Link
                  href="/developer/apps"
                  className="block px-3 py-2 text-base font-medium text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1E293B] rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Apps
                </Link>
                <Link
                  href="/developer/signup"
                  className="block px-3 py-2 text-base font-medium text-[#E5E7EB] bg-[#22D3EE] hover:bg-[#06B6D4] rounded-md transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#18181B] border-t border-[#374151]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#22D3EE] tracking-wider uppercase">Documentation</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/developer/docs/getting-started" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/authentication" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Authentication
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/webhooks" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Webhooks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#22D3EE] tracking-wider uppercase">SDKs</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/developer/sdks/javascript" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    JavaScript
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks/python" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Python
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks/ruby" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Ruby
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks/go" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Go
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#22D3EE] tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/developer/guides" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/developer/examples" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Example Projects
                  </Link>
                </li>
                <li>
                  <Link href="/developer/changelog" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="/developer/status" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Status Page
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#22D3EE] tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/developer/community" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Community Forum
                  </Link>
                </li>
                <li>
                  <Link href="/developer/support" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Developer Support
                  </Link>
                </li>
                <li>
                  <Link href="/developer/faq" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/developer/feedback" className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[#374151] pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link href="https://twitter.com/optiflow" className="text-[#9CA3AF] hover:text-[#E5E7EB]">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="https://github.com/optiflow" className="text-[#9CA3AF] hover:text-[#E5E7EB]">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
            <p className="mt-8 text-base text-[#9CA3AF] md:mt-0 md:order-1">
              &copy; {new Date().getFullYear()} Optiflow, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
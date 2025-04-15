'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

interface UserNavItem {
  name: string;
  href: string;
  description?: string;
  icon?: string;
}

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoading: userLoading } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation items based on auth state
  const navigationItems: NavigationItem[] = [
    { name: 'Flows', href: '/flows', current: pathname === '/flows' },
    { name: 'Connections', href: '/connections', current: pathname === '/connections' },
    { name: 'Pricing', href: '/pricing', current: pathname === '/pricing' },
    { name: 'FAQ', href: '/faq', current: pathname === '/faq' },
  ];

  const userNavigation: UserNavItem[] = [
    { 
      name: 'My Account',
      href: '/account',
      description: 'Manage your account settings',
      icon: '👤'
    },
    {
      name: 'Connected Services',
      href: '/connections',
      description: 'Manage your MCP connections',
      icon: '🔌'
    },
    {
      name: 'My Subscriptions',
      href: '/subscriptions',
      description: 'View and manage your subscriptions',
      icon: '📊'
    },
    {
      name: 'My Wallet',
      href: '/wallet',
      description: 'Manage your billing and payments',
      icon: '💳'
    },
    {
      name: 'Onboarding AORA1.5',
      href: '/onboarding',
      description: 'Complete your onboarding process',
      icon: '🚀'
    },
    {
      name: 'Log Out',
      href: '/logout',
      description: 'Sign out of your account',
      icon: '👋'
    }
  ];

  // Handle errors and notifications
  useEffect(() => {
    const checkConnectivity = () => {
      if (!navigator.onLine) {
        setError('You are offline. Some features may be unavailable.');
      } else {
        setError(null);
      }
    };

    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);

    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header 
        className="bg-black/20 backdrop-blur-sm sticky top-0 z-50"
        role="banner"
        aria-label="Main navigation"
      >
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border-b border-red-500/20"
            >
              <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-3"
              aria-label="ISYNCSO Home"
            >
              <div className="w-7 h-7 relative">
                <Image
                  src="/ISYNCSO_LOGO.png"
                  alt=""
                  layout="fill"
                  className="rounded"
                  priority
                />
              </div>
              <span className="text-base font-medium text-white">ISYNCSO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`px-4 py-1.5 text-sm rounded-full border border-transparent
                      ${item.current 
                        ? 'text-white bg-white/5 border-white/10' 
                        : 'text-white/90 hover:text-white hover:bg-white/5 hover:border-white/10'
                      } transition-all duration-200`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 px-4 py-1.5 text-sm text-white/90 hover:text-white rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                  aria-label="Select language"
                >
                  <span aria-hidden="true">🌐</span>
                  <span>EN</span>
                </button>
              </div>

              {userLoading ? (
                // Loading skeleton
                <div className="h-8 w-24 bg-white/5 rounded-full animate-pulse" />
              ) : currentUser ? (
                // User menu
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 px-4 py-1.5 text-sm text-white/90 hover:text-white rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                    aria-label="User menu"
                    aria-expanded="false"
                  >
                    <span>{currentUser.email}</span>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-1 w-64 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="py-1 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5"
                        >
                          <div className="flex items-center">
                            <span className="w-5">{item.icon}</span>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-white/60">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Auth buttons
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm text-white/90 hover:text-white rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/waitlist"
                    className="px-4 py-1.5 text-sm font-medium text-white rounded-full border border-white/10 hover:bg-white/5 transition-all duration-200"
                  >
                    JOIN WAITLIST
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-md border-t border-white/10">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.current
                      ? 'text-white bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              {currentUser && userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/5"
                >
                  <div className="flex items-center">
                    <span className="w-5">{item.icon}</span>
                    <span className="ml-3">{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Transition>
      </header>

      {/* Notification Portal */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50"
      >
        <AnimatePresence>
          {isNotifying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-4"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-white" aria-hidden="true">
                    🔔
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    New notification
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 
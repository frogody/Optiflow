'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { useThemeStore } from '@/lib/themeStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import Cookies from 'js-cookie';
import LanguageSwitcher from './LanguageSwitcher';
import TranslatedText from './TranslatedText';
import { signOut } from 'next-auth/react';

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
  requiresAuth: boolean;
  children?: NavigationItem[];
}

interface UserNavItem {
  name: string;
  href: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
}

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoading: userLoading, setCurrentUser } = useUserStore();
  const { theme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false); // Close menu before logout
      await signOut({ redirect: false });
      setCurrentUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  // Handle user menu click
  const handleUserMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && !target.closest('.mobile-menu')) {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Navigation items based on auth state
  const navigationItems: NavigationItem[] = [
    { 
      name: 'Optiflow',
      href: '#',
      current: pathname ? ['/pricing', '/faq', '/features', '/conversational-test', '/voice-test', '/integrations'].includes(pathname) : false,
      requiresAuth: false,
      children: [
        { name: 'Features', href: '/features', current: pathname === '/features', requiresAuth: false },
        { name: 'Voice Workflows', href: '/voice-test', current: pathname === '/voice-test', requiresAuth: false },
        { name: 'Conversational', href: '/conversational-test', current: pathname === '/conversational-test', requiresAuth: false },
        { name: 'Integrations', href: '/integrations', current: pathname === '/integrations', requiresAuth: false },
        { name: 'Pricing', href: '/pricing', current: pathname === '/pricing', requiresAuth: false },
        { name: 'FAQ', href: '/faq', current: pathname === '/faq', requiresAuth: false },
      ]
    },
    { name: 'Flows', href: '/workflows', current: pathname === '/workflows', requiresAuth: true },
    { name: 'Connections', href: '/connections', current: pathname === '/connections', requiresAuth: true },
    { name: 'AI Factory', href: '/products/ai-factory', current: pathname === '/products/ai-factory', requiresAuth: false },
    { name: 'AI Cademy', href: '/products/aicademy', current: pathname === '/products/aicademy', requiresAuth: false },
    { name: 'Enterprise', href: '/enterprise', current: pathname === '/enterprise', requiresAuth: false },
  ];

  const userNavigation: UserNavItem[] = [
    { 
      name: 'My Account',
      href: '/profile',
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
      name: 'Connect to Pipedream',
      href: '/connections/pipedream',
      description: 'Set up Pipedream integration',
      icon: '🔗'
    },
    {
      name: 'Connect to Oneflow',
      href: '/connections/oneflow',
      description: 'Set up Oneflow API integration',
      icon: '📄'
    },
    {
      name: 'Onboarding AORA1.5',
      href: '/onboarding',
      description: 'Complete your onboarding process',
      icon: '🚀'
    },
    {
      name: 'Log Out',
      href: '#',
      description: 'Sign out of your account',
      icon: '👋',
      onClick: handleLogout
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

  // Handle navigation with error handling
  const handleNavigation = (href: string) => {
    try {
      console.log(`Navigating to: ${href}`);
      router.push(href);
    } catch (error) {
      console.error(`Navigation error to ${href}:`, error);
      // Fallback to window.location if router.push fails
      window.location.href = href;
    }
  };

  // Filter navigation items based on auth status
  const filteredNavigationItems = navigationItems.filter(item => 
    !item.requiresAuth || currentUser
  );

  // Determine navigation styles based on compact mode
  const navPadding = compactMode ? 'py-1.5' : 'py-3';
  const buttonPadding = compactMode ? 'py-1 px-3' : 'py-1.5 px-4';
  const logoSize = compactMode ? 'w-6 h-6' : 'w-7 h-7';
  const logoTextSize = compactMode ? 'text-sm' : 'text-base';

  return (
    <>
      <header 
        className={`bg-black/20 backdrop-blur-sm sticky top-0 z-50 dark:bg-black/20 light:bg-white/80 transition-all duration-300`}
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

        <div className="max-w-7xl mx-auto px-4">
          <nav className={`flex items-center justify-between ${navPadding}`}>
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2"
              aria-label="ISYNCSO Home"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/ISYNCSO_LOGO.png"
                  alt=""
                  width={40}
                  height={40}
                  className="rounded"
                  priority
                />
              </div>
              <span className="text-lg font-medium dark:text-white light:text-gray-800 tracking-tight">ISYNCSO</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              {filteredNavigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className={`${buttonPadding} text-sm rounded-full border border-transparent flex items-center space-x-1
                          ${item.current 
                            ? 'dark:text-white dark:bg-white/5 dark:border-white/10 light:text-gray-800 light:bg-black/5 light:border-black/10' 
                            : 'dark:text-white/90 dark:hover:text-white dark:hover:bg-white/5 dark:hover:border-white/10 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5 light:hover:border-black/10'
                          } transition-all duration-200`}
                      >
                        <TranslatedText textKey={`navigation.${item.name.toLowerCase()}`} fallback={item.name} />
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Dropdown menu */}
                      <div className="absolute left-0 top-full mt-1 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="py-1 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 shadow-lg dark:bg-black/90 light:bg-white/90 dark:border-white/10 light:border-black/10">
                          {item.children.map((child) => (
                            <button
                              key={child.name}
                              onClick={() => handleNavigation(child.href)}
                              className={`w-full text-left block px-4 py-2 text-sm
                                ${child.current
                                  ? 'dark:text-white dark:bg-white/10 light:text-gray-900 light:bg-black/10'
                                  : 'dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5'
                                }`}
                            >
                              <TranslatedText textKey={`navigation.${child.name.toLowerCase()}`} fallback={child.name} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`${buttonPadding} text-sm rounded-full border border-transparent
                        ${item.current 
                          ? 'dark:text-white dark:bg-white/5 dark:border-white/10 light:text-gray-800 light:bg-black/5 light:border-black/10' 
                          : 'dark:text-white/90 dark:hover:text-white dark:hover:bg-white/5 dark:hover:border-white/10 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5 light:hover:border-black/10'
                        } transition-all duration-200`}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <TranslatedText textKey={`navigation.${item.name.toLowerCase()}`} fallback={item.name} />
                    </button>
                  )}
                </div>
              ))}
              {currentUser && (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className={`${buttonPadding} text-sm rounded-full border border-transparent
                    ${pathname === '/dashboard' 
                      ? 'dark:text-white dark:bg-white/5 dark:border-white/10 light:text-gray-800 light:bg-black/5 light:border-black/10' 
                      : 'dark:text-white/90 dark:hover:text-white dark:hover:bg-white/5 dark:hover:border-white/10 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5 light:hover:border-black/10'
                    } transition-all duration-200`}
                  aria-current={pathname === '/dashboard' ? 'page' : undefined}
                >
                  <TranslatedText textKey="navigation.dashboard" fallback="Dashboard" />
                </button>
              )}
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <LanguageSwitcher />

              {userLoading ? (
                // Loading skeleton
                <div className="h-8 w-24 bg-white/5 animate-pulse rounded-full" />
              ) : currentUser ? (
                // User menu
                <div className="relative user-menu">
                  <button
                    onClick={handleUserMenuClick}
                    className="flex items-center space-x-2 text-sm focus:outline-none"
                  >
                    <span>{currentUser.email}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Menu Dropdown */}
                  <Transition
                    show={isUserMenuOpen}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      {userNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.onClick) {
                              item.onClick();
                            } else {
                              setIsUserMenuOpen(false);
                              router.push(item.href);
                            }
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </Transition>
                </div>
              ) : (
                // Auth buttons
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className={`${buttonPadding} text-sm dark:text-white/90 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900 rounded-full border border-transparent dark:hover:border-white/10 dark:hover:bg-white/5 light:hover:border-black/10 light:hover:bg-black/5 transition-all duration-200`}
                  >
                    <TranslatedText textKey="navigation.login" fallback="Log in" />
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className={`${buttonPadding} text-sm font-medium text-black rounded-full bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] hover:opacity-90 transition-all duration-200`}
                  >
                    <TranslatedText textKey="navigation.signup" fallback="Sign Up" />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-3 rounded-md dark:text-white/80 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900 dark:hover:bg-white/5 light:hover:bg-black/5 touch-manipulation"
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
          enter="transition ease-out duration-200 transform"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 dark:bg-black/90 light:bg-white/90 backdrop-blur-md dark:border-t dark:border-white/10 light:border-t light:border-black/10">
              {filteredNavigationItems.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="space-y-1">
                      <button
                        className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium
                          ${item.current
                            ? 'dark:text-white dark:bg-white/10 light:text-gray-900 light:bg-black/10'
                            : 'dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5'
                          } touch-manipulation`}
                      >
                        <div className="flex items-center justify-between">
                          <TranslatedText textKey={`navigation.${item.name.toLowerCase()}`} fallback={item.name} />
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      <div className="pl-4">
                        {item.children.map((child) => (
                          <button
                            key={child.name}
                            onClick={() => {
                              handleNavigation(child.href);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium
                              ${child.current
                                ? 'dark:text-white dark:bg-white/10 light:text-gray-900 light:bg-black/10'
                                : 'dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5'
                              } touch-manipulation`}
                          >
                            <TranslatedText textKey={`navigation.${child.name.toLowerCase()}`} fallback={child.name} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleNavigation(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium ${
                        item.current
                          ? 'dark:text-white dark:bg-white/10 light:text-gray-900 light:bg-black/10'
                          : 'dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5'
                      } touch-manipulation`}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <TranslatedText textKey={`navigation.${item.name.toLowerCase()}`} fallback={item.name} />
                    </button>
                  )}
                </div>
              ))}
              {currentUser && (
                <button
                  onClick={() => {
                    handleNavigation('/dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium ${
                    pathname === '/dashboard'
                      ? 'dark:text-white dark:bg-white/10 light:text-gray-900 light:bg-black/10'
                      : 'dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5'
                  } touch-manipulation`}
                  aria-current={pathname === '/dashboard' ? 'page' : undefined}
                >
                  <TranslatedText textKey="navigation.dashboard" fallback="Dashboard" />
                </button>
              )}
              {currentUser && userNavigation.map((item) => (
                <div key={item.name}>
                  {item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left block px-4 py-3 rounded-md text-base font-medium dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5 touch-manipulation"
                    >
                      <div className="flex items-center">
                        <span className="w-5">{item.icon}</span>
                        <span className="ml-3">{item.name}</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleNavigation(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-md text-base font-medium dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5 touch-manipulation"
                    >
                      <div className="flex items-center">
                        <span className="w-5">{item.icon}</span>
                        <span className="ml-3">{item.name}</span>
                      </div>
                    </button>
                  )}
                </div>
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
              className="dark:bg-black/90 light:bg-white/90 backdrop-blur-md dark:border-white/10 light:border-black/10 border rounded-lg shadow-lg p-4"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="dark:text-white light:text-gray-800" aria-hidden="true">
                    🔔
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium dark:text-white light:text-gray-800">
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
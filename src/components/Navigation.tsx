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

interface FrontendUser {
  name: string;
  email: string;
  image?: string;
}

interface NavigationItem {
  name: string;
  translationKey: string;
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
  section?: string;
  external?: boolean;
}

const buttonPadding = "px-4 py-2";
const buttonBaseStyles = "text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50";
const buttonLightStyles = "light:text-gray-700 light:hover:text-gray-900 light:hover:bg-black/5 light:hover:border-black/10";
const buttonDarkStyles = "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/5 dark:hover:border-white/10";
const buttonActiveStyles = {
  light: "light:text-gray-800 light:bg-black/5 light:border-black/10",
  dark: "dark:text-white dark:bg-white/5 dark:border-white/10"
};

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
      translationKey: 'optiflow',
      href: '#',
      current: pathname ? ['/pricing', '/faq', '/features', '/conversational-test', '/voice-test', '/integrations'].includes(pathname) : false,
      requiresAuth: false,
      children: [
        { name: 'Features', translationKey: 'features', href: '/features', current: pathname === '/features', requiresAuth: false },
        { name: 'Voice Workflows', translationKey: 'voice_workflows', href: '/voice-test', current: pathname === '/voice-test', requiresAuth: false },
        { name: 'Conversational', translationKey: 'conversational', href: '/conversational-test', current: pathname === '/conversational-test', requiresAuth: false },
        { name: 'Integrations', translationKey: 'integrations', href: '/integrations', current: pathname === '/integrations', requiresAuth: false },
        { name: 'Pricing', translationKey: 'pricing', href: '/pricing', current: pathname === '/pricing', requiresAuth: false },
        { name: 'FAQ', translationKey: 'faq', href: '/faq', current: pathname === '/faq', requiresAuth: false },
      ]
    },
    { name: 'Flows', translationKey: 'flows', href: '/workflows', current: pathname === '/workflows', requiresAuth: true },
    { name: 'Connections', translationKey: 'connections', href: '/connections', current: pathname === '/connections', requiresAuth: true },
    { name: 'AI Factory', translationKey: 'ai_factory', href: '/products/ai-factory', current: pathname === '/products/ai-factory', requiresAuth: false },
    { name: 'AI Cademy', translationKey: 'ai_cademy', href: '/products/aicademy', current: pathname === '/products/aicademy', requiresAuth: false },
    { name: 'Enterprise', translationKey: 'enterprise', href: '/enterprise', current: pathname === '/enterprise', requiresAuth: false },
  ];

  // Update the user navigation items
  const userNavigation: UserNavItem[] = [
    // Account Section
    { 
      name: 'My Profile',
      href: '/profile',
      description: 'Manage your personal profile',
      icon: 'user',
      section: 'account'
    },
    {
      name: 'Account Settings',
      href: '/settings',
      description: 'Preferences and security settings',
      icon: 'settings',
      section: 'account'
    },
    // Team Section
    {
      name: 'Team Management',
      href: '/team',
      description: 'Invite and manage team members',
      icon: 'users',
      section: 'team'
    },
    {
      name: 'Roles & Permissions',
      href: '/team/roles',
      description: 'Configure access controls',
      icon: 'shield',
      section: 'team'
    },
    // Billing Section
    {
      name: 'Billing & Plans',
      href: '/billing',
      description: 'Manage subscription and payments',
      icon: 'creditcard',
      section: 'billing'
    },
    {
      name: 'Usage & Analytics',
      href: '/usage',
      description: 'View your resource consumption',
      icon: 'chart',
      section: 'billing'
    },
    // Support Section
    {
      name: 'Help & Support',
      href: '/support',
      description: 'Get assistance with our platform',
      icon: 'help',
      section: 'support'
    },
    {
      name: 'Documentation',
      href: '/docs',
      description: 'Guides and API references',
      icon: 'document',
      section: 'support',
      external: true
    },
    // Log out always at the end
    {
      name: 'Log Out',
      href: '#',
      description: 'Sign out of your account',
      icon: 'logout',
      onClick: handleLogout,
      section: 'logout'
    }
  ];

  // Define icons for the menu
  const getMenuIcon = (icon: string) => {
    switch (icon) {
      case 'user':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'creditcard':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'help':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'logout':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Group navigation items by section
  const groupedNavItems = userNavigation.reduce((acc, item) => {
    const section = item.section || 'other';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, UserNavItem[]>);

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
            <div className="hidden md:flex items-center space-x-4">
              {filteredNavigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className={`${buttonPadding} ${buttonBaseStyles} ${buttonLightStyles} ${buttonDarkStyles}
                          ${item.current ? `${buttonActiveStyles.light} ${buttonActiveStyles.dark}` : 'border-transparent'}
                          flex items-center gap-1`}
                        aria-expanded={isUserMenuOpen}
                        aria-haspopup="true"
                      >
                        <TranslatedText 
                          textKey={`navigation.${item.translationKey}`} 
                          fallback={item.name}
                          className="whitespace-nowrap"
                        />
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7" 
                          />
                        </svg>
                      </button>
                      
                      {/* Dropdown menu */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-2">
                          {item.children.map((child) => (
                            <button
                              key={child.name}
                              onClick={() => handleNavigation(child.href)}
                              className={`block w-full text-left px-4 py-2 text-sm
                                ${child.current
                                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50`}
                            >
                              <TranslatedText textKey={`navigation.${child.translationKey}`} fallback={child.name} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`${buttonPadding} ${buttonBaseStyles} ${buttonLightStyles} ${buttonDarkStyles}
                        ${item.current ? `${buttonActiveStyles.light} ${buttonActiveStyles.dark}` : 'border-transparent'}`}
                    >
                      <TranslatedText 
                        textKey={`navigation.${item.translationKey}`} 
                        fallback={item.name}
                        className="whitespace-nowrap"
                      />
                    </button>
                  )}
                </div>
              ))}

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* User Menu */}
              {currentUser ? (
                <div className="relative user-menu">
                  <button
                    onClick={handleUserMenuClick}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5"
                  >
                    <Image
                      src={currentUser.image || '/default-avatar.png'}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-primary/20"
                    />
                    <span className="text-sm text-white/90 font-medium">{currentUser.name}</span>
                    <svg 
                      className="w-4 h-4 text-white/70" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                  
                  {/* User dropdown menu */}
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50">
                    <Transition
                      show={isUserMenuOpen}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <div>
                        {/* User profile header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center">
                            <Image
                              src={currentUser.image || '/default-avatar.png'}
                              alt=""
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</div>
                              
                              {/* Plan badge */}
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                  Pro Plan
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu sections */}
                        <div className="py-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                          {Object.entries(groupedNavItems).map(([section, items]) => (
                            <div key={section} className={section !== 'logout' ? 'mb-2' : ''}>
                              {section !== 'logout' && (
                                <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                  {section === 'account' ? 'Account' : 
                                   section === 'team' ? 'Team' : 
                                   section === 'billing' ? 'Billing & Usage' : 
                                   section === 'support' ? 'Support' : section}
                                </div>
                              )}
                              
                              <div className={section !== 'logout' ? '' : 'border-t border-gray-100 dark:border-gray-800 pt-2'}>
                                {items.map((item) => (
                                  <button
                                    key={item.name}
                                    onClick={item.onClick || (() => handleNavigation(item.href))}
                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                  >
                                    <span className="inline-flex items-center justify-center w-8 h-8 mr-3 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                      {getMenuIcon(item.icon || '')}
                                    </span>
                                    <div>
                                      <div className="font-medium flex items-center">
                                        {item.name}
                                        {item.external && (
                                          <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        )}
                                      </div>
                                      {item.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="px-4 py-1.5 text-sm dark:text-white/90 dark:hover:text-white light:text-gray-700 light:hover:text-gray-900 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                  >
                    <TranslatedText textKey="navigation.login" fallback="Log in" />
                  </button>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="px-4 py-1.5 text-sm text-white bg-primary hover:bg-primary-dark rounded-full transition-colors duration-200"
                  >
                    <TranslatedText textKey="navigation.signup" fallback="Sign Up" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5"
            >
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden mobile-menu">
          <Transition
            show={isMobileMenuOpen}
            enter="transition-all duration-300 ease-out"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-200 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
              <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <Image
                      src="/ISYNCSO_LOGO.png"
                      alt="ISYNCSO"
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <span className="ml-2 text-lg font-medium text-gray-900 dark:text-white">ISYNCSO</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    aria-label="Close menu"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="px-2 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
                  {filteredNavigationItems.map((item) => (
                    <div key={item.name} className="space-y-1">
                      {item.children ? (
                        <>
                          <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                            <TranslatedText textKey={`navigation.${item.translationKey}`} fallback={item.name} />
                          </div>
                          <div className="space-y-1 pl-4">
                            {item.children.map((child) => (
                              <button
                                key={child.name}
                                onClick={() => {
                                  handleNavigation(child.href);
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                                  ${child.current
                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                                  }`}
                              >
                                <TranslatedText textKey={`navigation.${child.translationKey}`} fallback={child.name} />
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            handleNavigation(item.href);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                            ${item.current
                              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                            }`}
                        >
                          <TranslatedText textKey={`navigation.${item.translationKey}`} fallback={item.name} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Mobile Auth Buttons */}
                  <div className="px-3 py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                    {currentUser ? (
                      <>
                        <div className="flex items-center px-3 py-2 space-x-3">
                          <Image
                            src={currentUser.image || '/default-avatar.png'}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</span>
                        </div>
                        {userNavigation.map((item) => (
                          <button
                            key={item.name}
                            onClick={item.onClick || (() => handleNavigation(item.href))}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white rounded-md"
                          >
                            <div className="flex items-center">
                              {item.icon && <span className="mr-2">{item.icon}</span>}
                              <div>
                                <div className="font-medium">{item.name}</div>
                                {item.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            handleNavigation('/login');
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-sm text-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <TranslatedText textKey="navigation.login" fallback="Log in" />
                        </button>
                        <button
                          onClick={() => {
                            handleNavigation('/signup');
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-sm text-center text-white bg-primary hover:bg-primary-dark rounded-md transition-colors"
                        >
                          <TranslatedText textKey="navigation.signup" fallback="Sign Up" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
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
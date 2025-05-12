'use client';

import { 
  ArrowRightOnRectangleIcon, 
  Bars3Icon, 
  BellIcon, 
  BuildingOffice2Icon,
  Cog6ToothIcon,
  DocumentTextIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  notificationCount?: number;
}

export default function DashboardHeader({ 
  userName, 
  userEmail, 
  userAvatar,
  notificationCount = 0
}: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  
  // Navigation items
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', current: true },
    { name: 'Workflows', href: '/workflows', current: false },
    { name: 'Connections', href: '/connections', current: false },
    { name: 'Templates', href: '/workflow-editor/templates', current: false },
    { name: 'Analytics', href: '/analytics', current: false },
  ];
  
  // Settings menu items
  const settingsItems = [
    { name: 'Profile Settings', href: '/settings/profile', icon: UserCircleIcon },
    { name: 'Organization', href: '/settings/organization', icon: BuildingOffice2Icon },
    { name: 'API Keys', href: '/settings/api-keys', icon: KeyIcon },
    { name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
    { name: 'Knowledge Base', href: '/settings/knowledge-base', icon: DocumentTextIcon },
    { name: 'Notifications', href: '/settings/notifications', icon: BellIcon },
    { name: 'Data & Privacy', href: '/settings/data', icon: DocumentTextIcon },
  ];

  return (
    <header className="bg-[#111111] border-b border-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logo-transparent.svg"
                  alt="SYNC"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    item.current
                      ? 'bg-[#1E293B] text-white'
                      : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white transition-colors'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Search, notifications, and profile */}
          <div className="flex items-center">
            {/* Search */}
            <div className="relative mr-3 md:mr-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#9CA3AF]" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full rounded-md border border-[#374151] bg-[#18181B] pl-10 pr-3 py-2 text-sm text-[#E5E7EB] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
              />
            </div>
            
            {/* Notifications */}
            <Link
              href="/settings/notifications"
              className="relative rounded-full p-1 text-[#9CA3AF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE] mr-4"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#EF4444] ring-2 ring-[#111111]"></span>
              )}
            </Link>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {userAvatar ? (
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={userAvatar}
                    alt={userName}
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#22D3EE] flex items-center justify-center text-white font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#18181B] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3 border-b border-[#374151]">
                    <p className="text-sm text-[#E5E7EB] font-medium">{userName}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{userEmail}</p>
                  </div>
                  <Link
                    href="/settings/profile"
                    className="flex items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                    Your Profile
                  </Link>
                  
                  {/* Settings menu with dropdown */}
                  <div className="relative">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSettingsMenuOpen(!settingsMenuOpen);
                      }}
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                      <span className="flex-1 text-left">Settings</span>
                      <svg className={`h-4 w-4 text-[#9CA3AF] transition-transform ${settingsMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {settingsMenuOpen && (
                      <div className="ml-2 pl-4 border-l border-[#374151]">
                        {settingsItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                            onClick={() => {
                              setSettingsMenuOpen(false);
                              setUserMenuOpen(false);
                            }}
                          >
                            <item.icon className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href="/settings/organization"
                    className="flex items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <UserGroupIcon className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                    Team Management
                  </Link>
                  
                  <div className="border-t border-[#374151] my-1"></div>
                  
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-[#E5E7EB] hover:bg-[#1E293B] transition-colors"
                    onClick={() => {
                      setUserMenuOpen(false);
                      // Handle sign out - in a real app, this would call your auth provider
                      window.location.href = '/login';
                    }}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#374151]">
          <div className="space-y-1 px-2 py-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.current
                    ? 'bg-[#1E293B] text-white'
                    : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white transition-colors'
                }`}
                aria-current={item.current ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="mt-3 pt-3 border-t border-[#374151]">
              <p className="px-3 text-xs font-medium text-[#9CA3AF]">Settings</p>
              {settingsItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 
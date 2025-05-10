'use client';

import {
  ArrowLeftIcon,
  BellIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  DocumentTextIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Update isMobile state based on window width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const navigation = [
    { name: 'Profile', href: '/settings/profile', icon: UserCircleIcon },
    { name: 'Organization', href: '/settings/organization', icon: BuildingOffice2Icon },
    { name: 'Notifications', href: '/settings/notifications', icon: BellIcon },
    { name: 'API Keys', href: '/settings/api-keys', icon: KeyIcon },
    { name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
    { name: 'Data & Privacy', href: '/settings/data', icon: DocumentTextIcon },
    { name: 'General', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile menu toggle and back button */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <Link href="/dashboard" className="flex items-center text-[#9CA3AF] hover:text-[#E5E7EB]">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="px-4 py-2 bg-[#18181B] text-[#E5E7EB] rounded-md"
          >
            {mobileMenuOpen ? 'Close Menu' : 'Settings Menu'}
          </button>
        </div>
        
        <div className="md:flex gap-8">
          {/* Sidebar / Settings Navigation */}
          <aside className={`w-full md:w-64 md:block flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <h1 className="text-3xl font-bold text-[#22D3EE] mb-6 hidden md:block">Settings</h1>
            
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-md ${
                      isActive
                        ? 'bg-[#18181B] text-[#22D3EE] border-l-4 border-[#22D3EE] pl-3'
                        : 'text-[#9CA3AF] hover:bg-[#18181B] hover:text-[#E5E7EB]'
                    }`}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[#22D3EE]' : ''}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-[#18181B] rounded-lg border border-[#374151] p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 
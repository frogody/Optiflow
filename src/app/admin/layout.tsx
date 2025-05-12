'use client';

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user has admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <div className="animate-pulse text-[#22D3EE] text-xl">Loading admin panel...</div>
      </div>
    );
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'User Management', href: '/admin/users', icon: UsersIcon },
    { name: 'Workflows', href: '/admin/workflows', icon: CogIcon },
    { name: 'Integrations', href: '/admin/integrations', icon: ServerIcon },
    { name: 'Billing', href: '/admin/billing', icon: CreditCardIcon },
    { name: 'Content', href: '/admin/content', icon: DocumentTextIcon },
    { name: 'System Health', href: '/admin/system', icon: ServerIcon },
    { name: 'Feature Flags', href: '/admin/features', icon: FlagIcon },
    { name: 'Security & Audit', href: '/admin/security', icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen flex bg-[#111111] text-[#E5E7EB]">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-[#18181B] border-r border-[#374151]">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-[#111111] border-b border-[#374151]">
            <span className="text-xl font-bold text-[#22D3EE]">Optiflow Admin</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                    ${
                      pathname === item.href
                        ? 'bg-[#1E293B] text-[#22D3EE] border-l-2 border-[#22D3EE]'
                        : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-[#E5E7EB]'
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 
                      ${
                        pathname === item.href
                          ? 'text-[#22D3EE]'
                          : 'text-[#6B7280] group-hover:text-[#9CA3AF]'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-[#374151] p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-[#E5E7EB]">
                  {session?.user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  {session?.user?.email || 'admin@optiflow.com'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-[#111111] border-b border-[#374151] px-4 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-[#22D3EE]">Optiflow Admin</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-[#9CA3AF] hover:text-[#E5E7EB] focus:outline-none"
        >
          <span className="sr-only">Open menu</span>
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#111111] bg-opacity-95">
          <div className="pt-20 pb-6 px-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors
                    ${
                      pathname === item.href
                        ? 'bg-[#1E293B] text-[#22D3EE]'
                        : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-[#E5E7EB]'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 
                      ${
                        pathname === item.href
                          ? 'text-[#22D3EE]'
                          : 'text-[#6B7280] group-hover:text-[#9CA3AF]'
                      }
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-6 border-t border-[#374151] pt-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-[#E5E7EB] bg-[#1E293B] hover:bg-[#2D3748] rounded-md transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
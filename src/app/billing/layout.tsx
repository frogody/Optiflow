'use client';

// Heroicons removed to prevent React version conflicts
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Subscription Plans', href: '/billing/plans', icon: CreditCardIcon },
    { name: 'Credits', href: '/billing/credits', icon: CurrencyDollarIcon },
    { name: 'Billing History', href: '/billing/history', icon: DocumentTextIcon },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#22D3EE] mb-2">Billing & Subscription</h1>
          <p className="text-[#9CA3AF]">
            Manage your subscription plan, credits, and payment methods
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="border-b border-[#374151] mb-8">
          <nav className="flex -mb-px space-x-8">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group inline-flex items-center pb-4 px-1 border-b-2 font-medium text-sm
                    ${isActive
                      ? 'border-[#22D3EE] text-[#22D3EE]'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#E5E7EB] hover:border-[#6B7280]'
                    }`}
                >
                  <item.icon
                    className={`mr-2 h-5 w-5 ${
                      isActive ? 'text-[#22D3EE]' : 'text-[#6B7280] group-hover:text-[#9CA3AF]'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
} 
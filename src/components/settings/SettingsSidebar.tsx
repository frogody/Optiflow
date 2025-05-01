import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    section: 'Account',
    items: [
      { name: 'Profile', href: '/settings/profile', description: 'Manage your personal profile' },
      { name: 'Account', href: '/settings/account', description: 'Preferences and security settings' },
    ],
  },
  {
    section: 'Team',
    items: [
      { name: 'Team Management', href: '/settings/team', description: 'Invite and manage team members' },
      { name: 'Roles & Permissions', href: '/settings/roles', description: 'Configure access controls' },
    ],
  },
  {
    section: 'Billing',
    items: [
      { name: 'Plans & Billing', href: '/settings/billing', description: 'Manage subscription and payments' },
      { name: 'Usage & Analytics', href: '/settings/usage', description: 'View resource consumption' },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
      <nav className="space-y-8">
        {navigationItems.map((section) => (
          <div key={section.section}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {section.section}
            </h3>
            <ul className="mt-3 space-y-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex flex-col px-3 py-2 text-sm rounded-md',
                      pathname === item.href
                        ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
} 
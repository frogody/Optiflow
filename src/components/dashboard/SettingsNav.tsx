import {
  BellIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const settingsNavItems = [
  { name: 'Profile', href: '/settings/profile', icon: UserCircleIcon },
  { name: 'API Keys', href: '/settings/api-keys', icon: KeyIcon },
  { name: 'Notifications', href: '/settings/notifications', icon: BellIcon },
  { name: 'Organization', href: '/settings/organization', icon: BuildingOfficeIcon },
  { name: 'Knowledge Base', href: '/settings/knowledge-base', icon: BookOpenIcon },
  { name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
  { name: 'Billing', href: '/settings/billing', icon: CreditCardIcon },
  { name: 'Legal', href: '/settings/legal', icon: DocumentTextIcon },
]; 
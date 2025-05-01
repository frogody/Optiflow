import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings - Optiflow',
  description: 'Manage your account preferences and security settings',
};

export default function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 
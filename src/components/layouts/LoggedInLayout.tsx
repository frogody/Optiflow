'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import DashboardHeader from '@/components/dashboard/DashboardHeader';

interface LoggedInLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function LoggedInLayout({ 
  children,
  requireAuth = true
}: LoggedInLayoutProps) {
  const { data: session, status } = useSession();
  
  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111111]">
        <div className="loading-pulse gradient-text text-xl">Loading...</div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated and auth is required
  if (!session && requireAuth) {
    redirect('/login');
  }
  
  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';
  const userAvatar = session?.user?.image || undefined;
  
  return (
    <div className="bg-[#111111] min-h-screen">
      <DashboardHeader 
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        notificationCount={0}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
} 
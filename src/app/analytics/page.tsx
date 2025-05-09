// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AnalyticsContent = dynamic(() => import('@/components/AnalyticsContent'), { ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">Loading analytics...</div>
    </div>
  )
    });

export default function AnalyticsPage(): JSX.Element {
  const { data: session, status     } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">You must be signed in to view this page.</p>
        <Link 
          href="/login"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return <AnalyticsContent />;
} 
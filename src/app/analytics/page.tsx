'use client';

import dynamic from 'next/dynamic';

import LoggedInLayout from '@/components/layouts/LoggedInLayout';

const AnalyticsContent = dynamic(() => import('@/components/AnalyticsContent'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="loading-pulse gradient-text text-xl">Loading analytics...</div>
    </div>
  )
});

export default function AnalyticsPage(): JSX.Element {
  return (
    <LoggedInLayout>
      <div>
        <h1 className="text-3xl font-bold text-[#E5E7EB] mb-6">Analytics Dashboard</h1>
        <AnalyticsContent />
      </div>
    </LoggedInLayout>
  );
} 
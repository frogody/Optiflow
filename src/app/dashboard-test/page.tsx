'use client';

import { useState, useEffect } from 'react';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import Dashboard from '@/components/Dashboard';

// The imported Dashboard component is used in the UI.

// Creating an explicit test page with orchestratorId
export default function DashboardTestPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  return <Dashboard orchestratorId="default" />;
}

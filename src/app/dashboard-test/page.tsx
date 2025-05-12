'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import Dashboard from '@/components/Dashboard';

// The imported Dashboard component is used in the UI.

// Creating an explicit test page with orchestratorId
export default function DashboardTestPage(): JSX.Element {
  return <Dashboard orchestratorId="default" />;
}

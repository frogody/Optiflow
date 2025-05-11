'use client';

import Dashboard from '@/components/Dashboard';

// The imported Dashboard component is used in the UI.

// Creating an explicit test page with orchestratorId
export default function DashboardTestPage(): JSX.Element {
  return <Dashboard orchestratorId="default" />;
}

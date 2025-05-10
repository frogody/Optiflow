'use client';

import Dashboard from '@/components/Dashboard';

// Creating an explicit test page with orchestratorId
export default function DashboardTestPage(): JSX.Element {
  return <Dashboard orchestratorId="default" />;
}

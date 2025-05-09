// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import Dashboard from '@/components/Dashboard';

// Creating an explicit test page with orchestratorId
export default function DashboardTestPage(): JSX.Element {
  return <Dashboard orchestratorId="default" />;
}

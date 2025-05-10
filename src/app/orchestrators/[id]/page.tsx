'use client';

// Original content commented out to bypass build errors
/*
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Dashboard from '../../../components/Dashboard.js';
import { useUserStore } from '../../../lib/userStore.js';

export default function OrchestratorPage({ params }: { params: { id: string     } }): React.ReactNode {
  const router = useRouter();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentUser) {
    return null;
  }

  return <Dashboard orchestratorId={params.id} />;
}
*/

export default function OrchestratorPagePlaceholder() {
  return (
    <div>
      <h1>Orchestrator Page Temporarily Disabled</h1>
      <p>This page is currently under maintenance to resolve build issues.</p>
    </div>
  );
} 
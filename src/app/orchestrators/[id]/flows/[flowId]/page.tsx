'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// import { simpleValue } from './testSimpleImport.js'; // Removing test import

import FlowDashboard from '../../../../../components/FlowDashboard.js';
import { useUserStore } from '../../../../../lib/userStore.js';

export default function FlowPage({ params }: { params: { id: string; flowId: string     } }): React.ReactNode {
  const router = useRouter();
  const { currentUser } = useUserStore();

  useEffect(() => {
    // console.log(simpleValue); // Removing log for test import
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentUser) {
    return null;
  }

  return <FlowDashboard orchestratorId={params.id} flowId={params.flowId} />;
} 
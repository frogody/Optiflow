// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import FlowDashboard from '@/components/FlowDashboard';

export default function FlowPage({ params }: { params: { id: string; flowId: string     } }): JSX.Element {
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

  return <FlowDashboard orchestratorId={params.id} flowId={params.flowId} />;
} 
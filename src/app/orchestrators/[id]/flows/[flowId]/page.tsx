'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import FlowDashboard from '@/components/FlowDashboard';

export default function FlowPage({ params }: { params: { id: string; flowId: string } }) {
  const router = useRouter();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return <FlowDashboard orchestratorId={params.id} flowId={params.flowId} />;
} 
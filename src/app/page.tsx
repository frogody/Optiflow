'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/connections-browser');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">Welcome to Optiflow</div>
    </div>
  );
} 
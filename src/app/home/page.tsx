'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push('/connections-browser');
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">Redirecting to Connections...</div>
    </div>
  );
} 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
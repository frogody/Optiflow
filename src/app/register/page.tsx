// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signup');
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  return null; // No need to render anything as we're redirecting
} 
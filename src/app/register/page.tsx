'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signup');
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  return null; // No need to render anything as we're redirecting
} 
'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();

  useEffect(() => {
    router.replace('/signup');
  }, [router]) // eslint-disable-line react-hooks/exhaustive-deps

  return null; // No need to render anything as we're redirecting
} 
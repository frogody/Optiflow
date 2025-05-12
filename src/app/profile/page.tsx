'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the settings/profile page
    router.push('/settings/profile');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[#22D3EE]">Redirecting to profile settings...</div>
    </div>
  );
} 
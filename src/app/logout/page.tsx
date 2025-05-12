'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';
// Disable cache to avoid static rendering issues
export const revalidate = 0;

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUserStore } from '@/lib/userStore';


export default function LogoutPage() {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    const handleLogout = () => {
      // Clear user from store
      setCurrentUser(null);
      
      // Remove authentication cookie
      Cookies.remove('user-token');
      
      // Redirect to login page
      router.push('/login');
    };

    // Execute logout
    handleLogout();
  }, [router, setCurrentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  // Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">
        Logging out...
      </div>
    </div>
  );
} 
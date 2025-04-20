'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Cookies from 'js-cookie';

export default function LogoutPage() {
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
  }, [router, setCurrentUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loading-pulse gradient-text text-xl">
        Logging out...
      </div>
    </div>
  );
} 
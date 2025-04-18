'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/userStore';

/**
 * SessionInitializer component checks for an existing session
 * and syncs it with the user store.
 */
export function SessionInitializer() {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    setLoading(status === 'loading');

    if (status === 'authenticated' && session?.user) {
      // Ensure we have valid values before updating the store
      const user = {
        id: session.user.id || '',  // Fallback to empty string if undefined
        email: session.user.email || null,  // Explicitly set to null if undefined
        name: session.user.name || null,    // Explicitly set to null if undefined
      };
      setUser(user);
    } else if (status === 'unauthenticated') {
      // Clear the user when session is explicitly unauthenticated
      setUser(null);
    }
  }, [session, status, setUser, setLoading]);

  // This component doesn't render anything visible
  return null;
} 
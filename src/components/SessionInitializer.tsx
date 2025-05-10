'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

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

    // Set loading state
    setLoading(status === 'loading');

    // Handle session state
    if (status === 'authenticated' && session?.user) {
      try {
        // Ensure we have valid values before updating the store
        const user = {
          id: session.user.id || '', // Fallback to empty string if undefined
          email: session.user.email || null, // Explicitly set to null if undefined
          name: session.user.name || null, // Explicitly set to null if undefined
        };
        console.log('Setting authenticated user:', user);
        setUser(user);
      } catch (error) {
        console.error('Error setting user from session:', error);
        setUser(null);
      }
    } else if (status === 'unauthenticated' || !session) {
      // Clear the user when session is explicitly unauthenticated or missing
      console.log('Session is unauthenticated or missing, clearing user');
      setUser(null);
    } else {
      console.warn('Unexpected session status:', status);
    }
  }, [session, status, setUser, setLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // This component doesn't render anything visible
  return null;
}

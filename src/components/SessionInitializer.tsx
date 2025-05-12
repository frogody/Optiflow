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
  const userStore = useUserStore();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Validate that the required store functions exist
    if (typeof userStore?.setLoading !== 'function' || typeof userStore?.setUser !== 'function') {
      console.error('Required userStore functions not available', { 
        hasSetLoading: typeof userStore?.setLoading === 'function',
        hasSetUser: typeof userStore?.setUser === 'function',
      });
      return;
    }

    // Set loading state
    userStore.setLoading(status === 'loading');

    try {
      // Handle session state
      if (status === 'authenticated' && session?.user) {
        // Ensure we have valid values before updating the store
        const user = {
          id: session.user.id || '', // Fallback to empty string if undefined
          email: session.user.email || null, // Explicitly set to null if undefined
          name: session.user.name || null, // Explicitly set to null if undefined
        };
        console.log('Setting authenticated user:', user);
        userStore.setUser(user);
      } else if (status === 'unauthenticated' || !session) {
        // Clear the user when session is explicitly unauthenticated or missing
        console.log('Session is unauthenticated or missing, clearing user');
        userStore.setUser(null);
      } else {
        console.warn('Unexpected session status:', status);
      }
    } catch (error) {
      console.error('Error handling session state:', error);
      // Try to set user to null in case of error
      try {
        userStore.setUser(null);
      } catch (innerError) {
        console.error('Failed to reset user after error:', innerError);
      }
    }
  }, [session, status, userStore]); // Updated dependencies

  // This component doesn't render anything visible
  return null;
}

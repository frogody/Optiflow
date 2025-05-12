'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';

import { useUserStore } from '@/lib/userStore';

// Inner component that will be wrapped with Suspense
function SessionInitializerInner() {
  const { data: session, status } = useSession();
  const [retryCount, setRetryCount] = useState(0);
  
  // Get store functions directly to avoid potential issues
  const setUser = useUserStore((state) => state.setUser);
  const setLoading = useUserStore((state) => state.setLoading);
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Validate that the required store functions exist
    if (typeof setLoading !== 'function' || typeof setUser !== 'function') {
      console.error('Required userStore functions not available', { 
        hasSetLoading: typeof setLoading === 'function',
        hasSetUser: typeof setUser === 'function',
      });
      
      // If we've tried less than 3 times, retry with exponential backoff
      if (retryCount < 3) {
        const timeout = Math.pow(2, retryCount) * 500; // 500ms, 1000ms, 2000ms
        console.log(`Retrying userStore initialization in ${timeout}ms (attempt ${retryCount + 1}/3)`);
        const timer = setTimeout(() => setRetryCount(retryCount + 1), timeout);
        return () => clearTimeout(timer);
      }
      
      return;
    }

    console.log('Session status:', status, 'User:', session?.user?.email || 'none');
    
    // Set loading state
    setLoading(status === 'loading');

    try {
      // Handle session state
      if (status === 'authenticated' && session?.user) {
        // Ensure we have valid values before updating the store
        const user = {
          id: session.user.id || '', // Fallback to empty string if undefined
          email: session.user.email || null, // Explicitly set to null if undefined
          name: session.user.name || null, // Explicitly set to null if undefined
          image: session.user.image || null // Handle image if present
        };
        console.log('Setting authenticated user:', user);
        setUser(user);
      } else if (status === 'unauthenticated') {
        // Clear the user when session is explicitly unauthenticated
        console.log('Session is unauthenticated, clearing user');
        setUser(null);
      } else if (status !== 'loading') {
        // If we're not loading and don't have a user, make sure we're cleared
        console.log('Session is not loading but not authenticated, clearing user');
        setUser(null);
      }
    } catch (error) {
      console.error('Error handling session state:', error);
      // Try to set user to null in case of error
      try {
        setUser(null);
      } catch (innerError) {
        console.error('Failed to reset user after error:', innerError);
      }
    }
  }, [session, status, setUser, setLoading, retryCount]);

  // This inner component doesn't render anything visible
  return null;
}

/**
 * SessionInitializer component checks for an existing session
 * and syncs it with the user store.
 * 
 * Wrapped in Suspense for Next.js 15 compatibility.
 */
export function SessionInitializer() {
  return (
    <Suspense fallback={null}>
      <SessionInitializerInner />
    </Suspense>
  );
}

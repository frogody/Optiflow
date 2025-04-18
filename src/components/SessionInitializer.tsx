'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore, FrontendUser } from '@/lib/userStore';

/**
 * SessionInitializer component checks for an existing session
 * and syncs it with the user store.
 */
export default function SessionInitializer() {
  const { data: session, status } = useSession();
  const { setCurrentUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);

    // Set loading state based on session status
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Convert session user to FrontendUser type
      const user: FrontendUser = {
        // Use a fallback ID if not present
        id: (session.user as any).id || 'temp-id',
        email: session.user.email || '',
        name: session.user.name || null
      };
      console.log('Setting user in store:', user);
      setCurrentUser(user);
    } else if (status === 'unauthenticated') {
      console.log('Clearing user from store');
      clearUser();
    }
  }, [session, status, setCurrentUser, clearUser, setLoading]);

  // This component doesn't render anything visible
  return null;
} 
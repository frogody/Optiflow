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
  const { setCurrentUser, clearUser } = useUserStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Convert session user to FrontendUser type
      const user: FrontendUser = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || null
      };
      setCurrentUser(user);
    } else if (status === 'unauthenticated') {
      clearUser();
    }
  }, [session, status, setCurrentUser, clearUser]);

  // This component doesn't render anything visible
  return null;
} 
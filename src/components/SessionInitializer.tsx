'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/userStore';
import Cookies from 'js-cookie';
import { getUserById } from '@/lib/auth';
import { toast } from 'react-hot-toast';

/**
 * SessionInitializer component checks for an existing user token in cookies
 * and restores the user session when the application starts.
 */
export default function SessionInitializer() {
  const { currentUser, setCurrentUser, setLoading, isLoading } = useUserStore();
  const [sessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        
        // Only attempt to restore if no current user is set
        if (!currentUser) {
          // Check for existing token
          const token = Cookies.get('user-token');
          
          if (token) {
            // Attempt to get user by ID
            const user = getUserById(token);
            
            if (user) {
              console.log('Session restored for user:', user.email);
              // Restore user session
              setCurrentUser({
                id: user.id,
                email: user.email,
                name: user.name
              });
            } else {
              // Invalid token, clean up
              console.warn('Invalid session token found, clearing session');
              Cookies.remove('user-token');
              setCurrentUser(null);
            }
          } else {
            // No token found
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clean up in case of error
        Cookies.remove('user-token');
        setCurrentUser(null);
        
        // Show error to user
        toast.error('Session expired. Please log in again.');
      } finally {
        // Mark loading as complete
        setLoading(false);
        setSessionInitialized(true);
      }
    };

    if (!sessionInitialized) {
      initializeSession();
    }
  }, [currentUser, setCurrentUser, setLoading, sessionInitialized]);

  // This component doesn't render anything visible
  return null;
} 
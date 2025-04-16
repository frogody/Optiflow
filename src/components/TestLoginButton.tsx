'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { authenticateUser } from '@/lib/auth';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export default function TestLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleTestLogin = async () => {
    setIsLoading(true);

    try {
      const email = 'demo@example.com';
      const password = 'password123';
      
      toast.loading('Logging in with test account...');
      
      // Authenticate with test credentials
      const user = await authenticateUser(email, password);
      
      toast.dismiss();
      toast.success('Logged in as test user');
      
      // Set user in store
      setCurrentUser({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      
      // Set authentication cookie
      Cookies.set('user-token', user.id, { 
        expires: 7, 
        path: '/',
        sameSite: 'strict'
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      toast.dismiss();
      console.error('Test login error:', error);
      toast.error('Test login failed. Did you refresh the page to create the test user?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleTestLogin}
      disabled={isLoading}
      className="w-full px-4 py-2 text-sm font-medium text-dark-50 dark:text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 transition-all duration-200"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Logging in...
        </span>
      ) : (
        'Login with Test Account'
      )}
    </button>
  );
} 
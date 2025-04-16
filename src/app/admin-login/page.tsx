'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { authenticateUser, createTestUser } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  useEffect(() => {
    // Create the test user on page load
    const initUser = async () => {
      try {
        await createTestUser();
        console.log('Admin page: Test user created or verified');
      } catch (err) {
        console.error('Failed to create test user:', err);
      }
    };
    
    initUser();
  }, []);

  const handleDirectLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Force test user creation again to be sure
      await createTestUser();
      
      // Login with hardcoded test credentials
      const email = 'demo@example.com';
      const password = 'password123';
      
      console.log('Admin login: Authenticating with test credentials...');
      const user = await authenticateUser(email, password);
      
      if (!user || !user.id) {
        throw new Error('Failed to authenticate - invalid user data');
      }
      
      console.log('Admin login: Authentication successful for user:', user.email);
      
      // Set user in store
      setCurrentUser({
        id: user.id,
        email: user.email,
        name: user.name || 'Demo User',
      });
      
      // Set authentication cookie
      Cookies.set('user-token', user.id, { 
        expires: 7, 
        path: '/',
        sameSite: 'lax' // Changed to lax for better compatibility
      });
      
      toast.success('Logged in as admin user');
      
      // Check if cookie was set
      const cookie = Cookies.get('user-token');
      console.log('Admin login: Cookie set?', !!cookie);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <Image
              src="/ISYNCSO_LOGO.png"
              alt="ISYNCSO"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-gray-400">Direct login for admin access</p>
        </div>
        
        <div className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={handleDirectLogin}
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login as Admin User'}
          </button>
          
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:text-primary-dark transition-colors">
              Back to regular login
            </Link>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Using test credentials: demo@example.com / password123</p>
          <p>This page bypasses OAuth configuration for testing purposes.</p>
        </div>
      </div>
    </div>
  );
} 
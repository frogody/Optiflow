'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

export default function AdminLoginPage(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDirectLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use the admin credentials we created
      const email = 'admin@isyncso.com';
      const password = 'admin123';
      
      console.log('Admin login: Attempting authentication with admin credentials...');
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin',
      });
      
      console.log('Admin login: Authentication response:', { 
        status: result?.status,
        ok: result?.ok,
        error: result?.error,
        url: result?.url
      });
      
      if (!result?.ok || result?.error) {
        throw new Error(result?.error || 'Authentication failed');
      }
      
      console.log('Admin login: Authentication successful');
      toast.success('Logged in as admin user');
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Authentication failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative login method using our direct API endpoint
  const handleBackupLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use the admin credentials we created
      const email = 'admin@isyncso.com';
      const password = 'admin123';
      
      console.log('Admin login (backup): Attempting authentication with admin credentials...');
      
      const response = await fetch('/api/auth/login-debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      console.log('Admin login (backup): Authentication response:', data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      console.log('Admin login (backup): Authentication successful');
      toast.success('Logged in as admin user (backup method)');
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Admin login (backup) error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      toast.error('Backup login failed: ' + (error instanceof Error ? error.message : 'Authentication failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundaryWrapper>
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
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors mb-3"
            >
              {isLoading ? 'Logging in...' : 'Login as Admin User'}
            </button>
            
            <button
              onClick={handleBackupLogin}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Alternative Login Method'}
            </button>
            
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="text-primary hover:text-primary-dark transition-colors">
                Back to regular login
              </Link>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-8">
            <p>Using admin credentials: admin@isyncso.com</p>
            <p>This page provides direct admin access for authorized personnel.</p>
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
} 
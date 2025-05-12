'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage(): JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDirectLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const email = process.env['TEST_USER_EMAIL'] || 'demo@isyncso.com';
      const password = process.env['TEST_USER_PASSWORD'] || 'password123';
      
      console.log('Admin login: Authenticating with test credentials...');
      const result = await signIn('credentials', { email,
        password,
        redirect: false,
          });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      console.log('Admin login: Authentication successful');
      toast.success('Logged in as admin user');
      router.push('/dashboard');
    } catch (error) { console.error('Admin login error:', error);
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
            { isLoading ? 'Logging in...' : 'Login as Admin User'    }
          </button>
          
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:text-primary-dark transition-colors">
              Back to regular login
            </Link>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Using test credentials: {process.env['TEST_USER_EMAIL'] || 'demo@isyncso.com'} / {process.env['TEST_USER_PASSWORD'] || 'password123'}</p>
          <p>This page bypasses OAuth configuration for testing purposes.</p>
        </div>
      </div>
    </div>
  );
} 
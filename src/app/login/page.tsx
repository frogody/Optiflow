'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUserStore, FrontendUser } from '@/lib/userStore';
import { authenticateUser, authenticateWithSocialProvider, SocialProvider } from '@/lib/auth';
import Cookies from 'js-cookie';
import Image from 'next/image';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [apiLoading, setApiLoading] = useState(false);
  const [showConfigError, setShowConfigError] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = Cookies.get('user-token');
    if (token) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, router]);

  // Check if there's an error query parameter
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'Configuration') {
      setShowConfigError(true);
      toast.error('OAuth configuration error. Try using email login instead.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authenticateUser(formData.email, formData.password);
      
      // Set user in store
      const frontendUser: FrontendUser = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      setCurrentUser(frontendUser);
      
      // Set authentication cookie with secure settings
      Cookies.set('user-token', user.id, { 
        expires: 7, 
        path: '/',
        sameSite: 'strict'
      });
      
      // Redirect to the original requested URL or dashboard
      router.push(callbackUrl);
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Gmail') {
      // Use NextAuth for Google sign-in
      signIn('google', { callbackUrl });
      return;
    }
    
    // In a real implementation, this would redirect to OAuth provider
    setIsLoading(true);
    setError('');
    console.log(`Logging in with ${provider}...`);
    
    try {
      // For demo purposes, simulate a successful authentication
      // In a real app, you would redirect to the provider's OAuth page and handle the callback
      const mockAuthCode = 'mock-auth-code-' + Date.now();
      
      // Call the authenticateWithSocialProvider function with the provider and code
      const user = await authenticateWithSocialProvider(provider.toLowerCase() as SocialProvider, mockAuthCode);
      
      // Set user in store
      const frontendUser: FrontendUser = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      setCurrentUser(frontendUser);
      
      // Set authentication cookie with secure settings
      Cookies.set('user-token', user.id, { 
        expires: 7, 
        path: '/',
        sameSite: 'strict'
      });
      
      // Redirect to the original requested URL or dashboard
      router.push(callbackUrl);
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(error instanceof Error ? error.message : `Authentication with ${provider} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiLogin = async () => {
    setApiLoading(true);
    setError('');
    
    try {
      // Use the custom API endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      // Set user in store
      const frontendUser: FrontendUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name
      };
      setCurrentUser(frontendUser);
      
      // Redirect to dashboard
      router.push(callbackUrl);
    } catch (error) {
      console.error('API login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
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
        </div>
        <div className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Welcome Back
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Social Login Buttons */}
          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              className="w-full flex items-center justify-center px-4 py-2 bg-[#24292e] text-white rounded-md hover:bg-[#24292e]/90 transition-all duration-200"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
              </svg>
              Continue with GitHub
            </button>
            <GoogleLoginButton className="w-full" />
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-50/30 text-white/60">Or continue with email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-100/50 text-white placeholder-white/50 rounded-md border border-primary/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-dark-100/50 text-white placeholder-white/50 rounded-md border border-primary/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full glow-effect px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-200"
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
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          {showConfigError && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/20 rounded-md text-blue-300 text-sm">
              <p className="font-bold">OAuth Configuration Error</p>
              <p className="mt-1">The OAuth login is not properly configured. You can:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Try using email/password login above</li>
                <li>
                  <Link href="/admin-login" className="text-primary underline">
                    Use the admin login page
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="mt-6 text-center text-sm text-white/60">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
      {/* Gradient background effect */}
      <div className="fixed inset-0 -z-10 bg-dark">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-radial from-secondary/5 via-transparent to-transparent translate-x-[50%]"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
} 
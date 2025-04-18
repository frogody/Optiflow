'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

// Helper function to validate and sanitize callback URL
function getSafeCallbackUrl(url: string | null): string {
  if (!url) return '/dashboard';
  
  try {
    const urlObj = new URL(url);
    // Only allow redirects to our own domain
    if (urlObj.hostname !== 'app.isyncso.com' && urlObj.hostname !== 'localhost') {
      return '/dashboard';
    }
    // Don't allow redirects to login or auth pages
    if (urlObj.pathname.includes('/login') || urlObj.pathname.includes('/auth')) {
      return '/dashboard';
    }
    return url;
  } catch (e) {
    // If URL is invalid or relative, check if it's safe
    const relativeUrl = url.toString();
    if (relativeUrl.includes('/login') || relativeUrl.includes('/auth')) {
      return '/dashboard';
    }
    // Make sure the URL starts with a slash
    return relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Successfully logged in!');
      router.push(callbackUrl);
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { 
        callbackUrl,
        redirect: true 
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
      setIsLoading(false);
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
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-all duration-200"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
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
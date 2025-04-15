'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/userStore';
import { registerUser } from '@/lib/auth';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      });

      // Set user in store
      setCurrentUser({
        id: user.id,
        email: user.email,
      });
      
      // Set authentication cookie
      Cookies.set('user-token', user.id, { expires: 7 });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
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
              layout="fill"
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="bg-dark-50/30 backdrop-blur-md rounded-lg border border-primary/20 shadow-neon p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Create Account
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/20 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white/90 mb-2"
              >
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-dark-100/50 text-white placeholder-white/50 rounded-md border border-primary/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40"
                placeholder="Enter your name"
              />
            </div>
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
                placeholder="Create a password"
                minLength={8}
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Sign in
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
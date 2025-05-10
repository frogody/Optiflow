'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Mock API call - in a real app, this would call your password reset endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful email sending
      setEmailSent(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image
            src="/images/optiflow-logo.svg"
            alt="Optiflow"
            width={180}
            height={48}
            className="h-12 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-[#E5E7EB]">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-[#9CA3AF]">
          Enter your email address, and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#18181B] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-[#371520] border border-[#F87171] text-[#F87171] px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF]">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    placeholder="you@example.com"
                    aria-label="Your email address"
                    title="Your email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111111] bg-[#22D3EE] hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE] ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Send reset link"
                  title="Send reset link"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <CheckCircleIcon className="h-12 w-12 mx-auto text-[#10B981]" />
              <h3 className="mt-4 text-xl font-medium text-[#E5E7EB]">Check Your Email</h3>
              <p className="mt-2 text-[#9CA3AF]">
                We've sent a password reset link to <span className="font-medium text-[#E5E7EB]">{email}</span>.
                The link will expire in 1 hour.
              </p>
              <p className="mt-4 text-sm text-[#9CA3AF]">
                Didn't receive the email?{' '}
                <button 
                  className="text-[#22D3EE] hover:text-[#06B6D4] font-medium"
                  onClick={() => {
                    // Simulate resending reset email
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setError('Reset email resent. Please check your inbox.');
                    }, 800);
                  }}
                  disabled={loading}
                >
                  {loading ? 'Resending...' : 'Resend'}
                </button>
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="font-medium text-[#22D3EE] hover:text-[#06B6D4]">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
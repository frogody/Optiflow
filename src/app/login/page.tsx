'use client';

import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Mock login success with MFA for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate MFA requirement for specific email
      if (email === 'demo@optiflow.com') {
        setMfaRequired(true);
      } else {
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Mock MFA verification
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mfaCode === '123456') {
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Error verifying code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          Welcome Back to Optiflow
        </h2>
        <p className="mt-2 text-center text-sm text-[#9CA3AF]">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-[#22D3EE] hover:text-[#06B6D4]">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#18181B] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-[#371520] border border-[#F87171] text-[#F87171] px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {!mfaRequired ? (
            <>
              {/* Login Form */}
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
                      aria-label="Email address"
                      title="Your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#9CA3AF]">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      placeholder="••••••••"
                      aria-label="Password"
                      title="Your password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-[#4B5563] hover:text-[#9CA3AF] focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 bg-[#111111] border-[#374151] rounded text-[#22D3EE] focus:ring-[#22D3EE]"
                      aria-label="Remember me"
                      title="Remember me"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[#9CA3AF]">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-[#22D3EE] hover:text-[#06B6D4]">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111111] bg-[#22D3EE] hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE] ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Sign in"
                    title="Sign in"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#374151]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#18181B] text-[#9CA3AF]">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-[#374151] rounded-md shadow-sm bg-[#111111] text-sm font-medium text-[#E5E7EB] hover:bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE]"
                      aria-label="Sign in with Google"
                      title="Sign in with Google"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z" fill="#4285F4"/>
                        <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                        <path d="M5.50245 14.3003C4.99897 12.8099 4.99897 11.1975 5.50245 9.70708V6.61621H1.51199C-0.210581 10.0056 -0.210581 14.0018 1.51199 17.3912L5.50245 14.3003Z" fill="#FBBC05"/>
                        <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61621L5.50706 9.70706C6.45013 6.86173 9.10455 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                      </svg>
                      Google
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-[#374151] rounded-md shadow-sm bg-[#111111] text-sm font-medium text-[#E5E7EB] hover:bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE]"
                      aria-label="Sign in with GitHub"
                      title="Sign in with GitHub"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                      </svg>
                      GitHub
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* MFA Verification Form */}
              <form className="space-y-6" onSubmit={handleMfaSubmit}>
                <div>
                  <label htmlFor="mfa-code" className="block text-sm font-medium text-[#9CA3AF]">
                    Verification Code
                  </label>
                  <p className="text-xs text-[#9CA3AF] mb-2">
                    Enter the 6-digit code from your authenticator app.
                  </p>
                  <input
                    id="mfa-code"
                    name="mfa-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoComplete="one-time-code"
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full px-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent text-center tracking-widest text-xl"
                    placeholder="123456"
                    aria-label="Verification code"
                    title="Verification code"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || mfaCode.length !== 6}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111111] bg-[#22D3EE] hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE] ${
                      loading || mfaCode.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Verify code"
                    title="Verify code"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMfaRequired(false)}
                    className="text-sm font-medium text-[#22D3EE] hover:text-[#06B6D4]"
                    aria-label="Go back"
                    title="Go back"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

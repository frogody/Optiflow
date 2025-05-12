'use client';


// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Heroicons removed to prevent React version conflicts
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { SocialProvider } from '@/lib/auth';
import { useUserStore } from '@/lib/userStore';


interface PasswordStrength {
  score: number;
  feedback: string;
  criteria: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={`icon-placeholder ${name} ${className || ''}`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function Signup(): JSX.Element {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '',
    password: '',
    confirmPassword: '',
    name: '',
      });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);

  // Form validation states
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: 'Password is too weak',
    criteria: {
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            },
        body: JSON.stringify({
  email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
            }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Set user in store
      setCurrentUser({ id: data.user.id,
        email: data.user.email,
        name: data.user.name,
          });
      
      // Set authentication cookie
      Cookies.set('user-token', data.user.id, { expires: 7, 
        path: '/',
        sameSite: 'strict'
          });
      
      router.push('/dashboard');
    } catch (error) { console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
        } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');
    console.log(`Signing up with ${provider}...`);
    
    try {
      if (provider.toLowerCase() === 'github') {
        window.location.href = '/api/auth/signin/github';
        return;
      } else if (provider.toLowerCase() === 'gmail') {
        window.location.href = '/api/auth/signin/google';
        return;
      }
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      setError(error instanceof Error ? error.message : `Registration with ${provider} failed`);
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const criteria = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password)
    };

    const passedCriteria = Object.values(criteria).filter(Boolean).length;

    let score = 0;
    let feedback = 'Password is too weak';

    if (passedCriteria === 0 || passedCriteria === 1) {
      score = 1;
      feedback = 'Password is too weak';
    } else if (passedCriteria === 2 || passedCriteria === 3) {
      score = 2;
      feedback = 'Password could be stronger';
    } else if (passedCriteria === 4) {
      score = 3;
      feedback = 'Password is strong';
    } else if (passedCriteria === 5) {
      score = 4;
      feedback = 'Password is very strong';
    }

    setPasswordStrength({
      score,
      feedback,
      criteria
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          Create Your Optiflow Account
        </h2>
        <p className="mt-2 text-center text-sm text-[#9CA3AF]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#22D3EE] hover:text-[#06B6D4]">
            Log in
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

          {!isEmailVerificationSent ? (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-[#9CA3AF]">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="user-" className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                    </div>
                    <input
                      id="full-name"
                      name="full-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      placeholder="John Doe"
                      aria-label="Your full name"
                      title="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#9CA3AF]">
                    Work Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="envelope-" className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      placeholder="you@example.com"
                      aria-label="Your email address"
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
                      <Icon name="lock-closed-" className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                      placeholder="••••••••"
                      aria-label="Create password"
                      title="Create password"
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
                          <Icon name="eye-slash-" className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Icon name="eye-" className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#9CA3AF]">Password strength</span>
                      <span className={`text-xs ${
                        passwordStrength.score <= 1 ? 'text-[#F87171]' : 
                        passwordStrength.score === 2 ? 'text-[#F59E0B]' : 
                        'text-[#10B981]'
                      }`}>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[#1E293B] rounded-full overflow-hidden">
                      <div className={`h-full ${
                        passwordStrength.score <= 1 ? 'bg-[#F87171] w-1/4' : 
                        passwordStrength.score === 2 ? 'bg-[#F59E0B] w-2/4' : 
                        passwordStrength.score === 3 ? 'bg-[#10B981] w-3/4' : 
                        'bg-[#10B981] w-full'
                      }`}></div>
                    </div>

                    {/* Password requirements */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center text-xs">
                        {passwordStrength.criteria.hasMinLength ? (
                          <Icon name="check-circle-" className="h-4 w-4 text-[#10B981] mr-1" />
                        ) : (
                          <Icon name="exclamation-circle-" className="h-4 w-4 text-[#9CA3AF] mr-1" />
                        )}
                        <span className={passwordStrength.criteria.hasMinLength ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                          8+ characters
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.criteria.hasUppercase ? (
                          <Icon name="check-circle-" className="h-4 w-4 text-[#10B981] mr-1" />
                        ) : (
                          <Icon name="exclamation-circle-" className="h-4 w-4 text-[#9CA3AF] mr-1" />
                        )}
                        <span className={passwordStrength.criteria.hasUppercase ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                          Uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.criteria.hasLowercase ? (
                          <Icon name="check-circle-" className="h-4 w-4 text-[#10B981] mr-1" />
                        ) : (
                          <Icon name="exclamation-circle-" className="h-4 w-4 text-[#9CA3AF] mr-1" />
                        )}
                        <span className={passwordStrength.criteria.hasLowercase ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                          Lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.criteria.hasNumber ? (
                          <Icon name="check-circle-" className="h-4 w-4 text-[#10B981] mr-1" />
                        ) : (
                          <Icon name="exclamation-circle-" className="h-4 w-4 text-[#9CA3AF] mr-1" />
                        )}
                        <span className={passwordStrength.criteria.hasNumber ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                          Number
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordStrength.criteria.hasSpecialChar ? (
                          <Icon name="check-circle-" className="h-4 w-4 text-[#10B981] mr-1" />
                        ) : (
                          <Icon name="exclamation-circle-" className="h-4 w-4 text-[#9CA3AF] mr-1" />
                        )}
                        <span className={passwordStrength.criteria.hasSpecialChar ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-[#9CA3AF]">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="lock-closed-" className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`block w-full pl-10 pr-10 py-2 bg-[#111111] border ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-[#F87171] focus:ring-[#F87171]'
                          : 'border-[#374151] focus:ring-[#22D3EE]'
                      } rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:border-transparent`}
                      placeholder="••••••••"
                      aria-label="Confirm password"
                      title="Confirm password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-[#4B5563] hover:text-[#9CA3AF] focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <Icon name="eye-slash-" className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Icon name="eye-" className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-[#F87171]">Passwords do not match</p>
                  )}
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-4 w-4 bg-[#111111] border-[#374151] rounded text-[#22D3EE] focus:ring-[#22D3EE]"
                      aria-label="Agree to terms and conditions"
                      title="Agree to terms and conditions"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-[#9CA3AF]">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#22D3EE] hover:text-[#06B6D4]">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-[#22D3EE] hover:text-[#06B6D4]">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111111] bg-[#22D3EE] hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE] ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    aria-label="Create account"
                    title="Create account"
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
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
                      aria-label="Sign up with Google"
                      title="Sign up with Google"
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
                      aria-label="Sign up with GitHub"
                      title="Sign up with GitHub"
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
            <div className="text-center">
              <Icon name="check-circle-" className="h-12 w-12 mx-auto text-[#10B981]" />
              <h3 className="mt-4 text-xl font-medium text-[#E5E7EB]">Verification Email Sent</h3>
              <p className="mt-2 text-[#9CA3AF]">
                We've sent a verification link to <span className="font-medium text-[#E5E7EB]">{formData.email}</span>.
                Please check your inbox and click the link to complete your registration.
              </p>
              <p className="mt-4 text-sm text-[#9CA3AF]">
                Didn't receive the email?{' '}
                <button 
                  className="text-[#22D3EE] hover:text-[#06B6D4] font-medium"
                  onClick={() => {
                    // Simulate resending verification email
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setError('Verification email resent. Please check your inbox.');
                    }, 800);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Resending...' : 'Resend'}
                </button>
              </p>
              <div className="mt-6">
                <Link 
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-[#22D3EE] hover:text-[#06B6D4]"
                >
                  Back to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
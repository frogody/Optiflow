'use client';

import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

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

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);

  // Password strength state
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

  // Validate token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      // In a real app, you would validate the token with your API
      // This is a mock implementation for demonstration
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate expired token for specific token value
        if (token === 'expired') {
          setTokenExpired(true);
        } else if (!token) {
          // No token provided
          setError('No reset token provided');
        } else {
          setTokenValidated(true);
        }
      } catch (err) {
        setError('Could not validate reset token');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

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
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validations
    if (passwordStrength.score < 2) {
      setError('Please use a stronger password');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Mock API call - in a real app, this would call your password reset endpoint
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful password reset
      setResetComplete(true);
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
          Create a New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#18181B] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-[#371520] border border-[#F87171] text-[#F87171] px-4 py-3 rounded-md text-sm flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && !tokenValidated && !tokenExpired && (
            <div className="text-center py-6">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#22D3EE] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-[#9CA3AF]">Validating your reset link...</p>
            </div>
          )}

          {tokenExpired && (
            <div className="text-center">
              <ExclamationCircleIcon className="h-12 w-12 mx-auto text-[#F87171]" />
              <h3 className="mt-4 text-xl font-medium text-[#E5E7EB]">Reset Link Expired</h3>
              <p className="mt-2 text-[#9CA3AF]">
                The password reset link has expired or is invalid. Please request a new reset link.
              </p>
              <div className="mt-6">
                <Link 
                  href="/forgot-password"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-[#111111] bg-[#22D3EE] rounded-md hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE]"
                >
                  Request New Link
                </Link>
              </div>
            </div>
          )}

          {tokenValidated && !resetComplete && (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#9CA3AF]">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-10 py-2 bg-[#111111] border border-[#374151] rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent"
                    placeholder="••••••••"
                    aria-label="Create new password"
                    title="Create new password"
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
                        <CheckCircleIcon className="h-4 w-4 text-[#10B981] mr-1" />
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 text-[#9CA3AF] mr-1" />
                      )}
                      <span className={passwordStrength.criteria.hasMinLength ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                        8+ characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.criteria.hasUppercase ? (
                        <CheckCircleIcon className="h-4 w-4 text-[#10B981] mr-1" />
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 text-[#9CA3AF] mr-1" />
                      )}
                      <span className={passwordStrength.criteria.hasUppercase ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.criteria.hasLowercase ? (
                        <CheckCircleIcon className="h-4 w-4 text-[#10B981] mr-1" />
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 text-[#9CA3AF] mr-1" />
                      )}
                      <span className={passwordStrength.criteria.hasLowercase ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                        Lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.criteria.hasNumber ? (
                        <CheckCircleIcon className="h-4 w-4 text-[#10B981] mr-1" />
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 text-[#9CA3AF] mr-1" />
                      )}
                      <span className={passwordStrength.criteria.hasNumber ? 'text-[#E5E7EB]' : 'text-[#9CA3AF]'}>
                        Number
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordStrength.criteria.hasSpecialChar ? (
                        <CheckCircleIcon className="h-4 w-4 text-[#10B981] mr-1" />
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 text-[#9CA3AF] mr-1" />
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
                  Confirm New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#4B5563]" aria-hidden="true" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2 bg-[#111111] border ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-[#F87171] focus:ring-[#F87171]'
                        : 'border-[#374151] focus:ring-[#22D3EE]'
                    } rounded-md text-[#E5E7EB] focus:outline-none focus:ring-2 focus:border-transparent`}
                    placeholder="••••••••"
                    aria-label="Confirm new password"
                    title="Confirm new password"
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
                        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-[#F87171]">Passwords do not match</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#111111] bg-[#22D3EE] hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE] ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  aria-label="Reset password"
                  title="Reset password"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          {resetComplete && (
            <div className="text-center">
              <CheckCircleIcon className="h-12 w-12 mx-auto text-[#10B981]" />
              <h3 className="mt-4 text-xl font-medium text-[#E5E7EB]">Password Reset Successful</h3>
              <p className="mt-2 text-[#9CA3AF]">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <div className="mt-6">
                <Link 
                  href="/login"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-[#111111] bg-[#22D3EE] rounded-md hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22D3EE]"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}

          {!tokenExpired && !resetComplete && (
            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="font-medium text-[#22D3EE] hover:text-[#06B6D4]">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
} 
'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleLoginButtonProps {
  className?: string;
}

export default function GoogleLoginButton({ className = '' }: GoogleLoginButtonProps) {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      className={`flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ${className}`}
    >
      <FcGoogle className="h-5 w-5" />
      Sign in with Google
    </button>
  );
} 
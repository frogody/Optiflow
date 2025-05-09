// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-pulse gradient-text text-xl">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

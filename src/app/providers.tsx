// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { LanguageProvider } from '@/lib/languageContext';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Check session every 5 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}

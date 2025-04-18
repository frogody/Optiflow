'use client';

import { LanguageProvider } from '@/lib/languageContext';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
} 
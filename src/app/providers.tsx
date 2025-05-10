'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

import { LanguageProvider } from '@/lib/languageContext';

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

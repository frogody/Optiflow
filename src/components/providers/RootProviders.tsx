'use client';

import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';

import Navigation from '@/components/Navigation';
import TanstackProvider from '@/components/providers/TanstackProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SessionInitializer } from '@/components/SessionInitializer';

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <SessionInitializer />
            <Navigation />
            <div id="microphone-permission-root" />
            {children}
            <Toaster position="top-right" />
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
}

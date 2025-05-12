'use client';

import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { IconContext } from 'react-icons';

import '@/styles/globals.css';

import Navigation from '@/components/Navigation';
import TanstackProvider from '@/components/providers/TanstackProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SessionInitializer } from '@/components/SessionInitializer';

export function RootProviders({ children }: { children: React.ReactNode }) {
  // Use state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true after component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SessionProvider>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Fix for react-icons hydration issues */}
          <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
            <Suspense fallback={null}>
              <SessionInitializer />
              <Navigation />
              <div id="microphone-permission-root" />
              {children}
              <Toaster position="top-right" />
              {isClient && <Analytics />}
            </Suspense>
          </IconContext.Provider>
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
}

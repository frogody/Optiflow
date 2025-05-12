'use client';

import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { IconContext } from 'react-icons';
import dynamic from 'next/dynamic';

import '@/styles/globals.css';

// Dynamic imports to prevent hydration issues
const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false,
});

import TanstackProvider from '@/components/providers/TanstackProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SessionInitializer } from '@/components/SessionInitializer';
import { initI18n } from '@/lib/i18n';

export function RootProviders({ children }: { children: React.ReactNode }) {
  // Use state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Initialize i18n and other client-side only features
  useEffect(() => {
    // Initialize i18n on client-side
    initI18n();
    setIsClient(true);
    
    // Add a class to indicate client-side rendering is complete
    document.documentElement.classList.add('client-loaded');
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
              {isClient && <Navigation />}
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

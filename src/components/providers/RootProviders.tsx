'use client';

import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { IconContext } from 'react-icons';

import '@/styles/globals.css';

import TanstackProvider from '@/components/providers/TanstackProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SessionInitializer } from '@/components/SessionInitializer';
import { initI18n } from '@/lib/i18n';
import { initializeErrorHandler } from '@/lib/error-handler';

// Import Navigation normally - we'll control rendering with a state flag
import Navigation from '@/components/Navigation';

export function RootProviders({ children }: { children: React.ReactNode }) {
  // Use state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Initialize client-side features safely
  useEffect(() => {
    try {
      // Initialize error handler first to catch any errors in other initializations
      initializeErrorHandler();
      
      // Initialize i18n on client-side
      initI18n();
      
      // Mark client-side rendering as complete
      setIsClient(true);
      
      // Add a class to indicate client-side rendering is complete
      document.documentElement.classList.add('client-loaded');
    } catch (error) {
      console.error('Error initializing client-side features:', error);
    }
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

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
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { initI18n } from '@/lib/i18n';
import { initializeErrorHandler } from '@/lib/error-handler';

// Import Navigation normally - we'll control rendering with a state flag
import Navigation from '@/components/Navigation';

export function RootProviders({ children }: { children: React.ReactNode }) {
  // Use state to track client-side rendering and initialization status
  const [isClient, setIsClient] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  
  // Initialize client-side features safely
  useEffect(() => {
    let mounted = true;

    async function initializeFeatures() {
      if (!mounted) return;

      try {
        // Initialize error handler first to catch any errors in other initializations
        console.log('Initializing error handler...');
        initializeErrorHandler();
        
        // Initialize i18n on client-side
        console.log('Initializing i18n...');
        await initI18n();
        
        if (!mounted) return;

        // Mark client-side rendering as complete
        console.log('Client-side initialization complete');
        setIsClient(true);
        
        // Add a class to indicate client-side rendering is complete
        document.documentElement.classList.add('client-loaded');
      } catch (error) {
        console.error('Error initializing client-side features:', error);
        if (mounted) {
          setInitError(error instanceof Error ? error : new Error('Unknown initialization error'));
        }
      }
    }

    // Set isClient to true immediately to ensure Navigation is rendered
    setIsClient(true);
    
    initializeFeatures();

    return () => {
      mounted = false;
    };
  }, []);

  // If there was an initialization error, show an error message
  if (initError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Initialization Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We encountered an error while initializing the application.
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-[200px] mb-4">
            <code className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {initError.message}
              {initError.stack && (
                <>
                  {"\n\n"}
                  <span className="text-xs">
                    {initError.stack}
                  </span>
                </>
              )}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Only one ErrorBoundaryWrapper at the top
  return (
    <ErrorBoundaryWrapper>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <TanstackProvider>
            <IconContext.Provider value={{ className: 'inline-block' }}>
              <Suspense fallback={null}>
                <SessionInitializer />
                {isClient && <Navigation />}
                {children}
                <Analytics />
                <Toaster position="bottom-right" />
              </Suspense>
            </IconContext.Provider>
          </TanstackProvider>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundaryWrapper>
  );
}

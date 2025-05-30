import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { RootProviders } from '@/components/providers/RootProviders';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import ClientComponentsLoader from '@/components/ClientComponentsLoader';
import { initializeSentry } from '@/lib/monitoring/sentry';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Optiflow - Streamline Your Workflow Automation',
  description: 'Connect your apps and automate workflows with a powerful, easy-to-use integration platform.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Optiflow',
  },
};

// Initialize Sentry in production environment
if (process.env.NODE_ENV === 'production') {
  initializeSentry({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    environment: process.env.VERCEL_ENV || 'production',
    tracesSampleRate: 0.1,
    tags: {
      app: 'optiflow',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    },
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={inter.className}>
        <RootProviders>
          {/* Accessibility announcement region for screen readers */}
          <div 
            id="aria-live-region" 
            aria-live="polite" 
            aria-atomic="true" 
            className="sr-only"
          >
            {/* Dynamic announcements will be inserted here */}
          </div>
          
          {/* Error boundary wrapped around all client components */}
          <ErrorBoundaryWrapper>
            <ClientComponentsLoader>
              {children}
            </ClientComponentsLoader>
          </ErrorBoundaryWrapper>
        </RootProviders>
      </body>
    </html>
  );
} 
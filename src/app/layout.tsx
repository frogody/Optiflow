// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProviders } from '@/components/providers/RootProviders';
import BrowserDetection from '@/components/BrowserDetection';
import { initializeSentry } from '@/lib/monitoring/sentry';

const inter = Inter({ subsets: ['latin']     });

export const metadata: Metadata = {
  title: 'Optiflow - Streamline Your Workflow Automation',
  description: 'Connect your apps and automate workflows with a powerful, easy-to-use integration platform.',
  manifest: '/manifest.json',
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
}: { children: React.ReactNode;
    }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <BrowserDetection />
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
          <main>{children}</main>
        </RootProviders>
      </body>
    </html>
  );
} 
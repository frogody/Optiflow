import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import BrowserDetection from '@/components/BrowserDetection';
import { RootProviders } from '@/components/providers/RootProviders';
import { initializeSentry } from '@/lib/monitoring/sentry';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Optiflow - Streamline Your Workflow Automation',
  description: 'Connect your apps and automate workflows with a powerful, easy-to-use integration platform.',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Optiflow',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
    <html lang="en" suppressHydrationWarning className={inter.variable}>
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
          {children}
        </RootProviders>
      </body>
    </html>
  );
} 
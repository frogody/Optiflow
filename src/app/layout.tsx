import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

import { RootProviders } from '@/components/providers/RootProviders';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import { initializeSentry } from '@/lib/monitoring/sentry';
import '@/styles/globals.css';

// Use dynamic imports for client components to ensure proper code splitting
// and avoid "X is not a function" errors
const BrowserDetection = dynamic(
  () => import('@/components/BrowserDetection'),
  { ssr: false }
);

const ClientVoiceWrapper = dynamic(
  () => import('@/components/ClientVoiceWrapper'),
  { ssr: false }
);

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
          
          {/* Browser detection - client only */}
          <BrowserDetection />
          
          {/* Main content wrapped in error boundary */}
          <ErrorBoundaryWrapper>
            {children}
          </ErrorBoundaryWrapper>
          
          {/* Voice Agent Widget - client only */}
          <ClientVoiceWrapper />
        </RootProviders>
      </body>
    </html>
  );
} 
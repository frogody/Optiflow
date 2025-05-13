import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import BrowserDetection from '@/components/BrowserDetection';
import { RootProviders } from '@/components/providers/RootProviders';
import ClientVoiceWrapper from '@/components/ClientVoiceWrapper';
import { initializeSentry } from '@/lib/monitoring/sentry';
import { debugScript } from '@/lib/debug-script';
import '@/styles/globals.css';
import Footer from '@/components/Footer';

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
  title: 'SYNC - Automate Your Workflow',
  description: 'Connect your favorite tools, automate your workflows, and boost productivity with SYNC',
  icons: {
    icon: '/ISYNCSO_LOGO.png',
    apple: '/ISYNCSO_LOGO.png',
  },
  appleWebApp: {
    title: 'SYNC',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'SYNC',
  manifest: '/manifest.json',
  openGraph: {
    title: 'SYNC - Workflow Automation',
    description: 'Connect your favorite tools, automate your workflows, and boost productivity with SYNC',
    url: 'https://app.isyncso.com',
    siteName: 'SYNC',
    images: [
      {
        url: '/ISYNCSO_LOGO.png',
        width: 512,
        height: 512,
        alt: 'SYNC Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYNC - Automate Your Workflow',
    description: 'Connect your favorite tools, automate your workflows, and boost productivity with SYNC',
    creator: '@isyncso',
  },
  keywords: ['automation', 'workflows', 'productivity', 'AI', 'SYNC'],
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
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="debug-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: debugScript }}
          />
        )}
      </head>
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
          {/* Voice Agent Widget loaded via client component */}
          <ClientVoiceWrapper />
          <Footer />
        </RootProviders>
      </body>
    </html>
  );
} 
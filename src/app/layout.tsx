import { Metadata } from 'next';

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

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ClientProviders>
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}

'use client';

import '@/styles/globals.css';
import Navigation from '@/components/Navigation';
import MicrophonePermission from '@/components/MicrophonePermission';
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <div id="microphone-permission-root" />
          <MicrophonePermission />
          {children}
          <Toaster position="top-right" />
          <Analytics />
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
} 
'use client';

import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/Navigation';
import MicrophonePermission from '@/components/MicrophonePermission';
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

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
              <main>{children}</main>
              <Toaster position="top-right" />
              <Analytics />
            </ThemeProvider>
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html>
  );
} 
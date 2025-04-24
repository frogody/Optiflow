'use client';

import '@/styles/globals.css';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { SessionInitializer } from '@/components/SessionInitializer';

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionInitializer />
          <Navigation />
          <div id="microphone-permission-root" />
          {children}
          <Toaster position="top-right" />
          <Analytics />
        </ThemeProvider>
      </TanstackProvider>
    </SessionProvider>
  );
} 
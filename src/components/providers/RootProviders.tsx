'use client';

import '@/styles/globals.css';
import Navigation from '@/components/Navigation';
import MicrophonePermission from '@/components/MicrophonePermission';
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';

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
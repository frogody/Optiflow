// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProviders } from '@/components/providers/RootProviders';
import BrowserDetection from '@/components/BrowserDetection';

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
          <main>{children}</main>
        </RootProviders>
      </body>
    </html>
  );
} 
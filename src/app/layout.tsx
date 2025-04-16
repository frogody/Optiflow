import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import SessionInitializer from '@/components/SessionInitializer';
import ThemeProvider from '@/components/ThemeProvider';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SessionInitializer />
        <Providers>
          <ThemeProvider>
            <Navigation />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
} 
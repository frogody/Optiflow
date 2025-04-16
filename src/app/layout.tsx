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
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`
          ${inter.className} 
          flex flex-col min-h-screen
          bg-gray-50 dark:bg-dark
          text-gray-900 dark:text-gray-100
          transition-colors duration-200
        `}
      >
        <SessionInitializer />
        <Providers>
          <ThemeProvider>
            <div className="relative">
              <div className="fixed inset-0 bg-gradient-glow opacity-20 pointer-events-none" />
              <Navigation />
              <main className="relative flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </Providers>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-dark-50 dark:text-white',
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }} 
        />
      </body>
    </html>
  );
} 
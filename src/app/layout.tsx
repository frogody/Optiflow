import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/Navigation';
import MicrophonePermission from '@/components/MicrophonePermission';
import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/providers/theme-provider";
import TanstackProvider from "@/components/providers/TanstackProvider";

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
      <body className={inter.className}>
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
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
} 
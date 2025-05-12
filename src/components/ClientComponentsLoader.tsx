'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Import client components with ssr:false
const BrowserDetection = dynamic(
  () => import('@/components/BrowserDetection'),
  { ssr: false }
);

const ClientVoiceWrapper = dynamic(
  () => import('@/components/ClientVoiceWrapper'),
  { ssr: false }
);

export default function ClientComponentsLoader({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Browser detection for client-only features */}
      <BrowserDetection />
      
      {/* Main content */}
      {children}
      
      {/* Voice Agent Widget */}
      <ClientVoiceWrapper />
    </>
  );
} 
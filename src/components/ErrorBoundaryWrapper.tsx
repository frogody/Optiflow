'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import the ErrorBoundary component dynamically without SSR
const ErrorBoundary = dynamic(() => import('./ErrorBoundary'), {
  ssr: false,
});

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
} 
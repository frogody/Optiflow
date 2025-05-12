'use client';

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

export default function ErrorBoundaryWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Use client-side only rendering to avoid hydration issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the error boundary on the client side
  if (!mounted) {
    return <>{children}</>;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
} 
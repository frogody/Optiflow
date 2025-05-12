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
    // Safely set mounted state in an effect
    try {
      setMounted(true);
    } catch (error) {
      console.error('Error setting mounted state:', error);
    }
  }, []);

  // During server-side rendering or initial hydration, return children wrapped in a fragment
  // This ensures consistent behavior between server and client while avoiding hydration issues
  if (!mounted) {
    return (
      <>
        {children}
      </>
    );
  }

  // Once safely mounted on client-side, wrap with error boundary
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
} 
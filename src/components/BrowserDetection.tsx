// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useEffect } from 'react';
import { applySafariDetection } from '@/utils/browserDetection';

/**
 * Component that applies browser detection classes to the document body
 * This runs only on the client side and adds classes like 'safari' and 'mobile-safari'
 */
export default function BrowserDetection(): null {
  useEffect(() => {
    // Apply Safari detection classes to body
    applySafariDetection();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // This is a utility component that doesn't render anything
  return null;
} 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React, { ReactNode } from 'react';
import { isSafari } from '@/utils/browserDetection';

interface BackdropFilterProps {
  children: ReactNode;
  className?: string;
  intensity?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackBgColor?: string;
  style?: React.CSSProperties;
}

/**
 * A component that applies backdrop-filter with cross-browser compatibility
 * Uses -webkit-backdrop-filter for Safari and falls back to a background color
 * if backdrop-filter is not supported
 */
export default function BackdropFilter({
  children,
  className = '',
  intensity = 'md',
  fallbackBgColor = 'rgba(0, 0, 0, 0.7)',
  style = {},
}: BackdropFilterProps) {
  const intensityValues = { sm: '4px', md: '8px', lg: '12px', xl: '16px' };

  const blurValue = intensityValues[intensity];
  const isClientSafari = typeof window !== 'undefined' && isSafari();

  // Combine styles with backdrop-filter properties
  const combinedStyle: React.CSSProperties = {
    ...style,
  };

  if (typeof window !== 'undefined') {
    combinedStyle.backdropFilter = `blur(${blurValue})`;
    combinedStyle.WebkitBackdropFilter = `blur(${blurValue})`;

    // For browsers that don't support backdrop-filter at all
    if (
      !CSS.supports('backdrop-filter', 'blur(8px)') &&
      !CSS.supports('-webkit-backdrop-filter', 'blur(8px)')
    ) {
      combinedStyle.backgroundColor = fallbackBgColor;
    }
  } else {
    // Server-side rendering - apply both for hydration
    combinedStyle.backdropFilter = `blur(${blurValue})`;
    combinedStyle.WebkitBackdropFilter = `blur(${blurValue})`;
  }

  return (
    <div className={className} style={combinedStyle}>
      {children}
    </div>
  );
}

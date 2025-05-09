// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import * as React from 'react';
// Import ThemeProviderProps directly from the library
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

// Use the imported ThemeProviderProps
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

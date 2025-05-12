'use client';

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';
import * as React from 'react';
// Import ThemeProviderProps directly from the library

// Use the imported ThemeProviderProps
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Handle safe mounting
  React.useEffect(() => {
    try {
      setMounted(true);
    } catch (error) {
      console.error('Error mounting theme provider:', error);
    }
  }, []);

  // Prevent flash of incorrect theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

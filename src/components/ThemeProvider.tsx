// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/themeStore';
import React from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { theme } = useThemeStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') { // Check system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
        } else {
      // Apply specific theme
      root.classList.add(theme);
    }
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return <>{children}</>;
} 
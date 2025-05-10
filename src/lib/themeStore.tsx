'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the store with Zustand and persist to localStorage
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark', // Default theme
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // unique name for localStorage
      getStorage: () => (typeof window !== 'undefined' ? localStorage : null),
    }
  )
); 
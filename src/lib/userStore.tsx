'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image?: string | null;
}

interface UserStore {
  currentUser: User | null;
  isLoading: boolean;
  hasSetUser: boolean;
  hasSetLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void; // Alias for setCurrentUser
}

// This is a hack to force hydration in NextJS
const initialTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';

// Create the store with Zustand
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isLoading: true,
      hasSetUser: false,
      hasSetLoading: true,
      setCurrentUser: (user) => set({ 
        currentUser: user,
        hasSetUser: true 
      }),
      setLoading: (isLoading) => set({ 
        isLoading,
        hasSetLoading: true 
      }),
      setUser: (user) => set({ 
        currentUser: user,
        hasSetUser: true 
      })
    }),
    {
      name: 'user-store',
      // Add storage configuration for better Next.js compatibility
      storage: typeof window !== 'undefined' 
        ? {
            getItem: (name) => {
              try {
                const str = localStorage.getItem(name);
                if (!str) return null;
                return JSON.parse(str);
              } catch (error) {
                console.error(`Error getting item ${name} from localStorage:`, error);
                return null;
              }
            },
            setItem: (name, value) => {
              try {
                localStorage.setItem(name, JSON.stringify(value));
              } catch (error) {
                console.error(`Error setting item ${name} in localStorage:`, error);
              }
            },
            removeItem: (name) => {
              try {
                localStorage.removeItem(name);
              } catch (error) {
                console.error(`Error removing item ${name} from localStorage:`, error);
              }
            }
          }
        : undefined
    }
  )
); 
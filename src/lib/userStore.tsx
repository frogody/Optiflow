'use client';

import { create } from 'zustand';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image?: string | null;
}

interface UserStore {
  currentUser: User | null;
  isLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create the store with Zustand
export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: true,
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (isLoading) => set({ isLoading }),
})); 
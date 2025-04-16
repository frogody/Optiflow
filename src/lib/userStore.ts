'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ToolConnection {
  connected: boolean;
  config?: {
    apiKey?: string;
    endpoint?: string;
    [key: string]: any;
  };
}

export interface OrchestratorConnection {
  status: 'connected' | 'error' | 'connecting';
  config?: any;
}

export interface UserEnvironment {
  userId: string;
  toolConnections: {
    [toolName: string]: ToolConnection;
  };
  mcpConnections: {
    [orchestratorId: string]: OrchestratorConnection;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  environments: {
    [userId: string]: UserEnvironment;
  };
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateToolConnection: (userId: string, toolName: string, connection: ToolConnection) => void;
  updateMcpConnection: (userId: string, orchestratorId: string, connection: OrchestratorConnection) => void;
  getEnvironment: (userId: string) => UserEnvironment | null;
  setUser: (user: User | null) => void;
  logoutUser: () => void;
}

// Custom storage with safety checks
const customStorage = {
  getItem: (name: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(name);
      return item;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// For development and testing purposes, we'll create a mock user
const createMockUser = (): User => ({
  id: 'mock-user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  image: 'https://avatars.githubusercontent.com/u/12345678',
});

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null, // Set to null initially
      isLoading: true,
      environments: {},
      setCurrentUser: (user) => {
        console.log('Setting current user:', user ? user.email : 'null');
        set({ currentUser: user, isLoading: false });
      },
      setLoading: (loading) => set({ isLoading: loading }),
      updateToolConnection: (userId, toolName, connection) => 
        set((state) => ({
          environments: {
            ...state.environments,
            [userId]: {
              ...state.environments[userId],
              userId,
              toolConnections: {
                ...state.environments[userId]?.toolConnections,
                [toolName]: connection
              }
            }
          }
        })),
      updateMcpConnection: (userId, orchestratorId, connection) =>
        set((state) => ({
          environments: {
            ...state.environments,
            [userId]: {
              ...state.environments[userId],
              userId,
              mcpConnections: {
                ...state.environments[userId]?.mcpConnections,
                [orchestratorId]: connection
              }
            }
          }
        })),
      getEnvironment: (userId) => {
        const state = get();
        return state.environments[userId] || null;
      },
      setUser: (user) => {
        console.log('Setting user with setUser method:', user ? user.email : 'null');
        set({ currentUser: user });
      },
      logoutUser: () => {
        console.log('Logging out user');
        set({ currentUser: null });
      },
    }),
    {
      name: 'user_store',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        environments: state.environments
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated user state from storage:', state ? (state.currentUser ? state.currentUser.email : 'no user') : 'null state');
      }
    }
  )
); 
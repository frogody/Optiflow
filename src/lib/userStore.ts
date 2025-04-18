'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@prisma/client';

// Frontend user type matching our session types
export interface FrontendUser {
  id: string;
  email: string | null;
  name: string | null;
  // Add any additional fields from your session type here
}

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

export interface UserState {
  currentUser: FrontendUser | null;
  isLoading: boolean;
  environments: {
    [userId: string]: UserEnvironment;
  };
  setCurrentUser: (user: FrontendUser | null) => void;
  setLoading: (loading: boolean) => void;
  updateToolConnection: (userId: string, toolName: string, connection: ToolConnection) => void;
  updateMcpConnection: (userId: string, orchestratorId: string, connection: OrchestratorConnection) => void;
  getEnvironment: (userId: string) => UserEnvironment | null;
  setUser: (user: FrontendUser | null) => void;
  logoutUser: () => void;
  clearUser: () => void;
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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
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
        set({ currentUser: user, isLoading: false });
      },
      logoutUser: () => {
        console.log('Logging out user');
        set({ currentUser: null, isLoading: false });
      },
      clearUser: () => set({ currentUser: null, isLoading: false }),
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
        // Set loading to false after rehydration
        if (state) {
          useUserStore.setState({ isLoading: false });
        }
      }
    }
  )
); 
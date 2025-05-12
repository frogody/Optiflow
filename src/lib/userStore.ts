'use client';

import { User } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  toolConnections: { [toolName: string]: ToolConnection };
  mcpConnections: { [orchestratorId: string]: OrchestratorConnection };
}

export interface UserState {
  currentUser: FrontendUser | null;
  isLoading: boolean;
  environments: { [userId: string]: UserEnvironment };
  lastCheck: number;
  setCurrentUser: (user: FrontendUser | null) => void;
  setLoading: (loading: boolean) => void;
  updateToolConnection: (userId: string, toolName: string, connection: ToolConnection) => void;
  updateMcpConnection: (userId: string, orchestratorId: string, connection: OrchestratorConnection) => void;
  getEnvironment: (userId: string) => UserEnvironment | null;
  setUser: (user: FrontendUser | null) => void;
  logoutUser: () => void;
  clearUser: () => void;
}

// Create the store with better error handling
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: true,
      environments: {},
      lastCheck: 0,
      
      // Update user with error handling
      setCurrentUser: (user) => {
        try {
          console.log('Setting current user:', user ? user.email : 'null');
          set({ 
            currentUser: user, 
            isLoading: false,
            lastCheck: Date.now()
          });
        } catch (error) {
          console.error('Error in setCurrentUser:', error);
        }
      },
      
      // Set loading state
      setLoading: (loading) => {
        try {
          set({ isLoading: loading });
        } catch (error) {
          console.error('Error in setLoading:', error);
        }
      },
      
      // Update tool connection
      updateToolConnection: (userId, toolName, connection) => {
        try {
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
          }));
        } catch (error) {
          console.error('Error in updateToolConnection:', error);
        }
      },
      
      // Update MCP connection
      updateMcpConnection: (userId, orchestratorId, connection) => {
        try {
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
          }));
        } catch (error) {
          console.error('Error in updateMcpConnection:', error);
        }
      },
      
      // Get environment
      getEnvironment: (userId) => {
        try {
          const state = get();
          return state.environments[userId] || null;
        } catch (error) {
          console.error('Error in getEnvironment:', error);
          return null;
        }
      },
      
      // Set user (alias for setCurrentUser)
      setUser: (user) => {
        try {
          console.log('Setting user with setUser method:', user ? user.email : 'null');
          set({ 
            currentUser: user, 
            isLoading: false,
            lastCheck: Date.now()
          });
        } catch (error) {
          console.error('Error in setUser:', error);
          // Try to reset the store to a safe state
          try {
            set({ 
              currentUser: null, 
              isLoading: false
            });
          } catch (innerError) {
            console.error('Failed to reset user state after error:', innerError);
          }
        }
      },
      
      // Logout user
      logoutUser: () => {
        try {
          console.log('Logging out user');
          set({ currentUser: null, isLoading: false });
        } catch (error) {
          console.error('Error in logoutUser:', error);
        }
      },
      
      // Clear user
      clearUser: () => {
        try {
          set({ currentUser: null, isLoading: false });
        } catch (error) {
          console.error('Error in clearUser:', error);
        }
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        lastCheck: state.lastCheck
      }),
      // Add storage configuration for better Next.js 15 compatibility
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
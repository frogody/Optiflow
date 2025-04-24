'use client';

import { create } from 'zustand';
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

export const useUserStore = create<UserState>()((set, get) => ({
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
})); 
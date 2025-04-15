import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: true,
      environments: {},
      setCurrentUser: (user) => set({ currentUser: user, isLoading: false }),
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
      }
    }),
    {
      name: 'user-environment-storage',
      partialize: (state) => ({
        environments: state.environments
      })
    }
  )
); 
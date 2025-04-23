import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoiceCommand, VoiceInteraction, ConversationMessage } from '@/types/voice';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface VoiceState {
  // Current state
  isListening: boolean;
  isProcessing: boolean;
  currentTranscript: string;
  currentError: string | null;
  currentWorkflowId: string | null;

  // History
  commands: VoiceCommand[];
  interactions: VoiceInteraction[];
  conversationHistory: ConversationMessage[];

  // Actions
  startListening: () => void;
  stopListening: () => void;
  setProcessing: (isProcessing: boolean) => void;
  setTranscript: (transcript: string) => void;
  setError: (error: string | null) => void;
  setCurrentWorkflowId: (workflowId: string | null) => void;
  addCommand: (command: Omit<VoiceCommand, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addInteraction: (interaction: Omit<VoiceInteraction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addMessage: (message: Message) => void;
  clearHistory: () => void;

  // New state
  isProcessingCommand: boolean;
  activeConversationId: string | null;
  messages: Message[];
  lastCommandResult: string | null;

  // New actions
  setIsProcessingCommand: (isProcessing: boolean) => void;
  setActiveConversation: (conversationId: string | null) => void;
  clearMessages: () => void;
  setLastCommandResult: (result: string | null) => void;
}

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      // Initial state
      isListening: false,
      isProcessing: false,
      currentTranscript: '',
      currentError: null,
      currentWorkflowId: null,
      commands: [],
      interactions: [],
      conversationHistory: [],

      // Actions
      startListening: () => set({ isListening: true, currentError: null }),
      stopListening: () => set({ isListening: false }),
      setProcessing: (isProcessing) => set({ isProcessing }),
      setTranscript: (transcript) => set({ currentTranscript: transcript }),
      setError: (error) => set({ currentError: error }),
      setCurrentWorkflowId: (workflowId) => set({ currentWorkflowId: workflowId }),
      
      addCommand: (command) =>
        set((state) => ({
          commands: [
            {
              ...command,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...state.commands,
          ],
        })),

      addInteraction: (interaction) =>
        set((state) => ({
          interactions: [
            {
              ...interaction,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...state.interactions,
          ],
        })),

      addMessage: (message) =>
        set((state) => ({
          conversationHistory: [
            ...state.conversationHistory,
            {
              ...message,
              id: Date.now().toString(),
              createdAt: new Date(),
            },
          ],
        })),

      clearHistory: () =>
        set({
          commands: [],
          interactions: [],
          conversationHistory: [],
        }),

      // New state
      isProcessingCommand: false,
      activeConversationId: null,
      messages: [],
      lastCommandResult: null,

      // New actions
      setIsProcessingCommand: (isProcessing) =>
        set({ isProcessingCommand: isProcessing }),

      setActiveConversation: (conversationId) =>
        set({ activeConversationId: conversationId }),

      clearMessages: () =>
        set({
          messages: [],
          lastCommandResult: null,
        }),

      setLastCommandResult: (result) =>
        set({ lastCommandResult: result }),
    }),
    {
      name: 'voice-storage',
      partialize: (state) => ({
        commands: state.commands,
        interactions: state.interactions,
        conversationHistory: state.conversationHistory,
      }),
    }
  )
); 
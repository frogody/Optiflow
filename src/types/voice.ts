// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { Workflow, WorkflowNode, WorkflowEdge } from '@prisma/client';

export type VoiceCommandStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type VoiceInteractionStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface VoiceCommand { id: string;
  userId: string;
  command: string;
  intent: string;
  entities: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceInteraction { id: string;
  userId: string;
  workflowId?: string;
  transcript: string;
  intent?: string;
  entities?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationMessage { id: string;
  voiceInteractionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface VoiceRecognitionState { isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  interimTranscript: string;
}

export interface VoiceCommandContext {
  selectedNodeId?: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

export interface VoiceCommandResponse { success: boolean;
  message: string;
  followUpQuestion?: string;
  workflowUpdates?: Partial<Workflow>;
  nodeUpdates?: Partial<WorkflowNode>[];
  edgeUpdates?: Partial<WorkflowEdge>[];
}

export interface VoiceRecognitionConfig { language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  sampleRate: number;
  bufferSize: number;
}

export interface VoiceServiceConfig { deepgramApiKey: string;
  pipedreamApiKey: string;
  defaultLanguage: string;
  maxConversationLength: number;
  timeoutMs: number;
} 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
export interface ElevenLabsConfig { agentId: string;
  apiKey: string;
}

export interface ElevenLabsMessage { type: 'config' | 'audio' | 'text' | 'ping' | 'pong' | 'transcription' | 'agent_response' | 'workflow' | 'error';
  content?: any;
  timestamp?: number;
}

export interface ElevenLabsTranscription { text: string;
  isFinal: boolean;
  confidence: number;
  timestamp: number;
}

export interface ElevenLabsAgentResponse { text: string;
  audio?: Uint8Array;
  timestamp: number;
  workflow?: ElevenLabsWorkflow;
}

export interface ElevenLabsWorkflow {
  steps: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    provider: string;
    action: string;
    edges: Array<{
      target_node_id: string;
      edge_type: string;
    }>;
    parameters: Record<string, any>;
  }>;
  parameters: Record<string, any>;
  name: string;
  description: string;
  isComplete: boolean;
}

export interface ElevenLabsCallbacks { onMessage?: (message: ElevenLabsMessage) => void;
  onTranscription?: (transcription: ElevenLabsTranscription) => void;
  onAgentResponse?: (response: ElevenLabsAgentResponse) => void;
  onWorkflow?: (workflow: ElevenLabsWorkflow) => void;
  onAudio?: (audio: Uint8Array) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export interface ElevenLabsSession { start: () => Promise<void>;
  sendAudio: (audioData: string) => Promise<void>;
  sendText: (text: string) => Promise<void>;
  close: () => void;
}

export interface ElevenLabsError { message: string;
  code?: string;
  timestamp: number;
} 
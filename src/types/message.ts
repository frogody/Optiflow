export type MessageType = 
  | 'config'
  | 'audio'
  | 'text'
  | 'ping'
  | 'pong'
  | 'transcription'
  | 'agent_response'
  | 'workflow'
  | 'error';

export type MessageData = unknown;

export interface Message {
  type: MessageType;
  data: MessageData;
  timestamp?: number;
}

export interface TextMessage extends Message {
  type: 'text';
  data: string;
}

export interface AudioMessage extends Message {
  type: 'audio';
  data: Uint8Array;
}

export interface ConfigMessage extends Message {
  type: 'config';
  data: Record<string, unknown>;
}

export interface TranscriptionMessage extends Message {
  type: 'transcription';
  data: {
    text: string;
    confidence?: number;
    isFinal: boolean;
  };
}

export interface AgentResponseMessage extends Message {
  type: 'agent_response';
  data: {
    text: string;
    actions?: Array<{
      type: string;
      payload: unknown;
    }>;
  };
}

export interface WorkflowMessage extends Message {
  type: 'workflow';
  data: {
    id: string;
    status: 'started' | 'completed' | 'error';
    result?: unknown;
    error?: string;
  };
}

export interface ErrorMessage extends Message {
  type: 'error';
  data: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type TypedMessage =
  | TextMessage
  | AudioMessage
  | ConfigMessage
  | TranscriptionMessage
  | AgentResponseMessage
  | WorkflowMessage
  | ErrorMessage; 
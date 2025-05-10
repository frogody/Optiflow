import { ElevenLabsAgentResponse, ElevenLabsConfig, ElevenLabsTranscription } from '../types/elevenlabs';

import { Message, WebSocketHandler } from './WebSocketHandler';

interface ElevenLabsCallbacks {
  onTranscription?: (transcription: ElevenLabsTranscription) => void;
  onAgentResponse?: (response: ElevenLabsAgentResponse) => void;
  onError?: (error: Error) => void;
}

interface TranscriptionContent {
  text?: string;
  is_final?: boolean;
  confidence?: number;
}

interface AgentResponseContent {
  message?: string;
  audio?: Uint8Array;
}

interface ErrorContent {
  message?: string;
}

export class ElevenLabsClient {
  private wsHandler: WebSocketHandler;
  private config: ElevenLabsConfig;
  private callbacks: ElevenLabsCallbacks;

  constructor(config: ElevenLabsConfig, callbacks: ElevenLabsCallbacks) {
    this.config = config;
    this.callbacks = callbacks;
    this.wsHandler = new WebSocketHandler(`wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${config.agentId}`);
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    this.wsHandler.onMessage('transcription', (message: Message<TranscriptionContent>) => {
      if (this.callbacks.onTranscription && message.content) {
        this.callbacks.onTranscription({
          text: message.content.text || '',
          isFinal: message.content.is_final || false,
          confidence: message.content.confidence || 0,
          timestamp: Date.now()
        });
      }
    });

    this.wsHandler.onMessage('agent_response', (message: Message<AgentResponseContent>) => {
      if (this.callbacks.onAgentResponse && message.content) {
        this.callbacks.onAgentResponse({
          text: message.content.message || '',
          audio: message.content.audio,
          timestamp: Date.now()
        });
      }
    });

    this.wsHandler.onMessage('error', (message: Message<ErrorContent>) => {
      if (this.callbacks.onError && message.content) {
        this.callbacks.onError(new Error(message.content.message || 'Unknown error'));
      }
    });
  }

  async start(): Promise<void> {
    try {
      await this.wsHandler.connect();
      await this.wsHandler.send({
        type: 'configuration',
        content: {
          agentId: this.config.agentId,
          authorization: this.config.apiKey
        }
      });
    } catch (error) {
      if (this.callbacks.onError) {
        this.callbacks.onError(error instanceof Error ? error : new Error('Failed to start session'));
      }
      throw error;
    }
  }

  async sendAudio(audioData: Uint8Array): Promise<void> {
    try {
      await this.wsHandler.send({
        type: 'audio',
        content: {
          audio: audioData
        }
      });
    } catch (error) {
      if (this.callbacks.onError) {
        this.callbacks.onError(error instanceof Error ? error : new Error('Failed to send audio'));
      }
      throw error;
    }
  }

  async sendText(text: string): Promise<void> {
    try {
      await this.wsHandler.send({
        type: 'text',
        content: { text }
      });
    } catch (error) {
      if (this.callbacks.onError) {
        this.callbacks.onError(error instanceof Error ? error : new Error('Failed to send text'));
      }
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.wsHandler.close();
    } catch (error) {
      if (this.callbacks.onError) {
        this.callbacks.onError(error instanceof Error ? error : new Error('Failed to close session'));
      }
      throw error;
    }
  }
} 
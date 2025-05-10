import { ElevenLabsClient } from 'elevenlabs';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

interface Position {
  x: number;
  y: number;
}

interface NodeData {
  label: string;
  [key: string]: unknown;
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'conditional' | 'wait';
  data: NodeData;
  position: Position;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface ElevenLabsModel {
  model_id: string;
  name: string;
  description: string;
  token_cost: number;
  supported_languages: string[];
}

interface VoiceGenerationOptions {
  voice: string;
  text: string;
  model_id: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface VoiceGenerationError extends Error {
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

interface VoiceCommand {
  text: string;
  timestamp: Date;
  confidence: number;
  metadata?: Record<string, unknown>;
}

interface WorkflowProcessingResult {
  workflow: Workflow;
  status: 'success' | 'partial' | 'failed';
  error?: string;
  suggestions?: string[];
}

interface VoiceServiceConfig {
  apiKey: string;
  defaultVoiceId?: string;
  defaultModelId?: string;
  maxRetries?: number;
  retryDelay?: number;
}

interface VoiceMetadata {
  voiceId: string;
  name: string;
  category: string;
  labels?: Record<string, string>;
  previewUrl?: string;
  settings?: {
    stability: number;
    similarity: number;
    speakerBoost: boolean;
  };
}

interface AudioGenerationOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarity?: number;
  speakerBoost?: boolean;
  style?: number;
}

interface AudioGenerationResult {
  audio: Uint8Array;
  metadata: {
    requestId: string;
    timestamp: Date;
    processingTime: number;
    voiceId: string;
    modelId: string;
    textLength: number;
    audioLength: number;
  };
}

interface VoiceServiceError extends Error {
  code: 'VOICE_NOT_FOUND' | 'MODEL_NOT_FOUND' | 'API_ERROR' | 'INVALID_REQUEST' | 'RATE_LIMIT';
  status?: number;
  retryable: boolean;
  details?: Record<string, unknown>;
}

export class ElevenLabsService {
  private api: ElevenLabsClient;
  private config: Required<VoiceServiceConfig>;
  private voiceCache: Map<string, VoiceMetadata> = new Map();
  private modelCache: Map<string, ElevenLabsModel> = new Map();

  constructor(config: VoiceServiceConfig) {
    if (!config.apiKey) {
      throw new Error('Missing required API key for ElevenLabs service');
    }

    this.config = {
      apiKey: config.apiKey,
      defaultVoiceId: config.defaultVoiceId || 'pNInz6obpgDQGcFmaJgB',
      defaultModelId: config.defaultModelId || 'eleven_turbo_v2',
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000
    };

    this.api = new ElevenLabsClient({
      apiKey: this.config.apiKey
    });
  }

  private async retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    retries: number = this.config.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries === 0 || !this.isRetryableError(error)) {
        throw this.normalizeError(error);
      }

      const delay = this.config.retryDelay * Math.pow(2, this.config.maxRetries - retries);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryWithExponentialBackoff(operation, retries - 1);
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const status = (error as any).response?.status;
      return status === 429 || (status >= 500 && status < 600);
    }
    return false;
  }

  private normalizeError(error: unknown): VoiceServiceError {
    const serviceError = new Error() as VoiceServiceError;
    
    if (error instanceof Error) {
      serviceError.message = error.message;
      serviceError.stack = error.stack;
      
      if (error.message.includes('voice_not_found')) {
        serviceError.code = 'VOICE_NOT_FOUND';
        serviceError.retryable = false;
      } else if (error.message.includes('model_not_found')) {
        serviceError.code = 'MODEL_NOT_FOUND';
        serviceError.retryable = false;
      } else if ((error as any).response?.status === 429) {
        serviceError.code = 'RATE_LIMIT';
        serviceError.retryable = true;
      } else {
        serviceError.code = 'API_ERROR';
        serviceError.retryable = this.isRetryableError(error);
      }
      
      serviceError.status = (error as any).response?.status;
      serviceError.details = (error as any).response?.data;
    } else {
      serviceError.message = 'Unknown error occurred';
      serviceError.code = 'API_ERROR';
      serviceError.retryable = false;
    }
    
    return serviceError;
  }

  async textToSpeech(
    text: string,
    options: Partial<AudioGenerationOptions> = {}
  ): Promise<AudioGenerationResult> {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const voiceId = options.voiceId || this.config.defaultVoiceId;
      const modelId = options.modelId || this.config.defaultModelId;

      console.log(`[ElevenLabs] Generating speech with voice ID: ${voiceId}, model ID: ${modelId}`);

      const audio = await this.retryWithExponentialBackoff(() => 
        this.api.generate({
          voice: voiceId,
          text: text,
          model_id: modelId,
          stability: options.stability,
          similarity_boost: options.similarity,
          style: options.style,
          use_speaker_boost: options.speakerBoost
        })
      );

      let audioData: Uint8Array;
      if (audio instanceof ReadableStream) {
        const reader = audio.getReader();
        const chunks: Uint8Array[] = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        audioData = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
          audioData.set(chunk, offset);
          offset += chunk.length;
        }
      } else {
        audioData = new Uint8Array(audio);
      }

      return {
        audio: audioData,
        metadata: {
          requestId,
          timestamp: new Date(),
          processingTime: Date.now() - startTime,
          voiceId,
          modelId,
          textLength: text.length,
          audioLength: audioData.length
        }
      };
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async getVoices(forceRefresh = false): Promise<VoiceMetadata[]> {
    try {
      if (!forceRefresh && this.voiceCache.size > 0) {
        return Array.from(this.voiceCache.values());
      }

      const voices = await this.retryWithExponentialBackoff(() => 
        this.api.voices.getAll()
      );

      this.voiceCache.clear();
      voices.forEach(voice => {
        this.voiceCache.set(voice.voice_id, {
          voiceId: voice.voice_id,
          name: voice.name,
          category: voice.category,
          labels: voice.labels,
          previewUrl: voice.preview_url,
          settings: voice.settings
        });
      });

      return Array.from(this.voiceCache.values());
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async getModels(forceRefresh = false): Promise<ElevenLabsModel[]> {
    try {
      if (!forceRefresh && this.modelCache.size > 0) {
        return Array.from(this.modelCache.values());
      }

      const models = await this.retryWithExponentialBackoff(() => 
        this.api.models.getAll()
      );

      this.modelCache.clear();
      models.forEach(model => {
        this.modelCache.set(model.model_id, model);
      });

      return models;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async validateVoiceId(voiceId: string): Promise<boolean> {
    try {
      const voices = await this.getVoices();
      return voices.some(voice => voice.voiceId === voiceId);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async validateModelId(modelId: string): Promise<boolean> {
    try {
      const models = await this.getModels();
      return models.some(model => model.model_id === modelId);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  /**
   * Process voice command and generate workflow
   */
  async processVoiceCommand(command: string): Promise<WorkflowProcessingResult> {
    try {
      const voiceCommand: VoiceCommand = {
        text: command,
        timestamp: new Date(),
        confidence: 1.0
      };

      // Mock workflow generation for now
      const mockWorkflow: Workflow = {
        nodes: [
          {
            id: '1',
            type: 'trigger',
            data: { label: 'Voice Command Start', command: voiceCommand },
            position: { x: 100, y: 100 },
          },
          {
            id: '2',
            type: 'action',
            data: { label: 'Process Command', command: voiceCommand.text },
            position: { x: 300, y: 100 },
          },
        ],
        edges: [
          {
            id: 'e1-2',
            source: '1',
            target: '2',
          },
        ],
      };

      return {
        workflow: mockWorkflow,
        status: 'success'
      };
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        workflow: {
          nodes: [],
          edges: []
        },
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error processing voice command'
      };
    }
  }
} 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
declare module 'elevenlabs-node' {
  export interface VoiceSettings {
    stability: number;,
  similarityBoost: number;
  }

  export interface TextToSpeechOptions {
    textInput: string;,
  voiceId: string;,
  modelId: string;
    voiceSettings?: VoiceSettings;
  }

  export interface ElevenLabsOptions {
    apiKey: string;
  }

  export class ElevenLabs {
    constructor(options: ElevenLabsOptions);
    
    textToSpeech(options: TextToSpeechOptions): Promise<Uint8Array>;
    
    getVoices(): Promise<any>;
    
    getModels(): Promise<any>;
  }
} 
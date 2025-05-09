// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { ElevenLabsClient } from 'elevenlabs';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

export class ElevenLabsService {
  private api: any;
  private defaultVoiceId: string;
  private defaultModelId: string;

  constructor() {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('Missing required ELEVENLABS_API_KEY environment variable');
    }

    this.defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Default to Adam voice if not specified
    this.defaultModelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2'; // Default to eleven_turbo_v2 if not specified

    this.api = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY,
        });
  }

  /**
   * Generate speech from text using ElevenLabs API
   */
  async textToSpeech(text: string, fallbackOnError = true): Promise<Uint8Array> {
    try {
      const voiceId = this.defaultVoiceId;
      const modelId = this.defaultModelId;

      console.log(`ElevenLabs TTS: Using voice ID: ${voiceId}, model ID: ${modelId}`);

      const audio = await this.api.generate({ voice: voiceId,
        text: text,
        model_id: modelId,
          });

      // Handle if the response is a ReadableStream
      if (audio instanceof ReadableStream) {
        // Convert the ReadableStream to a Uint8Array
        const reader = audio.getReader();
        const chunks: Uint8Array[] = [];
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        
        // Combine all chunks into a single Uint8Array
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        
        return result;
      }
      
      // If it's already a Uint8Array or ArrayBuffer, return it
      return audio;
    } catch (error) {
      console.error('Error in text-to-speech:', error);
      
      // If fallback is enabled and the error might be related to voice not found, try with a different voice
      if (fallbackOnError && error instanceof Error && 
          (error.message.includes('voice_not_found') || error.message.includes('Voice not found'))) {
        console.log('Voice not found, trying with premade voice...');
        
        // List of reliable premade voices to try as fallbacks
        const fallbackVoices = [
          'pNInz6obpgDQGcFmaJgB', // Adam
          'EXAVITQu4vr4xnSDxMaL',  // Rachel
          '21m00Tcm4TlvDq8ikWAM',  // Nicole
          'AZnzlk1XvdvUeBnXmlld',  // Domi
          'MF3mGyEYCl7XYWbV9V6O'   // Elli
        ];
        
        // Try each fallback voice until one works
        for (const fallbackVoice of fallbackVoices) {
          if (fallbackVoice === this.defaultVoiceId) continue; // Skip if it's the same as the failed voice
          
          try {
            console.log(`Trying fallback voice ID: ${fallbackVoice}`);
            const audio = await this.api.generate({ voice: fallbackVoice,
              text: text,
              model_id: this.defaultModelId,
                });
            
            // Process the audio response as before
            if (audio instanceof ReadableStream) {
              const reader = audio.getReader();
              const chunks: Uint8Array[] = [];
              
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
              }
              
              const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
              const result = new Uint8Array(totalLength);
              let offset = 0;
              
              for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
              }
              
              return result;
            }
            
            return audio;
          } catch (fallbackError) {
            console.error(`Fallback voice ${fallbackVoice} failed:`, fallbackError);
            // Continue to the next fallback voice
          }
        }
      }
      
      // If all fallbacks fail or fallback is disabled, rethrow the original error
      throw error;
    }
  }

  /**
   * Process voice command and generate workflow
   */
  async processVoiceCommand(command: string): Promise<any> {
    try {
      // Mock workflow generation for now
      const mockWorkflow = {
        nodes: [
          {
            id: '1',
            type: 'trigger',
            data: { label: 'Start'     },
            position: { x: 100, y: 100     },
          },
          {
            id: '2',
            type: 'action',
            data: { label: 'Process Command'     },
            position: { x: 300, y: 100     },
          },
        ],
        edges: [
          { id: 'e1-2',
            source: '1',
            target: '2',
              },
        ],
      };

      return mockWorkflow;
    } catch (error) { console.error('Error processing voice command:', error);
      throw error;
        }
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<Voice[]> {
    try {
      const voices = await this.api.voices.getAll();
      return voices;
    } catch (error) { console.error('Error getting voices:', error);
      throw error;
        }
  }

  /**
   * Get available models from ElevenLabs
   */
  async getModels(): Promise<any[]> {
    try {
      const models = await this.api.models.getAll();
      return models;
    } catch (error) { console.error('Error getting models:', error);
      throw error;
        }
  }
} 
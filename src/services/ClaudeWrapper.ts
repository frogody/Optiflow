import { Anthropic, Message } from '@anthropic-ai/sdk';

// Define available model names with proper versioning
export const MODEL_MAP = {
  CLAUDE_3_7_SONNET: 'claude-3-7-sonnet-20250219',
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
  CLAUDE_3_OPUS: 'claude-3-opus-20240229',
  CLAUDE_3_SONNET: 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU: 'claude-3-haiku-20240307',
  CLAUDE_INSTANT: 'claude-instant-1.2'
} as const;

export type ModelName = keyof typeof MODEL_MAP;
export type ThinkingConfig = { type: 'enabled'; budget_tokens?: number };

interface GenerateTextOptions {
  maxTokens?: number;
  temperature?: number;
  thinking?: ThinkingConfig;
}

export interface ClaudeResponse {
  content: string;
  model: ModelName;
  id: string;
}

// Proper Claude client with updated API version headers
export class ClaudeWrapper {
  private client: Anthropic;
  
  constructor(apiKey: string = process.env.ANTHROPIC_API_KEY || '') {
    console.log('[ClaudeWrapper] Initializing with API key length:', apiKey.length);
    
    // Ensure API key is properly formatted
    if (apiKey && !apiKey.toLowerCase().startsWith('sk-ant-')) {
      console.error('[ClaudeWrapper] Warning: API key does not start with sk-ant-, this may cause authentication issues');
    }
    
    // Initialize Anthropic client with correct API version
    this.client = new Anthropic({
      apiKey,
      defaultHeaders: {
        'anthropic-version': '2024-02-19',
        'Content-Type': 'application/json'
      }
    });
    
    // Log initialization for debugging
    console.log('[ClaudeWrapper] Initialized with API key starting with:', apiKey.substring(0, 10) + '...');
    console.log('[ClaudeWrapper] API key format valid:', apiKey.toLowerCase().startsWith('sk-ant-'));
  }

  // Validate model name
  private validateModel(modelName: ModelName | string): string {
    if (!(modelName in MODEL_MAP)) {
      console.warn(`Warning: Using unrecognized model "${modelName}". Falling back to CLAUDE_3_7_SONNET.`);
      return MODEL_MAP.CLAUDE_3_7_SONNET;
    }
    return MODEL_MAP[modelName as ModelName];
  }
  
  // Generate text using Claude
  async generateText(
    prompt: string,
    modelName: ModelName = 'CLAUDE_3_7_SONNET',
    options: GenerateTextOptions = {}
  ): Promise<string> {
    try {
      const { maxTokens = 4096, temperature = 0.7, thinking } = options;
      const validatedModel = this.validateModel(modelName);
      
      // Additional logging for debugging
      console.log(`[ClaudeWrapper] API request with model: ${validatedModel}`);
      console.log(`[ClaudeWrapper] API Key starts with: ${this.client.apiKey ? this.client.apiKey.substring(0, 10) + '...' : 'null'}`);
      
      // Make API request with proper parameters
      const response = await this.client.messages.create({
        model: validatedModel,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }],
        system: "You are a workflow automation assistant helping users create and refine workflows.",
        ...(thinking && { thinking })
      });
      
      console.log(`[ClaudeWrapper] Response received successfully from model: ${response.model}`);
      
      // Extract text and thinking content
      let finalText = '';
      for (const content of response.content) {
        if (content.type === 'text') {
          finalText += content.text;
        } else if (content.type === 'thinking') {
          finalText += `\nThinking: ${content.text}\n`;
        }
      }
      
      return finalText.trim();
    } catch (error) {
      console.error('[ClaudeWrapper] Error generating text:', error);
      throw error;
    }
  }
  
  // Generate a structured response from Claude
  async generateJson<T>(
    prompt: string,
    modelName: ModelName = 'CLAUDE_3_5_SONNET'
  ): Promise<T> {
    const textResponse = await this.generateText(prompt, modelName);
    
    try {
      // Extract JSON from the response
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || 
                       textResponse.match(/```\n([\s\S]*?)\n```/) ||
                       textResponse.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr) as T;
      }
      
      throw new Error('Could not extract JSON from Claude response');
    } catch (error) {
      console.error('[ClaudeWrapper] Error parsing JSON:', error);
      throw error;
    }
  }

  async generateWithThinking(
    prompt: string,
    modelName: ModelName = 'CLAUDE_3_7_SONNET',
    budgetTokens = 4000,
    options: Omit<GenerateTextOptions, 'thinking'> = {}
  ): Promise<{ text: string; thinking: string }> {
    try {
      const response = await this.generateText(prompt, modelName, {
        ...options,
        thinking: { type: 'enabled', budget_tokens: budgetTokens }
      });

      const [thinking, ...textParts] = response.split('\nThinking: ');
      return {
        text: thinking,
        thinking: textParts.join('\nThinking: ')
      };
    } catch (error) {
      console.error('[ClaudeWrapper] Error generating with thinking:', error);
      throw error;
    }
  }
} 
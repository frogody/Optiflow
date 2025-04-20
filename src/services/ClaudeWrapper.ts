import { Anthropic } from '@anthropic-ai/sdk';

// Define available model names with proper versioning
export const MODEL_MAP = {
  CLAUDE_3_7_SONNET: 'claude-3-7-sonnet-20250219',
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
  CLAUDE_3_OPUS: 'claude-3-opus-20240229',
  CLAUDE_3_SONNET: 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU: 'claude-3-haiku-20240307',
  CLAUDE_INSTANT: 'claude-instant-1.2'
};

export interface ClaudeResponse {
  content: string;
  model: string;
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
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });
    
    // Log initialization for debugging
    console.log('[ClaudeWrapper] Initialized with API key starting with:', apiKey.substring(0, 10) + '...');
    console.log('[ClaudeWrapper] API key format valid:', apiKey.toLowerCase().startsWith('sk-ant-'));
  }

  // Validate model name
  private validateModel(model: string): string {
    const validModels = new Set(Object.values(MODEL_MAP));
    const isValid = validModels.has(model);
    
    if (!isValid) {
      console.warn(`Warning: Using unrecognized model "${model}". This may cause issues.`);
    }
    
    return model;
  }
  
  // Generate text using Claude
  async generateText(
    prompt: string, 
    modelName: string = MODEL_MAP.CLAUDE_3_5_SONNET,
    maxTokens: number = 4096,
    temperature: number = 0.7
  ): Promise<string> {
    try {
      console.log(`[ClaudeWrapper] Using model: ${modelName}`);
      
      // Validate model name
      const validatedModel = this.validateModel(modelName);
      
      // Additional logging for debugging
      console.log(`[ClaudeWrapper] API request with model: ${validatedModel}`);
      console.log(`[ClaudeWrapper] API Key starts with: ${this.client.apiKey ? this.client.apiKey.substring(0, 10) + '...' : 'null'}`);
      
      // Make API request with proper parameters
      const response = await this.client.messages.create({
        model: validatedModel,
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [{ role: 'user', content: prompt }],
        system: "You are a workflow automation assistant helping users create and refine workflows."
      });
      
      console.log(`[ClaudeWrapper] Response received successfully from model: ${response.model}`);
      
      // Extract text content
      const content = response.content[0];
      if (content && typeof content === 'object' && 'type' in content && content.type === 'text') {
        return content.text;
      }
      
      throw new Error('Unexpected response format from Anthropic');
    } catch (error) {
      console.error('[ClaudeWrapper] Error generating text:', error);
      throw error;
    }
  }
  
  // Generate a structured response from Claude
  async generateJson<T>(
    prompt: string,
    modelName: string = MODEL_MAP.CLAUDE_3_5_SONNET
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
} 
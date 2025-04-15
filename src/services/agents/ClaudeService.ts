import axios from 'axios';

interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  content: string;
  stop_reason: string | null;
  model: string;
}

export class ClaudeService {
  private config: ClaudeConfig;
  private baseUrl = 'https://api.anthropic.com/v1/messages';
  
  constructor(config: ClaudeConfig) {
    this.config = {
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
      temperature: 0.7,
      ...config
    };
  }

  async chat(messages: ClaudeMessage[]): Promise<ClaudeResponse> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error in Claude API call');
    }
  }

  async analyzeConnection(connectionData: any): Promise<{
    isHealthy: boolean;
    recommendations?: string[];
    error?: string;
  }> {
    try {
      const message = {
        role: 'user' as const,
        content: `Analyze this connection data and provide health status and recommendations:
          ${JSON.stringify(connectionData, null, 2)}`
      };

      const response = await this.chat([message]);
      
      // Parse Claude's response to extract insights
      // This is a simple implementation - you might want to add more structure
      const analysis = {
        isHealthy: response.content.toLowerCase().includes('healthy'),
        recommendations: response.content
          .split('\n')
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2)),
        error: response.content.toLowerCase().includes('error') 
          ? response.content.split('\n')[0] 
          : undefined
      };

      return analysis;
    } catch (error) {
      console.error('Connection analysis error:', error);
      return {
        isHealthy: false,
        error: 'Failed to analyze connection'
      };
    }
  }

  async suggestFixes(connectionType: string, errorData: any): Promise<string[]> {
    try {
      const message = {
        role: 'user' as const,
        content: `Suggest fixes for this ${connectionType} connection error:
          ${JSON.stringify(errorData, null, 2)}`
      };

      const response = await this.chat([message]);
      
      // Extract suggestions from Claude's response
      return response.content
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.substring(2));
    } catch (error) {
      console.error('Fix suggestion error:', error);
      return ['Unable to generate fix suggestions'];
    }
  }
} 
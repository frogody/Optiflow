import OpenAI from 'openai';

interface WorkflowIntent {
  intent: string;
  parameters: Record<string, unknown>;
}

interface WorkflowIntentResponse {
  intent: string;
  parameters: Record<string, unknown>;
}

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.client = new OpenAI({
      apiKey
    });
  }

  async processVoiceCommand(text: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that processes voice commands for a workflow automation tool. Convert natural language commands into structured actions."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content received');
      }

      return content;
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw new Error('Failed to process voice command');
    }
  }

  async analyzeWorkflowIntent(text: string): Promise<WorkflowIntent> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an AI that analyzes voice commands and extracts workflow intents and parameters. Return structured JSON responses."
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 150
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content received');
      }

      const result = JSON.parse(content) as WorkflowIntentResponse;
      return {
        intent: result.intent || "unknown",
        parameters: result.parameters || {}
      };
    } catch (error) {
      console.error('Error analyzing workflow intent:', error);
      throw new Error('Failed to analyze workflow intent');
    }
  }
} 
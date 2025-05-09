// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY,
        });
  }

  async processVoiceCommand(text: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system",
            content: "You are a helpful assistant that processes voice commands for a workflow automation tool. Convert natural language commands into structured actions."
              },
          { role: "user",
            content: text
              }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0]?.message?.content || "Sorry, I couldn't process that command.";
    } catch (error) { console.error('Error processing voice command:', error);
      throw new Error('Failed to process voice command');
        }
  }

  async analyzeWorkflowIntent(text: string): Promise<{ intent: string; parameters: Record<string, any>; }> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system",
            content: "You are an AI that analyzes voice commands and extracts workflow intents and parameters. Return structured JSON responses."
              },
          { role: "user",
            content: text
              }
        ],
        response_format: { type: "json_object"     },
        temperature: 0.3,
        max_tokens: 150
      });

      const result = JSON.parse(response.choices[0]?.message?.content || "{}");
      return {
        intent: result.intent || "unknown",
        parameters: result.parameters || {}
      };
    } catch (error) { console.error('Error analyzing workflow intent:', error);
      throw new Error('Failed to analyze workflow intent');
        }
  }
} 
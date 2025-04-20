import axios from 'axios';
import { ClaudeWrapper, MODEL_MAP } from '../ClaudeWrapper';

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

// Add this interface for workflow generation
interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
}

export class ClaudeService {
  private config: ClaudeConfig;
  private claudeWrapper: ClaudeWrapper;
  
  constructor(config: ClaudeConfig) {
    this.config = {
      maxTokens: 4096,
      temperature: 0.7,
      ...config
    };
    this.claudeWrapper = new ClaudeWrapper(this.config.apiKey);
  }

  async chat(messages: ClaudeMessage[]): Promise<ClaudeResponse> {
    try {
      console.log(`[ClaudeService] Making API call with model: ${this.config.model}`);
      
      // For a single message, use the wrapper directly
      if (messages.length === 1 && messages[0].role === 'user') {
        const text = await this.claudeWrapper.generateText(
          messages[0].content,
          this.config.model,
          this.config.maxTokens,
          this.config.temperature
        );
        
        // Convert to the expected response format
        return {
          id: `msg_${Date.now()}`,
          content: text,
          stop_reason: 'end_turn',
          model: this.config.model
        };
      }
      
      // For conversation threads, use the axios fallback
      // This function handles multiple message exchanges
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
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

  // Add generateWorkflow method
  async generateWorkflow(description: string, existingWorkflow?: any): Promise<any> {
    try {
      const contextSection = existingWorkflow 
        ? `\nExisting workflow to modify:\n${JSON.stringify(existingWorkflow, null, 2)}\n` 
        : '';
      
      const prompt = `
        Create a workflow based on the following description:
        
        ${description}
        ${contextSection}
        
        The workflow should include appropriate components where relevant:
        1. Data Source nodes
        2. Data Processing nodes
        3. Conditional Logic nodes
        4. Action nodes
        
        Each node should have:
        - A descriptive name
        - Appropriate configuration
        - Clear connections to other nodes
        - Proper positioning for visual clarity
        
        Return the workflow as a JSON object with this structure:
        {
          "name": "string",
          "description": "string",
          "nodes": [
            {
              "id": "string",
              "type": "trigger|action|conditional|wait",
              "position": { "x": number, "y": number },
              "data": {
                "label": "string",
                "description": "string",
                "config": {
                  // Node-specific configuration
                }
              }
            }
          ],
          "edges": [
            {
              "id": "string",
              "source": "string",
              "target": "string",
              "label": "string"
            }
          ]
        }
      `;
      
      // Use our wrapper for better compatibility with Claude 3.7
      return await this.claudeWrapper.generateJson<GeneratedWorkflow>(prompt, this.config.model)
        .then(workflow => {
          if (!workflow.nodes || !workflow.edges) {
            throw new Error('Invalid workflow structure: missing nodes or edges');
          }
          
          return {
            workflow,
            message: 'Workflow generated successfully',
            suggestions: []
          };
        });
    } catch (error) {
      console.error('Error generating workflow:', error);
      throw new Error('Failed to generate workflow from description');
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
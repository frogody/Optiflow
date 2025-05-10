import axios from 'axios';

import { ClaudeWrapper, MODEL_MAP } from '../ClaudeWrapper';

interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

type MessageRole = 'user' | 'assistant';

interface ClaudeMessage {
  role: MessageRole;
  content: string;
}

interface ClaudeResponse {
  id: string;
  content: string;
  stop_reason: string | null;
  model: string;
}

interface Position {
  x: number;
  y: number;
}

interface NodeData {
  label: string;
  description: string;
  config: Record<string, unknown>;
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'conditional' | 'wait';
  position: Position;
  data: NodeData;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowGenerationResult {
  workflow: GeneratedWorkflow;
  message: string;
  suggestions: string[];
}

interface ConnectionAnalysis {
  isHealthy: boolean;
  recommendations?: string[];
  error?: string;
}

interface AIModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

interface AIRequestMetadata {
  requestId: string;
  timestamp: Date;
  model: string;
  prompt: string;
}

interface AIResponseMetadata {
  requestId: string;
  timestamp: Date;
  model: string;
  processingTime: number;
  tokenCount?: number;
  finishReason?: string;
}

interface AIResponse<T = unknown> {
  data: T;
  metadata: AIResponseMetadata;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

interface WorkflowValidation {
  isValid: boolean;
  errors: Array<{
    code: string;
    message: string;
    nodeId?: string;
    edgeId?: string;
  }>;
  warnings: Array<{
    code: string;
    message: string;
    nodeId?: string;
    edgeId?: string;
  }>;
}

export class ClaudeService {
  private config: Required<AIModelConfig>;
  private claudeWrapper: ClaudeWrapper;
  private requestHistory: Map<string, AIResponse[]> = new Map();
  
  constructor(config: ClaudeConfig) {
    this.config = {
      model: config.model,
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.7,
      topP: 0.95,
      presencePenalty: 0,
      frequencyPenalty: 0
    };
    this.claudeWrapper = new ClaudeWrapper(config.apiKey);
  }

  private createRequestMetadata(prompt: string): AIRequestMetadata {
    return {
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      model: this.config.model,
      prompt
    };
  }

  private trackRequest<T>(response: AIResponse<T>): void {
    const history = this.requestHistory.get(response.metadata.requestId) || [];
    history.push(response);
    
    // Keep only last 50 requests
    if (history.length > 50) {
      history.shift();
    }
    
    this.requestHistory.set(response.metadata.requestId, history);
  }

  async chat(messages: ClaudeMessage[]): Promise<AIResponse<ClaudeResponse>> {
    const metadata = this.createRequestMetadata(messages[messages.length - 1].content);
    const startTime = Date.now();

    try {
      console.log(`[ClaudeService] Making API call with model: ${this.config.model}`);
      
      let response: ClaudeResponse;
      
      // For a single message, use the wrapper directly
      if (messages.length === 1 && messages[0].role === 'user') {
        const text = await this.claudeWrapper.generateText(
          messages[0].content,
          this.config.model,
          this.config.maxTokens,
          this.config.temperature
        );
        
        response = {
          id: metadata.requestId,
          content: text,
          stop_reason: 'end_turn',
          model: this.config.model
        };
      } else {
        // For conversation threads, use axios
        const axiosResponse = await axios.post<ClaudeResponse>(
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
              'x-api-key': this.claudeWrapper.apiKey,
              'anthropic-version': '2023-06-01'
            }
          }
        );
        response = axiosResponse.data;
      }

      const aiResponse: AIResponse<ClaudeResponse> = {
        data: response,
        metadata: {
          requestId: metadata.requestId,
          timestamp: new Date(),
          model: this.config.model,
          processingTime: Date.now() - startTime,
          finishReason: response.stop_reason
        }
      };

      this.trackRequest(aiResponse);
      return aiResponse;
    } catch (error) {
      console.error('Claude API error:', error);
      return {
        data: null as unknown as ClaudeResponse,
        metadata: {
          requestId: metadata.requestId,
          timestamp: new Date(),
          model: this.config.model,
          processingTime: Date.now() - startTime
        },
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error in Claude API call',
          details: { error }
        }
      };
    }
  }

  async generateWorkflow(
    description: string,
    existingWorkflow?: GeneratedWorkflow
  ): Promise<AIResponse<WorkflowGenerationResult>> {
    const metadata = this.createRequestMetadata(description);
    const startTime = Date.now();

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
      `;
      
      const workflow = await this.claudeWrapper.generateJson<GeneratedWorkflow>(prompt, this.config.model);
      
      if (!workflow.nodes || !workflow.edges) {
        throw new Error('Invalid workflow structure: missing nodes or edges');
      }

      // Validate the generated workflow
      const validation = await this.validateWorkflowStructure(workflow);
      
      const result: WorkflowGenerationResult = {
        workflow,
        message: validation.isValid ? 'Workflow generated successfully' : 'Workflow generated with warnings',
        suggestions: validation.warnings.map(w => w.message)
      };

      const aiResponse: AIResponse<WorkflowGenerationResult> = {
        data: result,
        metadata: {
          requestId: metadata.requestId,
          timestamp: new Date(),
          model: this.config.model,
          processingTime: Date.now() - startTime
        }
      };

      this.trackRequest(aiResponse);
      return aiResponse;
    } catch (error) {
      console.error('Error generating workflow:', error);
      return {
        data: {
          workflow: { nodes: [], edges: [], name: '', description: '' },
          message: 'Failed to generate workflow',
          suggestions: []
        },
        metadata: {
          requestId: metadata.requestId,
          timestamp: new Date(),
          model: this.config.model,
          processingTime: Date.now() - startTime
        },
        error: {
          code: 'WORKFLOW_GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to generate workflow from description',
          details: { error }
        }
      };
    }
  }

  private async validateWorkflowStructure(workflow: GeneratedWorkflow): Promise<WorkflowValidation> {
    const errors: WorkflowValidation['errors'] = [];
    const warnings: WorkflowValidation['warnings'] = [];

    // Check for isolated nodes
    const connectedNodeIds = new Set(workflow.edges.flatMap(e => [e.source, e.target]));
    workflow.nodes.forEach(node => {
      if (!connectedNodeIds.has(node.id)) {
        warnings.push({
          code: 'ISOLATED_NODE',
          message: `Node "${node.data.label}" is not connected to any other nodes`,
          nodeId: node.id
        });
      }
    });

    // Check for valid node references in edges
    const nodeIds = new Set(workflow.nodes.map(n => n.id));
    workflow.edges.forEach(edge => {
      if (!nodeIds.has(edge.source)) {
        errors.push({
          code: 'INVALID_EDGE_SOURCE',
          message: `Edge references non-existent source node: ${edge.source}`,
          edgeId: edge.id
        });
      }
      if (!nodeIds.has(edge.target)) {
        errors.push({
          code: 'INVALID_EDGE_TARGET',
          message: `Edge references non-existent target node: ${edge.target}`,
          edgeId: edge.id
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async getRequestHistory(requestId: string): Promise<AIResponse[]> {
    return this.requestHistory.get(requestId) || [];
  }

  async analyzeConnection(
    connectionData: Record<string, unknown>
  ): Promise<ConnectionAnalysis> {
    try {
      const message: ClaudeMessage = {
        role: 'user',
        content: `Analyze this connection data and provide health status and recommendations:
          ${JSON.stringify(connectionData, null, 2)}`
      };

      const response = await this.chat([message]);
      
      // Parse Claude's response to extract insights
      // This is a simple implementation - you might want to add more structure
      const analysis: ConnectionAnalysis = {
        isHealthy: response.data.content.toLowerCase().includes('healthy'),
        recommendations: response.data.content
          .split('\n')
          .filter(line => line.startsWith('- '))
          .map(line => line.substring(2)),
        error: response.data.content.toLowerCase().includes('error') 
          ? response.data.content.split('\n')[0] 
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

  async suggestFixes(
    connectionType: string,
    errorData: Record<string, unknown>
  ): Promise<string[]> {
    try {
      const message: ClaudeMessage = {
        role: 'user',
        content: `Suggest fixes for this ${connectionType} connection error:
          ${JSON.stringify(errorData, null, 2)}`
      };

      const response = await this.chat([message]);
      
      // Extract suggestions from Claude's response
      return response.data.content
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.substring(2));
    } catch (error) {
      console.error('Error suggesting fixes:', error);
      return ['Unable to generate suggestions at this time'];
    }
  }
} 
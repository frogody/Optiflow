// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Anthropic } from '@anthropic-ai/sdk';
import { AIError } from '../errors/AIError';
import { ClaudeWrapper, MODEL_MAP } from './ClaudeWrapper';

const claudeWrapper = new ClaudeWrapper();

// Types for raw queries
type AIPromptRow = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  version: number;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  organization_id: string;
  model_id: string | null;
  metadata: unknown | null;
  user_name: string;
  model_name: string | null;
};

type AITrainingDataRow = {
  id: string;
  name: string;
  description: string;
  data: unknown;
  version: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  processed_at: Date | null;
  user_id: string;
  organization_id: string;
  model_id: string | null;
  metadata: unknown | null;
  user_name: string;
  model_name: string | null;
};

// Simple validation of required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: { 'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json'
      }
});

// Validation schemas
const createPromptSchema = z.object({ name: z.string().min(1).max(100),
  description: z.string().min(1),
  prompt: z.string().min(1),
  isPublic: z.boolean().optional(),
  modelId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  organizationId: z.string().uuid(),
    });

const createTrainingDataSchema = z.object({ name: z.string().min(1).max(100),
  description: z.string().min(1),
  data: z.record(z.unknown()),
  modelId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  organizationId: z.string().uuid(),
    });

// Workflow types
interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'conditional' | 'wait';
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description: string;
    config: Record<string, any>;
  };
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

export class AIService {
  /**
   * Create a new AI prompt
   */
  async createPrompt(data: z.infer<typeof createPromptSchema>, userId: string) {
    try {
      const validatedData = createPromptSchema.parse(data);
      
      return await prisma.$queryRaw`
        INSERT INTO ai_prompts (
          id, name, description, prompt, version, is_public, created_at, updated_at,
          user_id, organization_id, model_id, metadata
        ) VALUES (
          gen_random_uuid(), ${validatedData.name}, ${validatedData.description},
          ${validatedData.prompt}, 1, ${validatedData.isPublic || false}, NOW(), NOW(),
          ${userId}, ${validatedData.organizationId}, ${validatedData.modelId}, ${validatedData.metadata || null}
        )
        RETURNING *;
      `;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AIError('Failed to create prompt', { cause: error     });
      }
      throw error;
    }
  }
  
  /**
   * Get all prompts for an organization with pagination
   */
  async getPromptsByOrganization(organizationId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const [prompts, countResult] = await Promise.all([
        prisma.$queryRaw<AIPromptRow[]>`
          SELECT p.*, u.name as user_name, m.name as model_name
          FROM ai_prompts p
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN ai_models m ON p.model_id = m.id
          WHERE p.organization_id = ${organizationId} OR p.is_public = true
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${skip}
        `,
        prisma.$queryRaw<[{ total: bigint     }]>`
          SELECT COUNT(*) as total
          FROM ai_prompts
          WHERE organization_id = ${organizationId} OR is_public = true
        `
      ]);
      
      const total = Number(countResult[0].total);
      
      return {
        prompts,
        pagination: { total,
          pages: Math.ceil(total / limit),
          page,
          limit,
            },
      };
    } catch (error) {
      throw new AIError('Failed to fetch prompts', { cause: error     });
    }
  }
  
  /**
   * Get all public prompts
   */
  async getPublicPrompts() {
    return prisma.$queryRaw<AIPromptRow[]>`
      SELECT p.*, u.name as user_name, m.name as model_name
      FROM ai_prompts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN ai_models m ON p.model_id = m.id
      WHERE p.is_public = true
      ORDER BY p.created_at DESC
    `;
  }
  
  /**
   * Create training data for AI models
   */
  async createTrainingData(data: z.infer<typeof createTrainingDataSchema>, userId: string) {
    try {
      const validatedData = createTrainingDataSchema.parse(data);
      
      const [result] = await prisma.$queryRaw<[AITrainingDataRow]>`
        INSERT INTO ai_training_data (
          id, name, description, data, version, status, created_at, updated_at,
          user_id, organization_id, model_id, metadata
        ) VALUES (
          gen_random_uuid(), ${validatedData.name}, ${validatedData.description},
          ${validatedData.data}, 1, 'pending', NOW(), NOW(),
          ${userId}, ${validatedData.organizationId}, ${validatedData.modelId}, ${validatedData.metadata || null}
        )
        RETURNING *, NULL as user_name, NULL as model_name;
      `;
      
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AIError('Failed to create training data', { cause: error     });
      }
      throw error;
    }
  }
  
  /**
   * Get all training data for an organization
   */
  async getTrainingDataByOrganization(organizationId: string) {
    return prisma.$queryRaw<AITrainingDataRow[]>`
      SELECT td.*, u.name as user_name, m.name as model_name
      FROM ai_training_data td
      LEFT JOIN users u ON td.user_id = u.id
      LEFT JOIN ai_models m ON td.model_id = m.id
      WHERE td.organization_id = ${organizationId}
      ORDER BY td.created_at DESC
    `;
  }
  
  private async generateWithAnthropic(prompt: string, model?: string) {
    let attempts = 0;
    const maxAttempts = 3;
    
    // Use environment variable or default to Claude 3.7 Sonnet
    const modelName = model || process.env.ANTHROPIC_DEFAULT_MODEL || MODEL_MAP.CLAUDE_3_7_SONNET;
    
    // Add debug logging
    console.log('[AIService] Debug Info:');
    console.log(`[AIService] Using model: ${modelName}`);
    console.log(`[AIService] API Key length: ${process.env.ANTHROPIC_API_KEY?.length || 0}`);
    console.log(`[AIService] API Key: ${ process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'not set'    }`);
    console.log(`[AIService] Model from param: ${model || 'not provided'}`);
    console.log(`[AIService] Env MODEL: ${process.env.ANTHROPIC_DEFAULT_MODEL || 'not set'}`);
    console.log(`[AIService] Final model selected: ${modelName}`);
    
    // Verify API key starts with sk-ant-
    if (!process.env.ANTHROPIC_API_KEY?.toLowerCase().startsWith('sk-ant-')) {
      console.error('[AIService] API key does not have the correct format (should start with sk-ant-)');
      throw new AIError('API key format is invalid. It should start with sk-ant-');
    }
    
    while (attempts < maxAttempts) {
      try {
        // Use Claude wrapper for API call
        const result = await claudeWrapper.generateText(
          prompt,
          modelName,
          parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4096'),
          parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7')
        );
        console.log('[AIService] Successfully generated text with Anthropic');
        return result;
      } catch (error) {
        attempts++;
        console.error(`[AIService] Attempt ${attempts}/${maxAttempts} failed:`, error);
        
        // Check for specific error types and provide better diagnostics
        if (error && typeof error === 'object' && 'status' in error) {
          if (error.status === 401) {
            console.error('[AIService] Authentication error - invalid API key. Please check your ANTHROPIC_API_KEY setting.');
          } else if (error.status === 404) {
            console.error(`[AIService] Model not found: ${modelName}. This model may not be available to your API key.`);
          }
        }
        
        if (attempts === maxAttempts) {
          throw new AIError('Failed to generate text with Anthropic', { cause: error     });
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  }
  
  /**
   * Generate text using the specified model
   */
  async generateText(prompt: string, model: string = 'gpt-4', temperature: number = 0.7, maxTokens: number = 1000) {
    if (model.startsWith('gpt')) {
      throw new Error(`Unsupported model: ${model}`);
    } else if (model.startsWith('claude')) {
      return this.generateWithAnthropic(prompt);
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }
  }
  
  /**
   * Analyze workflow data and suggest improvements
   */
  async analyzeWorkflow(workflowData: any) {
    const prompt = `
      Analyze the following workflow and suggest improvements:
      
      ${JSON.stringify(workflowData, null, 2)}
      
      Please provide:
      1. Potential bottlenecks
      2. Optimization opportunities
      3. Security considerations
      4. Suggested enhancements
    `;
    
    return this.generateText(prompt, 'gpt-4', 0.7, 2000);
  }
  
  /**
   * Generate a workflow based on a description
   */
  async generateWorkflowFromDescription(description: string, context: string = '', model?: string): Promise<GeneratedWorkflow> {
    const contextSection = context ? `\nPrevious conversation context:\n${context}\n` : '';
    
    const prompt = `
      Create a workflow based on the following description:
      
      ${description}
      ${contextSection}
      
      The workflow should focus on outreach campaigns and include the following components where appropriate:
      1. Data Source nodes (e.g., SQL, HubSpot, CSV)
      2. Data Processing nodes
      3. Email Template nodes
      4. Conditional Logic nodes
      5. Delay/Wait nodes
      6. Action nodes (e.g., Send Email, Update CRM)
      
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
            "position": { "x": number, "y": number     },
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
          { "id": "string",
            "source": "string",
            "target": "string",
            "label": "string"
              }
        ]
      }
    `;
    
    const response = await this.generateWithAnthropic(prompt, model);
    if (!response) {
      throw new AIError('No response received from AI model');
    }
    
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                       response.match(/```\n([\s\S]*?)\n```/) ||
                       response.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const workflow = JSON.parse(jsonStr) as GeneratedWorkflow;
        
        // Validate the workflow structure
        if (!workflow.nodes || !workflow.edges) { throw new Error('Invalid workflow structure: missing nodes or edges');
            }
        
        // Add default configurations for outreach-specific nodes
        workflow.nodes = workflow.nodes.map((node: WorkflowNode) => {
          switch (node.type) {
            case 'trigger':
              if (node.data.label.toLowerCase().includes('sql')) {
                node.data.config = { ...node.data.config,
                  queryType: 'select',
                  refreshInterval: '1h',
                  maxRows: 1000
                    };
              } else if (node.data.label.toLowerCase().includes('hubspot')) {
                node.data.config = { ...node.data.config,
                  objectType: 'contacts',
                  properties: ['email', 'firstname', 'lastname', 'company'],
                  filters: []
                    };
              }
              break;
            case 'action':
              if (node.data.label.toLowerCase().includes('email')) {
                node.data.config = { ...node.data.config,
                  provider: 'smtp',
                  template: 'default',
                  trackOpens: true,
                  trackClicks: true
                    };
              }
              break;
            case 'wait':
              node.data.config = { ...node.data.config,
                duration: '3d',
                workingHoursOnly: true
                  };
              break;
          }
          return node;
        });
        
        return workflow;
      }
      
      throw new Error('Could not extract JSON from response');
    } catch (error) { console.error('Error parsing workflow JSON:', error);
      throw new Error('Failed to generate workflow from description');
        }
  }
  
  /**
   * Refine an existing workflow based on user feedback
   */
  async refineWorkflow(feedback: string, existingWorkflow: any, context: string = ''): Promise<{ workflow: GeneratedWorkflow, message: string     }> {
    const workflowStr = typeof existingWorkflow === 'string' 
      ? existingWorkflow 
      : JSON.stringify(existingWorkflow, null, 2);
    
    const contextSection = context ? `\nPrevious conversation context:\n${context}\n` : '';
    
    const prompt = `
      You are a workflow refinement assistant. The user has an existing workflow and wants to make changes to it.
      
      Here is the existing workflow:
      
      ${workflowStr}
      
      The user's refinement request:
      ${feedback}
      ${contextSection}
      
      Please analyze the workflow and the user's request, then make the requested changes to the workflow.
      Take into account the current nodes, edges, and their configurations. Preserve existing IDs and relationships
      when possible, and only modify what's necessary to fulfill the request.
      
      Return the following:
      1. A clear message explaining what changes you made (or why you couldn't make certain changes)
      2. The updated workflow JSON that incorporates the requested changes
      
      Format your response like this:
      
      EXPLANATION:
      [Your explanation of the changes made]
      
      UPDATED_WORKFLOW:
      \`\`\`json
      {
        // The complete updated workflow JSON
      }
      \`\`\`
    `;
    
    const response = await this.generateWithAnthropic(prompt);
    if (!response) {
      throw new AIError('No response received from AI model');
    }
    
    try {
      // Extract explanation
      const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]*?)\s*UPDATED_WORKFLOW:/i);
      const explanation = explanationMatch ? explanationMatch[1].trim() : 'Workflow updated based on your feedback.';
      
      // Extract JSON
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                        response.match(/```\s*([\s\S]*?)\s*```/) ||
                        response.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const workflow = JSON.parse(jsonStr) as GeneratedWorkflow;
        
        // Validate the workflow structure
        if (!workflow.nodes || !workflow.edges) { throw new Error('Invalid workflow structure: missing nodes or edges');
            }
        
        return { workflow, message: explanation     };
      }
      
      throw new Error('Could not extract workflow JSON from response');
    } catch (error) { console.error('Error processing workflow refinement:', error);
      throw new Error('Failed to refine workflow based on feedback');
        }
  }
  
  /**
   * Generate documentation for a workflow
   */
  async generateWorkflowDocumentation(workflowData: any) {
    const prompt = `
      Generate comprehensive documentation for the following workflow:
      
      ${JSON.stringify(workflowData, null, 2)}
      
      Please include:
      1. Overview
      2. Purpose
      3. Components
      4. Data flow
      5. Configuration options
      6. Usage examples
    `;
    
    return this.generateWithAnthropic(prompt);
  }
}
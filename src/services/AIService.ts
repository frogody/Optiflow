import { Anthropic } from '@anthropic-ai/sdk';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { AIError } from '../errors/AIError';
import { GeneratedWorkflow } from '../types/workflow';

import { ClaudeWrapper, MODEL_MAP, ModelName, ThinkingConfig } from './ClaudeWrapper';

import { prisma } from '@/lib/prisma';

const claudeWrapper = new ClaudeWrapper();

// Types for raw queries
interface AIPromptRow {
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
}

interface AITrainingDataRow {
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
}

// Simple validation of required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultHeaders: {
    'anthropic-version': '2024-02-19',
    'Content-Type': 'application/json'
  }
});

// Validation schemas
const createPromptSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  prompt: z.string().min(1),
  isPublic: z.boolean().optional(),
  modelId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  organizationId: z.string().uuid(),
});

const createTrainingDataSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  data: z.record(z.unknown()),
  modelId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  organizationId: z.string().uuid(),
});

// Workflow types
interface Position {
  x: number;
  y: number;
}

interface NodeConfig {
  [key: string]: unknown;
  type?: string;
  label?: string;
  description?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'conditional' | 'wait';
  position: Position;
  data: {
    label: string;
    description: string;
    config: NodeConfig;
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

interface PaginationResult {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

interface PromptsResult {
  prompts: AIPromptRow[];
  pagination: PaginationResult;
}

interface GenerateTextOptions {
  model?: ModelName;
  temperature?: number;
  maxTokens?: number;
  thinking?: ThinkingConfig;
}

export class AIService {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    this.anthropic = new Anthropic({
      apiKey,
      defaultHeaders: {
        'anthropic-version': '2024-02-19',
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create a new AI prompt
   */
  async createPrompt(data: z.infer<typeof createPromptSchema>, userId: string): Promise<AIPromptRow> {
    try {
      const validatedData = createPromptSchema.parse(data);
      
      const [result] = await prisma.$queryRaw<[AIPromptRow]>`
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
      
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AIError('Failed to create prompt', { cause: error });
      }
      throw error;
    }
  }
  
  /**
   * Get all prompts for an organization with pagination
   */
  async getPromptsByOrganization(organizationId: string, page = 1, limit = 20): Promise<PromptsResult> {
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
        prisma.$queryRaw<[{ total: bigint }]>`
          SELECT COUNT(*) as total
          FROM ai_prompts
          WHERE organization_id = ${organizationId} OR is_public = true
        `
      ]);
      
      const total = Number(countResult[0].total);
      
      return {
        prompts,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      };
    } catch (error) {
      throw new AIError('Failed to fetch prompts', { cause: error });
    }
  }
  
  /**
   * Get all public prompts
   */
  async getPublicPrompts(): Promise<AIPromptRow[]> {
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
  async createTrainingData(data: z.infer<typeof createTrainingDataSchema>, userId: string): Promise<AITrainingDataRow> {
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
        RETURNING *;
      `;
      
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AIError('Failed to create training data', { cause: error });
      }
      throw error;
    }
  }
  
  /**
   * Get training data by organization
   */
  async getTrainingDataByOrganization(organizationId: string): Promise<AITrainingDataRow[]> {
    return prisma.$queryRaw<AITrainingDataRow[]>`
      SELECT t.*, u.name as user_name, m.name as model_name
      FROM ai_training_data t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN ai_models m ON t.model_id = m.id
      WHERE t.organization_id = ${organizationId}
      ORDER BY t.created_at DESC
    `;
  }
  
  /**
   * Generate text using Anthropic's Claude model
   */
  private async generateWithAnthropic(
    prompt: string,
    options: GenerateTextOptions = {}
  ): Promise<string> {
    const {
      model = 'CLAUDE_3_7_SONNET',
      temperature = 0.7,
      maxTokens = 4000,
      thinking
    } = options;

    try {
      const response = await this.anthropic.messages.create({
        model: MODEL_MAP[model],
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }],
        ...(thinking && { thinking })
      });

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
      console.error('[AIService] Error generating text:', error);
      throw new AIError('Failed to generate text with Anthropic', { cause: error });
    }
  }
  
  /**
   * Generate text using specified model
   */
  async generateText(
    prompt: string,
    options: GenerateTextOptions = {}
  ): Promise<string> {
    return this.generateWithAnthropic(prompt, options);
  }
  
  /**
   * Analyze a workflow and provide insights
   */
  async analyzeWorkflow(workflow: GeneratedWorkflow): Promise<{
    insights: string[];
    suggestions: string[];
    risks: string[];
  }> {
    try {
      const prompt = `Analyze the following workflow and provide insights, suggestions, and potential risks:
      
Workflow Name: ${workflow.name}
Description: ${workflow.description}

Nodes:
${workflow.nodes.map(node => `- ${node.type}: ${node.data.label} (${node.data.description})`).join('\n')}

Connections:
${workflow.edges.map(edge => `- ${edge.source} -> ${edge.target}: ${edge.label}`).join('\n')}

Please provide:
1. Key insights about the workflow design and structure
2. Suggestions for improvement or optimization
3. Potential risks or issues to consider`;

      const response = await this.generateWithAnthropic(prompt);
      const sections = response.split('\n\n');

      return {
        insights: sections[0]?.split('\n').filter(line => line.trim()) || [],
        suggestions: sections[1]?.split('\n').filter(line => line.trim()) || [],
        risks: sections[2]?.split('\n').filter(line => line.trim()) || []
      };
    } catch (error) {
      throw new AIError('Failed to analyze workflow', { cause: error });
    }
  }
  
  /**
   * Generate a workflow from a natural language description
   */
  async generateWorkflowFromDescription(
    description: string,
    context = '',
    model: ModelName = 'CLAUDE_3_7_SONNET',
    thinking?: ThinkingConfig
  ): Promise<GeneratedWorkflow> {
    const prompt = `Create a workflow based on the following description. The workflow should be practical, efficient, and follow best practices.

Description: ${description}
${context ? `Additional Context: ${context}` : ''}

Please generate a workflow with:
1. A clear name and description
2. Appropriate trigger nodes for starting the workflow
3. Action nodes for performing tasks
4. Conditional nodes for decision making where needed
5. Proper connections between nodes with meaningful labels

Format the response as a JSON object with the following structure:
{
  "name": "Workflow name",
  "description": "Workflow description",
  "nodes": [
    {
      "id": "unique-id",
      "type": "trigger|action|condition",
      "position": { "x": number, "y": number },
      "data": {
        "label": "Node label",
        "description": "Node description",
        "config": {}
      }
    }
  ],
  "edges": [
    {
      "id": "unique-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "label": "Connection label"
    }
  ]
}`;

    try {
      const response = await this.generateText(prompt, {
        model,
        thinking,
        temperature: 0.7,
        maxTokens: 4000
      });

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AIError('Invalid workflow JSON generated');
      }

      const workflow = JSON.parse(jsonMatch[0]);

      // Validate workflow structure
      if (!workflow.name || !workflow.description || !Array.isArray(workflow.nodes) || !Array.isArray(workflow.edges)) {
        throw new AIError('Invalid workflow structure generated');
      }

      return workflow;
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }
      throw new AIError('Failed to generate workflow', { cause: error });
    }
  }
  
  /**
   * Refine an existing workflow based on feedback
   */
  async refineWorkflow(
    feedback: string,
    existingWorkflow: GeneratedWorkflow,
    context = ''
  ): Promise<{ workflow: GeneratedWorkflow; message: string }> {
    try {
      const prompt = `Refine the following workflow based on the provided feedback. Maintain the workflow's core functionality while addressing the feedback.

Current Workflow:
Name: ${existingWorkflow.name}
Description: ${existingWorkflow.description}

Nodes:
${existingWorkflow.nodes.map(node => `- ${node.type}: ${node.data.label} (${node.data.description})`).join('\n')}

Connections:
${existingWorkflow.edges.map(edge => `- ${edge.source} -> ${edge.target}: ${edge.label}`).join('\n')}

Feedback: ${feedback}
${context ? `Additional Context: ${context}` : ''}

Please provide:
1. A refined version of the workflow in the same JSON format as the original
2. A brief message explaining the changes made

Format the response as a JSON object with:
{
  "workflow": {
    // Updated workflow structure
  },
  "message": "Explanation of changes"
}`;

      const response = await this.generateWithAnthropic(prompt);
      const result = JSON.parse(response) as {
        workflow: GeneratedWorkflow;
        message: string;
      };

      // Validate the refined workflow
      if (!result.workflow || !result.message) {
        throw new Error('Invalid refinement response structure');
      }

      return result;
    } catch (error) {
      throw new AIError('Failed to refine workflow', { cause: error });
    }
  }
  
  /**
   * Generate documentation for a workflow
   */
  async generateWorkflowDocumentation(workflow: GeneratedWorkflow): Promise<{
    overview: string;
    setup: string;
    usage: string;
    troubleshooting: string;
  }> {
    try {
      const prompt = `Generate comprehensive documentation for the following workflow:

Workflow Name: ${workflow.name}
Description: ${workflow.description}

Components:
${workflow.nodes.map(node => `- ${node.type}: ${node.data.label} (${node.data.description})`).join('\n')}

Connections:
${workflow.edges.map(edge => `- ${edge.source} -> ${edge.target}: ${edge.label}`).join('\n')}

Please provide documentation with the following sections:
1. Overview: A high-level explanation of the workflow's purpose and functionality
2. Setup: Step-by-step instructions for configuring the workflow
3. Usage: How to use and monitor the workflow
4. Troubleshooting: Common issues and their solutions

Format the response as a JSON object with sections as properties.`;

      const response = await this.generateWithAnthropic(prompt);
      const documentation = JSON.parse(response) as {
        overview: string;
        setup: string;
        usage: string;
        troubleshooting: string;
      };

      // Validate the documentation structure
      if (!documentation.overview || !documentation.setup || !documentation.usage || !documentation.troubleshooting) {
        throw new Error('Invalid documentation structure generated');
      }

      return documentation;
    } catch (error) {
      throw new AIError('Failed to generate workflow documentation', { cause: error });
    }
  }
}
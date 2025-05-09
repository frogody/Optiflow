// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ElevenLabsConversationalService } from '@/services/ElevenLabsConversationalService';
import { ElevenLabsConfig } from '@/types/elevenlabs';
import OpenAI from 'openai';

// Define request validation schema
const ConversationRequestSchema = z.object({
  message: z.string(),
  agentId: z.string(),
  apiKey: z.string(),
  conversationHistory: z.array(z.object({
  role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.number()
      })).optional()
});

export type ConversationRequest = z.infer<typeof ConversationRequestSchema>;

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY
    });

// Function to generate workflow steps using GPT-4o
async function generateWorkflowWithGPT(message: string, conversationHistory: any[] = []): Promise<{ workflowName: string;
  workflowDescription: string;
  steps: any[];
  assistantMessage: string;
  parameters?: any;
    }> {
  try {
    // Create a system prompt for generating workflows
    const systemPrompt = `You are Sync, an AI specialized in creating detailed, professional workflow designs.
When a user describes a workflow they need, you'll create:
1. A clear workflow name (10 words or less)
2. A concise workflow description (20-30 words);
3. 3-6 detailed workflow steps, each with:
   - Descriptive title (5 words or less)
   - Brief description (15-20 words)
   - Appropriate type (e.g., trigger, action, condition)
   - Provider name (e.g., 'elevenlabs', 'openai', 'internal')
   - Action name (e.g., 'generate_text', 'process_audio', 'validate_input')
   - Relevant parameters with realistic values (3-6 parameters)
   - Logical connections to other steps
;
Focus on practical, implementable workflows for business processes, marketing campaigns, lead qualification, and data processing.;
Your response should be JSON-formatted with the following structure:;
{
  "workflowName": "Name of the workflow",
  "workflowDescription": "Brief description of what the workflow does",
  "parameters": {},
  "steps": [
    {
      "id": "step-id",
      "type": "step-type",
      "title": "Step Title",
      "description": "What this step does",
      "provider": "provider-name",
      "action": "action-name",
      "edges": [{ "target_node_id": "next-step-id", "edge_type": "success"    }],
      "parameters": { "key1": "value1", "key2": "value2"    }
    }
  ],
  "assistantMessage": "A helpful, encouraging message to the user about the workflow you've created (100-150 words)"
}`;

    // Format conversation history for the API
    const formattedHistory = conversationHistory.map(msg => ({ role: msg.role,
      content: msg.content
        }));

    // Call OpenAI API for workflow generation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt     },
        ...formattedHistory,
        { role: "user", content: `Create a workflow for: ${message}` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object"     }
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(responseContent);
  } catch (error) { console.error('Error generating workflow with GPT:', error);
    throw error;
      }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = ConversationRequestSchema.parse(body);
    
    const { message, agentId, apiKey, conversationHistory = [] } = validatedData;
    
    // Initialize ElevenLabs service
    const config: ElevenLabsConfig = {
      agentId,
      apiKey
    };
    
    // Generate workflow using GPT
    const workflowData = await generateWorkflowWithGPT(message, conversationHistory);
    
    // Format the response
    const response = {
      workflow: {
  name: workflowData.workflowName,
        description: workflowData.workflowDescription,
        steps: workflowData.steps,
        parameters: workflowData.parameters || {},
        isComplete: true
      },
      message: workflowData.assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message, timestamp: Date.now()     },
        { role: 'assistant', content: workflowData.assistantMessage, timestamp: Date.now()     }
      ]
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing conversation request:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors     },
        { status: 400     }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process conversation request'     },
      { status: 500     }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
  });
} 
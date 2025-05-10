import { NextResponse } from 'next/server';

import { ClaudeService } from '@/services/agents/ClaudeService';
import { MODEL_MAP } from '@/services/ClaudeWrapper';

/**
 * Process natural language to generate or modify a workflow
 * This uses Claude to interpret user requests and convert them into workflow nodes and edges
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { messages } = body;
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format'     }, { status: 400     });
    }
    
    // Find the latest user message
    const latestUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!latestUserMessage) {
      return NextResponse.json({ error: 'No user message found'     }, { status: 400     });
    }
    
    // Remove logic for existingWorkflow based on existingNodes and existingEdges
    const existingWorkflow = undefined;
    
    // Use the model from environment variables, with appropriate fallback
    const modelName = process.env.ANTHROPIC_DEFAULT_MODEL || MODEL_MAP.CLAUDE_3_7_SONNET;
    console.log(`[claude/route] Using model: ${modelName}`);
    
    // Initialize Claude service with API key from environment variable
    const claudeService = new ClaudeService({ apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: modelName
        });
    
    // Use the enhanced generateWorkflow method to process the request
    const response = await claudeService.generateWorkflow(
      latestUserMessage.content,
      existingWorkflow
    );
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process your request'     },
      { status: 500     }
    );
  }
} 
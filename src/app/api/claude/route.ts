import { NextResponse } from 'next/server';
import { Node, Edge } from 'reactflow';
import { ClaudeService } from '@/services/agents/ClaudeService';
import { MODEL_MAP } from '@/services/ClaudeWrapper';

// Define node data type for the workflow
interface NodeDataType {
  id?: string;
  type?: string;
  label: string;
  description?: string;
  settings?: Record<string, any>;
  config?: any;
}

// Define the message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Claude API response interface
interface ClaudeResponse {
  message: string;
  workflow?: {
    nodes: Node<NodeDataType>[];
    edges: Edge[];
  };
  error?: string;
}

/**
 * Process natural language to generate or modify a workflow
 * This uses Claude to interpret user requests and convert them into workflow nodes and edges
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { messages, workflowContext, existingNodes, existingEdges } = body;
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }
    
    // Find the latest user message
    const latestUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!latestUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 });
    }
    
    // Call Claude Service to process the request
    const existingWorkflow = existingNodes && existingNodes.length > 0 
      ? { nodes: existingNodes, edges: existingEdges || [] } 
      : undefined;
    
    // Use the model from environment variables, with appropriate fallback
    const modelName = process.env.ANTHROPIC_DEFAULT_MODEL || MODEL_MAP.CLAUDE_3_SONNET;
    console.log(`[claude/route] Using model: ${modelName}`);
    
    // Initialize Claude service with API key from environment variable
    const claudeService = new ClaudeService({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
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
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}

/**
 * Build a detailed system prompt for Claude with workflow context
 */
function buildSystemPrompt(
  workflowContext: string, 
  existingNodes: Node<NodeDataType>[] = [], 
  existingEdges: Edge[] = []
): string {
  // Define all available node types and their capabilities
  const availableNodeTypes = [
    {
      type: 'default',
      subTypes: [
        {
          type: 'extract-webpage',
          description: 'Extracts content from a webpage',
          settings: {
            url: 'URL to extract content from',
            selector: 'CSS selector to target specific elements',
            includeImages: 'Whether to include images in extraction',
            maxDepth: 'Maximum crawl depth for linked pages'
          }
        },
        {
          type: 'process-data',
          description: 'Process, transform, or filter data',
          settings: {
            inputFormat: 'Format of the input data (json, csv, xml, text)',
            outputFormat: 'Format of the output data (json, csv, xml, text)',
            transformation: 'Transformation expression or mapping',
            filterCondition: 'Filter data based on this condition'
          }
        },
        {
          type: 'send-email',
          description: 'Send an email to a recipient',
          settings: {
            to: 'Recipient email address',
            subject: 'Email subject line',
            body: 'Email body content',
            attachments: 'File paths to attach',
            sendAt: 'Schedule email for later delivery'
          }
        },
        {
          type: 'wait',
          description: 'Pause workflow execution',
          settings: {
            duration: 'Wait duration in seconds',
            waitUntil: 'Wait until specific time',
            condition: 'Wait until this condition is met'
          }
        },
        {
          type: 'api',
          description: 'Make requests to external APIs',
          settings: {
            endpoint: 'API endpoint URL',
            method: 'HTTP method (GET, POST, PUT, DELETE, PATCH)',
            headers: 'HTTP headers as JSON',
            body: 'Request body as JSON',
            authentication: 'Authentication method',
            retryCount: 'Number of retries on failure'
          }
        },
        {
          type: 'database',
          description: 'Execute operations on a database',
          settings: {
            connectionString: 'Database connection string',
            query: 'SQL query to execute',
            queryType: 'Type of SQL operation',
            parameters: 'Query parameters as JSON object'
          }
        },
        {
          type: 'conditional',
          description: 'Branch workflow based on conditions',
          settings: {
            condition: 'Condition to evaluate',
            trueLabel: 'Label for the true condition path',
            falseLabel: 'Label for the false condition path'
          }
        },
        {
          type: 'chatbot',
          description: 'Create interactive chatbot experiences',
          settings: {
            initialMessage: 'First message to send to the user',
            model: 'AI model to use for responses',
            systemPrompt: 'Instructions for the AI',
            maxTurns: 'Maximum conversation turns before escalation',
            fallbackMessage: 'Message when the bot cannot help'
          }
        },
        {
          type: 'social-post',
          description: 'Post to social media platforms',
          settings: {
            platform: 'Social media platform (Twitter/X, LinkedIn, Facebook, Instagram)',
            content: 'Post content',
            media: 'Media URLs',
            scheduledTime: 'When to publish the post'
          }
        },
        {
          type: 'code',
          description: 'Run custom code in your workflow',
          settings: {
            language: 'Programming language',
            code: 'Code to execute',
            timeout: 'Max execution time in seconds',
            environmentVariables: 'Environment variables as JSON'
          }
        },
        {
          type: 'ml-model',
          description: 'Use machine learning models',
          settings: {
            modelType: 'Type of machine learning model',
            modelURL: 'URL for the model endpoint or file',
            inputMapping: 'Map workflow data to model inputs',
            outputMapping: 'Map model outputs to workflow data'
          }
        },
        {
          type: 'analytics',
          description: 'Track events and metrics',
          settings: {
            trackingId: 'Analytics tracking identifier',
            eventType: 'Type of analytics event',
            eventCategory: 'Category of the event',
            eventAction: 'Action performed',
            eventLabel: 'Label for the event',
            eventValue: 'Numeric value for the event'
          }
        },
        {
          type: 'file-manager',
          description: 'Manage files and directories',
          settings: {
            operation: 'File operation to perform',
            sourcePath: 'Path to the source file',
            destinationPath: 'Path to the destination file',
            content: 'Content to write to the file',
            encoding: 'File encoding'
          }
        },
        {
          type: 'scheduler',
          description: 'Schedule workflow execution',
          settings: {
            scheduleType: 'Type of schedule (one-time or recurring)',
            startDate: 'When to start the schedule',
            cronExpression: 'Cron expression for recurring schedules',
            endDate: 'When to end the schedule',
            timezone: 'Timezone for the schedule'
          }
        },
        {
          type: 'contact',
          description: 'Manage contact information',
          settings: {
            action: 'Action to perform (create, update, delete)',
            contactDetails: 'Contact information fields',
            source: 'Source of the contact information'
          }
        },
        {
          type: 'transform',
          description: 'Transform data structure or format',
          settings: {
            transformationType: 'Type of transformation',
            mapping: 'Field mapping rules',
            customLogic: 'Custom transformation logic'
          }
        },
        {
          type: 'filter',
          description: 'Filter data based on conditions',
          settings: {
            condition: 'Filter condition',
            mode: 'Include or exclude matching items'
          }
        }
      ]
    },
    {
      type: 'aiAgent',
      description: 'AI-powered node that uses LLMs to process data',
      configOptions: {
        name: 'Name of the AI agent',
        type: 'Type of AI agent (General, Conditional, Classifier, etc.)',
        prompt: 'Instructions for the AI model',
        model: 'AI model to use (gpt-4o, claude-3-sonnet, claude-3-opus, claude-3-haiku)',
        temperature: 'Model temperature (0.0 to 1.0)',
        tools: 'Available tools (web_search, code_interpreter, retrieval)',
        contextStrategy: 'Context handling strategy (all_inputs, recent_inputs, selected_inputs)',
        description: 'Purpose of this AI agent'
      }
    }
  ];

  // Provide guidance on creating workflow connections
  const connectionGuidance = `
CONNECTIONS:
1. Connect nodes with edges to create a workflow.
2. Edges represent data flow between nodes.
3. Each edge needs a source node, target node, and optional label.
4. Conditional nodes can have multiple outgoing edges for different conditions.
5. AI agent nodes often connect to multiple downstream nodes.
`;

  // Provide examples of common workflow patterns
  const workflowPatterns = `
COMMON WORKFLOW PATTERNS:
1. Data extraction → Processing → AI analysis → Conditional branching → Action (email/notification)
2. Scheduled trigger → Data fetching → Transformation → Database storage
3. Input form → Validation → Processing → Email notification
4. Web scraping → Data cleaning → AI categorization → Analytics tracking
5. File upload → Processing → ML model prediction → Conditional action
`;

  // Create a detailed system prompt
  return `You are an expert workflow designer that helps users build data processing and AI workflows using natural language.
  
CONTEXT:
${workflowContext}

AVAILABLE NODE TYPES:
${JSON.stringify(availableNodeTypes, null, 2)}

${connectionGuidance}

${workflowPatterns}

WORKFLOW GENERATION INSTRUCTIONS:
1. When a user describes a workflow or asks to modify one, interpret their request and convert it to a valid workflow structure.
2. A workflow consists of nodes (processing steps) and edges (connections between steps).
3. Each node must have a unique ID, a type, position, and data appropriate for its type.
4. Node positions should be assigned to create a clean, top-to-bottom flow with proper spacing.
5. For completely new workflows, create all required nodes and edges to fulfill the user's request.
6. For modifications to existing workflows, update only the nodes and edges that need changing.
7. Respond conversationally to explain your changes, but also return a structured workflow object.
8. Always use node types from the provided list - don't invent new node types.
9. Make sure to set realistic and useful default values for node settings when applicable.
10. Use descriptive labels for nodes and edges that clearly explain their purpose.

If you need to generate a new workflow, use the following structure:
{
  "message": "I've created a workflow that...",
  "workflow": {
    "nodes": [...],
    "edges": [...]
  }
}

If you need to modify an existing workflow, make the necessary changes and return the complete updated workflow.`;
}

/**
 * Call the Claude API to process the natural language request
 */
async function callClaude(systemPrompt: string, messages: Message[]): Promise<ClaudeResponse> {
  // Get the latest user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  try {
    // Extract existing workflow context from the system prompt
    // Use a more compatible regex approach without the 's' flag
    const contextStartIndex = systemPrompt.indexOf('CONTEXT:');
    const availableTypesIndex = systemPrompt.indexOf('AVAILABLE NODE TYPES:');
    
    const workflowContext = contextStartIndex >= 0 && availableTypesIndex > contextStartIndex
      ? systemPrompt.substring(contextStartIndex + 8, availableTypesIndex).trim()
      : '';
    
    // Parse existing workflow from context if available
    const existingWorkflow = workflowContext.includes('Current workflow has') 
      ? extractExistingWorkflow(messages) 
      : undefined;
    
    // Use the model from environment variables, with appropriate fallback
    const modelName = process.env.ANTHROPIC_DEFAULT_MODEL || MODEL_MAP.CLAUDE_3_SONNET;
    console.log(`[callClaude] Using model: ${modelName}`);
    
    // Initialize Claude service with API key from environment variable
    const claudeService = new ClaudeService({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: modelName
    });
    
    // Use the enhanced generateWorkflow method to process the request
    const response = await claudeService.generateWorkflow(
      lastUserMessage,
      existingWorkflow
    );
    
    return response;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    // Fallback to mock implementation if there's an error
    // This allows the app to function even if the API is unavailable
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to mock implementation in development mode');
      return mockFallbackResponse(messages);
    }
    
    // If we're not in development mode, just return an error message
    return {
      message: 'Sorry, I encountered an error processing your request. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Extract existing workflow data from messages
 */
function extractExistingWorkflow(messages: Message[]): { nodes: any[], edges: any[] } | undefined {
  try {
    // This is a placeholder implementation - in a real app, you'd get this from the request
    // For now, return undefined as we don't have a way to extract this
    return undefined;
  } catch (error) {
    console.error('Error extracting existing workflow:', error);
    return undefined;
  }
}

/**
 * Fallback to mock response in development mode
 */
function mockFallbackResponse(messages: Message[]): ClaudeResponse {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  // Simple keyword-based mock response selector
  if (lastUserMessage.toLowerCase().includes('create') || 
      lastUserMessage.toLowerCase().includes('build') || 
      lastUserMessage.toLowerCase().includes('make')) {
    return mockCreateWorkflowResponse(lastUserMessage);
  } else if (lastUserMessage.toLowerCase().includes('add') || 
             lastUserMessage.toLowerCase().includes('change') || 
             lastUserMessage.toLowerCase().includes('modify') ||
             lastUserMessage.toLowerCase().includes('update')) {
    return mockModifyWorkflowResponse(lastUserMessage);
  } else {
    return {
      message: `I understand you're asking about "${lastUserMessage}". To build or modify a workflow, please give me more specific instructions.`
    };
  }
}

/**
 * Mock a create workflow response - Only used for testing/fallback
 */
function mockCreateWorkflowResponse(userMessage: string): ClaudeResponse {
  // Simple mock implementation that returns a basic workflow
  return {
    message: `I've created a simple workflow based on your request: "${userMessage}"`,
    workflow: {
      nodes: [
        {
          id: 'node1',
          type: 'default',
          position: { x: 100, y: 100 },
          data: {
            label: 'Start',
            description: 'Starting point of the workflow',
            config: {}
          }
        },
        {
          id: 'node2',
          type: 'default',
          position: { x: 100, y: 200 },
          data: {
            label: 'Process',
            description: 'Process the data',
            config: {}
          }
        },
        {
          id: 'node3',
          type: 'default',
          position: { x: 100, y: 300 },
          data: {
            label: 'End',
            description: 'End of the workflow',
            config: {}
          }
        }
      ],
      edges: [
        {
          id: 'edge1-2',
          source: 'node1',
          target: 'node2',
          label: 'Next'
        },
        {
          id: 'edge2-3',
          source: 'node2',
          target: 'node3',
          label: 'Complete'
        }
      ]
    }
  };
}

/**
 * Mock a modify workflow response - Only used for testing/fallback
 */
function mockModifyWorkflowResponse(userMessage: string): ClaudeResponse {
  // Simple mock implementation that returns a modified workflow
  return {
    message: `I've modified the workflow based on your request: "${userMessage}"`,
    workflow: {
      nodes: [
        {
          id: 'node1',
          type: 'default',
          position: { x: 100, y: 100 },
          data: {
            label: 'Updated Start',
            description: 'Starting point of the workflow',
            config: {}
          }
        },
        {
          id: 'node2',
          type: 'default',
          position: { x: 100, y: 200 },
          data: {
            label: 'Updated Process',
            description: 'Process the data with improvements',
            config: {}
          }
        },
        {
          id: 'node3',
          type: 'default',
          position: { x: 100, y: 300 },
          data: {
            label: 'Updated End',
            description: 'End of the workflow',
            config: {}
          }
        }
      ],
      edges: [
        {
          id: 'edge1-2',
          source: 'node1',
          target: 'node2',
          label: 'Next'
        },
        {
          id: 'edge2-3',
          source: 'node2',
          target: 'node3',
          label: 'Complete'
        }
      ]
    }
  };
} 
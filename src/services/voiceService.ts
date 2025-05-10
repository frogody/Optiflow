import { OpenAIService } from './OpenAIService';

import { ChatCompletionMessage } from '@/types/ai';
import { WorkflowAction, Position } from '@/types/workflow';

interface VoiceCommandContext {
  selectedNodeId?: string;
  nodes: Array<{
    id: string;
    type: string;
    position: Position;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

interface ProcessVoiceCommandResult {
  response: string;
  actions: WorkflowAction[];
  intent?: string;
  entities?: Record<string, unknown>;
}

interface NodeEntity {
  nodeType?: string;
  nodeIds?: string[];
  config?: {
    key: string;
    value: string;
  };
}

const openai = new OpenAIService();

const SYSTEM_PROMPT = `You are a voice-controlled workflow builder assistant. Your task is to help users create and modify workflows using natural language commands.

Available node types:
- trigger: Starts the workflow (e.g., webhook, schedule)
- action: Performs an action (e.g., HTTP request, data transformation)
- condition: Branches the workflow based on conditions
- loop: Iterates over data
- delay: Adds a delay in the workflow

You should:
1. Understand the user's intent
2. Generate appropriate workflow actions
3. Provide a natural language response
4. Handle errors gracefully

Example commands:
- "Add a webhook trigger"
- "Connect the trigger to the HTTP action"
- "Configure the delay for 5 minutes"
- "Add a condition to check the response status"`;

export async function processVoiceCommand(
  command: string,
  context: VoiceCommandContext
): Promise<ProcessVoiceCommandResult> {
  try {
    const messages: ChatCompletionMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Current workflow state:
Selected node: ${context.selectedNodeId || 'none'}
Nodes: ${JSON.stringify(context.nodes, null, 2)}
Edges: ${JSON.stringify(context.edges, null, 2)}

User command: "${command}"`,
      },
    ];

    const completion = await openai.createChatCompletion({
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';

    // Parse the response to extract actions
    const actions = parseActionsFromResponse(response);

    // Extract intent and entities
    const intent = determineIntent(command);
    const entities = extractEntities(command);

    return {
      response,
      actions,
      intent,
      entities,
    };
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw new Error('Failed to process voice command');
  }
}

function parseActionsFromResponse(response: string): WorkflowAction[] {
  const actions: WorkflowAction[] = [];
  
  // Action patterns to look for in the response
  const patterns = {
    addNode: /add (?:a |an )?(\w+)(?: node)?(?: at position (\d+),\s*(\d+))?/i,
    connectNodes: /connect (\w+) to (\w+)/i,
    updateNode: /configure (\w+) with (.*)/i,
  };

  const lines = response.split('\n');
  
  for (const line of lines) {
    // Check for add node actions
    const addMatch = line.match(patterns.addNode);
    if (addMatch) {
      actions.push({
        type: 'ADD_NODE',
        nodeType: addMatch[1].toLowerCase(),
        position: addMatch[2] && addMatch[3]
          ? { x: parseInt(addMatch[2]), y: parseInt(addMatch[3]) }
          : { x: 100, y: 100 }, // Default position
      });
      continue;
    }

    // Check for connect nodes actions
    const connectMatch = line.match(patterns.connectNodes);
    if (connectMatch) {
      actions.push({
        type: 'CONNECT_NODES',
        sourceId: connectMatch[1],
        targetId: connectMatch[2],
      });
      continue;
    }

    // Check for update node actions
    const updateMatch = line.match(patterns.updateNode);
    if (updateMatch) {
      try {
        const config = JSON.parse(updateMatch[2]);
        actions.push({
          type: 'UPDATE_NODE',
          nodeId: updateMatch[1],
          config,
        });
      } catch (error) {
        console.error('Failed to parse node configuration:', error);
      }
    }
  }

  return actions;
}

function determineIntent(command: string): string {
  // Simple intent detection based on keywords
  if (command.match(/add|create|new/i)) return 'create_node';
  if (command.match(/connect|link/i)) return 'connect_nodes';
  if (command.match(/configure|set|update/i)) return 'update_node';
  if (command.match(/delete|remove/i)) return 'delete_node';
  return 'unknown';
}

function extractEntities(command: string): NodeEntity {
  const entities: NodeEntity = {};

  // Extract node types
  const nodeTypeMatch = command.match(/(?:add|create) (?:a |an )?(\w+)(?: node)?/i);
  if (nodeTypeMatch) {
    entities.nodeType = nodeTypeMatch[1].toLowerCase();
  }

  // Extract node IDs
  const nodeIdsMatch = command.match(/node (\w+)/g);
  if (nodeIdsMatch) {
    entities.nodeIds = nodeIdsMatch.map(match => match.split(' ')[1]);
  }

  // Extract configuration values
  const configMatch = command.match(/set (\w+) to (.+)/i);
  if (configMatch) {
    entities.config = {
      key: configMatch[1],
      value: configMatch[2],
    };
  }

  return entities;
} 
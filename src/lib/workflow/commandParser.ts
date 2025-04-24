import { WorkflowCommand, CommandType } from '@/types/workflow';

const COMMAND_PATTERNS = {
  CREATE_NODE: /(?:create|add) (?:a )?(?:new )?(\w+)(?: node)?/i,
  CONNECT_NODES: /connect (\w+)(?: node)? to (\w+)(?: node)?/i,
  DELETE_NODE: /(?:delete|remove) (?:the )?(\w+)(?: node)?/i,
  RENAME_NODE: /rename (?:the )?(\w+)(?: node)? to (\w+)/i,
  CONFIGURE_NODE: /configure (?:the )?(\w+)(?: node)?/i,
  SAVE_WORKFLOW: /save (?:the )?workflow(?: as )?(\w+)?/i,
  LOAD_WORKFLOW: /load (?:the )?workflow (\w+)/i,
  RUN_WORKFLOW: /run (?:the )?workflow/i,
  STOP_WORKFLOW: /stop (?:the )?workflow/i,
};

export function parseCommand(transcript: string): WorkflowCommand | null {
  // Clean up the transcript
  const cleanTranscript = transcript.trim().toLowerCase();

  // Try to match each command pattern
  for (const [commandType, pattern] of Object.entries(COMMAND_PATTERNS)) {
    const match = cleanTranscript.match(pattern);
    if (match) {
      switch (commandType) {
        case 'CREATE_NODE':
          return {
            type: CommandType.CREATE_NODE,
            nodeType: match[1],
          };
        case 'CONNECT_NODES':
          return {
            type: CommandType.CONNECT_NODES,
            sourceNode: match[1],
            targetNode: match[2],
          };
        case 'DELETE_NODE':
          return {
            type: CommandType.DELETE_NODE,
            nodeName: match[1],
          };
        case 'RENAME_NODE':
          return {
            type: CommandType.RENAME_NODE,
            nodeName: match[1],
            newName: match[2],
          };
        case 'CONFIGURE_NODE':
          return {
            type: CommandType.CONFIGURE_NODE,
            nodeName: match[1],
          };
        case 'SAVE_WORKFLOW':
          return {
            type: CommandType.SAVE_WORKFLOW,
            workflowName: match[1],
          };
        case 'LOAD_WORKFLOW':
          return {
            type: CommandType.LOAD_WORKFLOW,
            workflowName: match[1],
          };
        case 'RUN_WORKFLOW':
          return {
            type: CommandType.RUN_WORKFLOW,
          };
        case 'STOP_WORKFLOW':
          return {
            type: CommandType.STOP_WORKFLOW,
          };
      }
    }
  }

  return null;
} 
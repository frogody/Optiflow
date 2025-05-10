import { Workflow, WorkflowEdge, WorkflowNode } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { ConversationMessage, VoiceCommandContext, VoiceCommandResponse } from '@/types/voice';

interface CommandAnalysis {
  intent: string;
  entities: CommandEntities;
}

interface CommandEntities {
  name?: string;
  description?: string;
  type?: string;
  source?: string;
  target?: string;
  config?: Record<string, unknown>;
}

export class ConversationService {
  private context: VoiceCommandContext;
  private readonly maxConversationLength: number;

  constructor(initialContext: Partial<VoiceCommandContext> = {}) {
    this.context = {
      conversationHistory: [],
      pendingQuestions: [],
      ...initialContext,
    };
    this.maxConversationLength = 10;
  }

  async processCommand(command: string): Promise<VoiceCommandResponse> {
    try {
      // Add user message to conversation history
      this.addMessage('user', command);

      // Analyze command for intent and entities
      const { intent, entities } = await this.analyzeCommand(command);

      // Process based on intent
      switch (intent) {
        case 'create_workflow':
          return await this.handleCreateWorkflow(entities);
        case 'add_node':
          return await this.handleAddNode(entities);
        case 'connect_nodes':
          return await this.handleConnectNodes(entities);
        case 'configure_node':
          return await this.handleConfigureNode(entities);
        case 'start_workflow':
          return await this.handleStartWorkflow(entities);
        default:
          return this.handleUnknownIntent();
      }
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error processing your request. Please try again.',
      };
    }
  }

  private async analyzeCommand(command: string): Promise<CommandAnalysis> {
    // TODO: Implement actual NLP analysis using a service like OpenAI or similar
    // This is a simplified version for demonstration
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('create') && lowerCommand.includes('workflow')) {
      return {
        intent: 'create_workflow',
        entities: { name: this.extractEntity(command, 'named', 'workflow') },
      };
    }

    if (lowerCommand.includes('add') && lowerCommand.includes('node')) {
      return {
        intent: 'add_node',
        entities: { type: this.extractEntity(command, 'type', 'node') },
      };
    }

    if (lowerCommand.includes('connect')) {
      return {
        intent: 'connect_nodes',
        entities: {
          source: this.extractEntity(command, 'from', 'node'),
          target: this.extractEntity(command, 'to', 'node'),
        },
      };
    }

    return {
      intent: 'unknown',
      entities: {},
    };
  }

  private extractEntity(command: string, preposition: string, type: string): string | undefined {
    const regex = new RegExp(`${preposition}\\s+([\\w\\s]+)\\s+${type}`, 'i');
    const match = command.match(regex);
    return match ? match[1].trim() : undefined;
  }

  private async handleCreateWorkflow(entities: CommandEntities): Promise<VoiceCommandResponse> {
    if (!entities.name) {
      return {
        success: false,
        message: 'What would you like to name this workflow?',
        followUpQuestion: 'Please provide a name for the workflow.',
      };
    }

    try {
      const workflow = await prisma.workflow.create({
        data: {
          name: entities.name,
          description: entities.description || '',
          organizationId: this.context.currentWorkflow?.organizationId || '',
          createdById: this.context.currentWorkflow?.createdById || '',
        },
      });

      this.context.currentWorkflow = workflow;

      return {
        success: true,
        message: `I've created a new workflow named "${entities.name}". What would you like to add to it?`,
        workflowUpdates: workflow,
      };
    } catch (error) {
      console.error('Error creating workflow:', error);
      return {
        success: false,
        message: "Sorry, I couldn't create the workflow. Please try again.",
      };
    }
  }

  private async handleAddNode(entities: CommandEntities): Promise<VoiceCommandResponse> {
    if (!this.context.currentWorkflow) {
      return {
        success: false,
        message: 'Please create a workflow first before adding nodes.',
      };
    }

    if (!entities.type) {
      return {
        success: false,
        message: 'What type of node would you like to add?',
        followUpQuestion: 'Please specify the node type (e.g., HubSpot, Gmail, Slack).',
      };
    }

    try {
      const node = await prisma.workflowNode.create({
        data: {
          workflowId: this.context.currentWorkflow.id,
          type: entities.type,
          positionX: 0, // Default position
          positionY: 0, // Default position
          config: {},
        },
      });

      this.context.currentNode = node;

      return {
        success: true,
        message: `I've added a ${entities.type} node to your workflow. Would you like to configure it?`,
        nodeUpdates: [node],
      };
    } catch (error) {
      console.error('Error adding node:', error);
      return {
        success: false,
        message: "Sorry, I couldn't add the node. Please try again.",
      };
    }
  }

  private async handleConnectNodes(entities: CommandEntities): Promise<VoiceCommandResponse> {
    if (!this.context.currentWorkflow) {
      return {
        success: false,
        message: 'Please create a workflow first before connecting nodes.',
      };
    }

    if (!entities.source || !entities.target) {
      return {
        success: false,
        message: 'Which nodes would you like to connect?',
        followUpQuestion: 'Please specify the source and target nodes.',
      };
    }

    try {
      const edge = await prisma.workflowEdge.create({
        data: {
          workflowId: this.context.currentWorkflow.id,
          sourceNodeId: entities.source,
          targetNodeId: entities.target,
        },
      });

      this.context.currentEdge = edge;

      return {
        success: true,
        message: "I've connected the nodes. What would you like to do next?",
        edgeUpdates: [edge],
      };
    } catch (error) {
      console.error('Error connecting nodes:', error);
      return {
        success: false,
        message: "Sorry, I couldn't connect the nodes. Please try again.",
      };
    }
  }

  private async handleConfigureNode(entities: CommandEntities): Promise<VoiceCommandResponse> {
    if (!this.context.currentNode) {
      return {
        success: false,
        message: 'Please select a node to configure first.',
      };
    }

    if (!entities.config) {
      return {
        success: false,
        message: 'What configuration would you like to apply?',
        followUpQuestion: 'Please specify the configuration details.',
      };
    }

    try {
      const updatedNode = await prisma.workflowNode.update({
        where: { id: this.context.currentNode.id },
        data: { config: entities.config },
      });

      return {
        success: true,
        message: 'Node configuration updated successfully.',
        nodeUpdates: [updatedNode],
      };
    } catch (error) {
      console.error('Error configuring node:', error);
      return {
        success: false,
        message: "Sorry, I couldn't update the node configuration. Please try again.",
      };
    }
  }

  private async handleStartWorkflow(entities: CommandEntities): Promise<VoiceCommandResponse> {
    if (!this.context.currentWorkflow) {
      return {
        success: false,
        message: 'Please select a workflow to start first.',
      };
    }

    try {
      // Implement workflow start logic here
      return {
        success: true,
        message: 'Workflow started successfully.',
      };
    } catch (error) {
      console.error('Error starting workflow:', error);
      return {
        success: false,
        message: "Sorry, I couldn't start the workflow. Please try again.",
      };
    }
  }

  private handleUnknownIntent(): VoiceCommandResponse {
    return {
      success: false,
      message: "I'm not sure what you want to do. Could you please rephrase that?",
      followUpQuestion: 'You can try commands like "create workflow", "add node", or "connect nodes".',
    };
  }

  private addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    const message: ConversationMessage = {
      role,
      content,
      timestamp: new Date(),
    };

    this.context.conversationHistory.push(message);

    // Keep conversation history within limit
    if (this.context.conversationHistory.length > this.maxConversationLength) {
      this.context.conversationHistory.shift();
    }
  }

  getContext(): VoiceCommandContext {
    return this.context;
  }
} 
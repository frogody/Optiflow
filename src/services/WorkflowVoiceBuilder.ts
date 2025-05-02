import { ElevenLabsConfig, ElevenLabsTranscription } from '../types/elevenlabs';
import { ElevenLabsConversationalService } from './ElevenLabsConversationalService';
import { VoiceCommandProcessor } from './VoiceCommandProcessor';
import { WorkflowBuilder } from './WorkflowBuilder';

export class WorkflowVoiceBuilder {
  private elevenLabs: ElevenLabsConversationalService;
  private commandProcessor: VoiceCommandProcessor;
  private workflowBuilder: WorkflowBuilder;

  constructor(config: ElevenLabsConfig) {
    this.elevenLabs = new ElevenLabsConversationalService(config, {
      onTranscription: this.handleTranscription.bind(this),
      onError: this.handleError.bind(this)
    });
    this.commandProcessor = new VoiceCommandProcessor();
    this.workflowBuilder = new WorkflowBuilder();
  }

  async start(): Promise<void> {
    try {
      await this.elevenLabs.start();
    } catch (error) {
      console.error('Failed to start voice session:', error);
      throw error;
    }
  }

  async processAudio(audioData: Uint8Array): Promise<void> {
    try {
      await this.elevenLabs.processAudio(audioData);
    } catch (error) {
      console.error('Failed to process audio:', error);
      throw error;
    }
  }

  private async handleTranscription(transcription: ElevenLabsTranscription): Promise<void> {
    try {
      // Process voice command
      const command = await this.commandProcessor.processCommand(transcription);
      if (command) {
        await this.executeCommand(command);
      }

      // Generate/update workflow
      const workflow = await this.workflowBuilder.generateFromVoice(transcription);
      if (workflow) {
        // Emit workflow update event or callback
        console.log('Workflow updated:', workflow);
      }
    } catch (error) {
      console.error('Error handling transcription:', error);
      this.handleError(error instanceof Error ? error : new Error('Failed to handle transcription'));
    }
  }

  private async executeCommand(command: any): Promise<void> {
    try {
      switch (command.type) {
        case 'create_step':
          // Handle step creation
          console.log('Creating step:', command.params);
          
          // Create a new node for the workflow
          // This would typically interact with the workflow state
          // For this implementation, we'll assume a workflow context is available
          const newNode = {
            id: `node-${Date.now()}`,
            type: command.params.stepType || 'default',
            position: { x: 100, y: 100 + (Math.random() * 200) }, // Random position
            data: {
              label: command.params.label || `${command.params.stepType} Step`,
              description: command.params.description || '',
              type: command.params.stepType,
              settings: command.params.config || {}
            }
          };
          
          // Notify about the new node
          // This would be connected to the UI to update the workflow
          this.emitWorkflowChange({
            type: 'node_added',
            node: newNode
          });
          break;
          
        case 'connect_steps':
          // Handle step connection
          console.log('Connecting steps:', command.params);
          
          const newEdge = {
            id: `edge-${Date.now()}`,
            source: command.params.sourceId,
            target: command.params.targetId,
            type: 'custom',
            animated: true,
            data: { 
              label: command.params.label || 'Connection'
            }
          };
          
          // Notify about the new edge
          this.emitWorkflowChange({
            type: 'edge_added',
            edge: newEdge
          });
          break;
          
        case 'configure_step':
          // Handle step configuration
          console.log('Configuring step:', command.params);
          
          // This would update an existing node's configuration
          this.emitWorkflowChange({
            type: 'node_updated',
            nodeId: command.params.stepId,
            config: command.params.config
          });
          break;
          
        case 'delete_step':
          // Handle step deletion
          console.log('Deleting step:', command.params);
          
          // Notify about node deletion
          this.emitWorkflowChange({
            type: 'node_deleted',
            nodeId: command.params.stepId
          });
          break;
      }
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }
  
  /**
   * Emit a workflow change event
   * This would be connected to a state management system or event emitter
   */
  private emitWorkflowChange(change: any): void {
    // In a real implementation, this would emit an event or update a central state
    console.log('Workflow change:', change);
    
    // Example of what might happen in a real implementation:
    // this.eventEmitter.emit('workflow:change', change);
    // or
    // this.workflowStore.update(change);
    
    // For now, we'll just log it
    if (typeof window !== 'undefined') {
      // Store the change in sessionStorage for demo purposes
      try {
        const currentWorkflow = JSON.parse(sessionStorage.getItem('currentWorkflow') || '{"nodes":[],"edges":[]}');
        
        switch (change.type) {
          case 'node_added':
            currentWorkflow.nodes.push(change.node);
            break;
          case 'edge_added':
            currentWorkflow.edges.push(change.edge);
            break;
          case 'node_updated':
            const nodeIndex = currentWorkflow.nodes.findIndex((n: any) => n.id === change.nodeId);
            if (nodeIndex >= 0) {
              currentWorkflow.nodes[nodeIndex].data.settings = change.config;
            }
            break;
          case 'node_deleted':
            currentWorkflow.nodes = currentWorkflow.nodes.filter((n: any) => n.id !== change.nodeId);
            currentWorkflow.edges = currentWorkflow.edges.filter(
              (e: any) => e.source !== change.nodeId && e.target !== change.nodeId
            );
            break;
        }
        
        sessionStorage.setItem('currentWorkflow', JSON.stringify(currentWorkflow));
      } catch (error) {
        console.error('Error updating workflow in sessionStorage:', error);
      }
    }
  }

  private handleError(error: Error): void {
    console.error('Voice builder error:', error);
    // Implement error handling logic
  }

  async close(): Promise<void> {
    try {
      await this.elevenLabs.close();
    } catch (error) {
      console.error('Failed to close voice session:', error);
      throw error;
    }
  }
} 
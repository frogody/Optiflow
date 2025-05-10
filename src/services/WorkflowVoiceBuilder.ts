import { ElevenLabsConfig, ElevenLabsTranscription } from '../types/elevenlabs';
import { VoiceCommand, VoiceCommandType } from '../types/voice';
import { Workflow } from '../types/workflow';

import { ElevenLabsConversationalService } from './ElevenLabsConversationalService';
import { VoiceCommandProcessor } from './VoiceCommandProcessor';
import { WorkflowBuilder } from './WorkflowBuilder';

interface VoiceCommandPayload {
  type: VoiceCommandType;
  stepId?: string;
  sourceStepId?: string;
  targetStepId?: string;
  config?: Record<string, unknown>;
}

export class WorkflowVoiceBuilder {
  private elevenLabs: ElevenLabsConversationalService;
  private commandProcessor: VoiceCommandProcessor;
  private workflowBuilder: WorkflowBuilder;

  constructor(config: ElevenLabsConfig) {
    this.elevenLabs = new ElevenLabsConversationalService(config, {
      onTranscription: this.handleTranscription.bind(this),
      onError: this.handleError.bind(this),
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

  private async handleTranscription(
    transcription: ElevenLabsTranscription
  ): Promise<void> {
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
      this.handleError(
        error instanceof Error
          ? error
          : new Error('Failed to handle transcription')
      );
    }
  }

  private async executeCommand(command: VoiceCommandPayload): Promise<void> {
    try {
      switch (command.type) {
        case 'create_step':
          if (!command.config) {
            throw new Error('Step configuration is required for creation');
          }
          await this.workflowBuilder.addStep(command.config);
          break;

        case 'connect_steps':
          if (!command.sourceStepId || !command.targetStepId) {
            throw new Error('Source and target step IDs are required for connection');
          }
          await this.workflowBuilder.connectSteps(command.sourceStepId, command.targetStepId);
          break;

        case 'configure_step':
          if (!command.stepId || !command.config) {
            throw new Error('Step ID and configuration are required');
          }
          await this.workflowBuilder.configureStep(command.stepId, command.config);
          break;

        case 'delete_step':
          if (!command.stepId) {
            throw new Error('Step ID is required for deletion');
          }
          await this.workflowBuilder.deleteStep(command.stepId);
          break;

        default:
          throw new Error(`Unsupported command type: ${command.type}`);
      }
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
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

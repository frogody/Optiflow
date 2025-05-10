import { ElevenLabsTranscription } from '../types/elevenlabs';

type CommandType = 'create_step' | 'connect_steps' | 'configure_step' | 'delete_step';
type StepType = 'email' | 'qualification' | 'sql' | 'notification' | 'unknown';

interface WorkflowCommand {
  type: CommandType;
  params: WorkflowCommandParams;
}

interface WorkflowCommandParams {
  stepType?: StepType;
  config?: Record<string, unknown>;
  sourceId?: string;
  targetId?: string;
  stepId?: string;
}

type CommandHandler = (text: string) => Promise<WorkflowCommand>;

export class VoiceCommandProcessor {
  private commands: Record<string, CommandHandler> = {
    'create step': this.handleCreateStep.bind(this),
    'connect steps': this.handleConnectSteps.bind(this),
    'configure step': this.handleConfigureStep.bind(this),
    'delete step': this.handleDeleteStep.bind(this)
  };

  async processCommand(transcription: ElevenLabsTranscription): Promise<WorkflowCommand | null> {
    if (!transcription.isFinal) {
      return null;
    }

    const command = this.identifyCommand(transcription.text);
    if (command && this.commands[command]) {
      return this.commands[command](transcription.text);
    }

    return null;
  }

  private identifyCommand(text: string): keyof typeof this.commands | null {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('create') && lowerText.includes('step')) {
      return 'create step';
    }
    
    if (lowerText.includes('connect') && lowerText.includes('step')) {
      return 'connect steps';
    }
    
    if (lowerText.includes('configure') && lowerText.includes('step')) {
      return 'configure step';
    }
    
    if (lowerText.includes('delete') && lowerText.includes('step')) {
      return 'delete step';
    }
    
    return null;
  }

  private async handleCreateStep(text: string): Promise<WorkflowCommand> {
    // Parse step type and configuration from text
    const stepType = this.extractStepType(text);
    const config = this.extractStepConfig(text);
    
    return {
      type: 'create_step',
      params: {
        stepType,
        config
      }
    };
  }

  private async handleConnectSteps(text: string): Promise<WorkflowCommand> {
    // Parse source and target step IDs from text
    const [sourceId, targetId] = this.extractStepIds(text);
    
    return {
      type: 'connect_steps',
      params: {
        sourceId,
        targetId
      }
    };
  }

  private async handleConfigureStep(text: string): Promise<WorkflowCommand> {
    // Parse step ID and new configuration from text
    const stepId = this.extractStepId(text);
    const config = this.extractStepConfig(text);
    
    return {
      type: 'configure_step',
      params: {
        stepId,
        config
      }
    };
  }

  private async handleDeleteStep(text: string): Promise<WorkflowCommand> {
    // Parse step ID from text
    const stepId = this.extractStepId(text);
    
    return {
      type: 'delete_step',
      params: {
        stepId
      }
    };
  }

  private extractStepType(text: string): StepType {
    // Implement step type extraction logic
    // Example: "create an email step" -> "email"
    const stepTypes: StepType[] = ['email', 'qualification', 'sql', 'notification'];
    const lowerText = text.toLowerCase();
    
    for (const type of stepTypes) {
      if (lowerText.includes(type)) {
        return type;
      }
    }
    
    return 'unknown';
  }

  private extractStepConfig(text: string): Record<string, unknown> {
    // Implement configuration extraction logic
    // This would parse specific configuration parameters from the text
    return {};
  }

  private extractStepIds(text: string): [string, string] {
    // Implement step ID extraction logic
    // This would parse step IDs from the text
    return ['', ''];
  }

  private extractStepId(text: string): string {
    // Implement single step ID extraction logic
    return '';
  }
} 
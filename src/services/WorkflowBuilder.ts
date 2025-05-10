import { ElevenLabsTranscription } from '../types/elevenlabs';

interface WorkflowStep {
  id: string;
  type: 'email' | 'qualification' | 'sql' | 'notification';
  config: Record<string, any>;
  nextSteps: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export class WorkflowBuilder {
  private workflows: Map<string, Workflow> = new Map();
  private currentWorkflow: Workflow | null = null;

  async generateFromVoice(transcription: ElevenLabsTranscription): Promise<Workflow | null> {
    if (!transcription.isFinal) {
      return null;
    }

    // Parse the transcription to identify workflow components
    const components = this.parseWorkflowIntent(transcription.text);
    
    // Generate a new workflow or update existing one
    if (!this.currentWorkflow) {
      this.currentWorkflow = this.createNewWorkflow(components);
    } else {
      this.updateWorkflow(components);
    }

    return this.currentWorkflow;
  }

  private parseWorkflowIntent(text: string): {
    name?: string;
    description?: string;
    steps: Array<{
      type: string;
      config: Record<string, any>;
    }>;
  } {
    // Implement intent parsing logic
    // This would use NLP or pattern matching to extract workflow components
    return { steps: []
    };
  }

  private createNewWorkflow(components: any): Workflow {
    const workflow: Workflow = {
      id: this.generateId(),
      name: components.name || 'New Workflow',
      description: components.description || '',
      steps: components.steps.map((step: any) => ({ id: this.generateId(),
        type: step.type,
        config: step.config,
        nextSteps: []
          }))
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  private updateWorkflow(components: any): void {
    if (!this.currentWorkflow) {
      return;
    }

    // Update workflow properties
    if (components.name) {
      this.currentWorkflow.name = components.name;
    }
    if (components.description) {
      this.currentWorkflow.description = components.description;
    }

    // Add new steps
    for (const step of components.steps) {
      this.currentWorkflow.steps.push({ id: this.generateId(),
        type: step.type,
        config: step.config,
        nextSteps: []
          });
    }

    // Update the workflow in the map
    this.workflows.set(this.currentWorkflow.id, this.currentWorkflow);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  deleteWorkflow(id: string): void {
    this.workflows.delete(id);
    if (this.currentWorkflow?.id === id) {
      this.currentWorkflow = null;
    }
  }

  setCurrentWorkflow(id: string): void {
    const workflow = this.workflows.get(id);
    if (workflow) {
      this.currentWorkflow = workflow;
    }
  }
} 
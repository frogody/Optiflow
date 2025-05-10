import { toast } from 'react-hot-toast';

// Types
export interface ModelContext {
  modelId: string;
  name: string;
  maxContextLength: number;
  currentUsage: number;
  contextSections: ContextSection[];
}

export interface ContextSection {
  id: string;
  name: string;
  type: 'system' | 'user' | 'assistant' | 'data' | 'tools';
  tokenCount: number;
  color: string;
  content?: string;
}

export interface ContextSectionUpdate {
  name?: string;
  tokenCount?: number;
  color?: string;
  content?: string;
}

// Mock data for development purposes
const MOCK_MODELS: ModelContext[] = [
  {
    modelId: 'gpt-4o',
    name: 'GPT-4o',
    maxContextLength: 128000,
    currentUsage: 32500,
    contextSections: [
      {
        id: 'system-1',
        name: 'System',
        type: 'system',
        tokenCount: 6500,
        color: '#6366F1', // Indigo
        content: 'You are a helpful AI assistant focused on productivity...'
      },
      {
        id: 'user-messages',
        name: 'User',
        type: 'user',
        tokenCount: 8200,
        color: '#10B981', // Green
        content: 'User messages requesting information and assistance...'
      },
      {
        id: 'assistant-responses',
        name: 'Assistant',
        type: 'assistant',
        tokenCount: 10800,
        color: '#8B5CF6', // Purple
        content: 'Assistant responses providing solutions and information...'
      },
      {
        id: 'data-1',
        name: 'Data',
        type: 'data',
        tokenCount: 4500,
        color: '#F59E0B', // Amber
        content: 'Referenced data and documents...'
      },
      {
        id: 'tools-1',
        name: 'Tools',
        type: 'tools',
        tokenCount: 2500,
        color: '#EC4899', // Pink
        content: 'Tool definitions and function schemas...'
      }
    ]
  },
  {
    modelId: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    maxContextLength: 200000,
    currentUsage: 45000,
    contextSections: [
      { id: 'system-2',
        name: 'System',
        type: 'system',
        tokenCount: 8000,
        color: '#6366F1', // Indigo
        content: 'You are Claude, a helpful AI assistant by Anthropic...'
      },
      { id: 'user-messages-2',
        name: 'User',
        type: 'user',
        tokenCount: 12000,
        color: '#10B981', // Green
        content: 'User conversation history and queries...'
      },
      { id: 'assistant-responses-2',
        name: 'Assistant',
        type: 'assistant',
        tokenCount: 15000,
        color: '#8B5CF6', // Purple
        content: "Claude's detailed and helpful responses..."
      },
      { id: 'data-2',
        name: 'Data',
        type: 'data',
        tokenCount: 7000,
        color: '#F59E0B', // Amber
        content: 'Data and content from files and databases...'
      },
      { id: 'tools-2',
        name: 'Tools',
        type: 'tools',
        tokenCount: 3000,
        color: '#EC4899', // Pink
        content: 'Tool specifications and API schemas...'
      }
    ]
  },
  {
    modelId: 'gemini-pro',
    name: 'Gemini Pro',
    maxContextLength: 32000,
    currentUsage: 21000,
    contextSections: [
      { id: 'system-3',
        name: 'System',
        type: 'system',
        tokenCount: 4000,
        color: '#6366F1', // Indigo
        content: 'You are a helpful AI assistant from Google...'
      },
      { id: 'user-messages-3',
        name: 'User',
        type: 'user',
        tokenCount: 7000,
        color: '#10B981', // Green
        content: 'User conversation history...'
      },
      { id: 'assistant-responses-3',
        name: 'Assistant',
        type: 'assistant',
        tokenCount: 6000,
        color: '#8B5CF6', // Purple
        content: 'Assistant responses providing information...'
      },
      { id: 'data-3',
        name: 'Data',
        type: 'data',
        tokenCount: 3000,
        color: '#F59E0B', // Amber
        content: 'Data references and content...'
      },
      { id: 'tools-3',
        name: 'Tools',
        type: 'tools',
        tokenCount: 1000,
        color: '#EC4899', // Pink
        content: 'Tool specifications...'
      }
    ]
  }
];

/**
 * Service for managing Model Context Protocol (MCP) operations
 */
export class MCPContextService {
  private static instance: MCPContextService;
  private models: Map<string, ModelContext> = new Map();
  
  private constructor() {
    // Initialize with mock data
    MOCK_MODELS.forEach(model => {
      this.models.set(model.modelId, { ...model });
    });
  }
  
  /**
   * Get the singleton instance of MCPContextService
   */
  public static getInstance(): MCPContextService {
    if (!MCPContextService.instance) {
      MCPContextService.instance = new MCPContextService();
    }
    return MCPContextService.instance;
  }
  
  /**
   * Get all available models with context data
   */
  public getModels(): ModelContext[] {
    return Array.from(this.models.values());
  }
  
  /**
   * Get a specific model by ID
   */
  public getModel(modelId: string): ModelContext | undefined {
    return this.models.get(modelId);
  }
  
  /**
   * Optimize the context for a model to reduce token usage
   */
  public async optimizeContext(modelId: string): Promise<ModelContext | undefined> {
    const model = this.models.get(modelId);
    if (!model) {
      toast.error(`Model ${modelId} not found`);
      return undefined;
    }
    
    try {
      // Simulate optimization by reducing token counts
      const optimizedSections = model.contextSections.map(section => ({
        ...section,
        tokenCount: Math.floor(section.tokenCount * 0.8) // Reduce by 20%
      }));
      
      const optimizedModel: ModelContext = {
        ...model,
        contextSections: optimizedSections,
        currentUsage: optimizedSections.reduce((sum, section) => sum + section.tokenCount, 0)
      };
      
      this.models.set(modelId, optimizedModel);
      toast.success('Context optimized successfully');
      return optimizedModel;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize context';
      toast.error(errorMessage);
      return undefined;
    }
  }
  
  /**
   * Clear the context for a specific model
   */
  public async clearContext(modelId: string): Promise<ModelContext | undefined> {
    const model = this.models.get(modelId);
    if (!model) {
      toast.error(`Model ${modelId} not found`);
      return undefined;
    }
    
    try {
      // Simulate clearing process
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a copy with minimal token usage
      const updatedModel = { ...model };
      
      // Keep system prompt but clear everything else
      updatedModel.contextSections = model.contextSections.map(section => ({ ...section,
        tokenCount: section.type === 'system' ? section.tokenCount : 0
      }));
      
      // Recalculate total usage (only system prompt remains)
      updatedModel.currentUsage = updatedModel.contextSections.reduce(
        (total, section) => total + section.tokenCount, 0
      );
      
      // Update in the map
      this.models.set(modelId, updatedModel);
      
      toast.success(`Context cleared for ${model.name}`);
      return updatedModel;
    } catch (error) {
      toast.error(`Failed to clear context: ${ error instanceof Error ? error.message : 'Unknown error'    }`);
      return model;
    }
  }
  
  /**
   * Update a specific section of the context
   */
  public async updateContextSection(
    modelId: string, 
    sectionId: string, 
    updates: Partial<ContextSection>
  ): Promise<ModelContext | undefined> {
    const model = this.models.get(modelId);
    if (!model) {
      toast.error(`Model ${modelId} not found`);
      return undefined;
    }
    
    try {
      // Simulate updating process
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Create a copy with updated section
      const updatedModel = { ...model };
      
      // Find and update the specific section
      updatedModel.contextSections = model.contextSections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      );
      
      // Recalculate total usage
      updatedModel.currentUsage = updatedModel.contextSections.reduce(
        (total, section) => total + section.tokenCount, 0
      );
      
      // Update in the map
      this.models.set(modelId, updatedModel);
      
      return updatedModel;
    } catch (error) {
      toast.error(`Failed to update context section: ${ error instanceof Error ? error.message : 'Unknown error'    }`);
      return model;
    }
  }
  
  /**
   * Transfer context between models (useful for routing between different models)
   */
  public async transferContext(
    sourceModelId: string, 
    targetModelId: string, 
    sectionIds?: string[]
  ): Promise<boolean> {
    const sourceModel = this.models.get(sourceModelId);
    const targetModel = this.models.get(targetModelId);
    
    if (!sourceModel) {
      toast.error(`Source model ${sourceModelId} not found`);
      return false;
    }
    
    if (!targetModel) {
      toast.error(`Target model ${targetModelId} not found`);
      return false;
    }
    
    try {
      // Simulate transfer process
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Determine which sections to transfer
      const sectionsToTransfer = sectionIds 
        ? sourceModel.contextSections.filter(section => sectionIds.includes(section.id))
        : sourceModel.contextSections;
      
      // Check if target model has enough space
      const transferTokenCount = sectionsToTransfer.reduce((total, section) => total + section.tokenCount, 0);
      const targetAvailableTokens = targetModel.maxContextLength - targetModel.currentUsage;
      
      if (transferTokenCount > targetAvailableTokens) {
        toast.error(`Insufficient context space in target model (need ${transferTokenCount} tokens, have ${targetAvailableTokens})`);
        return false;
      }
      
      // Create unique IDs for transferred sections
      const transferredSections = sectionsToTransfer.map(section => ({
        ...section,
        id: `${section.id}-transferred-${Date.now()}`
      }));
      
      // Update target model with transferred sections
      const updatedTargetModel = { ...targetModel,
        contextSections: [...targetModel.contextSections, ...transferredSections],
        currentUsage: targetModel.currentUsage + transferTokenCount
      };
      
      // Update in the map
      this.models.set(targetModelId, updatedTargetModel);
      
      toast.success(`Context transferred from ${sourceModel.name} to ${targetModel.name}`);
      return true;
    } catch (error) {
      toast.error(`Failed to transfer context: ${ error instanceof Error ? error.message : 'Unknown error'    }`);
      return false;
    }
  }
} 
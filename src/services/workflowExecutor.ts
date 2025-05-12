/**
 * Workflow Executor Service
 * 
 * Handles the execution of workflow nodes with support for:
 * - Safe mode (manual approval of each step)
 * - Execution timeouts
 * - Concurrency control
 * - Memory integration
 * - RAG integration
 */

import { Edge, Node } from 'reactflow';

import { WorkflowSettings } from '@/components/workflow/WorkflowSettings.tsx';

import ragService, { RetrievalRequest } from './ragService';
import WorkflowMemory, { getWorkflowMemory, MemoryItem } from './workflowMemory';


export type NodeStatus = 'idle' | 'running' | 'completed' | 'error' | 'waiting-approval';

export interface NodeExecutionResult { nodeId: string;
  status: NodeStatus;
  output?: any;
  error?: string;
  executionTimeMs: number;
  memoryIds?: string[];
}

export interface WorkflowExecutionState { workflowId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  currentNodes: string[];
  nodeStatus: Record<string, NodeStatus>;
  results: Record<string, NodeExecutionResult>;
  pendingApprovals: string[];
  startTime?: number;
  endTime?: number;
  error?: string;
}

export class WorkflowExecutor {
  private workflowId: string;
  private settings: WorkflowSettings;
  private nodes: Node[];
  private edges: Edge[];
  private state: WorkflowExecutionState;
  private memory: WorkflowMemory;
  private timeoutId?: NodeJS.Timeout;
  private listeners: ((state: WorkflowExecutionState) => void)[] = [];
  
  constructor(workflowId: string, nodes: Node[], edges: Edge[], settings: WorkflowSettings) {
    this.workflowId = workflowId;
    this.nodes = nodes;
    this.edges = edges;
    this.settings = settings;
    
    // Initialize state
    this.state = {
      workflowId,
      status: 'idle',
      currentNodes: [],
      nodeStatus: {},
      results: {},
      pendingApprovals: [],
    };
    
    // Initialize memory if enabled
    if (settings.memoryEnabled) {
      this.memory = getWorkflowMemory({ workflowId,
        memoryType: settings.memoryType,
        memorySize: settings.memorySize,
        contextWindowSize: settings.contextWindowSize,
      });
    } else {
      // Create in-memory instance anyway for uniformity
      this.memory = getWorkflowMemory({ workflowId,
        memoryType: 'buffer',
        memorySize: 1024,
        contextWindowSize: 10,
      });
    }
  }
  
  /**
   * Add a listener for state changes
   */
  addListener(listener: (state: WorkflowExecutionState) => void): void {
    this.listeners.push(listener);
  }
  
  /**
   * Remove a listener
   */
  removeListener(listener: (state: WorkflowExecutionState) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }
  
  /**
   * Start workflow execution
   */
  async start(): Promise<void> {
    if (this.state.status === 'running') {
      throw new Error('Workflow is already running');
    }
    
    // Reset state
    this.state = {
      workflowId: this.workflowId,
      status: 'running',
      currentNodes: [],
      nodeStatus: {},
      results: {},
      pendingApprovals: [],
      startTime: Date.now(),
    };
    
    // Set timeout if configured
    if (this.settings.executionTimeout > 0) {
      this.timeoutId = setTimeout(() => {
        this.handleError(new Error(`Workflow execution timed out after ${this.settings.executionTimeout} seconds`));
      }, this.settings.executionTimeout * 1000);
    }
    
    // Find starting nodes (nodes with no incoming edges)
    const startingNodes = this.nodes.filter(node => {
      return !this.edges.some(edge => edge.target === node.id);
    });
    
    if (startingNodes.length === 0) {
      this.handleError(new Error('No starting nodes found in workflow'));
      return;
    }
    
    // Queue starting nodes for execution
    for (const node of startingNodes) {
      this.queueNode(node.id);
    }
    
    // Start execution
    await this.processQueue();
  }
  
  /**
   * Pause workflow execution
   */
  pause(): void {
    if (this.state.status !== 'running') {
      return;
    }
    
    this.state.status = 'paused';
    this.notifyListeners();
  }
  
  /**
   * Resume workflow execution
   */
  async resume(): Promise<void> {
    if (this.state.status !== 'paused') {
      return;
    }
    
    this.state.status = 'running';
    this.notifyListeners();
    
    await this.processQueue();
  }
  
  /**
   * Stop workflow execution
   */
  stop(): void {
    if (this.state.status !== 'running' && this.state.status !== 'paused') {
      return;
    }
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.state.status = 'completed';
    this.state.endTime = Date.now();
    this.notifyListeners();
  }
  
  /**
   * Approve a node in safe mode
   */
  async approveNode(nodeId: string): Promise<void> {
    if (!this.state.pendingApprovals.includes(nodeId)) {
      throw new Error(`Node ${nodeId} is not pending approval`);
    }
    
    // Remove from pending approvals
    this.state.pendingApprovals = this.state.pendingApprovals.filter(id => id !== nodeId);
    
    // Update status
    this.state.nodeStatus[nodeId] = 'running';
    this.notifyListeners();
    
    // Execute node
    await this.executeNode(nodeId);
  }
  
  /**
   * Reject a node in safe mode
   */
  rejectNode(nodeId: string): void {
    if (!this.state.pendingApprovals.includes(nodeId)) {
      throw new Error(`Node ${nodeId} is not pending approval`);
    }
    
    // Remove from pending approvals
    this.state.pendingApprovals = this.state.pendingApprovals.filter(id => id !== nodeId);
    
    // Update status
    this.state.nodeStatus[nodeId] = 'error';
    this.state.results[nodeId] = { nodeId,
      status: 'error',
      error: 'Execution rejected by user',
      executionTimeMs: 0,
    };
    
    this.notifyListeners();
    
    // Check if we need to continue with other nodes
    this.checkWorkflowCompletion();
  }
  
  /**
   * Queue a node for execution
   */
  private queueNode(nodeId: string): void {
    if (
      this.state.nodeStatus[nodeId] === 'running' ||
      this.state.nodeStatus[nodeId] === 'completed' ||
      this.state.nodeStatus[nodeId] === 'waiting-approval' ||
      this.state.currentNodes.includes(nodeId)
    ) {
      return;
    }
    
    // Add to current nodes queue
    this.state.currentNodes.push(nodeId);
    
    // Set initial status
    this.state.nodeStatus[nodeId] = 'idle';
    
    this.notifyListeners();
  }
  
  /**
   * Process the execution queue
   */
  private async processQueue(): Promise<void> {
    if (this.state.status !== 'running' || this.state.currentNodes.length === 0) {
      return;
    }
    
    // Limit concurrent executions
    const availableSlots = this.settings.maxConcurrentNodes - 
      Object.values(this.state.nodeStatus).filter(status => status === 'running').length;
    
    if (availableSlots <= 0) {
      return; // Max concurrency reached
    }
    
    // Get next nodes to execute
    const nodesToRun = this.state.currentNodes
      .filter(nodeId => this.state.nodeStatus[nodeId] === 'idle')
      .slice(0, availableSlots);
    
    if (nodesToRun.length === 0) {
      return;
    }
    
    // Start executions
    const executions = nodesToRun.map(nodeId => {
      if (this.settings.safeMode) {
        // In safe mode, request approval first
        this.state.nodeStatus[nodeId] = 'waiting-approval';
        this.state.pendingApprovals.push(nodeId);
        this.notifyListeners();
        return Promise.resolve();
      } else {
        // Execute directly
        return this.executeNode(nodeId);
      }
    });
    
    // Wait for executions to complete
    await Promise.all(executions);
    
    // Continue with remaining nodes
    await this.processQueue();
  }
  
  /**
   * Execute a single node
   */
  private async executeNode(nodeId: string): Promise<void> {
    if (this.state.status !== 'running') {
      return;
    }
    
    // Update status
    this.state.nodeStatus[nodeId] = 'running';
    this.notifyListeners();
    
    // Remove from current nodes queue
    this.state.currentNodes = this.state.currentNodes.filter(id => id !== nodeId);
    
    try {
      // Track execution time
      const startTime = Date.now();
      
      // Find the node
      const node = this.nodes.find(n => n.id === nodeId);
      if (!node) {
        throw new Error(`Node ${nodeId} not found`);
      }
      
      // Get input from previous nodes
      const inputs = this.getNodeInputs(nodeId);
      
      // Store input in memory if enabled
      let inputMemoryId: string | undefined;
      if (this.settings.memoryEnabled) {
        inputMemoryId = `${nodeId}-input-${Date.now()}`;
        this.memory.store({ id: inputMemoryId,
          nodeId,
          timestamp: Date.now(),
          type: 'input',
          content: inputs,
        });
      }
      
      // Prepare RAG context if enabled
      let ragContext = '';
      if (this.settings.ragEnabled && this.settings.knowledgeBase) {
        // Generate a query based on node data and inputs
        const query = this.generateRagQuery(node, inputs);
        
        // Retrieve documents
        const retrievalResult = await ragService.retrieveDocuments({
          query,
          options: {
            knowledgeBase: this.settings.knowledgeBase,
            similarityThreshold: this.settings.similarityThreshold,
            maxDocuments: this.settings.maxDocuments,
          }
        });
        
        // Generate context
        ragContext = ragService.generateContext(retrievalResult);
      }
      
      // Execute the node (mock implementation)
      // In a real implementation, this would call the specific node type's execution logic
      const output = await this.mockExecuteNode(node, inputs, ragContext);
      
      // Store output in memory if enabled
      let outputMemoryId: string | undefined;
      if (this.settings.memoryEnabled) {
        outputMemoryId = `${nodeId}-output-${Date.now()}`;
        this.memory.store({ id: outputMemoryId,
          nodeId,
          timestamp: Date.now(),
          type: 'output',
          content: output,
        });
      }
      
      // Update status
      const executionTimeMs = Date.now() - startTime;
      this.state.nodeStatus[nodeId] = 'completed';
      this.state.results[nodeId] = { nodeId,
        status: 'completed',
        output,
        executionTimeMs,
        memoryIds: [inputMemoryId, outputMemoryId].filter(Boolean) as string[],
      };
      
      this.notifyListeners();
      
      // Execute auto-save if enabled
      if (this.settings.autoSave) {
        this.saveWorkflowState();
      }
      
      // Find next nodes to execute
      this.queueNextNodes(nodeId);
      
      // Check if workflow is complete
      this.checkWorkflowCompletion();
      
      // Continue processing queue
      await this.processQueue();
      
    } catch (error) {
      // Handle node execution error
      this.state.nodeStatus[nodeId] = 'error';
      this.state.results[nodeId] = { nodeId,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        executionTimeMs: 0,
      };
      
      this.notifyListeners();
      
      // Check if workflow should continue or stop on error
      // For now, we just continue with other branches
      this.checkWorkflowCompletion();
      await this.processQueue();
    }
  }
  
  /**
   * Get inputs for a node from previous nodes
   */
  private getNodeInputs(nodeId: string): any {
    const incomingEdges = this.edges.filter(edge => edge.target === nodeId);
    
    if (incomingEdges.length === 0) {
      return {}; // No inputs
    }
    
    // Collect outputs from source nodes
    const inputs: Record<string, any> = {};
    
    for (const edge of incomingEdges) {
      const sourceNodeId = edge.source;
      const sourceNodeResult = this.state.results[sourceNodeId];
      
      if (sourceNodeResult?.status === 'completed' && sourceNodeResult.output !== undefined) {
        // If edge has a label, use it as the key, otherwise use the source node ID
        const key = edge.data?.label || sourceNodeId;
        inputs[key] = sourceNodeResult.output;
      }
    }
    
    return inputs;
  }
  
  /**
   * Queue next nodes for execution
   */
  private queueNextNodes(nodeId: string): void {
    const outgoingEdges = this.edges.filter(edge => edge.source === nodeId);
    
    for (const edge of outgoingEdges) {
      const targetNodeId = edge.target;
      
      // Check if all incoming edges to the target node have completed source nodes
      const incomingEdges = this.edges.filter(e => e.target === targetNodeId);
      const allSourcesCompleted = incomingEdges.every(e => 
        this.state.nodeStatus[e.source] === 'completed'
      );
      
      if (allSourcesCompleted) {
        this.queueNode(targetNodeId);
      }
    }
  }
  
  /**
   * Check if workflow execution is complete
   */
  private checkWorkflowCompletion(): void {
    if (this.state.status !== 'running') {
      return;
    }
    
    // Check if all nodes have a final status (completed or error)
    const allNodesProcessed = this.nodes.every(node => 
      this.state.nodeStatus[node.id] === 'completed' || 
      this.state.nodeStatus[node.id] === 'error'
    );
    
    // Check if there are no pending nodes
    const noPendingNodes = this.state.currentNodes.length === 0;
    
    // Check if there are no nodes waiting for approval
    const noWaitingApprovals = this.state.pendingApprovals.length === 0;
    
    if (allNodesProcessed && noPendingNodes && noWaitingApprovals) {
      // Workflow is complete
      this.state.status = 'completed';
      this.state.endTime = Date.now();
      
      // Clear timeout if set
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      // Send notifications if enabled
      if (this.settings.notifyOnCompletion) {
        this.sendCompletionNotification();
      }
      
      this.notifyListeners();
    }
  }
  
  /**
   * Handle workflow error
   */
  private handleError(error: Error): void {
    this.state.status = 'error';
    this.state.error = error.message;
    this.state.endTime = Date.now();
    
    // Clear timeout if set
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Send notifications if enabled
    if (this.settings.notifyOnError) {
      this.sendErrorNotification(error);
    }
    
    this.notifyListeners();
  }
  
  /**
   * Save workflow state (for auto-save feature)
   */
  private saveWorkflowState(): void {
    // In a real implementation, this would save to a database or API
    // For this example, we just log to console
    if (this.settings.debugMode) {
      console.log(`[Workflow ${this.workflowId}] Auto-saving state:`, JSON.stringify(this.state, null, 2));
    }
  }
  
  /**
   * Send completion notification
   */
  private sendCompletionNotification(): void {
    // In a real implementation, this would send a notification via API
    // For this example, we just log to console
    console.log(`[Workflow ${this.workflowId}] Completed successfully`);
  }
  
  /**
   * Send error notification
   */
  private sendErrorNotification(error: Error): void {
    // In a real implementation, this would send a notification via API
    // For this example, we just log to console
    console.error(`[Workflow ${this.workflowId}] Error:`, error.message);
  }
  
  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (error) { console.error('Error in workflow state listener:', error);
      }
    }
  }
  
  /**
   * Generate a RAG query based on node data and inputs
   */
  private generateRagQuery(node: Node, inputs: any): string {
    // Build a query based on node type and data
    const nodeType = node.data.type || 'default';
    const nodeDescription = node.data.description || '';
    
    let query = `For a ${nodeType} node described as "${nodeDescription}", `;
    
    // Add context based on node settings
    if (node.data.settings) {
      const settingsStr = Object.entries(node.data.settings)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      query += `with settings (${settingsStr}), `;
    }
    
    // Add context based on inputs
    const inputStr = Object.keys(inputs).join(', ');
    if (inputStr) {
      query += `using inputs: ${inputStr}, `;
    }
    
    query += 'provide relevant information and context.';
    
    return query;
  }
  
  /**
   * Mock node execution (for demonstration purposes)
   */
  private async mockExecuteNode(node: Node, inputs: any, ragContext: string): Promise<any> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const nodeType = node.data.type || 'default';
    
    // Mock outputs based on node type
    switch (nodeType) {
      case 'extract-webpage':
        return { title: 'Example Website',
          content: 'This is example content extracted from a webpage.',
          timestamp: new Date().toISOString()
        };
        
      case 'process-data':
        return {
          processedData: inputs.data ? `Processed: ${JSON.stringify(inputs.data)}` : 'No input data',
          fields: ['name', 'email', 'phone'],
          metadata: { processingTime: '0.35s'     }
        };
        
      case 'conditional':
        // Evaluate the condition if possible
        const condition = node.data.settings?.condition;
        if (condition && typeof condition === 'string') {
          // Very simple evaluation for demo purposes
          try {
            // Create a safe evaluation context with inputs
            const context = { ...inputs, result: inputs.result || {} };
            const result = eval(`with (context) { ${condition} }`);
            return { result, 
              path: result ? 'true' : 'false', 
              condition 
            };
          } catch (error) {
            return { error: 'Condition evaluation failed', condition     };
          }
        }
        return { result: Math.random() > 0.5, condition: 'Random outcome'     };
        
      case 'send-email':
        return { sent: true,
          to: node.data.settings?.to || 'example@example.com',
          subject: node.data.settings?.subject || 'No subject',
          timestamp: new Date().toISOString()
        };
        
      case 'database':
        return { operation: node.data.settings?.queryType || 'select',
          affected: Math.floor(Math.random() * 10) + 1,
          success: true
        };
        
      default:
        return { executed: true,
          nodeType,
          timestamp: new Date().toISOString()
        };
    }
  }
}

// Factory function to create a workflow executor
export function createWorkflowExecutor(
  workflowId: string,
  nodes: Node[],
  edges: Edge[],
  settings: WorkflowSettings
): WorkflowExecutor {
  return new WorkflowExecutor(workflowId, nodes, edges, settings);
}

export default WorkflowExecutor; 
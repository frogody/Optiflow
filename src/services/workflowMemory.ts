/**
 * Workflow Memory Service
 * 
 * Manages memory for workflow execution with different storage strategies:
 * - Buffer: In-memory only, cleared on page refresh
 * - Session: Uses sessionStorage, persists until browser is closed
 * - Persistent: Uses localStorage + optional server sync, persists across sessions
 */

export interface MemoryItem {
  id: string;
  nodeId: string;
  timestamp: number;
  type: 'input' | 'output' | 'state' | 'error';
  content: any;
}

export interface WorkflowMemoryOptions {
  workflowId: string;
  memoryType: 'buffer' | 'session' | 'persistent';
  memorySize: number; // In KB
  contextWindowSize: number; // Number of items
}

class WorkflowMemory {
  private workflowId: string;
  private memoryType: 'buffer' | 'session' | 'persistent';
  private memorySize: number;
  private contextWindowSize: number;
  private bufferMemory: Map<string, MemoryItem[]> = new Map();
  
  constructor(options: WorkflowMemoryOptions) {
    this.workflowId = options.workflowId;
    this.memoryType = options.memoryType;
    this.memorySize = options.memorySize;
    this.contextWindowSize = options.contextWindowSize;
    
    // Load existing memory if using session or persistent storage
    if (this.memoryType !== 'buffer') {
      this.loadFromStorage();
    }
  }
  
  /**
   * Update memory options
   */
  updateOptions(options: Partial<WorkflowMemoryOptions>) {
    if (options.memoryType && options.memoryType !== this.memoryType) {
      // If changing memory type, migrate the data
      const currentMemory = this.getAll();
      this.memoryType = options.memoryType;
      this.setAll(currentMemory);
    }
    
    if (options.memorySize) {
      this.memorySize = options.memorySize;
    }
    
    if (options.contextWindowSize) {
      this.contextWindowSize = options.contextWindowSize;
    }
    
    if (options.workflowId) {
      this.workflowId = options.workflowId;
    }
  }
  
  /**
   * Store a memory item
   */
  store(item: MemoryItem): void {
    const memoryKey = this.getMemoryKey();
    let memoryItems: MemoryItem[] = [];
    
    // Get existing items based on storage type
    switch (this.memoryType) {
      case 'buffer':
        memoryItems = this.bufferMemory.get(memoryKey) || [];
        break;
      case 'session':
        const sessionData = sessionStorage.getItem(memoryKey);
        memoryItems = sessionData ? JSON.parse(sessionData) : [];
        break;
      case 'persistent':
        const localData = localStorage.getItem(memoryKey);
        memoryItems = localData ? JSON.parse(localData) : [];
        break;
    }
    
    // Add new item
    memoryItems.push(item);
    
    // Trim to context window size
    if (memoryItems.length > this.contextWindowSize) {
      memoryItems = memoryItems.slice(-this.contextWindowSize);
    }
    
    // Check memory size limit (only for session/persistent)
    if (this.memoryType !== 'buffer') {
      const memoryString = JSON.stringify(memoryItems);
      const memorySizeInKB = new Blob([memoryString]).size / 1024;
      
      if (memorySizeInKB > this.memorySize) {
        // If over limit, remove oldest items until under limit
        while (memoryItems.length > 1) {
          memoryItems.shift();
          const newMemoryString = JSON.stringify(memoryItems);
          const newMemorySizeInKB = new Blob([newMemoryString]).size / 1024;
          
          if (newMemorySizeInKB <= this.memorySize) {
            break;
          }
        }
      }
    }
    
    // Store based on memory type
    switch (this.memoryType) {
      case 'buffer':
        this.bufferMemory.set(memoryKey, memoryItems);
        break;
      case 'session':
        try {
          sessionStorage.setItem(memoryKey, JSON.stringify(memoryItems));
        } catch (error) {
          console.error('Failed to store in session storage:', error);
          // Fallback to buffer memory
          this.bufferMemory.set(memoryKey, memoryItems);
        }
        break;
      case 'persistent':
        try {
          localStorage.setItem(memoryKey, JSON.stringify(memoryItems));
        } catch (error) {
          console.error('Failed to store in local storage:', error);
          // Fallback to buffer memory
          this.bufferMemory.set(memoryKey, memoryItems);
        }
        break;
    }
  }
  
  /**
   * Get all memory items for the workflow
   */
  getAll(): MemoryItem[] {
    const memoryKey = this.getMemoryKey();
    
    switch (this.memoryType) {
      case 'buffer':
        return this.bufferMemory.get(memoryKey) || [];
      case 'session':
        const sessionData = sessionStorage.getItem(memoryKey);
        return sessionData ? JSON.parse(sessionData) : [];
      case 'persistent':
        const localData = localStorage.getItem(memoryKey);
        return localData ? JSON.parse(localData) : [];
      default:
        return [];
    }
  }
  
  /**
   * Get items for a specific node
   */
  getByNodeId(nodeId: string): MemoryItem[] {
    const allItems = this.getAll();
    return allItems.filter(item => item.nodeId === nodeId);
  }
  
  /**
   * Get items by type
   */
  getByType(type: MemoryItem['type']): MemoryItem[] {
    const allItems = this.getAll();
    return allItems.filter(item => item.type === type);
  }
  
  /**
   * Get the most recent context window of items
   */
  getContextWindow(): MemoryItem[] {
    const allItems = this.getAll();
    return allItems.slice(-this.contextWindowSize);
  }
  
  /**
   * Set all memory items (replaces existing)
   */
  setAll(items: MemoryItem[]): void {
    const memoryKey = this.getMemoryKey();
    const limitedItems = items.slice(-this.contextWindowSize);
    
    switch (this.memoryType) {
      case 'buffer':
        this.bufferMemory.set(memoryKey, limitedItems);
        break;
      case 'session':
        try {
          sessionStorage.setItem(memoryKey, JSON.stringify(limitedItems));
        } catch (error) {
          console.error('Failed to store in session storage:', error);
          this.bufferMemory.set(memoryKey, limitedItems);
        }
        break;
      case 'persistent':
        try {
          localStorage.setItem(memoryKey, JSON.stringify(limitedItems));
        } catch (error) {
          console.error('Failed to store in local storage:', error);
          this.bufferMemory.set(memoryKey, limitedItems);
        }
        break;
    }
  }
  
  /**
   * Clear all memory for this workflow
   */
  clear(): void {
    const memoryKey = this.getMemoryKey();
    
    switch (this.memoryType) {
      case 'buffer':
        this.bufferMemory.delete(memoryKey);
        break;
      case 'session':
        sessionStorage.removeItem(memoryKey);
        break;
      case 'persistent':
        localStorage.removeItem(memoryKey);
        break;
    }
  }
  
  /**
   * Migrate memory from one type to another
   */
  migrateMemory(targetType: 'buffer' | 'session' | 'persistent'): void {
    if (targetType === this.memoryType) return;
    
    const currentMemory = this.getAll();
    const prevType = this.memoryType;
    this.memoryType = targetType;
    this.setAll(currentMemory);
    
    // Clear previous storage if different
    if (prevType !== 'buffer') {
      const memoryKey = this.getMemoryKey(prevType);
      switch (prevType) {
        case 'session':
          sessionStorage.removeItem(memoryKey);
          break;
        case 'persistent':
          localStorage.removeItem(memoryKey);
          break;
      }
    }
  }
  
  /**
   * Load memory from storage (for session/persistent)
   */
  private loadFromStorage(): void {
    const memoryKey = this.getMemoryKey();
    
    switch (this.memoryType) {
      case 'session':
        const sessionData = sessionStorage.getItem(memoryKey);
        if (sessionData) {
          try {
            const memoryItems = JSON.parse(sessionData);
            this.bufferMemory.set(memoryKey, memoryItems);
          } catch (error) {
            console.error('Failed to parse session storage data:', error);
          }
        }
        break;
      case 'persistent':
        const localData = localStorage.getItem(memoryKey);
        if (localData) {
          try {
            const memoryItems = JSON.parse(localData);
            this.bufferMemory.set(memoryKey, memoryItems);
          } catch (error) {
            console.error('Failed to parse local storage data:', error);
          }
        }
        break;
    }
  }
  
  /**
   * Generate storage key for the workflow
   */
  private getMemoryKey(type?: 'buffer' | 'session' | 'persistent'): string {
    const memType = type || this.memoryType;
    return `workflow_memory_${memType}_${this.workflowId}`;
  }
}

/**
 * Create a memory manager for a workflow
 */
export function createWorkflowMemory(options: WorkflowMemoryOptions): WorkflowMemory {
  return new WorkflowMemory(options);
}

/**
 * Get or create a memory instance for a workflow
 */
let memoryInstances: Map<string, WorkflowMemory> = new Map();

export function getWorkflowMemory(options: WorkflowMemoryOptions): WorkflowMemory {
  const key = `${options.workflowId}_${options.memoryType}`;
  
  if (!memoryInstances.has(key)) {
    memoryInstances.set(key, new WorkflowMemory(options));
  } else {
    // Update options if instance exists
    const instance = memoryInstances.get(key)!;
    instance.updateOptions(options);
  }
  
  return memoryInstances.get(key)!;
}

export default WorkflowMemory; 
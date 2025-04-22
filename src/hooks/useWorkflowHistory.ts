import { useState, useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

interface UseWorkflowHistoryResult {
  currentState: WorkflowState;
  canUndo: boolean;
  canRedo: boolean;
  updateWorkflow: (nodes: Node[], edges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export function useWorkflowHistory(
  initialNodes: Node[] = [], 
  initialEdges: Edge[] = [],
  maxHistorySize: number = 50
): UseWorkflowHistoryResult {
  // History stacks
  const [history, setHistory] = useState<WorkflowState[]>([{
    nodes: initialNodes,
    edges: initialEdges,
    timestamp: Date.now()
  }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get current state
  const currentState = history[currentIndex];
  
  // Check if undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  // Update workflow with new state
  const updateWorkflow = useCallback((nodes: Node[], edges: Edge[]) => {
    const newState: WorkflowState = {
      nodes,
      edges,
      timestamp: Date.now()
    };
    
    setHistory(prev => {
      // Remove any future states if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => prev - 1);
      }
      
      return newHistory;
    });
    
    setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
  }, [currentIndex, maxHistorySize]);
  
  // Undo last change
  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [canUndo]);
  
  // Redo last undone change
  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canRedo]);
  
  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([{
      nodes: [],
      edges: [],
      timestamp: Date.now()
    }]);
    setCurrentIndex(0);
  }, []);
  
  return {
    currentState,
    canUndo,
    canRedo,
    updateWorkflow,
    undo,
    redo,
    clearHistory
  };
} 
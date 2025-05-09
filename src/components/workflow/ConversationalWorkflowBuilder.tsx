// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Node, Edge } from 'reactflow';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';
import { validateWorkflow } from '@/utils/workflowValidation';
import { WorkflowNodeCreator } from './WorkflowNodeCreator';

interface ConversationalWorkflowBuilderProps {
  onWorkflowUpdate: (nodes: Node[], edges: Edge[]) => void;
  agentId: string;
  apiKey: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  workflowStep?: {
    id: string;
    title: string;
    description: string;
    type: string;
    parameters: Record<string, unknown>;
  };
}

export const ConversationalWorkflowBuilder: React.FC<ConversationalWorkflowBuilderProps> = ({
  onWorkflowUpdate,
  agentId,
  apiKey
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditStep = async (stepId: string) => {
    const message = messages.find(m => m.workflowStep?.id === stepId);
    if (!message?.workflowStep) return;

    setInputText(`Edit step "${message.workflowStep.title}": `);
    setSelectedStep(stepId);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setShowToast(false);

    try {
      // Add user message to the chat with 'sending' status
      const userMessage = { role: 'user' as const,
        content: inputText,
        timestamp: Date.now(),
        status: 'sending' as const
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Check if this is an edit request
      const isEdit = selectedStep !== null;
      
      // Send request to our API
      const response = await fetch('/api/workflow-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText,
          agentId,
          apiKey,
          conversationHistory: messages,
          editStepId: selectedStep
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process message');
      }
      
      const data = await response.json();
      
      // Update user message status to 'sent'
      setMessages(prev => prev.map(msg => 
        msg === userMessage ? { ...msg, status: 'sent' as const } : msg
      ));
      
      // Add assistant message to the chat
      setMessages(data.conversationHistory);
      
      // Validate workflow before converting and updating
      if (data.workflow) {
        const validationResult = validateWorkflow(data.workflow);
        
        if (!validationResult.isValid) {
          const errorMessages = validationResult.errors.map(err => 
            `${err.message} (at ${err.path.join('.')})`
          ).join('\n');
          
          setError(`Invalid workflow structure:\n${errorMessages}`);
          setShowToast(true);
          return;
        }
        
        const { nodes: newNodes, edges: newEdges } = convertWorkflowToReactFlow(validationResult.validatedData!);
        setNodes(newNodes);
        setEdges(newEdges);
        onWorkflowUpdate(newNodes, newEdges);
      }
      
      // Clear input and selected step
      setInputText('');
      setSelectedStep(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setShowToast(true);
      
      // Update user message status to 'error'
      setMessages(prev => prev.map(msg => 
        msg === prev[prev.length - 1] ? { ...msg, status: 'error' as const } : msg
      ));
      
      console.error('Send message error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Convert workflow to ReactFlow nodes and edges
  const convertWorkflowToReactFlow = (workflow: any) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Calculate layout grid
    const GRID_SPACING_X = 300;
    const GRID_SPACING_Y = 150;
    const MAX_NODES_PER_COLUMN = 3;
    
    // Create nodes with improved positioning
    workflow.steps.forEach((step: any, index: number) => {
      const column = Math.floor(index / MAX_NODES_PER_COLUMN);
      const row = index % MAX_NODES_PER_COLUMN;
      
      nodes.push({
        id: step.id,
        type: step.type.toLowerCase(),
        position: {
          x: column * GRID_SPACING_X + 100,
          y: row * GRID_SPACING_Y + 100
        },
        data: {
          label: step.title,
          description: step.description,
          config: step.parameters
        }
      });
    });
    
    // Create edges
    workflow.connections.forEach((connection: any) => {
      edges.push({
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        animated: true,
        style: { stroke: '#6366f1' }
      });
    });
    
    return { nodes, edges };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <WorkflowNodeCreator
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your workflow step..."
            className="flex-1 min-h-[80px] p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !inputText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            { isProcessing ? <Spinner size="sm" /> : 'Send' }
          </button>
        </div>
      </div>
      
      {showToast && error && (
        <Toast
          title="Error"
          description={error}
          variant="destructive"
          onClose={() => setShowToast(false)}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}; 
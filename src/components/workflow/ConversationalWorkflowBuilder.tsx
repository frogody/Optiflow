'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Node, Edge } from 'reactflow';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';
import { validateWorkflow } from '@/utils/workflowValidation';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const userMessage = {
        role: 'user' as const,
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
        headers: {
          'Content-Type': 'application/json'
        },
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
        
        const { nodes, edges } = convertWorkflowToReactFlow(validationResult.validatedData!);
        onWorkflowUpdate(nodes, edges);
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
      
      // Determine node type and style
      let nodeType = 'default';
      let nodeStyle = {};
      
      switch (step.type.toLowerCase()) {
        case 'trigger':
          nodeType = 'input';
          nodeStyle = { background: '#e0f2fe', borderColor: '#60a5fa' };
          break;
        case 'condition':
          nodeType = 'condition';
          nodeStyle = { background: '#fef3c7', borderColor: '#fbbf24' };
          break;
        case 'action':
          nodeType = 'default';
          nodeStyle = { background: '#dcfce7', borderColor: '#34d399' };
          break;
        case 'api':
          nodeType = 'api';
          nodeStyle = { background: '#f3e8ff', borderColor: '#a855f7' };
          break;
        case 'database':
          nodeType = 'database';
          nodeStyle = { background: '#fee2e2', borderColor: '#f87171' };
          break;
        default:
          nodeType = 'default';
          nodeStyle = { background: '#f3f4f6', borderColor: '#9ca3af' };
      }
      
      nodes.push({
        id: step.id,
        type: nodeType,
        position: {
          x: column * GRID_SPACING_X + 100,
          y: row * GRID_SPACING_Y + 100
        },
        data: {
          label: step.title,
          description: step.description,
          settings: {
            ...step.parameters,
            nodeType: step.type,
            customStyle: nodeStyle
          }
        },
        style: nodeStyle
      });
      
      // Create edges with improved types
      step.edges.forEach((edge: any) => {
        let edgeType = 'default';
        let edgeStyle = {};
        
        switch (edge.edge_type.toLowerCase()) {
          case 'success':
            edgeType = 'success';
            edgeStyle = { stroke: '#34d399', strokeWidth: 2 };
            break;
          case 'failure':
            edgeType = 'failure';
            edgeStyle = { stroke: '#f87171', strokeWidth: 2 };
            break;
          case 'condition_true':
            edgeType = 'conditionTrue';
            edgeStyle = { stroke: '#60a5fa', strokeWidth: 2 };
            break;
          case 'condition_false':
            edgeType = 'conditionFalse';
            edgeStyle = { stroke: '#f97316', strokeWidth: 2 };
            break;
          default:
            edgeType = 'default';
            edgeStyle = { stroke: '#9ca3af', strokeWidth: 2 };
        }
        
        edges.push({
          id: `${step.id}-${edge.target_node_id}`,
          source: step.id,
          target: edge.target_node_id,
          type: edgeType,
          animated: edge.edge_type === 'async',
          style: edgeStyle,
          data: {
            label: edge.edge_type,
            description: edge.description
          }
        });
      });
    });
    
    return { nodes, edges };
  };

  return (
    <div className="conversational-workflow-builder flex flex-col h-full">
      <div className="chat-container flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Start a conversation with the agent to build your workflow</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message mb-4 p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-auto max-w-[80%]' 
                  : 'bg-white border border-gray-200 max-w-[80%]'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">
                  {message.role === 'user' ? 'You' : 'Agent'}
                </p>
                {message.role === 'user' && message.status && (
                  <span className={`text-xs ${
                    message.status === 'sending' ? 'text-gray-500' :
                    message.status === 'sent' ? 'text-green-500' :
                    'text-red-500'
                  }`}>
                    {message.status === 'sending' ? 'Sending...' :
                     message.status === 'sent' ? 'Sent' :
                     'Failed'}
                  </span>
                )}
              </div>
              <p className="text-gray-800">{message.content}</p>
              
              {/* Show workflow step details if available */}
              {message.workflowStep && (
                <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm">{message.workflowStep.title}</h4>
                    <button
                      onClick={() => handleEditStep(message.workflowStep!.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.workflowStep.description}</p>
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-500">Type: </span>
                    <span className="text-xs text-gray-700">{message.workflowStep.type}</span>
                  </div>
                  {Object.entries(message.workflowStep.parameters).map(([key, value]) => (
                    <div key={key} className="mt-1">
                      <span className="text-xs font-medium text-gray-500">{key}: </span>
                      <span className="text-xs text-gray-700">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {showToast && error && (
        <Toast
          type="error"
          message={error}
          onClose={() => setShowToast(false)}
          className="mb-4"
        />
      )}
      
      <div className="input-container flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedStep ? "Describe how you want to modify this step..." : "Type your message..."}
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isProcessing}
        />
        <button
          onClick={handleSendMessage}
          disabled={isProcessing || !inputText.trim()}
          className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
        >
          {isProcessing ? (
            <Spinner className="w-5 h-5" />
          ) : (
            selectedStep ? 'Update' : 'Send'
          )}
        </button>
      </div>
    </div>
  );
}; 
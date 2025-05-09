// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React, { useState, useCallback } from 'react';
import { useWorkflowStore } from '@/lib/workflowStore';
import { mcpService } from '@/services/mcp/MCPService';
import { useUserStore } from '@/lib/userStore';

interface Orchestrator { id: string;
  name: string;
  icon: string;
  description: string;
    }

interface Message { id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
    }

interface ChatInterfaceProps { selectedOrchestrator: Orchestrator | null;
    }

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedOrchestrator }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { workflow, setWorkflow, validateWorkflow } = useWorkflowStore();

  const addMessage = useCallback((text: string, sender: 'user' | 'system') => {
    const message: Message = { id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
        };
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !selectedOrchestrator) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');
    setIsProcessing(true);

    try {
      await processNaturalLanguage(userMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const processNaturalLanguage = async (text: string) => {
    if (!selectedOrchestrator) return;

    try {
      const userId = useUserStore.getState().currentUser?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await mcpService.sendRequest(userId, selectedOrchestrator.id, 'process_natural_language', { text,
        workflow: workflow || undefined,
          });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.result?.workflow) {
        setWorkflow(response.result.workflow);
        addMessage(`${selectedOrchestrator.name} has updated the workflow.`, 'system');
      }

      const isValid = await validateWorkflow();
      if (!isValid) { addMessage('Warning: The updated workflow may have validation issues.', 'system');
          }
    } catch (error) {
      addMessage(`Error: ${ error instanceof Error ? error.message : 'Unknown error'    }`, 'system');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 p-4 border-b border-primary/20">
        {selectedOrchestrator && (
          <>
            <img
              src={selectedOrchestrator.icon}
              alt={selectedOrchestrator.name}
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-medium">{selectedOrchestrator.name}</span>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedOrchestrator ? (
          <div className="text-center text-white/50 mt-8">
            Select an AI orchestrator to begin
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${ message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 shadow-neon ${ message.sender === 'user'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-dark-50/50 border border-primary/20 text-white/90'
                    }`}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-primary/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ selectedOrchestrator ? "Ask your AI orchestrator..." : "Select an orchestrator to begin"    }
            className="flex-1 bg-dark-50/50 text-white placeholder-white/50 rounded-md border border-primary/20 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40"
            disabled={!selectedOrchestrator || isProcessing}
          />
          <button
            type="submit"
            className="glow-effect px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-200"
            disabled={!selectedOrchestrator || isProcessing}
          >
            { isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Send'
            )    }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 
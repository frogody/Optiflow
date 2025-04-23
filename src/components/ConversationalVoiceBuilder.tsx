import React, { useState, useEffect, useCallback } from 'react';
import { VoiceCommandInput } from './VoiceCommandInput';
import { ConversationService } from '@/services/ConversationService';
import { VoiceCommandResponse } from '@/types/voice';
import { toast } from 'react-hot-toast';
import { Workflow, WorkflowNode, WorkflowEdge } from '@prisma/client';

interface ConversationalVoiceBuilderProps {
  initialWorkflow?: Workflow;
  onWorkflowUpdate?: (workflow: Partial<Workflow>) => void;
  onNodeUpdate?: (nodes: Partial<WorkflowNode>[]) => void;
  onEdgeUpdate?: (edges: Partial<WorkflowEdge>[]) => void;
}

export const ConversationalVoiceBuilder: React.FC<ConversationalVoiceBuilderProps> = ({
  initialWorkflow,
  onWorkflowUpdate,
  onNodeUpdate,
  onEdgeUpdate,
}) => {
  const [conversationService] = useState(() => new ConversationService({
    currentWorkflow: initialWorkflow,
  }));

  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);

  const handleCommand = useCallback(async (command: string) => {
    setIsProcessing(true);
    try {
      const response = await conversationService.processCommand(command);
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: command },
        { role: 'assistant', content: response.message },
      ]);

      // Handle workflow updates
      if (response.workflowUpdates && onWorkflowUpdate) {
        onWorkflowUpdate(response.workflowUpdates);
      }

      if (response.nodeUpdates && onNodeUpdate) {
        onNodeUpdate(response.nodeUpdates);
      }

      if (response.edgeUpdates && onEdgeUpdate) {
        onEdgeUpdate(response.edgeUpdates);
      }

      // Show follow-up question if needed
      if (response.followUpQuestion) {
        toast(response.followUpQuestion, {
          duration: 4000,
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error('Error processing command:', error);
      toast.error('Failed to process command. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [conversationService, onWorkflowUpdate, onNodeUpdate, onEdgeUpdate]);

  const handleError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <VoiceCommandInput
          onCommand={handleCommand}
          onError={handleError}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}; 
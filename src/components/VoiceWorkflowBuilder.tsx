import React, { useCallback, useEffect, useState } from 'react';
import { VoiceCommandInput } from './VoiceCommandInput';
import { useToast } from '@/hooks/useToast';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useSession } from 'next-auth/react';
import { useVoiceStore } from '@/stores/voiceStore';

interface VoiceWorkflowBuilderProps {
  workflowId?: string;
  onWorkflowUpdate?: () => void;
}

export const VoiceWorkflowBuilder: React.FC<VoiceWorkflowBuilderProps> = ({
  workflowId,
  onWorkflowUpdate,
}) => {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    setActiveConversation,
    addMessage,
    isProcessingCommand,
    lastCommandResult,
  } = useVoiceStore();

  const {
    addNode,
    connectNodes,
    updateNodeConfig,
    selectedNode,
    nodes,
    edges,
  } = useWorkflowStore();

  const handleVoiceCommand = useCallback(async (command: string) => {
    if (!session?.user?.id) {
      showToast('error', 'Please sign in to use voice commands');
      return;
    }

    setIsProcessing(true);
    try {
      // Create a new voice interaction
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          workflowId,
          context: {
            selectedNodeId: selectedNode?.id,
            nodes: nodes.map(node => ({
              id: node.id,
              type: node.type,
              position: { x: node.position.x, y: node.position.y },
            })),
            edges: edges.map(edge => ({
              id: edge.id,
              source: edge.source,
              target: edge.target,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process voice command');
      }

      const result = await response.json();
      
      // Add the command to the conversation
      addMessage({
        role: 'user',
        content: command,
      });

      // Add the response to the conversation
      addMessage({
        role: 'assistant',
        content: result.response,
      });

      // Execute the workflow modifications
      if (result.actions) {
        for (const action of result.actions) {
          switch (action.type) {
            case 'ADD_NODE':
              addNode({
                type: action.nodeType,
                position: action.position,
                data: action.config,
              });
              break;
            case 'CONNECT_NODES':
              connectNodes(action.sourceId, action.targetId);
              break;
            case 'UPDATE_NODE':
              updateNodeConfig(action.nodeId, action.config);
              break;
          }
        }
      }

      if (onWorkflowUpdate) {
        onWorkflowUpdate();
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      showToast('error', 'Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  }, [
    session?.user?.id,
    workflowId,
    selectedNode,
    nodes,
    edges,
    addNode,
    connectNodes,
    updateNodeConfig,
    showToast,
    addMessage,
    onWorkflowUpdate,
  ]);

  const handleError = useCallback((error: string) => {
    showToast('error', error);
  }, [showToast]);

  return (
    <div className="flex flex-col space-y-4">
      <VoiceCommandInput
        onCommand={handleVoiceCommand}
        onError={handleError}
        disabled={isProcessing || !session?.user?.id}
      />
      
      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {lastCommandResult && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Last Command Result
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {lastCommandResult}
          </p>
        </div>
      )}
    </div>
  );
}; 
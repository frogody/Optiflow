import React, { useState, useCallback } from 'react';
import { VoiceCommandInput } from './VoiceCommandInput';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { useVoiceStore } from '@/stores/voiceStore';
import { useSession } from 'next-auth/react';

interface OrchestratorInputProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
  workflowId?: string;
}

export const OrchestratorInput: React.FC<OrchestratorInputProps> = ({
  onCommand,
  disabled = false,
  workflowId,
}) => {
  const { data: session } = useSession();
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    addMessage,
    setActiveConversation,
    lastCommandResult,
  } = useVoiceStore();

  const handleTextCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    try {
      // Add the command to the conversation
      addMessage({
        role: 'user',
        content: inputValue.trim(),
      });

      await onCommand(inputValue.trim());
      setInputValue('');
    } catch (error) {
      toast.error('Failed to process command');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceCommand = useCallback(async (command: string) => {
    if (!session?.user?.id) {
      toast.error('Please sign in to use voice commands');
      return;
    }

    setIsProcessing(true);
    try {
      // Process the voice command
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          workflowId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process voice command');
      }

      const result = await response.json();
      
      // Add the command and response to the conversation
      addMessage({
        role: 'user',
        content: command,
      });
      addMessage({
        role: 'assistant',
        content: result.response,
      });

      // Execute the command
      await onCommand(command);
      
      setShowVoiceInput(false);
      toast.success('Voice command processed!');
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast.error('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  }, [session?.user?.id, workflowId, onCommand, addMessage]);

  const handleVoiceError = useCallback((error: string) => {
    toast.error(error);
    setShowVoiceInput(false);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {showVoiceInput ? (
        <VoiceCommandInput
          onCommand={handleVoiceCommand}
          onError={handleVoiceError}
          disabled={disabled || isProcessing}
        />
      ) : (
        <form onSubmit={handleTextCommand} className="flex items-center space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell the orchestrator what to do..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            disabled={disabled || isProcessing}
          />
          <button
            type="button"
            onClick={() => setShowVoiceInput(true)}
            disabled={disabled || isProcessing}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            aria-label="Use voice input"
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
          <button
            type="submit"
            disabled={disabled || isProcessing || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Send'}
          </button>
        </form>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        </div>
      )}

      {lastCommandResult && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {lastCommandResult}
          </p>
        </div>
      )}
    </div>
  );
}; 
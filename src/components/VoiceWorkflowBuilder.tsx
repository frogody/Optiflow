'use client';

import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { parseCommand } from '@/lib/workflow/commandParser';
import { CommandType, WorkflowCommand, WorkflowState } from '@/types/workflow';

import { VoiceCommandInput } from './VoiceCommandInput';
import { FlowEditor } from './workflow/FlowEditor';


export default function VoiceWorkflowBuilder(): JSX.Element {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({ currentWorkflow: null,
    selectedNode: null,
    isRunning: false,
    error: null,
      });

  const handleCommand = useCallback((transcript: string) => {
    const command = parseCommand(transcript);
    if (!command) {
      toast.error('Command not recognized');
      return;
    }

    try {
      switch (command.type) {
        case CommandType.CREATE_NODE:
          if (!command.nodeType) break;
          // Add node logic
          toast.success(`Creating ${command.nodeType} node`);
          break;

        case CommandType.CONNECT_NODES:
          if (!command.sourceNode || !command.targetNode) break;
          // Connect nodes logic
          toast.success(`Connecting ${command.sourceNode} to ${command.targetNode}`);
          break;

        case CommandType.DELETE_NODE:
          if (!command.nodeName) break;
          // Delete node logic
          toast.success(`Deleting ${command.nodeName} node`);
          break;

        case CommandType.RENAME_NODE:
          if (!command.nodeName || !command.newName) break;
          // Rename node logic
          toast.success(`Renaming ${command.nodeName} to ${command.newName}`);
          break;

        case CommandType.CONFIGURE_NODE:
          if (!command.nodeName) break;
          // Configure node logic
          toast.success(`Configuring ${command.nodeName} node`);
          break;

        case CommandType.SAVE_WORKFLOW:
          // Save workflow logic
          toast.success('Saving workflow');
          break;

        case CommandType.LOAD_WORKFLOW:
          if (!command.workflowName) break;
          // Load workflow logic
          toast.success(`Loading workflow ${command.workflowName}`);
          break;

        case CommandType.RUN_WORKFLOW:
          // Run workflow logic
          setWorkflowState(prev => ({ ...prev, isRunning: true     }));
          toast.success('Running workflow');
          break;

        case CommandType.STOP_WORKFLOW:
          // Stop workflow logic
          setWorkflowState(prev => ({ ...prev, isRunning: false     }));
          toast.success('Stopping workflow');
          break;

        default:
          toast.error('Unknown command');
      }
    } catch (error) {
      toast.error('Error executing command');
      setWorkflowState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Unknown error'     }));
    }
  }, []);

  const handleError = useCallback((error: string) => {
    toast.error(`Voice recognition error: ${error}`);
    setWorkflowState(prev => ({ ...prev, error }));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none p-4 bg-gray-100 dark:bg-gray-800">
        <VoiceCommandInput
          onCommand={handleCommand}
          onError={handleError}
          disabled={workflowState.isRunning}
        />
      </div>
      
      <div className="flex-grow">
        <FlowEditor
          workflow={workflowState.currentWorkflow}
          isRunning={workflowState.isRunning}
          selectedNode={workflowState.selectedNode}
          onNodeSelect={(nodeId) => setWorkflowState(prev => ({ ...prev, selectedNode: nodeId     }))}
        />
      </div>

      {workflowState.error && (
        <div className="flex-none p-4 bg-red-100 dark:bg-red-900">
          <p className="text-red-600 dark:text-red-300">{workflowState.error}</p>
        </div>
      )}
    </div>
  );
} 
'use client';

import React, { useEffect, useState } from 'react';

import { useUserStore } from '@/lib/userStore';
import type { ToolConnection } from '@/lib/userStore';
import { mcpService } from '@/services/mcp/MCPService';

interface Tool {
  name: string;
  description: string;
  isConnected: boolean;
}

interface OrchestratorSetupProps {
  orchestrator: {
    id: string;
    name: string;
    icon: string;
  };
  onSetupComplete: () => void;
}

const getRequiredTools = (orchestratorId: string): Tool[] => {
  switch (orchestratorId) {
    case 'aora':
      return [
        { name: 'Clay',
          description: 'Used for gathering and enriching prospect data',
          isConnected: false
            },
        { name: 'LindyAI',
          description: 'Provides AI-powered decision making capabilities',
          isConnected: false
            },
        { name: 'n8n',
          description: 'Handles workflow automation and integrations',
          isConnected: false
            }
      ];
    // Add cases for other orchestrators here
    default:
      return [];
  }
};

const OrchestratorSetup: React.FC<OrchestratorSetupProps> = ({ orchestrator, onSetupComplete }) => {
  const { currentUser, getEnvironment } = useUserStore();
  const [mcpStatus, setMcpStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [tools, setTools] = useState<Tool[]>(getRequiredTools(orchestrator.id));
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Redirect to login if no user
  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
  }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  const checkToolConnections = async () => {
    if (!currentUser) return;

    try {
      const toolsResponse = await mcpService.sendRequest(
        currentUser.id,
        orchestrator.id,
        'check_tools',
        {}
      );

      if (toolsResponse.result?.tools) {
        const environment = getEnvironment(currentUser.id);
        const updatedTools = tools.map(tool => {
          const toolConnection = environment?.toolConnections[tool.name.toLowerCase()];
          return { ...tool,
            isConnected: toolConnection?.connected || false
              };
        });
        setTools(updatedTools);
        
        if (updatedTools.every(tool => tool.isConnected)) {
          setMcpStatus('connected');
        }
      }
    } catch (error) { console.error('Failed to check tool connections:', error);
        }
  };

  useEffect(() => {
    if (!currentUser) return;

    const checkConnections = async () => {
      try {
        const mcpResponse = await mcpService.sendRequest(
          currentUser.id,
          orchestrator.id,
          'check_connection',
          {}
        );

        if (mcpResponse.error) {
          throw new Error(mcpResponse.error.message);
        }

        const environment = getEnvironment(currentUser.id);
        const mcpConnection = environment?.mcpConnections[orchestrator.id];
        setMcpStatus(mcpConnection?.status || 'connecting');
        
        await checkToolConnections();
      } catch (error) { setMcpStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to MCP server');
          }
    };

    checkConnections();

    const pollInterval = setInterval(checkToolConnections, 3000);
    return () => clearInterval(pollInterval);
  }, [currentUser, orchestrator.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-2xl mx-auto w-full px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={orchestrator.icon}
              alt={orchestrator.name}
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">{orchestrator.name} Setup</h2>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${ mcpStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                  mcpStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                    }`} />
                <span className={`text-sm ${ mcpStatus === 'error' ? 'text-red-400' : 'text-white/60'    }`}>
                  { mcpStatus === 'connected' ? 'MCP server connected' :
                   mcpStatus === 'connecting' ? 'Connecting to MCP server...' :
                   'MCP server connection error'    }
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/60">
            {currentUser.email}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-950/30 border border-red-500/20 rounded-md text-red-400 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Tools Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-white mb-4">Required Tools</h3>
          <div className="space-y-3">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between p-4 bg-dark-100/50 rounded-md border border-primary/10"
              >
                <div>
                  <h4 className="text-white font-medium">{tool.name}</h4>
                  <p className="text-sm text-white/60">{tool.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className={`w-2 h-2 rounded-full ${ tool.isConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                      }`} />
                  <span className="text-sm text-white/60">
                    { tool.isConnected ? 'Connected' : 'Not connected'    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onSetupComplete}
            disabled={!tools.some(tool => tool.isConnected)}
            className="px-6 py-2 text-sm font-medium text-primary/80 bg-dark-100/50 rounded-md border border-primary/20 hover:text-primary hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-200"
          >
            { tools.some(tool => tool.isConnected) ? 'Continue to Workflow' : 'Waiting for Connection...'    }
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrchestratorSetup; 
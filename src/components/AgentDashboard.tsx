import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import MCPContextDisplay from './MCPContextDisplay';

import { useAgentOrchestrator } from '@/hooks/useAgentOrchestrator';
import { useMCPContext } from '@/hooks/useMCPContext';
import { useUserStore } from '@/lib/userStore';
import { Agent, Flow } from '@/services/AgentOrchestratorService';

export default function AgentDashboard(): JSX.Element {
  const { currentUser } = useUserStore();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [isCreatingFlow, setIsCreatingFlow] = useState(false);
  const [newFlowData, setNewFlowData] = useState<Partial<Omit<Flow, 'id'>>>({ name: '',
    description: '',
    status: 'draft',
    triggerApp: '',
    actionApps: [],
    executionCount: 0
      });
  
  // Use our hooks
  const { agents,
    selectedAgent,
    isLoading: isAgentLoading,
    error: agentError,
    selectAgent,
    startAgent,
    stopAgent,
    executeFlow,
    createFlow
      } = useAgentOrchestrator();
  
  const { models,
    selectedModel,
    isLoading: isModelLoading,
    selectModel,
    optimizeContext,
    clearContext
      } = useMCPContext({ modelId: selectedAgent?.modelId 
      });
  
  // Handle agent selection
  const handleAgentSelect = (agentId: string) => {
    selectAgent(agentId);
    setSelectedFlowId(null);
  };
  
  // Handle starting an agent
  const handleStartAgent = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to start an agent');
      return;
    }
    
    const result = await startAgent();
    if (result) {
      toast.success(`Agent ${result.name} started successfully`);
    }
  };
  
  // Handle stopping an agent
  const handleStopAgent = async () => {
    const result = await stopAgent();
    if (result) {
      toast.success(`Agent ${result.name} stopped successfully`);
    }
  };
  
  // Handle executing a flow
  const handleExecuteFlow = async (flowId: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to execute a flow');
      return;
    }
    
    const success = await executeFlow(flowId);
    if (success) {
      toast.success('Flow executed successfully');
    }
  };
  
  // Handle creating a new flow
  const handleCreateFlow = async () => {
    if (!newFlowData.name || !newFlowData.triggerApp || newFlowData.actionApps?.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const flow = await createFlow(newFlowData as Omit<Flow, 'id'>);
    if (flow) {
      toast.success(`Flow ${flow.name} created successfully`);
      setIsCreatingFlow(false);
      setNewFlowData({ name: '',
        description: '',
        status: 'draft',
        triggerApp: '',
        actionApps: [],
        executionCount: 0
          });
    }
  };
  
  // Handle context optimization
  const handleOptimizeContext = async () => {
    await optimizeContext();
    toast.success('Context optimized successfully');
  };
  
  // Handle context clearing
  const handleClearContext = async () => {
    await clearContext();
    toast.success('Context cleared successfully');
  };
  
  // Handle adding an action app to the new flow
  const handleAddActionApp = () => {
    setNewFlowData({ ...newFlowData,
      actionApps: [...(newFlowData.actionApps || []), '']
        });
  };
  
  // Handle updating an action app in the new flow
  const handleUpdateActionApp = (index: number, value: string) => {
    const updatedActionApps = [...(newFlowData.actionApps || [])];
    updatedActionApps[index] = value;
    setNewFlowData({ ...newFlowData,
      actionApps: updatedActionApps
        });
  };
  
  if (isAgentLoading || isModelLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (agentError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{agentError.message}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold gradient-text">AI Agent Orchestration</h1>
      <p className="text-gray-400">
        Manage your AI agents that orchestrate workflows through Model Context Protocol
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List */}
        <div className="lg:col-span-1">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Agents</h2>
            <div className="space-y-3">
              {agents.length === 0 ? (
                <div className="text-white/60 text-center py-4">
                  No agents available
                </div>
              ) : (
                agents.map(agent => (
                  <div 
                    key={agent.id}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${ selectedAgent?.id === agent.id
                        ? 'bg-white/10 border-primary/50'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                          }`}
                    onClick={() => handleAgentSelect(agent.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{agent.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${ agent.status === 'running' ? 'bg-green-500/20 text-green-400' :
                          agent.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-white/10 text-white/60'
                            }`}
                      >
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">{agent.description}</p>
                    <div className="mt-2 flex items-center text-xs text-white/40">
                      <span className="mr-3">Model: {agent.modelId}</span>
                      <span>{agent.flows.length} flows</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Agent Details and Flows */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <div className="space-y-6">
              <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedAgent.name}</h2>
                    <p className="text-white/60 mt-1">{selectedAgent.description}</p>
                  </div>
                  <div className="flex space-x-3">
                    {selectedAgent.status === 'idle' ? (
                      <button
                        onClick={handleStartAgent}
                        className="px-3 py-1 text-sm text-white bg-green-600/80 rounded-md hover:bg-green-600 transition-all duration-200"
                      >
                        Start Agent
                      </button>
                    ) : selectedAgent.status === 'running' ? (
                      <button
                        onClick={handleStopAgent}
                        className="px-3 py-1 text-sm text-white bg-red-600/80 rounded-md hover:bg-red-600 transition-all duration-200"
                      >
                        Stop Agent
                      </button>
                    ) : (
                      <button
                        onClick={handleStartAgent}
                        className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
                      >
                        Restart Agent
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-white/60 mb-1">Status</div>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2
                        ${ selectedAgent.status === 'running' ? 'bg-green-500' :
                          selectedAgent.status === 'error' ? 'bg-red-500' :
                          'bg-yellow-500'
                            }`}
                      ></span>
                      <span className="text-white">
                        {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-white/60 mb-1">Model</div>
                    <div className="text-white">{selectedAgent.modelId}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-white/60 mb-1">Last Run</div>
                    <div className="text-white">
                      { selectedAgent.lastRun 
                        ? new Date(selectedAgent.lastRun).toLocaleString() 
                        : 'Never'    }
                    </div>
                  </div>
                </div>
                
                {selectedAgent.error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">
                    <div className="font-medium mb-1">Error</div>
                    {selectedAgent.error}
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-white font-medium mb-2">Connected Apps</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.connectedApps.map(app => (
                      <span 
                        key={app}
                        className="px-2 py-0.5 bg-white/10 text-white/80 rounded-md text-xs"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Flows</h3>
                    <button
                      onClick={() => setIsCreatingFlow(true)}
                      className="px-2 py-1 text-xs text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
                    >
                      Create Flow
                    </button>
                  </div>
                  
                  {/* Flow Creation Form */}
                  <AnimatePresence>
                    {isCreatingFlow && (
                      <motion.div
                        initial={{ height: 0, opacity: 0     }}
                        animate={{ height: 'auto', opacity: 1     }}
                        exit={{ height: 0, opacity: 0     }}
                        className="mb-4 bg-black/30 rounded-lg border border-white/10 p-4 overflow-hidden"
                      >
                        <h4 className="text-white font-medium mb-3">Create New Flow</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Name</label>
                            <input
                              type="text"
                              value={newFlowData.name}
                              onChange={(e) => setNewFlowData({ ...newFlowData, name: e.target.value     })}
                              className="w-full bg-black/30 text-white border border-white/20 rounded-md px-3 py-1 text-sm"
                              placeholder="Flow name"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Description</label>
                            <input
                              type="text"
                              value={newFlowData.description}
                              onChange={(e) => setNewFlowData({ ...newFlowData, description: e.target.value     })}
                              className="w-full bg-black/30 text-white border border-white/20 rounded-md px-3 py-1 text-sm"
                              placeholder="Flow description"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Trigger App</label>
                            <select
                              value={newFlowData.triggerApp}
                              onChange={(e) => setNewFlowData({ ...newFlowData, triggerApp: e.target.value     })}
                              className="w-full bg-black/30 text-white border border-white/20 rounded-md px-3 py-1 text-sm"
                              aria-label="Select Trigger App"
                            >
                              <option value="">Select Trigger App</option>
                              {selectedAgent.connectedApps.map(app => (
                                <option key={app} value={app}>{app}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Action Apps</label>
                            {(newFlowData.actionApps || []).map((app, index) => (
                              <div key={index} className="flex items-center space-x-2 mb-2">
                                <select
                                  value={app}
                                  onChange={(e) => handleUpdateActionApp(index, e.target.value)}
                                  className="w-full bg-black/30 text-white border border-white/20 rounded-md px-3 py-1 text-sm"
                                  aria-label={`Select Action App ${index + 1}`}
                                >
                                  <option value="">Select Action App</option>
                                  {selectedAgent.connectedApps
                                    .filter(a => a !== newFlowData.triggerApp)
                                    .map(app => (
                                      <option key={app} value={app}>{app}</option>
                                    ))
                                  }
                                </select>
                              </div>
                            ))}
                            <button
                              onClick={handleAddActionApp}
                              className="text-primary text-xs hover:underline"
                            >
                              + Add Action App
                            </button>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm mb-1">Status</label>
                            <select
                              value={newFlowData.status}
                              onChange={(e) => setNewFlowData({ ...newFlowData, status: e.target.value as Flow['status']     })}
                              className="w-full bg-black/30 text-white border border-white/20 rounded-md px-3 py-1 text-sm"
                              aria-label="Select Flow Status"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-3 pt-2">
                            <button
                              onClick={() => setIsCreatingFlow(false)}
                              className="px-3 py-1 text-sm text-white/80 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition-all duration-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleCreateFlow}
                              className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
                            >
                              Create Flow
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Flow List */}
                  <div className="space-y-3">
                    {selectedAgent.flows.length === 0 ? (
                      <div className="text-white/60 text-center py-4 bg-black/20 rounded-lg border border-white/5">
                        No flows available. Create your first flow.
                      </div>
                    ) : (
                      selectedAgent.flows.map(flow => (
                        <div 
                          key={flow.id}
                          className={`p-4 rounded-lg border transition-all duration-200
                            ${ selectedFlowId === flow.id
                              ? 'bg-white/10 border-primary/50'
                              : 'bg-black/30 border-white/5 hover:border-white/20'
                                }`}
                          onClick={() => setSelectedFlowId(flow.id)}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">{flow.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                              ${ flow.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                flow.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-yellow-500/20 text-yellow-400'
                                  }`}
                            >
                              {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm mt-1">{flow.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-xs text-white/40">
                              <span className="mr-3">Trigger: {flow.triggerApp}</span>
                              <span>Actions: {flow.actionApps.join(', ')}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExecuteFlow(flow.id);
                              }}
                              className="px-2 py-0.5 text-xs text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
                              disabled={selectedAgent.status !== 'running'}
                            >
                              Execute
                            </button>
                          </div>
                          {flow.lastExecuted && (
                            <div className="mt-2 text-xs text-white/40 flex justify-between">
                              <span>Last run: {new Date(flow.lastExecuted).toLocaleString()}</span>
                              <span>Runs: {flow.executionCount} | Avg. time: {flow.averageExecutionTime?.toFixed(1)}s</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              {/* Model Context Display */}
              {selectedModel && (
                <div>
                  <MCPContextDisplay 
                    models={models} 
                    selectedModelId={selectedModel.modelId} 
                    onModelSelect={selectModel}
                  />
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={handleOptimizeContext}
                      className="px-3 py-1 text-sm text-white/80 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      Optimize Context
                    </button>
                    <button
                      onClick={handleClearContext}
                      className="px-3 py-1 text-sm text-white/80 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      Clear Context
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-6 flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-white/60">Select an agent to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
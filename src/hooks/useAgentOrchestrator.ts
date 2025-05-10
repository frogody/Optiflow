import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useUserStore } from '@/lib/userStore';
import {
  Agent,
  AgentOrchestratorService,
  Flow,
} from '@/services/AgentOrchestratorService';
import { ModelContext } from '@/services/MCPContextService';

interface UseAgentOrchestratorOptions {
  agentId?: string;
  autoLoad?: boolean;
}

export function useAgentOrchestrator({
  agentId,
  autoLoad = true,
}: UseAgentOrchestratorOptions = {}) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useUserStore();

  // Get service instance
  const orchestratorService = AgentOrchestratorService.getInstance();

  // Load all agents
  const loadAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const availableAgents = orchestratorService.getAgents();
      setAgents(availableAgents);

      // Select the specified agent or the first one
      if (agentId) {
        const agent = availableAgents.find((a) => a.id === agentId);
        if (agent) {
          setSelectedAgent(agent);
        } else if (availableAgents.length > 0) {
          setSelectedAgent(availableAgents[0]);
        }
      } else if (availableAgents.length > 0) {
        setSelectedAgent(availableAgents[0]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load agents';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [orchestratorService, agentId]);

  // Load on mount if autoLoad is true
  useEffect(() => {
    if (autoLoad) {
      loadAgents();
    }
  }, [autoLoad, loadAgents]);

  // Select a different agent
  const selectAgent = useCallback(
    (agentId: string) => {
      const agent = agents.find((a) => a.id === agentId);
      if (agent) {
        setSelectedAgent(agent);
      } else {
        toast.error(`Agent ${agentId} not found`);
      }
    },
    [agents]
  );

  // Start the selected agent
  const startAgent = useCallback(async () => {
    if (!selectedAgent) {
      toast.error('No agent selected');
      return null;
    }

    if (!currentUser) {
      toast.error('You must be logged in to start an agent');
      return null;
    }

    try {
      setIsLoading(true);
      const updatedAgent = await orchestratorService.startAgent(
        selectedAgent.id,
        currentUser.id
      );

      if (updatedAgent) {
        // Update selected agent
        setSelectedAgent(updatedAgent);

        // Also update in the agents list
        setAgents(
          agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
        );

        return updatedAgent;
      }
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start agent';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [orchestratorService, selectedAgent, currentUser, agents]);

  // Stop the selected agent
  const stopAgent = useCallback(async () => {
    if (!selectedAgent) {
      toast.error('No agent selected');
      return null;
    }

    try {
      setIsLoading(true);
      const updatedAgent = await orchestratorService.stopAgent(
        selectedAgent.id
      );

      if (updatedAgent) {
        // Update selected agent
        setSelectedAgent(updatedAgent);

        // Also update in the agents list
        setAgents(
          agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
        );

        return updatedAgent;
      }
      return null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to stop agent';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [orchestratorService, selectedAgent, agents]);

  // Execute a specific flow
  const executeFlow = useCallback(
    async (flowId: string) => {
      if (!selectedAgent) {
        toast.error('No agent selected');
        return false;
      }

      if (!currentUser) {
        toast.error('You must be logged in to execute a flow');
        return false;
      }

      try {
        setIsLoading(true);
        const success = await orchestratorService.executeFlow(
          selectedAgent.id,
          flowId,
          currentUser.id
        );

        if (success) {
          // Reload agents to get updated flow stats
          await loadAgents();
        }

        return success;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to execute flow';
        setError(new Error(errorMessage));
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [orchestratorService, selectedAgent, currentUser, loadAgents]
  );

  // Create a new agent
  const createAgent = useCallback(
    async (agent: Omit<Agent, 'id'>) => {
      try {
        setIsLoading(true);
        const newAgent = await orchestratorService.createAgent(agent);

        // Update agents list
        setAgents([...agents, newAgent]);

        // Select the new agent
        setSelectedAgent(newAgent);

        return newAgent;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create agent';
        setError(new Error(errorMessage));
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [orchestratorService, agents]
  );

  // Create a new flow for the selected agent
  const createFlow = useCallback(
    async (flow: Omit<Flow, 'id'>) => {
      if (!selectedAgent) {
        toast.error('No agent selected');
        return null;
      }

      try {
        setIsLoading(true);
        const newFlow = await orchestratorService.createFlow(
          selectedAgent.id,
          flow
        );

        // Reload agents to get the updated agent with the new flow
        await loadAgents();

        return newFlow;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create flow';
        setError(new Error(errorMessage));
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [orchestratorService, selectedAgent, loadAgents]
  );

  // Get the context model for the selected agent
  const getAgentContext =
    useCallback(async (): Promise<ModelContext | null> => {
      if (!selectedAgent) {
        toast.error('No agent selected');
        return null;
      }

      try {
        const context = await orchestratorService.getAgentContext(
          selectedAgent.id
        );
        return context || null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to get agent context';
        setError(new Error(errorMessage));
        toast.error(errorMessage);
        return null;
      }
    }, [orchestratorService, selectedAgent]);

  // Update the model for the selected agent
  const updateAgentModel = useCallback(
    async (modelId: string) => {
      if (!selectedAgent) {
        toast.error('No agent selected');
        return null;
      }

      try {
        setIsLoading(true);
        const updatedAgent = await orchestratorService.updateAgentModel(
          selectedAgent.id,
          modelId
        );

        if (updatedAgent) {
          // Update selected agent
          setSelectedAgent(updatedAgent);

          // Also update in the agents list
          setAgents(
            agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
          );

          return updatedAgent;
        }
        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update agent model';
        setError(new Error(errorMessage));
        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [orchestratorService, selectedAgent, agents]
  );

  return {
    agents,
    selectedAgent,
    isLoading,
    error,
    loadAgents,
    selectAgent,
    startAgent,
    stopAgent,
    executeFlow,
    createAgent,
    createFlow,
    getAgentContext,
    updateAgentModel,
  };
}

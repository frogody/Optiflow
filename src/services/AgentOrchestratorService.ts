// Import types from PipedreamService
import { toast } from 'react-hot-toast';

import { pipedreamConfig } from '@/config/pipedream';

import { MCPContextService, ModelContext } from './MCPContextService';
import { PipedreamService } from './PipedreamService';


// Types for orchestration
export interface Agent {
  id: string;
  name: string;
  description: string;
  modelId: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  connectedApps: string[];
  capabilities: AgentCapability[];
  flows: Flow[];
  lastRun?: Date;
  error?: string;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'automation' | 'analysis' | 'communication';
  requiredPermissions: string[];
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  triggerApp: string;
  actionApps: string[];
  lastExecuted?: Date;
  executionCount: number;
  averageExecutionTime?: number;
}

// Mock data for agents
const MOCK_AGENTS: Agent[] = [
  {
    id: 'aora-agent',
    name: 'AORA',
    description: 'Autonomous Outreach & Research Automation-',
    modelId: 'gpt-4o',
    status: 'idle',
    connectedApps: ['HubSpot', 'Gmail'],
    capabilities: [
      { id: 'data-sync',
        name: 'Data Synchronization',
        description: 'AORA includes decision-maker mapping capabilities and CRM data enrichment with verified insights—far beyond human capabilities. This design integrates autonomous outreach management, inquiry response, and meeting booking with data-driven precision.',
        category: 'data',
        requiredPermissions: ['read', 'write']
          },
      { id: 'conflict-resolution',
        name: 'Conflict Resolution',
        description: 'Intelligently resolve data conflicts',
        category: 'data',
        requiredPermissions: ['read', 'write']
          }
    ],
    flows: [
      { id: 'hubspot-gmail-sync',
        name: 'HubSpot to Gmail Contact Sync',
        description: 'Syncs contacts from HubSpot to Gmail',
        status: 'active',
        triggerApp: 'HubSpot',
        actionApps: ['Gmail'],
        lastExecuted: new Date(Date.now() - 86400000), // 1 day ago
        executionCount: 157,
        averageExecutionTime: 1.8
          }
    ]
  },
  {
    id: 'close-agent',
    name: 'CLOSE',
    description: 'Conversational Lead Optimization & Smart Execution',
    modelId: 'claude-3.5-sonnet',
    status: 'idle',
    connectedApps: ['Clay', 'HubSpot'],
    capabilities: [
      { id: 'lead-enrichment',
        name: 'Lead Enrichment',
        description: 'CLOSE incorporates prospect interaction analysis, buying signal identification, and real-time guidance for representatives. This design features high-converting message creation with human-like nuance, objection anticipation, and deal velocity acceleration with strategic precision.',
        category: 'data',
        requiredPermissions: ['read', 'write']
          },
      { id: 'lead-scoring',
        name: 'Lead Scoring',
        description: 'Score leads based on likelihood to convert',
        category: 'analysis',
        requiredPermissions: ['read']
          }
    ],
    flows: [
      { id: 'clay-hubspot-enrichment',
        name: 'Clay to HubSpot Lead Enrichment',
        description: 'Enriches leads from Clay and sends to HubSpot',
        status: 'active',
        triggerApp: 'Clay',
        actionApps: ['HubSpot'],
        lastExecuted: new Date(Date.now() - 43200000), // 12 hours ago
        executionCount: 78,
        averageExecutionTime: 2.3
          }
    ]
  },
  {
    id: 'launch-agent',
    name: 'LAUNCH',
    description: 'Learn & Adapt User Navigated Customer-Handoff',
    modelId: 'gemini-pro',
    status: 'idle',
    connectedApps: ['n8n', 'HubSpot', 'Gmail'],
    capabilities: [
      { id: 'workflow-orchestration',
        name: 'Workflow Orchestration',
        description: 'LAUNCH incorporates personalized onboarding plan creation, technical setup automation, and role-specific training resource delivery. This design includes adoption metric monitoring, challenge identification, and time-to-value acceleration with methodical efficiency.',
        category: 'automation',
        requiredPermissions: ['admin']
          },
      { id: 'error-handling',
        name: 'Intelligent Error Handling',
        description: 'Automatically detect and recover from workflow errors',
        category: 'automation',
        requiredPermissions: ['admin']
          }
    ],
    flows: [
      { id: 'n8n-multi-service-flow',
        name: 'n8n Multi-Service Workflow',
        description: 'Coordinates workflows between multiple services via n8n',
        status: 'active',
        triggerApp: 'n8n',
        actionApps: ['HubSpot', 'Gmail'],
        lastExecuted: new Date(Date.now() - 7200000), // 2 hours ago
        executionCount: 42,
        averageExecutionTime: 5.7
          }
    ]
  },
  {
    id: 'nova-agent',
    name: 'NOVA',
    description: 'Next-Gen Outreach & Value Automation',
    modelId: 'claude-3-sonnet-20240229',
    status: 'idle',
    connectedApps: ['Slack', 'GitHub'],
    capabilities: [
      { id: 'performance-monitoring',
        name: 'Performance Monitoring',
        description: 'NOVA incorporates usage pattern monitoring, expansion opportunity detection, and churn risk identification with predictive analytics. This design features personalized communication management, customer health analysis, and account strategy optimization with relationship-focused intelligence.',
        category: 'analysis',
        requiredPermissions: ['read']
          },
      { id: 'anomaly-detection',
        name: 'Anomaly Detection',
        description: 'Identify unusual patterns in network traffic',
        category: 'analysis',
        requiredPermissions: ['read']
          }
    ],
    flows: [
      { id: 'github-slack-alerts',
        name: 'GitHub to Slack Alerts',
        description: 'Sends GitHub activity alerts to Slack channels',
        status: 'active',
        triggerApp: 'GitHub',
        actionApps: ['Slack'],
        lastExecuted: new Date(Date.now() - 21600000), // 6 hours ago
        executionCount: 95,
        averageExecutionTime: 1.2
          }
    ]
  },
  {
    id: 'peak-agent',
    name: 'PEAK',
    description: 'Proactive Engagement & Account Kinetics',
    modelId: 'gpt-4-turbo',
    status: 'idle',
    connectedApps: ['Google Analytics', 'Tableau'],
    capabilities: [
      { id: 'data-analysis',
        name: 'Data Analysis',
        description: 'PEAK incorporates usage pattern analysis, growth potential prediction, and personalized success plan creation for each account. This design includes advanced feature adoption guidance, internal champion nurturing, and renewal streamlining with loyalty-building precision.',
        category: 'analysis',
        requiredPermissions: ['read']
          },
      { id: 'report-generation',
        name: 'Report Generation',
        description: 'Generate automated reports with key findings',
        category: 'automation',
        requiredPermissions: ['write']
          }
    ],
    flows: [
      { id: 'analytics-to-tableau',
        name: 'Google Analytics to Tableau',
        description: 'Transfers analytics data to Tableau for visualization',
        status: 'active',
        triggerApp: 'Google Analytics',
        actionApps: ['Tableau'],
        lastExecuted: new Date(Date.now() - 129600000), // 36 hours ago
        executionCount: 28,
        averageExecutionTime: 8.3
          }
    ]
  },
  {
    id: 'expand-agent',
    name: 'EXPAND',
    description: 'Ecosystem Xceleration & Predictive Analytics for New Domains',
    modelId: 'claude-3.5-sonnet',
    status: 'idle',
    connectedApps: ['Salesforce', 'LinkedIn'],
    capabilities: [
      { id: 'market-analysis',
        name: 'Market Analysis',
        description: 'EXPAND incorporates market trend analysis, competitive landscape evaluation, and success pattern recognition to guide strategic growth decisions with data-driven precision.',
        category: 'analysis',
        requiredPermissions: ['read']
          },
      { id: 'lead-generation',
        name: 'Lead Generation',
        description: 'Identify and qualify potential leads in new markets',
        category: 'data',
        requiredPermissions: ['read', 'write']
          }
    ],
    flows: [
      { id: 'linkedin-to-salesforce',
        name: 'LinkedIn to Salesforce Pipeline',
        description: 'Imports LinkedIn leads into Salesforce CRM',
        status: 'active',
        triggerApp: 'LinkedIn',
        actionApps: ['Salesforce'],
        lastExecuted: new Date(Date.now() - 172800000), // 48 hours ago
        executionCount: 65,
        averageExecutionTime: 3.5
          }
    ]
  }
];

/**
 * Service for orchestrating AI agents that manage flows through Pipedream
 */
export class AgentOrchestratorService {
  private static instance: AgentOrchestratorService;
  private agents: Map<string, Agent>;
  private pipedreamService: PipedreamService;
  private mcpContextService: MCPContextService;
  
  private constructor() {
    this.agents = new Map(MOCK_AGENTS.map(agent => [agent.id, agent]));
    this.pipedreamService = new PipedreamService();
    this.mcpContextService = MCPContextService.getInstance();
  }
  
  /**
   * Get the singleton instance of AgentOrchestratorService
   */
  public static getInstance(): AgentOrchestratorService {
    if (!AgentOrchestratorService.instance) {
      AgentOrchestratorService.instance = new AgentOrchestratorService();
    }
    return AgentOrchestratorService.instance;
  }
  
  /**
   * Get all registered agents
   */
  public getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Get a specific agent by ID
   */
  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }
  
  /**
   * Start an agent to manage its flows
   */
  public async startAgent(agentId: string, userId: string): Promise<Agent | undefined> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      toast.error(`Agent ${agentId} not found`);
      return undefined;
    }
    
    try {
      // Validate connected apps
      for (const appName of agent.connectedApps) {
        const config = await this.pipedreamService.getIntegrationConfig(appName);
        if (!config) {
          throw new Error(`Missing configuration for ${appName}`);
        }
      }
      
      // Update agent status
      const updatedAgent = { ...agent, status: 'running' as const, lastRun: new Date() };
      this.agents.set(agentId, updatedAgent);
      
      // Load the model context for this agent
      const modelContext = this.mcpContextService.getModel(agent.modelId);
      if (!modelContext) {
        throw new Error(`Model context for ${agent.modelId} not found`);
      }
      
      // Simulate agent running its flows
      for (const flow of agent.flows) {
        if (flow.status === 'active') {
          await this.executeFlow(agent.id, flow.id, userId);
        }
      }
      
      toast.success(`Agent ${agent.name} started successfully`);
      return updatedAgent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start agent';
      const failedAgent = { ...agent, 
        status: 'error' as const, 
        error: errorMessage 
          };
      this.agents.set(agentId, failedAgent);
      toast.error(`Failed to start agent: ${errorMessage}`);
      return failedAgent;
    }
  }
  
  /**
   * Stop an agent
   */
  public async stopAgent(agentId: string): Promise<Agent | undefined> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      toast.error(`Agent ${agentId} not found`);
      return undefined;
    }
    
    try {
      // Update agent status
      const updatedAgent = { ...agent, status: 'idle' as const };
      this.agents.set(agentId, updatedAgent);
      
      toast.success(`Agent ${agent.name} stopped successfully`);
      return updatedAgent;
    } catch (error) { const errorMessage = error instanceof Error ? error.message : 'Failed to stop agent';
      toast.error(errorMessage);
      return agent;
        }
  }
  
  /**
   * Execute a specific flow managed by an agent
   */
  public async executeFlow(agentId: string, flowId: string, userId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      toast.error(`Agent ${agentId} not found`);
      return false;
    }
    
    const flow = agent.flows.find(f => f.id === flowId);
    if (!flow) {
      toast.error(`Flow ${flowId} not found for agent ${agent.name}`);
      return false;
    }
    
    try {
      toast.success(`Executing flow: ${flow.name}`);
      
      // Simulate flow execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check Pipedream connections for all apps in the flow
      const allApps = [flow.triggerApp, ...flow.actionApps];
      for (const appName of allApps) {
        const connectionStatus = await this.pipedreamService.getConnectionStatus(appName, userId);
        if (connectionStatus.status !== 'connected') {
          throw new Error(`App ${appName} is not connected. Flow execution aborted.`);
        }
      }
      
      // Simulate API request for the trigger app
      await this.pipedreamService.makeApiRequest(
        flow.triggerApp,
        userId,
        `/workflows/${flowId}/trigger`,
        'POST',
        { flowId, timestamp: new Date().toISOString()     }
      );
      
      // Update flow stats
      const updatedAgent = { ...agent };
      const flowIndex = updatedAgent.flows.findIndex(f => f.id === flowId);
      if (flowIndex !== -1) {
        const executionTime = Math.random() * 3 + 1; // Random execution time between 1-4 seconds
        const updatedFlow = { ...updatedAgent.flows[flowIndex],
          lastExecuted: new Date(),
          executionCount: updatedAgent.flows[flowIndex].executionCount + 1,
          averageExecutionTime: updatedAgent.flows[flowIndex].averageExecutionTime 
            ? (updatedAgent.flows[flowIndex].averageExecutionTime * 0.9 + executionTime * 0.1)
            : executionTime
            };
        updatedAgent.flows[flowIndex] = updatedFlow;
        updatedAgent.lastRun = new Date();
      }
      
      this.agents.set(agentId, updatedAgent);
      
      toast.success(`Flow ${flow.name} executed successfully`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute flow';
      toast.error(errorMessage);
      
      // Update agent with error
      const updatedAgent = { ...agent, 
        error: errorMessage 
          };
      this.agents.set(agentId, updatedAgent);
      
      return false;
    }
  }
  
  /**
   * Create a new agent
   */
  public async createAgent(agent: Omit<Agent, 'id'>): Promise<Agent> {
    try {
      // Generate a unique ID
      const id = `agent-${Date.now()}`;
      const newAgent: Agent = { ...agent, id };
      
      // Store the agent
      this.agents.set(id, newAgent);
      
      toast.success(`Agent ${agent.name} created successfully`);
      return newAgent;
    } catch (error) { const errorMessage = error instanceof Error ? error.message : 'Failed to create agent';
      toast.error(errorMessage);
      throw new Error(errorMessage);
        }
  }
  
  /**
   * Create a new flow for an agent
   */
  public async createFlow(agentId: string, flow: Omit<Flow, 'id'>): Promise<Flow> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      const error = `Agent ${agentId} not found`;
      toast.error(error);
      throw new Error(error);
    }
    
    try {
      // Generate a unique ID
      const id = `flow-${Date.now()}`;
      const newFlow: Flow = { ...flow, id };
      
      // Add flow to agent
      const updatedAgent = { ...agent, 
        flows: [...agent.flows, newFlow] 
          };
      this.agents.set(agentId, updatedAgent);
      
      toast.success(`Flow ${flow.name} created for agent ${agent.name}`);
      return newFlow;
    } catch (error) { const errorMessage = error instanceof Error ? error.message : 'Failed to create flow';
      toast.error(errorMessage);
      throw new Error(errorMessage);
        }
  }
  
  /**
   * Get the context model for an agent
   */
  public async getAgentContext(agentId: string): Promise<ModelContext | undefined> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      toast.error(`Agent ${agentId} not found`);
      return undefined;
    }
    
    return this.mcpContextService.getModel(agent.modelId);
  }
  
  /**
   * Update an agent's model
   */
  public async updateAgentModel(agentId: string, modelId: string): Promise<Agent | undefined> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      toast.error(`Agent ${agentId} not found`);
      return undefined;
    }
    
    // Check if model exists
    const model = this.mcpContextService.getModel(modelId);
    if (!model) {
      toast.error(`Model ${modelId} not found`);
      return undefined;
    }
    
    try {
      // Update agent
      const updatedAgent = { ...agent, modelId };
      this.agents.set(agentId, updatedAgent);
      
      toast.success(`Agent ${agent.name} updated to use ${model.name}`);
      return updatedAgent;
    } catch (error) { const errorMessage = error instanceof Error ? error.message : 'Failed to update agent model';
      toast.error(errorMessage);
      return agent;
        }
  }
} 
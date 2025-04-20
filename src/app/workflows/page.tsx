'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/userStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Define types for agents and their capabilities
interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'automation' | 'analysis' | 'communication';
}

interface Agent {
  id: string;
  name: string;
  description: string;
  modelId: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  connectedApps: string[];
  capabilities: AgentCapability[];
  activeFlows: number;
  successRate: number;
}

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: 'aora-agent',
    name: 'AORA',
    description: 'Autonomous Outreach & Research Automation',
    modelId: 'gpt-4o',
    status: 'idle',
    connectedApps: ['HubSpot', 'Gmail'],
    capabilities: [
      {
        id: 'data-sync',
        name: 'Data Synchronization',
        description: 'AORA includes decision-maker mapping capabilities and CRM data enrichment with verified insights.',
        category: 'data'
      },
      {
        id: 'conflict-resolution',
        name: 'Conflict Resolution',
        description: 'Intelligently resolve data conflicts',
        category: 'data'
      }
    ],
    activeFlows: 3,
    successRate: 98
  },
  {
    id: 'close-agent',
    name: 'CLOSE',
    description: 'Conversational Lead Optimization & Smart Execution',
    modelId: 'claude-3-sonnet-20240229',
    status: 'idle',
    connectedApps: ['Clay', 'HubSpot'],
    capabilities: [
      {
        id: 'lead-enrichment',
        name: 'Lead Enrichment',
        description: 'CLOSE incorporates prospect interaction analysis and buying signal identification.',
        category: 'data'
      },
      {
        id: 'lead-scoring',
        name: 'Lead Scoring',
        description: 'Score leads based on likelihood to convert',
        category: 'analysis'
      }
    ],
    activeFlows: 2,
    successRate: 95
  },
  {
    id: 'launch-agent',
    name: 'LAUNCH',
    description: 'Learn & Adapt User Navigated Customer-Handoff',
    modelId: 'gemini-pro',
    status: 'idle',
    connectedApps: ['n8n', 'HubSpot', 'Gmail'],
    capabilities: [
      {
        id: 'workflow-orchestration',
        name: 'Workflow Orchestration',
        description: 'LAUNCH incorporates personalized onboarding plan creation and technical setup automation.',
        category: 'automation'
      }
    ],
    activeFlows: 1,
    successRate: 75
  },
  {
    id: 'nova-agent',
    name: 'NOVA',
    description: 'Next-Gen Outreach & Value Automation',
    modelId: 'claude-3-opus',
    status: 'idle',
    connectedApps: ['Slack', 'GitHub'],
    capabilities: [
      {
        id: 'performance-monitoring',
        name: 'Performance Monitoring',
        description: 'NOVA incorporates usage pattern monitoring and expansion opportunity detection.',
        category: 'analysis'
      }
    ],
    activeFlows: 2,
    successRate: 89
  },
  {
    id: 'peak-agent',
    name: 'PEAK',
    description: 'Proactive Engagement & Account Kinetics',
    modelId: 'gpt-4-turbo',
    status: 'idle',
    connectedApps: ['Google Analytics', 'Tableau'],
    capabilities: [
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'PEAK incorporates usage pattern analysis and growth potential prediction.',
        category: 'analysis'
      }
    ],
    activeFlows: 1,
    successRate: 91
  },
  {
    id: 'expand-agent',
    name: 'EXPAND',
    description: 'Ecosystem Xceleration & Predictive Analytics for New Domains',
    modelId: 'claude-3-sonnet-20240229',
    status: 'idle',
    connectedApps: ['Salesforce', 'LinkedIn'],
    capabilities: [
      {
        id: 'market-analysis',
        name: 'Market Analysis',
        description: 'EXPAND incorporates market trend analysis and competitive landscape evaluation.',
        category: 'analysis'
      }
    ],
    activeFlows: 2,
    successRate: 86
  }
];

export default function Workflows() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [configureAgentId, setConfigureAgentId] = useState<string | null>(null);
  const [startingAgentId, setStartingAgentId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [currentUser, router]);

  const handleConfigureAgent = (agentId: string) => {
    // In a real app, this would navigate to a configuration page
    // For now, we'll just log and show a toast notification
    console.log(`Configuring agent: ${agentId}`);
    router.push(`/workflows/configure/${agentId}`);
  };

  const handleStartAgent = (agentId: string) => {
    // Set the agent as starting
    setStartingAgentId(agentId);
    
    // Simulate the agent starting process
    setTimeout(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: 'running' } 
            : agent
        )
      );
      setStartingAgentId(null);
      
      // Show toast notification
      toast.success(`${agents.find(a => a.id === agentId)?.name} agent started successfully`);
    }, 1500);
  };

  const handleStopAgent = (agentId: string) => {
    // Set the agent as stopping (also using startingAgentId state for simplicity)
    setStartingAgentId(agentId);
    
    // Simulate the agent stopping process
    setTimeout(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: 'idle' } 
            : agent
        )
      );
      setStartingAgentId(null);
      
      // Show toast notification
      toast.success(`${agents.find(a => a.id === agentId)?.name} agent stopped successfully`);
    }, 1500);
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'idle':
      default:
        return 'bg-blue-500';
    }
  };

  const getCategoryColor = (category: AgentCapability['category']) => {
    switch (category) {
      case 'data':
        return 'bg-purple-500/20 text-purple-300';
      case 'automation':
        return 'bg-blue-500/20 text-blue-300';
      case 'analysis':
        return 'bg-teal-500/20 text-teal-300';
      case 'communication':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-white/10 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>
      
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold gradient-text mr-4">
                Workflows
              </h1>
              <Link href="/workflow-editor" className="action-button px-4 py-2 rounded-lg flex items-center">
                <span className="mr-2">+</span> New Workflow
              </Link>
            </div>
            <p className="text-white/70">Manage your AI agents and their automated workflows</p>
          </div>
          <button
            onClick={() => router.push('/workflows/new')}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-glow hover:shadow-glow-intense transition-all duration-300"
          >
            Create New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-white mr-2">{agent.name}</h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agent.status)} text-white uppercase`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">{agent.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-medium text-white">{agent.successRate}%</div>
                    <div className="text-white/60 text-xs">Success Rate</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-white/80 text-sm mb-2">Connected Apps</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.connectedApps.map((app) => (
                      <span key={app} className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-white/80 text-sm mb-2">Capabilities</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((capability) => (
                      <span 
                        key={capability.id} 
                        className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(capability.category)}`}
                        title={capability.description}
                      >
                        {capability.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="text-white/70 text-sm">
                    <span className="font-medium text-white">{agent.activeFlows}</span> active flows
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleConfigureAgent(agent.id)}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg border border-white/10 transition-all duration-200"
                      disabled={configureAgentId === agent.id}
                    >
                      Configure
                    </button>
                    
                    {agent.status === 'idle' ? (
                      <button 
                        onClick={() => handleStartAgent(agent.id)}
                        disabled={startingAgentId === agent.id}
                        className="px-3 py-1 bg-primary/90 hover:bg-primary text-white text-sm rounded-lg transition-all duration-200 flex items-center justify-center min-w-20"
                      >
                        {startingAgentId === agent.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Starting
                          </span>
                        ) : "Start Agent"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStopAgent(agent.id)}
                        disabled={startingAgentId === agent.id}
                        className="px-3 py-1 bg-red-500/90 hover:bg-red-500 text-white text-sm rounded-lg transition-all duration-200 flex items-center justify-center min-w-20"
                      >
                        {startingAgentId === agent.id ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Stopping
                          </span>
                        ) : "Stop Agent"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 
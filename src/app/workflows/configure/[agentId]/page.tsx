'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useUserStore } from '../../../../lib/userStore.js';

// Mock data for agent configuration - in a real app, this would come from an API
interface AgentConfig {
  id: string;
  modelId: string;
  contextLength: number;
  apiKeys: { [key: string]: string;
      };
  permissions: string[];
  maxParallelFlows: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  prompt: string;
}

// Mock data for available models
const availableModels = [
  { id: 'gpt-4o', name: 'GPT-4o'     },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet'     },
  { id: 'claude-3-opus', name: 'Claude 3 Opus'     },
  { id: 'gemini-pro', name: 'Gemini Pro'     },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo'     },
];

// Mock configuration data
const mockConfigData: Record<string, AgentConfig> = {
  'aora-agent': {
    id: 'aora-agent',
    modelId: 'gpt-4o',
    contextLength: 128000,
    apiKeys: { 'hubspot': '••••••••••••••••',
      'gmail': '••••••••••••••••'
        },
    permissions: ['read_contacts', 'write_contacts', 'read_emails', 'send_emails'],
    maxParallelFlows: 3,
    logLevel: 'info',
    prompt: 'You are AORA, an autonomous agent focused on outreach and research automation. Your objective is to manage communications, enrich CRM data, and coordinate decision-maker mapping. Always maintain a professional tone and prioritize data accuracy.'
  },
  'close-agent': {
    id: 'close-agent',
    modelId: 'claude-3.5-sonnet',
    contextLength: 200000,
    apiKeys: { 'clay': '••••••••••••••••',
      'hubspot': '••••••••••••••••'
        },
    permissions: ['read_leads', 'write_leads', 'analyze_conversations'],
    maxParallelFlows: 2,
    logLevel: 'info',
    prompt: 'You are CLOSE, a conversational agent focused on lead optimization and smart execution. Your objective is to analyze prospect interactions, identify buying signals, and provide strategic guidance. Maintain a persuasive yet authentic tone in all communications.'
  },
  'launch-agent': {
    id: 'launch-agent',
    modelId: 'gemini-pro',
    contextLength: 64000,
    apiKeys: { 'n8n': '••••••••••••••••',
      'hubspot': '••••••••••••••••',
      'gmail': '••••••••••••••••'
        },
    permissions: ['manage_workflows', 'read_data', 'write_data'],
    maxParallelFlows: 1,
    logLevel: 'debug',
    prompt: 'You are LAUNCH, an agent focused on user onboarding and customer handoff. Your objective is to create personalized onboarding plans, automate technical setup, and deliver training resources. Be helpful, clear, and focus on time-to-value acceleration.'
  },
  'nova-agent': {
    id: 'nova-agent',
    modelId: 'claude-3-opus',
    contextLength: 200000,
    apiKeys: { 'slack': '••••••••••••••••',
      'github': '••••••••••••••••'
        },
    permissions: ['read_messages', 'send_messages', 'read_repositories'],
    maxParallelFlows: 2,
    logLevel: 'info',
    prompt: 'You are NOVA, an agent focused on next-gen outreach and value automation. Your objective is to monitor usage patterns, detect expansion opportunities, and identify churn risks. Be data-driven and relationship-focused in all communications.'
  },
  'peak-agent': {
    id: 'peak-agent',
    modelId: 'gpt-4-turbo',
    contextLength: 128000,
    apiKeys: { 'google_analytics': '••••••••••••••••',
      'tableau': '••••••••••••••••'
        },
    permissions: ['read_analytics', 'create_reports'],
    maxParallelFlows: 1,
    logLevel: 'info',
    prompt: 'You are PEAK, an agent focused on proactive engagement and account growth. Your objective is to analyze usage patterns, predict growth potential, and create personalized success plans. Focus on advanced feature adoption and building customer loyalty.'
  },
  'expand-agent': {
    id: 'expand-agent',
    modelId: 'claude-3.5-sonnet',
    contextLength: 200000,
    apiKeys: { 'salesforce': '••••••••••••••••',
      'linkedin': '••••••••••••••••'
        },
    permissions: ['read_accounts', 'write_accounts', 'read_prospects'],
    maxParallelFlows: 2,
    logLevel: 'warn',
    prompt: 'You are EXPAND, an agent focused on ecosystem growth and predictive analytics. Your objective is to analyze market trends, evaluate competitive landscapes, and recognize success patterns. Be strategic and data-driven in guidance for growth decisions.'
  }
};

// Map from agentId to agent name
const agentNames: Record<string, string> = { 'aora-agent': 'AORA',
  'close-agent': 'CLOSE',
  'launch-agent': 'LAUNCH',
  'nova-agent': 'NOVA',
  'peak-agent': 'PEAK',
  'expand-agent': 'EXPAND'
    };

const MODEL_OPTIONS = [
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet'     },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo'     },
  { id: 'gpt-4', name: 'GPT-4'     },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo'     }
];

export default function AgentConfigPage(): JSX.Element {
  const router = useRouter();
  const params = useParams() || {};
  const agentId = params['agentId'] as string;
  const { currentUser } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<AgentConfig | null>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Fetch agent configuration - in a real app, this would be an API call
    const agentConfig = mockConfigData[agentId];
    if (agentConfig) {
      setConfig(agentConfig);
    } else {
      toast.error('Agent configuration not found');
      router.push('/workflows');
    }

    setIsLoading(false);
  }, [agentId, currentUser, router]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (config) {
      setConfig({ ...config,
        modelId: e.target.value
          });
    }
  };

  const handleContextLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (config) {
      setConfig({ ...config,
        contextLength: parseInt(e.target.value, 10) || 0
          });
    }
  };

  const handleMaxParallelFlowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (config) {
      setConfig({ ...config,
        maxParallelFlows: parseInt(e.target.value, 10) || 1
          });
    }
  };

  const handleLogLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (config) {
      setConfig({ ...config,
        logLevel: e.target.value as AgentConfig['logLevel']
          });
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (config) {
      setConfig({ ...config,
        prompt: e.target.value
          });
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    
    try { // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send the config to an API
      console.log('Saving agent configuration:', config);
      
      toast.success('Agent configuration saved successfully');
        } catch (error) { console.error('Error saving agent configuration:', error);
      toast.error('Failed to save agent configuration');
        } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-pulse gradient-text text-xl">Loading agent configuration...</div>
      </div>
    );
  }

  if (!config) { return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Agent configuration not found</h1>
          <Link href="/workflows" className="text-primary hover:underline">
            Return to Workflows
          </Link>
        </div>
      </div>
    );
      }

  return (
    <div className="pb-8">
      {/* Neural Network Background */}
      <div className="neural-bg"></div>
      
      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20     }}
          animate={{ opacity: 1, y: 0     }}
          transition={{ duration: 0.5     }}
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Configure {agentNames[agentId] || 'Agent'}
              </h1>
              <p className="text-white/70">Adjust model settings and connection parameters</p>
            </div>
            <Link href="/workflows" className="px-4 py-2 text-white/80 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300">
              Back to Workflows
            </Link>
          </div>
          
          {/* Configuration Sections */}
          <div className="space-y-6">
            {/* Natural Language Prompt */}
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Agent Instructions</h2>
              <p className="text-white/70 text-sm mb-4">Configure your agent with natural language instructions that define its behavior, goals, and tone.</p>
              
              <div className="mb-4">
                <label className="block text-white/80 text-sm mb-2">Prompt</label>
                <textarea
                  value={config.prompt}
                  onChange={handlePromptChange}
                  className="w-full h-40 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
                  placeholder="Enter instructions for the agent..."
                ></textarea>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-white/40">The agent will follow these instructions when executing workflows</p>
                  <div className="text-xs text-white/60">{config.prompt.length} characters</div>
                </div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-primary mr-2"></div>
                  <h3 className="text-white font-medium text-sm">Prompt Tips</h3>
                </div>
                <ul className="text-white/60 text-xs space-y-1">
                  <li>• Start with the agent's identity and primary purpose</li>
                  <li>• Define specific objectives and priorities</li>
                  <li>• Specify the tone and communication style</li>
                  <li>• Include any constraints or ethical guidelines</li>
                  <li>• Mention how to handle edge cases or errors</li>
                </ul>
              </div>
            </div>
            
            {/* Model Configuration */}
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Model Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="modelId" className="block text-white/80 text-sm mb-2">AI Model</label>
                  <select
                    id="modelId"
                    value={config.modelId}
                    onChange={handleModelChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    aria-label="Select AI Model"
                  >
                    {MODEL_OPTIONS.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="contextLength" className="block text-white/80 text-sm mb-2">Context Length</label>
                  <input
                    id="contextLength"
                    type="number"
                    value={config.contextLength}
                    onChange={handleContextLengthChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    min="1000"
                    max="200000"
                    step="1000"
                    placeholder="e.g., 128000"
                  />
                  <p className="text-xs text-white/40 mt-1">Maximum tokens for agent context</p>
                </div>
              </div>
            </div>
            
            {/* API Keys */}
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">API Connections</h2>
              
              <div className="space-y-4">
                {Object.entries(config.apiKeys).map(([service, apiKey]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium capitalize">{service}</h3>
                      <p className="text-white/60 text-sm">API connection for {service}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white/60">
                        {apiKey}
                      </div>
                      <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors">
                        <span className="text-white/80">Edit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Execution Settings */}
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Execution Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxParallelFlows" className="block text-white/80 text-sm mb-2">Max Parallel Flows</label>
                  <input
                    id="maxParallelFlows"
                    type="number"
                    value={config.maxParallelFlows}
                    onChange={handleMaxParallelFlowsChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    min="1"
                    max="10"
                    placeholder="e.g., 3"
                  />
                  <p className="text-xs text-white/40 mt-1">Maximum number of workflows to run in parallel</p>
                </div>
                
                <div>
                  <label htmlFor="logLevel" className="block text-white/80 text-sm mb-2">Log Level</label>
                  <select
                    id="logLevel"
                    value={config.logLevel}
                    onChange={handleLogLevelChange}
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white"
                    aria-label="Select Log Level"
                  >
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Permissions */}
            <div className="bg-dark-100/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Permissions</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {config.permissions.map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={true}
                      className="rounded border-white/20 text-primary bg-black/30"
                      readOnly
                    />
                    <label htmlFor={permission} className="text-white/80 text-sm capitalize">
                      {permission.replace(/_/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/workflows"
              className="px-6 py-3 bg-white/5 text-white/80 rounded-lg font-medium hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </Link>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-glow hover:shadow-glow-intense transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              { isSaving ? 'Saving...' : 'Save Configuration'    }
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
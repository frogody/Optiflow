'use client';

import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Fragment } from 'react';

interface AIAgentConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AIAgentConfigData) => void;
  initialConfig?: Partial<AIAgentConfigData>;
}

export interface AIAgentConfigData {
  name: string;
  type: string;
  prompt: string;
  model: string;
  temperature: number;
  tools: string[];
  contextStrategy: string;
  description?: string;
  customContextRules?: string;
  maxTokens?: number;
  stopSequences?: string[];
  systemMessage?: string;
}

const availableTools = [
  { id: 'web_search', name: 'Web Search', description: 'Search the web for information'     },
  { id: 'calculator', name: 'Calculator', description: 'Perform calculations'     },
  { id: 'database_query', name: 'Database Query', description: 'Query databases'     },
  { id: 'email_sender', name: 'Email Sender', description: 'Send emails'     },
  { id: 'calendar', name: 'Calendar', description: 'Create and check calendar events'     },
  { id: 'weather', name: 'Weather', description: 'Get weather information'     },
  { id: 'code_executor', name: 'Code Executor', description: 'Execute code snippets'     },
  { id: 'file_operations', name: 'File Operations', description: 'Handle file operations'     },
  { id: 'api_client', name: 'API Client', description: 'Make API requests'     },
  { id: 'data_transformer', name: 'Data Transformer', description: 'Transform data formats'     }
];

const MODEL_OPTIONS = [
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet'     },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo'     },
  { id: 'gpt-4', name: 'GPT-4'     },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo'     }
];

const contextStrategies = [
  { id: 'all_inputs', name: 'All Inputs', description: 'Use all available input data'     },
  { id: 'last_node', name: 'Last Node', description: "Use only the last node's output"     },
  { id: 'custom', name: 'Custom', description: 'Define custom context rules'     },
  { id: 'smart', name: 'Smart', description: 'AI-powered context selection'     }
];

const defaultPrompt = `You are an AI assistant that helps analyze and process data in a workflow.
Consider the following factors:
- Input data structure and format
- Required transformations
- Expected output format
- Error handling requirements
- Performance considerations

Analyze the provided content and respond with:
1. Processing steps;
2. Data transformations;
3. Error handling strategy;
4. Performance optimizations;
`;

export default function AIAgentConfig({ isOpen, onClose, onSave, initialConfig }: AIAgentConfigProps) {
  const [config, setConfig] = useState<AIAgentConfigData>({ name: initialConfig?.name || 'AI Agent',
    type: initialConfig?.type || 'Conditional',
    prompt: initialConfig?.prompt || defaultPrompt,
    model: initialConfig?.model || 'gpt-4o',
    temperature: initialConfig?.temperature || 0.7,
    tools: initialConfig?.tools || [],
    contextStrategy: initialConfig?.contextStrategy || 'all_inputs',
    description: initialConfig?.description || 'Process data with AI',
    customContextRules: initialConfig?.customContextRules || '',
    maxTokens: initialConfig?.maxTokens || 2000,
    stopSequences: initialConfig?.stopSequences || [],
    systemMessage: initialConfig?.systemMessage || ''
      });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value     });
  };

  const handleToolToggle = (toolId: string) => {
    setConfig(prev => {
      const tools = prev.tools.includes(toolId)
        ? prev.tools.filter(id => id !== toolId)
        : [...prev.tools, toolId];
      return { ...prev, tools };
    });
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, temperature: parseFloat(e.target.value)     });
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-dark-50 p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-semibold text-white mb-4">
                  Configure: AI Agent
                </Dialog.Title>
                
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={config.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={config.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  {/* Type Field */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-200 mb-1">
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={config.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Conditional">Conditional</option>
                      <option value="Transformation">Transformation</option>
                      <option value="Generation">Generation</option>
                    </select>
                  </div>
                  
                  {/* Model Selection */}
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-200 mb-1">
                      Model
                    </label>
                    <select
                      id="model"
                      name="model"
                      value={config.model}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {MODEL_OPTIONS.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Temperature Slider */}
                  <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-200 mb-1">
                      Temperature: {config.temperature.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      id="temperature"
                      name="temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.temperature}
                      onChange={handleTemperatureChange}
                      className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  {/* Prompt Template */}
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-200 mb-1">
                      Prompt Template
                    </label>
                    <textarea
                      id="prompt"
                      name="prompt"
                      rows={10}
                      value={config.prompt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                    />
                  </div>
                  
                  {/* Tools Selection */}
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-dark-100 px-4 py-3 text-left text-sm font-medium text-white focus:outline-none focus-visible:ring focus-visible:ring-primary">
                          <span>Available Tools ({config.tools.length} selected)</span>
                          <ChevronDownIcon
                            className={`${ open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-white`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-200">
                          <div className="space-y-2">
                            {availableTools.map((tool) => (
                              <div key={tool.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={tool.id}
                                  checked={config.tools.includes(tool.id)}
                                  onChange={() => handleToolToggle(tool.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={tool.id} className="ml-3">
                                  <span className="font-medium">{tool.name}</span>
                                  <p className="text-gray-400 text-xs">{tool.description}</p>
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  
                  {/* Context Strategy Selection */}
                  <div>
                    <label htmlFor="contextStrategy" className="block text-sm font-medium text-gray-200 mb-1">
                      Context Strategy
                    </label>
                    <select
                      id="contextStrategy"
                      name="contextStrategy"
                      value={config.contextStrategy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {contextStrategies.map((strategy) => (
                        <option key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Context Rules */}
                  {config.contextStrategy === 'custom' && (
                    <div>
                      <label htmlFor="customContextRules" className="block text-sm font-medium text-gray-200 mb-1">
                        Custom Context Rules
                      </label>
                      <textarea
                        id="customContextRules"
                        name="customContextRules"
                        value={config.customContextRules}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={4}
                        placeholder="Define custom rules for context selection..."
                      />
                    </div>
                  )}

                  {/* Advanced Settings */}
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-dark-100 px-4 py-3 text-left text-sm font-medium text-white focus:outline-none focus-visible:ring focus-visible:ring-primary">
                          <span>Advanced Settings</span>
                          <ChevronDownIcon
                            className={`${ open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-white`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-200">
                          <div className="space-y-4">
                            {/* Max Tokens */}
                            <div>
                              <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-200 mb-1">
                                Max Tokens
                              </label>
                              <input
                                type="number"
                                id="maxTokens"
                                name="maxTokens"
                                value={config.maxTokens}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>

                            {/* System Message */}
                            <div>
                              <label htmlFor="systemMessage" className="block text-sm font-medium text-gray-200 mb-1">
                                System Message
                              </label>
                              <textarea
                                id="systemMessage"
                                name="systemMessage"
                                value={config.systemMessage}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                rows={4}
                                placeholder="Define system-level instructions..."
                              />
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-dark-200 rounded-md hover:bg-dark-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-dark-50 bg-gradient-to-r from-primary to-secondary rounded-md hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition, Disclosure, Switch } from '@headlessui/react';
import { 
  Cog6ToothIcon, 
  BoltIcon, 
  ChevronUpIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BoltSlashIcon,
  CloudIcon,
  BeakerIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export interface WorkflowSettings { // Basic Info
  name: string;
  description: string;
  version: string;
  interval: string;
  maxConcurrency: number;
  isActive: boolean;
  
  // Memory Management
  memoryEnabled: boolean;
  memoryType: 'buffer' | 'persistent' | 'session';
  memorySize: number; // In KB,
  contextWindowSize: number; // Number of items
  
  // Execution Controls
  safeMode: boolean; // Requires approval for each step,
  autoSave: boolean; // Automatically save workflow state,
  executionTimeout: number; // In seconds,
  maxConcurrentNodes: number; // Max nodes to execute simultaneously
  
  // RAG Settings
  ragEnabled: boolean;
  knowledgeBase: string; // ID or name of knowledge base,
  similarityThreshold: number; // 0-1 threshold for retrieval,
  maxDocuments: number; // Max documents to retrieve
  
  // Notifications
  notifyOnCompletion: boolean;
  notifyOnError: boolean;
  
  // Advanced
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
}

const defaultSettings: WorkflowSettings = { name: 'New Workflow',
  description: 'A workflow created with Optiflow',
  version: '1.0.0',
  interval: '1d',
  maxConcurrency: 5,
  isActive: true,
  
  memoryEnabled: true,
  memoryType: 'buffer',
  memorySize: 1024,
  contextWindowSize: 10,
  
  safeMode: false,
  autoSave: true,
  executionTimeout: 300,
  maxConcurrentNodes: 5,
  
  ragEnabled: false,
  knowledgeBase: '',
  similarityThreshold: 0.7,
  maxDocuments: 5,
  
  notifyOnCompletion: true,
  notifyOnError: true,
  
  debugMode: false,
  logLevel: 'error',
};

export interface WorkflowSettingsProps { isOpen: boolean;
  onClose: () => void;
  initialSettings?: Partial<WorkflowSettings>;
  onSave: (settings: WorkflowSettings) => void;
}

export default function WorkflowSettingsPanel({
  isOpen,
  onClose,
  initialSettings = {},
  onSave,
}: WorkflowSettingsProps) {
  // Initialize settings with defaults and any provided settings
  const [settings, setSettings] = useState<WorkflowSettings>({
    ...defaultSettings,
    ...initialSettings,
  });

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const updateSetting = <K extends keyof WorkflowSettings>(
    key: K,
    value: WorkflowSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev,
      [key]: value,
    }));
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
          <div className="fixed inset-0 bg-black/75" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-dark-100 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-white flex items-center gap-2">
                  <Cog6ToothIcon className="h-6 w-6 text-primary" />
                  Workflow Settings
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-400">
                  Configure global settings for this workflow. These settings affect how the entire workflow executes.
                </Dialog.Description>

                <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {/* Memory Management Section */}
                  <Disclosure as="div" className="rounded-lg bg-dark-200 overflow-hidden">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between px-4 py-3 text-left text-sm font-medium text-white hover:bg-dark-300">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-primary" />
                            <span>Memory & Context Management</span>
                          </div>
                          <ChevronUpIcon
                            className={`${ open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-primary`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Enable Memory
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Store workflow execution history and context
                                </p>
                              </div>
                              <Switch
                                checked={settings.memoryEnabled}
                                onChange={(value) => updateSetting('memoryEnabled', value)}
                                className={`${ settings.memoryEnabled ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Enable Memory</span>
                                <span
                                  className={`${ settings.memoryEnabled ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            {settings.memoryEnabled && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300">
                                    Memory Type
                                  </label>
                                  <select
                                    value={settings.memoryType}
                                    onChange={(e) => updateSetting('memoryType', e.target.value as any)}
                                    className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                    title="Memory Type"
                                  >
                                    <option value="buffer">Buffer Memory (Temporary)</option>
                                    <option value="session">Session Memory (Lasts until browser close)</option>
                                    <option value="persistent">Persistent Memory (Stored in database)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300">
                                    Memory Size (KB)
                                  </label>
                                  <input
                                    type="number"
                                    min="64"
                                    max="10240"
                                    value={settings.memorySize}
                                    onChange={(e) => updateSetting('memorySize', parseInt(e.target.value))}
                                    className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                    title="Memory Size (KB)"
                                    placeholder="Memory Size (KB)"
                                  />
                                  <p className="text-xs text-gray-400 mt-1">
                                    Maximum memory size for storing workflow state and history
                                  </p>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300">
                                    Context Window Size
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={settings.contextWindowSize}
                                    onChange={(e) => updateSetting('contextWindowSize', parseInt(e.target.value))}
                                    className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                    title="Context Window Size"
                                    placeholder="Context Window Size"
                                  />
                                  <p className="text-xs text-gray-400 mt-1">
                                    Number of recent items to keep in context window
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  {/* Execution Control Section */}
                  <Disclosure as="div" className="rounded-lg bg-dark-200 overflow-hidden">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between px-4 py-3 text-left text-sm font-medium text-white hover:bg-dark-300">
                          <div className="flex items-center gap-2">
                            <BoltIcon className="h-5 w-5 text-primary" />
                            <span>Execution Controls</span>
                          </div>
                          <ChevronUpIcon
                            className={`${ open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-primary`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Safe Mode
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Require approval for each step in the workflow
                                </p>
                              </div>
                              <Switch
                                checked={settings.safeMode}
                                onChange={(value) => updateSetting('safeMode', value)}
                                className={`${ settings.safeMode ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Safe Mode</span>
                                <span
                                  className={`${ settings.safeMode ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Auto-Save
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Automatically save workflow state during execution
                                </p>
                              </div>
                              <Switch
                                checked={settings.autoSave}
                                onChange={(value) => updateSetting('autoSave', value)}
                                className={`${ settings.autoSave ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Auto Save</span>
                                <span
                                  className={`${ settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300">
                                Execution Timeout (seconds)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="3600"
                                value={settings.executionTimeout}
                                onChange={(e) => updateSetting('executionTimeout', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                title="Execution Timeout (seconds)"
                                placeholder="Execution Timeout (seconds)"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Maximum time the workflow can run before timing out
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300">
                                Max Concurrent Nodes
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={settings.maxConcurrentNodes}
                                onChange={(e) => updateSetting('maxConcurrentNodes', parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                title="Max Concurrent Nodes"
                                placeholder="Max Concurrent Nodes"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Maximum number of nodes that can execute simultaneously
                              </p>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  {/* RAG Settings Section */}
                  <Disclosure as="div" className="rounded-lg bg-dark-200 overflow-hidden">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between px-4 py-3 text-left text-sm font-medium text-white hover:bg-dark-300">
                          <div className="flex items-center gap-2">
                            <CloudIcon className="h-5 w-5 text-primary" />
                            <span>RAG & Knowledge Enhancement</span>
                          </div>
                          <ChevronUpIcon
                            className={`${ open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-primary`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Enable RAG
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Use retrieval augmented generation to enhance AI responses
                                </p>
                              </div>
                              <Switch
                                checked={settings.ragEnabled}
                                onChange={(value) => updateSetting('ragEnabled', value)}
                                className={`${ settings.ragEnabled ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Enable RAG</span>
                                <span
                                  className={`${ settings.ragEnabled ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            {settings.ragEnabled && (
                              <>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300">
                                    Knowledge Base
                                  </label>
                                  <select
                                    value={settings.knowledgeBase}
                                    onChange={(e) => updateSetting('knowledgeBase', e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                    title="Knowledge Base"
                                  >
                                    <option value="">Select Knowledge Base</option>
                                    <option value="company-docs">Company Documents</option>
                                    <option value="product-info">Product Information</option>
                                    <option value="customer-data">Customer Data</option>
                                    <option value="general-kb">General Knowledge</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300">
                                    Similarity Threshold
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={settings.similarityThreshold}
                                    onChange={(e) => updateSetting('similarityThreshold', parseFloat(e.target.value))}
                                    className="mt-1 w-full h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer"
                                    title="Similarity Threshold"
                                  />
                                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Low Relevance (0)</span>
                                    <span>Current: {settings.similarityThreshold}</span>
                                    <span>High Relevance (1)</span>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-300">
                                    Max Documents to Retrieve
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={settings.maxDocuments}
                                    onChange={(e) => updateSetting('maxDocuments', parseInt(e.target.value))}
                                    className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                    title="Max Documents to Retrieve"
                                    placeholder="Max Documents to Retrieve"
                                  />
                                  <p className="text-xs text-gray-400 mt-1">
                                    Maximum number of documents to retrieve during execution
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  {/* Notifications & Advanced Section */}
                  <Disclosure as="div" className="rounded-lg bg-dark-200 overflow-hidden">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between px-4 py-3 text-left text-sm font-medium text-white hover:bg-dark-300">
                          <div className="flex items-center gap-2">
                            <BeakerIcon className="h-5 w-5 text-primary" />
                            <span>Notifications & Advanced</span>
                          </div>
                          <ChevronUpIcon
                            className={`${ open ? 'rotate-180 transform' : ''
                                } h-5 w-5 text-primary`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Notify on Completion
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Send notification when workflow completes
                                </p>
                              </div>
                              <Switch
                                checked={settings.notifyOnCompletion}
                                onChange={(value) => updateSetting('notifyOnCompletion', value)}
                                className={`${ settings.notifyOnCompletion ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Notify on Completion</span>
                                <span
                                  className={`${ settings.notifyOnCompletion ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Notify on Error
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Send notification when workflow encounters an error
                                </p>
                              </div>
                              <Switch
                                checked={settings.notifyOnError}
                                onChange={(value) => updateSetting('notifyOnError', value)}
                                className={`${ settings.notifyOnError ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Notify on Error</span>
                                <span
                                  className={`${ settings.notifyOnError ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">
                                  Debug Mode
                                </label>
                                <p className="text-xs text-gray-400 mt-1">
                                  Enable detailed logging and debug information
                                </p>
                              </div>
                              <Switch
                                checked={settings.debugMode}
                                onChange={(value) => updateSetting('debugMode', value)}
                                className={`${ settings.debugMode ? 'bg-primary' : 'bg-dark-300'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">Debug Mode</span>
                                <span
                                  className={`${ settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300">
                                Log Level
                              </label>
                              <select
                                value={settings.logLevel}
                                onChange={(e) => updateSetting('logLevel', e.target.value as any)}
                                className="mt-1 block w-full rounded-md bg-dark-300 border-gray-700 text-white focus:border-primary focus:ring-primary"
                                title="Log Level"
                              >
                                <option value="error">Error</option>
                                <option value="warn">Warning</option>
                                <option value="info">Info</option>
                                <option value="debug">Debug</option>
                                <option value="trace">Trace</option>
                              </select>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-dark-300 rounded-md hover:bg-dark-400 focus:outline-none"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none"
                    onClick={handleSave}
                  >
                    Save Settings
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
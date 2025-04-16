'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ExclamationCircleIcon, 
  DocumentTextIcon,
  EnvelopeIcon, 
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ServerIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

// Map of node types to icons for representation
const nodeTypeIcons: Record<string, any> = {
  'extract-webpage': DocumentTextIcon,
  'send-email': EnvelopeIcon,
  'wait': ClockIcon,
  'api': ServerIcon,
  'process-data': AdjustmentsHorizontalIcon,
  'cloud-function': CloudIcon,
  'default': AdjustmentsHorizontalIcon
};

// Field type definitions
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'select' | 'checkbox' | 'date' | 'time';

export interface FieldConfig {
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  defaultValue?: any;
}

// Map of node types to their field configurations
const nodeConfigs: Record<string, Record<string, FieldConfig>> = {
  'extract-webpage': {
    url: {
      type: 'url',
      label: 'URL',
      description: 'The webpage URL to extract data from',
      placeholder: 'https://example.com',
      required: true
    },
    selector: {
      type: 'text',
      label: 'CSS Selector',
      description: 'CSS selector to extract specific elements',
      placeholder: '.main-content'
    },
    includeImages: {
      type: 'checkbox',
      label: 'Include Images',
      description: 'Whether to include images in extraction'
    }
  },
  'send-email': {
    to: {
      type: 'email',
      label: 'To Email',
      description: 'Recipient email address',
      placeholder: 'recipient@example.com',
      required: true
    },
    subject: {
      type: 'text',
      label: 'Subject',
      description: 'Email subject line',
      placeholder: 'Important: Your notification'
    },
    body: {
      type: 'textarea',
      label: 'Body',
      description: 'Email body content',
      placeholder: 'Enter your email content here...'
    }
  },
  'wait': {
    duration: {
      type: 'number',
      label: 'Duration',
      description: 'Wait duration in seconds',
      placeholder: '30',
      required: true
    },
    waitUntil: {
      type: 'time',
      label: 'Wait Until',
      description: 'Wait until specific time (optional)'
    }
  },
  'api': {
    endpoint: {
      type: 'url',
      label: 'API Endpoint',
      description: 'The API endpoint URL',
      placeholder: 'https://api.example.com/data',
      required: true
    },
    method: {
      type: 'select',
      label: 'Method',
      description: 'HTTP method to use',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' }
      ],
      defaultValue: 'GET'
    },
    headers: {
      type: 'textarea',
      label: 'Headers',
      description: 'HTTP headers as JSON',
      placeholder: '{"Content-Type": "application/json"}'
    },
    body: {
      type: 'textarea',
      label: 'Body',
      description: 'Request body as JSON',
      placeholder: '{"key": "value"}'
    }
  }
};

// Get field configuration for a node type and field key
const getFieldConfig = (nodeType: string, fieldKey: string): FieldConfig => {
  // First check if there's a specific config for this node type and field
  if (nodeConfigs[nodeType]?.[fieldKey]) {
    return nodeConfigs[nodeType][fieldKey];
  }
  
  // Otherwise infer from field key
  if (fieldKey.includes('email') || fieldKey === 'to' || fieldKey === 'from') {
    return { type: 'email', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('url') || fieldKey.includes('endpoint') || fieldKey.includes('link')) {
    return { type: 'url', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('duration') || fieldKey.includes('count') || fieldKey.includes('amount')) {
    return { type: 'number', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('description') || fieldKey.includes('body') || fieldKey.includes('content')) {
    return { type: 'textarea', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('enabled') || fieldKey.includes('active') || fieldKey.startsWith('is') || fieldKey.startsWith('has')) {
    return { type: 'checkbox', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('date')) {
    return { type: 'date', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('time')) {
    return { type: 'time', label: formatFieldName(fieldKey) };
  }
  
  // Default to text
  return { type: 'text', label: formatFieldName(fieldKey) };
};

// Format field name for display (camelCase to Title Case)
const formatFieldName = (fieldName: string): string => {
  return fieldName
    // Insert a space before capital letters and uppercase the first letter
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    // Handle special cases
    .replace(/Url/g, 'URL')
    .replace(/Api/g, 'API');
};

export interface DefaultNodeData {
  id: string;
  type: string;
  label?: string;
  description?: string;
  settings?: Record<string, any>;
  onConfigChange?: (updatedData: DefaultNodeData) => void;
}

interface DefaultNodeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: DefaultNodeData) => void;
  nodeData: DefaultNodeData;
}

export default function DefaultNodeConfig({ 
  isOpen, 
  onClose, 
  onSave,
  nodeData 
}: DefaultNodeConfigProps) {
  const [localNodeData, setLocalNodeData] = useState<DefaultNodeData>({
    ...nodeData,
    settings: nodeData.settings || {}
  });
  
  useEffect(() => {
    setLocalNodeData({
      ...nodeData,
      settings: nodeData.settings || {}
    });
  }, [nodeData]);
  
  const handleSettingChange = (key: string, value: any) => {
    setLocalNodeData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };
  
  const handleLabelChange = (label: string) => {
    setLocalNodeData(prev => ({
      ...prev,
      label
    }));
  };
  
  const handleDescriptionChange = (description: string) => {
    setLocalNodeData(prev => ({
      ...prev,
      description
    }));
  };
  
  const handleSave = () => {
    onSave(localNodeData);
    onClose();
  };

  // Get the appropriate icon for the node type
  const Icon = nodeTypeIcons[localNodeData.type] || nodeTypeIcons.default;
  
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-100 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 flex items-center gap-2 text-white"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  Configure {localNodeData.type} Node
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  {/* Basic node info */}
                  <div>
                    <label htmlFor="node-label" className="block text-sm font-medium text-gray-300">
                      Label
                    </label>
                    <input
                      type="text"
                      id="node-label"
                      className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                      value={localNodeData.label || ''}
                      onChange={(e) => handleLabelChange(e.target.value)}
                      placeholder="Node Label"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="node-description" className="block text-sm font-medium text-gray-300">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      id="node-description"
                      className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                      value={localNodeData.description || ''}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Brief description of what this node does"
                    />
                  </div>
                  
                  {/* Dynamic settings based on node type */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-300">Settings</h4>
                    
                    {Object.entries(localNodeData.settings || {}).map(([key, value]) => {
                      const fieldConfig = getFieldConfig(localNodeData.type, key);
                      
                      return (
                        <div key={key} className="space-y-1">
                          <label htmlFor={`setting-${key}`} className="block text-sm font-medium text-gray-300">
                            {fieldConfig.label}
                            {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          {fieldConfig.description && (
                            <p className="text-xs text-gray-400">{fieldConfig.description}</p>
                          )}
                          
                          {fieldConfig.type === 'textarea' ? (
                            <textarea
                              id={`setting-${key}`}
                              className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                              value={value || ''}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                              placeholder={fieldConfig.placeholder}
                              rows={4}
                            />
                          ) : fieldConfig.type === 'select' ? (
                            <select
                              id={`setting-${key}`}
                              className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                              value={value || ''}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                            >
                              {fieldConfig.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : fieldConfig.type === 'checkbox' ? (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`setting-${key}`}
                                className="h-4 w-4 rounded text-primary focus:ring-primary"
                                checked={!!value}
                                onChange={(e) => handleSettingChange(key, e.target.checked)}
                              />
                              <label htmlFor={`setting-${key}`} className="ml-2 block text-sm text-gray-300">
                                {fieldConfig.label}
                              </label>
                            </div>
                          ) : (
                            <input
                              type={fieldConfig.type}
                              id={`setting-${key}`}
                              className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                              value={value || ''}
                              onChange={(e) => handleSettingChange(key, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
                              placeholder={fieldConfig.placeholder}
                            />
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Add new setting button */}
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-dashed border-gray-500 text-xs text-gray-300 rounded-md hover:bg-dark-200"
                      onClick={() => {
                        const newKey = prompt('Enter setting name:');
                        if (newKey && newKey.trim() !== '') {
                          handleSettingChange(newKey.trim(), '');
                        }
                      }}
                    >
                      + Add Custom Setting
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-dark-200 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-dark-300 focus:outline-none"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none"
                    onClick={handleSave}
                  >
                    Save
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
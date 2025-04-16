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
  CloudIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  UserIcon,
  TableCellsIcon,
  BeakerIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ChartBarIcon,
  FolderIcon,
  PaperAirplaneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Map of node types to icons for representation
const nodeTypeIcons: Record<string, any> = {
  'extract-webpage': DocumentTextIcon,
  'send-email': EnvelopeIcon,
  'wait': ClockIcon,
  'api': ServerIcon,
  'process-data': AdjustmentsHorizontalIcon,
  'cloud-function': CloudIcon,
  'chatbot': ChatBubbleLeftRightIcon,
  'conditional': ArrowPathIcon,
  'contact': UserIcon,
  'database': TableCellsIcon,
  'transform': BeakerIcon,
  'code': CodeBracketIcon,
  'ml-model': CpuChipIcon,
  'analytics': ChartBarIcon,
  'file-manager': FolderIcon,
  'social-post': PaperAirplaneIcon,
  'scheduler': CalendarIcon,
  'default': AdjustmentsHorizontalIcon
};

// Field type definitions
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'select' | 'checkbox' | 'date' | 'time' | 'json' | 'code' | 'color';

export interface FieldConfig {
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  defaultValue?: any;
  language?: string; // For code editor
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
    },
    maxDepth: {
      type: 'number',
      label: 'Max Depth',
      description: 'Maximum crawl depth for linked pages',
      defaultValue: 1
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
    },
    attachments: {
      type: 'text',
      label: 'Attachments',
      description: 'Comma-separated file paths to attach',
      placeholder: '/path/to/file1.pdf, /path/to/file2.jpg'
    },
    sendAt: {
      type: 'date',
      label: 'Send At',
      description: 'Schedule email for later delivery'
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
    },
    condition: {
      type: 'text',
      label: 'Condition',
      description: 'Wait until this condition is met',
      placeholder: '{{variable}} == "value"'
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
        { label: 'DELETE', value: 'DELETE' },
        { label: 'PATCH', value: 'PATCH' }
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
    },
    authentication: {
      type: 'select',
      label: 'Authentication',
      description: 'Authentication method',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Basic Auth', value: 'basic' },
        { label: 'Bearer Token', value: 'bearer' },
        { label: 'API Key', value: 'apikey' },
        { label: 'OAuth 2.0', value: 'oauth2' }
      ],
      defaultValue: 'none'
    },
    retryCount: {
      type: 'number',
      label: 'Retry Count',
      description: 'Number of retries on failure',
      defaultValue: 3
    }
  },
  'process-data': {
    inputFormat: {
      type: 'select',
      label: 'Input Format',
      description: 'Format of the input data',
      options: [
        { label: 'JSON', value: 'json' },
        { label: 'CSV', value: 'csv' },
        { label: 'XML', value: 'xml' },
        { label: 'Text', value: 'text' }
      ],
      defaultValue: 'json'
    },
    outputFormat: {
      type: 'select',
      label: 'Output Format',
      description: 'Format of the output data',
      options: [
        { label: 'JSON', value: 'json' },
        { label: 'CSV', value: 'csv' },
        { label: 'XML', value: 'xml' },
        { label: 'Text', value: 'text' }
      ],
      defaultValue: 'json'
    },
    transformation: {
      type: 'textarea',
      label: 'Transformation',
      description: 'Transformation expression or mapping',
      placeholder: '{ "newField": data.oldField }'
    },
    filterCondition: {
      type: 'text',
      label: 'Filter Condition',
      description: 'Filter data based on this condition',
      placeholder: 'data.age > 30'
    }
  },
  'database': {
    connectionString: {
      type: 'text',
      label: 'Connection String',
      description: 'Database connection string',
      placeholder: 'postgresql://user:password@localhost:5432/mydb',
      required: true
    },
    query: {
      type: 'textarea',
      label: 'SQL Query',
      description: 'SQL query to execute',
      placeholder: 'SELECT * FROM users WHERE active = true',
      required: true
    },
    queryType: {
      type: 'select',
      label: 'Query Type',
      description: 'Type of SQL operation',
      options: [
        { label: 'Select', value: 'select' },
        { label: 'Insert', value: 'insert' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' }
      ],
      defaultValue: 'select'
    },
    parameters: {
      type: 'textarea',
      label: 'Query Parameters',
      description: 'Parameters as JSON object',
      placeholder: '{"id": 123, "status": "active"}'
    }
  },
  'conditional': {
    condition: {
      type: 'text',
      label: 'Condition',
      description: 'Condition to evaluate',
      placeholder: '{{variable}} == "value"',
      required: true
    },
    trueLabel: {
      type: 'text',
      label: 'True Path Label',
      description: 'Label for the true condition path',
      defaultValue: 'True'
    },
    falseLabel: {
      type: 'text',
      label: 'False Path Label',
      description: 'Label for the false condition path',
      defaultValue: 'False'
    }
  },
  'chatbot': {
    initialMessage: {
      type: 'text',
      label: 'Initial Message',
      description: 'First message to send to the user',
      placeholder: 'Hello! How can I help you today?'
    },
    model: {
      type: 'select',
      label: 'AI Model',
      description: 'AI model to use for responses',
      options: [
        { label: 'GPT-4o', value: 'gpt-4o' },
        { label: 'Claude 3', value: 'claude-3' },
        { label: 'Llama 3', value: 'llama-3' }
      ],
      defaultValue: 'gpt-4o'
    },
    systemPrompt: {
      type: 'textarea',
      label: 'System Prompt',
      description: 'Instructions for the AI',
      placeholder: 'You are a helpful assistant that helps customers with product inquiries.'
    },
    maxTurns: {
      type: 'number',
      label: 'Max Turns',
      description: 'Maximum conversation turns before escalation',
      defaultValue: 5
    },
    fallbackMessage: {
      type: 'text',
      label: 'Fallback Message',
      description: 'Message when the bot cannot help',
      placeholder: "I'm sorry, I'll connect you with a human agent."
    }
  },
  'social-post': {
    platform: {
      type: 'select',
      label: 'Platform',
      description: 'Social media platform',
      options: [
        { label: 'Twitter/X', value: 'twitter' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Instagram', value: 'instagram' }
      ],
      required: true
    },
    content: {
      type: 'textarea',
      label: 'Content',
      description: 'Post content',
      placeholder: 'Check out our latest product launch!',
      required: true
    },
    media: {
      type: 'text',
      label: 'Media URLs',
      description: 'Comma-separated list of media URLs',
      placeholder: 'https://example.com/image1.jpg, https://example.com/image2.jpg'
    },
    scheduledTime: {
      type: 'date',
      label: 'Scheduled Time',
      description: 'When to publish the post'
    }
  },
  'code': {
    language: {
      type: 'select',
      label: 'Language',
      description: 'Programming language',
      options: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'PHP', value: 'php' },
        { label: 'Ruby', value: 'ruby' },
        { label: 'Shell', value: 'shell' }
      ],
      defaultValue: 'javascript'
    },
    code: {
      type: 'textarea',
      label: 'Code',
      description: 'Code to execute',
      placeholder: 'console.log("Hello World");',
      required: true
    },
    timeout: {
      type: 'number',
      label: 'Timeout',
      description: 'Max execution time in seconds',
      defaultValue: 30
    },
    environmentVariables: {
      type: 'textarea',
      label: 'Environment Variables',
      description: 'Environment variables as JSON',
      placeholder: '{"API_KEY": "abc123", "DEBUG": "true"}'
    }
  },
  'ml-model': {
    modelType: {
      type: 'select',
      label: 'Model Type',
      description: 'Type of machine learning model',
      options: [
        { label: 'Classification', value: 'classification' },
        { label: 'Regression', value: 'regression' },
        { label: 'Clustering', value: 'clustering' },
        { label: 'Image Recognition', value: 'image' },
        { label: 'Natural Language', value: 'nlp' }
      ],
      required: true
    },
    modelURL: {
      type: 'url',
      label: 'Model URL',
      description: 'URL for the model endpoint or file',
      placeholder: 'https://api.example.com/models/sentiment',
      required: true
    },
    inputMapping: {
      type: 'textarea',
      label: 'Input Mapping',
      description: 'Map workflow data to model inputs',
      placeholder: '{"text": "{{data.content}}", "language": "en"}'
    },
    outputMapping: {
      type: 'textarea',
      label: 'Output Mapping',
      description: 'Map model outputs to workflow data',
      placeholder: '{"sentiment": "result.label", "confidence": "result.score"}'
    }
  },
  'analytics': {
    trackingId: {
      type: 'text',
      label: 'Tracking ID',
      description: 'Analytics tracking identifier',
      placeholder: 'UA-XXXXXXXX-X',
      required: true
    },
    eventType: {
      type: 'select',
      label: 'Event Type',
      description: 'Type of analytics event',
      options: [
        { label: 'Page View', value: 'pageview' },
        { label: 'Event', value: 'event' },
        { label: 'Transaction', value: 'transaction' },
        { label: 'Social', value: 'social' },
        { label: 'Timing', value: 'timing' }
      ],
      defaultValue: 'event'
    },
    eventCategory: {
      type: 'text',
      label: 'Event Category',
      description: 'Category of the event',
      placeholder: 'Workflow'
    },
    eventAction: {
      type: 'text',
      label: 'Event Action',
      description: 'Action performed',
      placeholder: 'Node Execution'
    },
    eventLabel: {
      type: 'text',
      label: 'Event Label',
      description: 'Label for the event',
      placeholder: '{{nodeId}}'
    },
    eventValue: {
      type: 'number',
      label: 'Event Value',
      description: 'Numeric value for the event',
      placeholder: '1'
    }
  },
  'file-manager': {
    operation: {
      type: 'select',
      label: 'Operation',
      description: 'File operation to perform',
      options: [
        { label: 'Read', value: 'read' },
        { label: 'Write', value: 'write' },
        { label: 'Append', value: 'append' },
        { label: 'Delete', value: 'delete' },
        { label: 'Copy', value: 'copy' },
        { label: 'Move', value: 'move' },
        { label: 'Rename', value: 'rename' }
      ],
      required: true
    },
    sourcePath: {
      type: 'text',
      label: 'Source Path',
      description: 'Path to the source file',
      placeholder: '/path/to/source.txt',
      required: true
    },
    destinationPath: {
      type: 'text',
      label: 'Destination Path',
      description: 'Path to the destination file',
      placeholder: '/path/to/destination.txt'
    },
    content: {
      type: 'textarea',
      label: 'Content',
      description: 'Content to write to the file',
      placeholder: 'File content goes here'
    },
    encoding: {
      type: 'select',
      label: 'Encoding',
      description: 'File encoding',
      options: [
        { label: 'UTF-8', value: 'utf8' },
        { label: 'ASCII', value: 'ascii' },
        { label: 'Binary', value: 'binary' }
      ],
      defaultValue: 'utf8'
    }
  },
  'scheduler': {
    scheduleType: {
      type: 'select',
      label: 'Schedule Type',
      description: 'Type of schedule',
      options: [
        { label: 'One-time', value: 'once' },
        { label: 'Recurring', value: 'recurring' }
      ],
      required: true
    },
    startDate: {
      type: 'date',
      label: 'Start Date',
      description: 'When to start the schedule',
      required: true
    },
    cronExpression: {
      type: 'text',
      label: 'Cron Expression',
      description: 'Cron expression for recurring schedules',
      placeholder: '0 9 * * 1-5'
    },
    endDate: {
      type: 'date',
      label: 'End Date',
      description: 'When to end the schedule (optional)'
    },
    timezone: {
      type: 'text',
      label: 'Timezone',
      description: 'Timezone for the schedule',
      placeholder: 'America/New_York',
      defaultValue: 'UTC'
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
  } else if (fieldKey.includes('description') || fieldKey.includes('body') || fieldKey.includes('content') || fieldKey.includes('code') || fieldKey.includes('query')) {
    return { type: 'textarea', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('enabled') || fieldKey.includes('active') || fieldKey.startsWith('is') || fieldKey.startsWith('has')) {
    return { type: 'checkbox', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('date')) {
    return { type: 'date', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('time')) {
    return { type: 'time', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('color')) {
    return { type: 'color', label: formatFieldName(fieldKey) };
  } else if (fieldKey.includes('json') || fieldKey.includes('config')) {
    return { type: 'textarea', label: formatFieldName(fieldKey) };
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
    .replace(/Api/g, 'API')
    .replace(/Sql/g, 'SQL')
    .replace(/Json/g, 'JSON')
    .replace(/Xml/g, 'XML')
    .replace(/Csv/g, 'CSV')
    .replace(/Id/g, 'ID');
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
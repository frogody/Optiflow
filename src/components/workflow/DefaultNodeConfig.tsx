'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  DocumentTextIcon, 
  EnvelopeIcon, 
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

// Node type to icon mapping
const nodeTypeIcons: Record<string, any> = {
  'extract-webpage': DocumentTextIcon,
  'send-email': EnvelopeIcon,
  'wait': ClockIcon,
  'contact': UserIcon,
  'chatbot': ChatBubbleLeftRightIcon,
  'transform': ArrowPathIcon,
  'branch': ArrowsPointingOutIcon,
  'first-outreach-email': EnvelopeIcon,
};

export interface DefaultNodeData {
  id: string;
  type: string;
  label: string;
  description?: string;
  settings?: Record<string, any>;
  onConfigChange?: (data: DefaultNodeData) => void;
}

interface DefaultNodeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DefaultNodeData) => void;
  nodeData: DefaultNodeData;
}

// Field configuration for different node types
const nodeFieldConfigs: Record<string, Array<{ name: string, label: string, type: string, placeholder?: string, options?: Array<{ value: string, label: string }> }>> = {
  'extract-webpage': [
    { name: 'url', label: 'URL to extract', type: 'text', placeholder: 'https://example.com' },
    { name: 'selector', label: 'CSS Selector (optional)', type: 'text', placeholder: '.content' },
    { name: 'includeImages', label: 'Include Images', type: 'checkbox' },
  ],
  'send-email': [
    { name: 'to', label: 'To', type: 'text', placeholder: '{{contact.email}}' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Follow up on our conversation' },
    { name: 'template', label: 'Email Template', type: 'select', options: [
      { value: 'intro', label: 'Introduction' },
      { value: 'followup', label: 'Follow Up' },
      { value: 'cold-outreach', label: 'Cold Outreach' },
      { value: 'custom', label: 'Custom' },
    ]},
    { name: 'body', label: 'Email Body', type: 'textarea', placeholder: 'Hello {{contact.firstName}},' },
  ],
  'first-outreach-email': [
    { name: 'to', label: 'To', type: 'text', placeholder: '{{contact.email}}' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Opportunity with our solution' },
    { name: 'template', label: 'Email Template', type: 'select', options: [
      { value: 'intro', label: 'Introduction' },
      { value: 'product-demo', label: 'Product Demo Request' },
      { value: 'cold-outreach', label: 'Cold Outreach' },
      { value: 'custom', label: 'Custom' },
    ]},
    { name: 'body', label: 'Email Body', type: 'textarea', placeholder: 'Hello {{contact.firstName}},' },
  ],
  'wait': [
    { name: 'duration', label: 'Duration', type: 'number', placeholder: '3' },
    { name: 'unit', label: 'Time Unit', type: 'select', options: [
      { value: 'minutes', label: 'Minutes' },
      { value: 'hours', label: 'Hours' },
      { value: 'days', label: 'Days' },
    ]},
  ],
  'contact': [
    { name: 'action', label: 'Action', type: 'select', options: [
      { value: 'create', label: 'Create New Contact' },
      { value: 'update', label: 'Update Existing Contact' },
      { value: 'find', label: 'Find Contact' },
    ]},
    { name: 'source', label: 'Data Source', type: 'select', options: [
      { value: 'input', label: 'Input Data' },
      { value: 'crm', label: 'CRM' },
    ]},
  ],
  'transform': [
    { name: 'transformType', label: 'Transformation Type', type: 'select', options: [
      { value: 'filter', label: 'Filter Data' },
      { value: 'map', label: 'Map Fields' },
      { value: 'sort', label: 'Sort Data' },
      { value: 'format', label: 'Format Data' },
    ]},
    { name: 'expression', label: 'Transformation Expression', type: 'textarea', placeholder: '// Write transformation logic here' },
  ],
  'branch': [
    { name: 'condition', label: 'Condition', type: 'textarea', placeholder: '// Write condition here\nreturn input.score > 50;' },
    { name: 'branches', label: 'Number of Branches', type: 'select', options: [
      { value: '2', label: '2 (Yes/No)' },
      { value: '3', label: '3 (Low/Medium/High)' },
      { value: 'custom', label: 'Custom' },
    ]},
  ],
  'chatbot': [
    { name: 'initialMessage', label: 'Initial Message', type: 'textarea', placeholder: 'Hello! How can I help you today?' },
    { name: 'model', label: 'AI Model', type: 'select', options: [
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
      { value: 'claude-3', label: 'Claude 3' },
    ]},
    { name: 'knowledgeBase', label: 'Knowledge Base', type: 'select', options: [
      { value: 'none', label: 'None' },
      { value: 'product-docs', label: 'Product Documentation' },
      { value: 'support-kb', label: 'Support Knowledge Base' },
    ]},
  ],
};

export default function DefaultNodeConfig({ isOpen, onClose, onSave, nodeData }: DefaultNodeConfigProps) {
  const [formData, setFormData] = useState<DefaultNodeData>({
    ...nodeData,
    settings: nodeData.settings || {},
  });

  // Determine node type for field config
  const nodeType = nodeData.id.split('-')[0];
  const fields = nodeFieldConfigs[nodeType] || nodeFieldConfigs[nodeData.id] || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: inputValue,
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  // Get the icon for this node type
  const Icon = nodeTypeIcons[nodeType] || nodeTypeIcons[nodeData.id] || DocumentTextIcon;

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-dark-50 p-6 shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary mr-3">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                    Configure: {formData.label}
                  </Dialog.Title>
                </div>
                
                <div className="space-y-6">
                  {/* Node Name Field */}
                  <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-200 mb-1">
                      Node Name
                    </label>
                    <input
                      type="text"
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
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
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  {/* Dynamic Node-specific Fields */}
                  {fields.length > 0 && (
                    <div className="border-t border-dark-200 pt-4 mt-4">
                      <h4 className="text-md font-medium text-white mb-3">Node Settings</h4>
                      <div className="space-y-4">
                        {fields.map((field) => (
                          <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-200 mb-1">
                              {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                id={field.name}
                                name={field.name}
                                rows={4}
                                value={formData.settings?.[field.name] || ''}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                              />
                            ) : field.type === 'select' ? (
                              <select
                                id={field.name}
                                name={field.name}
                                value={formData.settings?.[field.name] || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="">Select...</option>
                                {field.options?.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === 'checkbox' ? (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={field.name}
                                  name={field.name}
                                  checked={formData.settings?.[field.name] || false}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={field.name} className="ml-2 text-sm text-gray-300">
                                  {field.label}
                                </label>
                              </div>
                            ) : (
                              <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={formData.settings?.[field.name] || ''}
                                onChange={handleInputChange}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 bg-dark-100 border border-dark-200 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
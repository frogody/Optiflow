'use client';

import { CheckIcon, CogIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';

import DefaultNodeConfig, { DefaultNodeData } from './DefaultNodeConfig';

interface DefaultNodeProps {
  data: DefaultNodeData;
  selected: boolean;
  isConnectable: boolean;
  id: string;
}

// Inline edit field component for direct editing without modal
interface InlineEditFieldProps {
  name: string;
  value: any;
  type: string;
  onChange: (name: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

function InlineEditField({ name, value, type, onChange, onSave, onCancel }: InlineEditFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { const newValue = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    onChange(name, newValue);
      };

  return (
    <div className="flex items-center space-x-2">
      {type === 'textarea' ? (
        <textarea
          className="flex-1 bg-dark-100 border border-primary text-white px-2 py-1 text-xs rounded"
          value={value || ''}
          onChange={handleChange}
          rows={2}
          title="Edit value"
          placeholder="Enter value"
        />
      ) : type === 'select' ? (
        <select
          className="flex-1 bg-dark-100 border border-primary text-white px-2 py-1 text-xs rounded"
          value={value || ''}
          onChange={handleChange}
          title="Select option"
        >
          <option value="">Select...</option>
          {/* Options would be dynamically populated based on field type */}
        </select>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={value || false}
          onChange={handleChange}
          className="h-4 w-4 rounded text-primary focus:ring-primary"
          title="Toggle option"
        />
      ) : (
        <input
          type={type}
          className="flex-1 bg-dark-100 border border-primary text-white px-2 py-1 text-xs rounded"
          value={value || ''}
          onChange={handleChange}
          title="Edit value"
          placeholder="Enter value"
        />
      )}
      <button 
        onClick={onSave} 
        className="p-1 rounded bg-green-800 hover:bg-green-700"
        title="Save"
      >
        <CheckIcon className="h-3 w-3 text-white" />
      </button>
      <button 
        onClick={onCancel} 
        className="p-1 rounded bg-red-800 hover:bg-red-700"
        title="Cancel"
      >
        <XMarkIcon className="h-3 w-3 text-white" />
      </button>
    </div>
  );
}

export default function DefaultNode({ data, selected, isConnectable, id }: DefaultNodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [nodeData, setNodeData] = useState<DefaultNodeData>({
    id,
    type: data.type || 'default',
    label: data.label,
    description: data.description,
    settings: data.settings || {},
  });
  
  // Track which field is being edited inline
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempEditValue, setTempEditValue] = useState<any>(null);
  
  const handleConfigure = () => {
    setIsConfigOpen(true);
  };
  
  const handleConfigSave = (updatedData: DefaultNodeData) => {
    setNodeData(updatedData);
    
    // If the component has an onConfigChange prop, call it
    if (data.onConfigChange) {
      data.onConfigChange(updatedData);
    }
  };
  
  // Start editing a specific field
  const startEditingField = (key: string, value: any) => {
    setEditingField(key);
    setTempEditValue(value);
  };
  
  // Handle inline field change
  const handleInlineFieldChange = (name: string, value: any) => {
    setTempEditValue(value);
  };
  
  // Save inline edit
  const saveInlineEdit = () => {
    if (editingField !== null) {
      const updatedSettings = { ...nodeData.settings,
        [editingField]: tempEditValue
          };
      
      const updatedData = { ...nodeData,
        settings: updatedSettings
          };
      
      setNodeData(updatedData);
      
      // If the component has an onConfigChange prop, call it
      if (data.onConfigChange) {
        data.onConfigChange(updatedData);
      }
      
      // Reset editing state
      setEditingField(null);
      setTempEditValue(null);
    }
  };
  
  // Cancel inline edit
  const cancelInlineEdit = () => {
    setEditingField(null);
    setTempEditValue(null);
  };
  
  return (
    <>
      <div 
        className={`
          relative p-4 min-w-[220px] 
          ${ selected ? 'shadow-neon' : ''    }
          transition-all duration-300
        `}
        style={{ backgroundColor: 'transparent',
            }}
      >
        <div className={`
          absolute inset-0 rounded-xl
          ${ selected ? 'border-2 border-primary' : 'border border-gray-700'    }
          bg-dark-50
          `}
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)'
              }}
        />
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-400 z-10"
          isConnectable={isConnectable}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {nodeData.label}
              </p>
              {nodeData.description && (
                <p className="text-xs text-gray-400 mt-1">
                  {nodeData.description}
                </p>
              )}
            </div>
            <button
              className="p-1 rounded-md hover:bg-dark-200 transition-colors ml-2"
              onClick={handleConfigure}
              title="Configure node"
            >
              <CogIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          {/* Show some settings summary if available */}
          {nodeData.settings && Object.keys(nodeData.settings).length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="flex flex-col gap-2">
                {Object.entries(nodeData.settings).map(([key, value]) => (
                  <div key={key}>
                    {editingField === key ? (
                      <InlineEditField
                        name={key}
                        value={tempEditValue}
                        type="text" // Would be determined by field type in a real implementation
                        onChange={handleInlineFieldChange}
                        onSave={saveInlineEdit}
                        onCancel={cancelInlineEdit}
                      />
                    ) : (
                      <div 
                        className="flex items-center justify-between text-xs px-2 py-1 rounded-md bg-dark-200 text-gray-300 cursor-pointer hover:bg-dark-300"
                        onClick={() => selected && startEditingField(key, value)}
                      >
                        <span className="font-medium">{key}:</span>
                        <span className="truncate max-w-[120px]">
                          { typeof value === 'boolean' 
                            ? (value ? 'Yes' : 'No')
                            : String(value).length > 15 
                              ? String(value).substring(0, 12) + '&hellip;'
                              : String(value)
                              }
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {selected && Object.keys(nodeData.settings).length > 0 && (
                  <div className="text-xs text-gray-400 italic mt-1">
                    Click on a setting to edit
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-400 z-10"
          isConnectable={isConnectable}
        />
      </div>
      
      {isConfigOpen && (
        <DefaultNodeConfig
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          onSave={handleConfigSave}
          nodeData={nodeData}
        />
      )}
    </>
  );
} 
'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { CogIcon } from '@heroicons/react/24/outline';
import DefaultNodeConfig, { DefaultNodeData } from './DefaultNodeConfig';

interface DefaultNodeProps {
  data: DefaultNodeData;
  selected: boolean;
  isConnectable: boolean;
  id: string;
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
  
  return (
    <>
      <div 
        className={`
          relative bg-dark-50 p-4 rounded-lg border-2 min-w-[200px] shadow-lg
          ${selected ? 'border-primary shadow-neon' : 'border-gray-700'}
          transition-all duration-300 backdrop-blur-sm
        `}
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)'
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-400"
          isConnectable={isConnectable}
        />
        
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
          >
            <CogIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        
        {/* Show some settings summary if available */}
        {nodeData.settings && Object.keys(nodeData.settings).length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="flex flex-wrap gap-2">
              {Object.entries(nodeData.settings).slice(0, 2).map(([key, value]) => (
                <div 
                  key={key}
                  className="text-xs px-2 py-1 rounded-full bg-dark-200 text-gray-300"
                >
                  {typeof value === 'boolean' 
                    ? (value ? key : `no ${key}`)
                    : `${key}: ${String(value).length > 10 ? String(value).substring(0, 8) + '...' : value}`
                  }
                </div>
              ))}
              {Object.keys(nodeData.settings).length > 2 && (
                <div className="text-xs px-2 py-1 rounded-full bg-dark-200 text-gray-300">
                  +{Object.keys(nodeData.settings).length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-400"
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
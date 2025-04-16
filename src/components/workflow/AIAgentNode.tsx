'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { WrenchScrewdriverIcon, CogIcon } from '@heroicons/react/24/outline';
import AIAgentConfig, { AIAgentConfigData } from './AIAgentConfig';

interface AIAgentNodeProps {
  data: {
    label: string;
    description?: string;
    config?: AIAgentConfigData;
    onConfigChange?: (config: AIAgentConfigData) => void;
  };
  selected: boolean;
}

export default function AIAgentNode({ data, selected }: AIAgentNodeProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [nodeConfig, setNodeConfig] = useState<AIAgentConfigData | undefined>(data.config);
  
  const handleConfigure = () => {
    setIsConfigOpen(true);
  };
  
  const handleConfigSave = (config: AIAgentConfigData) => {
    setNodeConfig(config);
    if (data.onConfigChange) {
      data.onConfigChange(config);
    }
  };
  
  // Get the tools used
  const toolCount = nodeConfig?.tools?.length || 0;
  
  return (
    <>
      <div className={`
        relative rounded-lg bg-dark-50 border-2 transition-all duration-200 min-w-[240px]
        ${selected ? 'border-primary shadow-neon' : 'border-gray-700 shadow-md'}
      `}>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-400"
        />
        
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mr-3">
              <WrenchScrewdriverIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">
                {nodeConfig?.name || data.label}
              </h3>
              <p className="text-xs text-gray-400">
                {nodeConfig?.description || data.description || "Analyze content with AI"}
              </p>
            </div>
            <button 
              className="ml-auto p-1.5 rounded-md hover:bg-dark-200 transition-colors"
              onClick={handleConfigure}
            >
              <CogIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          {nodeConfig && (
            <div className="mt-3 border-t border-gray-700 pt-3 text-xs text-gray-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Model:</span>
                <span className="font-medium text-gray-300">{nodeConfig.model}</span>
              </div>
              {toolCount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Tools enabled:</span>
                  <span className="font-medium text-gray-300">{toolCount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Type:</span>
                <span className="font-medium text-gray-300">{nodeConfig.type}</span>
              </div>
            </div>
          )}
        </div>
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-blue-400"
        />
      </div>
      
      {isConfigOpen && (
        <AIAgentConfig
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          onSave={handleConfigSave}
          initialConfig={nodeConfig}
        />
      )}
    </>
  );
} 
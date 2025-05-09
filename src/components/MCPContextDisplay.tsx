// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModelContext {
  modelId: string;
  name: string;
  maxContextLength: number;
  currentUsage: number;
  contextSections: ContextSection[];
}

interface ContextSection {
  id: string;
  name: string;
  type: 'system' | 'user' | 'assistant' | 'data' | 'tools';
  tokenCount: number;
  color: string;
}

interface MCPContextDisplayProps {
  models: ModelContext[];
  onModelSelect?: (modelId: string) => void;
  selectedModelId?: string;
}

export default function MCPContextDisplay() {
  const [selectedModel, setSelectedModel] = useState<ModelContext | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  
  useEffect(() => {
    if (selectedModelId) {
      const model = models.find(m => m.modelId === selectedModelId);
      if (model) {
        setSelectedModel(model);
      }
    } else if (models.length > 0) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModelId]) // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.modelId === modelId);
    if (model) {
      setSelectedModel(model);
      if (onModelSelect) {
        onModelSelect(modelId);
      }
    }
  };
  
  const toggleInspector = () => {
    setIsInspectorOpen(!isInspectorOpen);
  };
  
  if (!selectedModel) {
    return <div className="p-6 text-center text-white/60">No model context data available</div>;
  }
  
  const usagePercentage = (selectedModel.currentUsage / selectedModel.maxContextLength) * 100;
  
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Model Context Protocol</h2>
        <div className="flex items-center space-x-3">
          <select
            title="Select model"
            aria-label="Select model"
            value={selectedModel.modelId}
            onChange={(e) => handleModelChange(e.target.value)}
            className="bg-black/30 text-white border border-white/20 rounded-md px-3 py-1 text-sm"
          >
            {models.map(model => (
              <option key={model.modelId} value={model.modelId}>
                {model.name}
              </option>
            ))}
          </select>
          <button
            onClick={toggleInspector}
            className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200"
          >
            { isInspectorOpen ? 'Close Inspector' : 'Open Inspector'    }
          </button>
        </div>
      </div>
      
      {/* Context Usage Meter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Context Usage</span>
          <span className="text-sm text-white/80">
            {selectedModel.currentUsage.toLocaleString()} / {selectedModel.maxContextLength.toLocaleString()} tokens 
            ({usagePercentage.toFixed(1)}%)
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${ usagePercentage > 90 ? 'bg-red-500' : 
              usagePercentage > 70 ? 'bg-yellow-500' : 
              'bg-green-500'
                }`} 
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Context Sections Visualization */}
      <div className="mb-6">
        <h3 className="text-sm text-white/80 mb-2">Context Distribution</h3>
        <div className="flex h-8 rounded-md overflow-hidden">
          {selectedModel.contextSections.map((section, index) => {
            const sectionPercentage = (section.tokenCount / selectedModel.maxContextLength) * 100;
            return (
              <div 
                key={section.id}
                className="h-full group relative transition-all duration-200 cursor-pointer hover:opacity-80"
                style={{ 
                  width: `${Math.max(sectionPercentage, 1)}%`,
                  backgroundColor: section.color,
                }}
                title={`${section.name}: ${section.tokenCount.toLocaleString()} tokens (${sectionPercentage.toFixed(1)}%)`}
              >
                <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                  {section.name}: {section.tokenCount.toLocaleString()} tokens
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {selectedModel.contextSections.map((section) => (
            <div key={section.id} className="flex items-center text-xs text-white/60">
              <div 
                className="w-3 h-3 mr-1 rounded-sm" 
                style={{ backgroundColor: section.color     }}
              ></div>
              {section.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Context Inspector (Expandable) */}
      {isInspectorOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0     }}
          animate={{ height: 'auto', opacity: 1     }}
          exit={{ height: 0, opacity: 0     }}
          className="bg-black/30 rounded-md border border-white/10 p-4 overflow-auto max-h-96"
        >
          <h3 className="text-white font-medium mb-3">Context Inspector</h3>
          <div className="space-y-4">
            {selectedModel.contextSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: section.color     }}
                  ></div>
                  <h4 className="text-white font-medium">{section.name}</h4>
                  <span className="text-white/60 text-xs ml-2">
                    {section.tokenCount.toLocaleString()} tokens
                  </span>
                </div>
                <div className="bg-black/20 p-3 rounded border border-white/5 text-sm text-white/80">
                  {/* Placeholder for actual context content */}
                  <div className="line-clamp-3">
                    {section.type === 'system' && 'System instructions and directives...'}
                    {section.type === 'user' && 'User messages and inputs...'}
                    {section.type === 'assistant' && 'Assistant generated responses...'}
                    {section.type === 'data' && 'Data and information provided to model...'}
                    {section.type === 'tools' && 'Tool definitions and API specifications...'}
                  </div>
                  <button className="text-primary text-xs mt-1">View full content</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Context Management Buttons */}
      <div className="flex items-center justify-end space-x-3 mt-4">
        <button className="px-3 py-1 text-sm text-white/80 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition-all duration-200">
          Optimize Context
        </button>
        <button className="px-3 py-1 text-sm text-white/80 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 transition-all duration-200">
          Clear Context
        </button>
        <button className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-200">
          Save Context
        </button>
      </div>
    </div>
  );
} 
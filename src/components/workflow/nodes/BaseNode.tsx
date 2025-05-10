'use client';

import React from 'react';
import { Handle, Position } from 'reactflow';

// Shared styles for all nodes
export const nodeStyles = {
  base: 'px-3 py-2 rounded-lg border shadow-sm min-w-[180px] bg-[#1F2937] hover:shadow-md transition-shadow duration-200',
  selected: 'ring-2 ring-[#22D3EE]',
  trigger: 'border-[#F97316] bg-[#7C2D12]/40',
  action: 'border-[#22D3EE] bg-[#164E63]/40',
  condition: 'border-[#A855F7] bg-[#6B21A8]/40',
  loop: 'border-[#F59E0B] bg-[#78350F]/40',
  error: 'border-[#EF4444] bg-[#7F1D1D]/40',
  integration: 'border-[#10B981] bg-[#065F46]/40',
  utility: 'border-[#6366F1] bg-[#3730A3]/40',
  transform: 'border-[#EC4899] bg-[#831843]/40',
  ai: 'border-[#8B5CF6] bg-[#4C1D95]/40',
  title: 'flex items-center font-medium text-white mb-1',
  content: 'text-xs text-gray-300',
  icon: 'h-5 w-5 mr-2 flex-shrink-0',
  handleIn: 'w-3 h-3 bg-gray-400 border border-gray-600 top-1/2',
  handleOut: 'w-3 h-3 bg-gray-400 border border-gray-600 top-1/2'
};

// Node type definitions for TypeScript
interface NodeProps {
  data: {
    label: string;
    description?: string;
    selected?: boolean;
    config?: any;
  };
  selected?: boolean;
  type: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}

// Base node component that other nodes will extend
export const BaseNode: React.FC<NodeProps> = ({ 
  data, 
  selected, 
  type, 
  icon: Icon,
  children 
}) => {
  // Determine node style based on type
  const getNodeStyle = () => {
    let style = nodeStyles.base;
    
    // Add type-specific styling
    switch (type) {
      case 'trigger': style += ' ' + nodeStyles.trigger; break;
      case 'action': style += ' ' + nodeStyles.action; break;
      case 'condition': style += ' ' + nodeStyles.condition; break;
      case 'loop': style += ' ' + nodeStyles.loop; break;
      case 'error': style += ' ' + nodeStyles.error; break;
      case 'integration': style += ' ' + nodeStyles.integration; break;
      case 'utility': style += ' ' + nodeStyles.utility; break;
      case 'transform': style += ' ' + nodeStyles.transform; break;
      case 'ai': style += ' ' + nodeStyles.ai; break;
      default: style += ' ' + nodeStyles.action;
    }
    
    // Add selected styling if selected
    if (selected || data.selected) {
      style += ' ' + nodeStyles.selected;
    }
    
    return style;
  };
  
  return (
    <div className={getNodeStyle()}>
      <Handle
        type="target"
        position={Position.Left}
        className={nodeStyles.handleIn}
      />
      
      <div className={nodeStyles.title}>
        <Icon className={nodeStyles.icon} />
        <span>{data.label}</span>
      </div>
      
      {data.description && (
        <div className={nodeStyles.content}>
          {data.description}
        </div>
      )}
      
      {children}
      
      <Handle
        type="source"
        position={Position.Right}
        className={nodeStyles.handleOut}
      />
    </div>
  );
}; 
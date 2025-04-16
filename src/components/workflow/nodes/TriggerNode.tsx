import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const TriggerNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-500/90 to-blue-700 rounded-md shadow-lg p-4 min-w-[180px]">
      <div className="flex items-center mb-2">
        <span className="text-xl mr-2">{data.icon || '🔔'}</span>
        <div className="text-white font-medium">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-white/70 text-xs">{data.description}</div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-300"
      />
    </div>
  );
};

export default memo(TriggerNode); 
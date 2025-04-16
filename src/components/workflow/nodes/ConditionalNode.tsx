import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const ConditionalNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-500/90 to-purple-700 rounded-md shadow-lg p-4 min-w-[180px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-300"
      />
      
      <div className="flex items-center mb-2">
        <span className="text-xl mr-2">{data.icon || '🤖'}</span>
        <div className="text-white font-medium">{data.label}</div>
      </div>
      
      {data.description && (
        <div className="text-white/70 text-xs">{data.description}</div>
      )}
      
      <div className="flex justify-between mt-2">
        <Handle
          id="yes"
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!left-1/4 w-3 h-3 bg-green-400"
        />
        <Handle
          id="no"
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!left-3/4 w-3 h-3 bg-red-400"
        />
      </div>
      <div className="flex justify-between text-xs text-white/70 mt-1 px-2">
        <span className="mr-2">Yes</span>
        <span>No</span>
      </div>
    </div>
  );
};

export default memo(ConditionalNode); 
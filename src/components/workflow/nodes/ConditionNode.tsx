'use client';

import React, { memo } from 'react';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { Handle, NodeProps, Position } from 'reactflow';

export const ConditionNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md border-2 bg-yellow-50 border-yellow-500">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-yellow-500"
      />

      <div className="flex items-center">
        <HiOutlineSwitchHorizontal className="w-6 h-6 text-yellow-500 mr-2" />
        <div>
          <div className="font-bold text-sm text-yellow-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-yellow-700 mt-1">
              {data.description}
            </div>
          )}
        </div>
      </div>

      {data.config && (
        <div className="mt-2 text-xs text-yellow-600">
          {Object.entries(data.config).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '30%' }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />

      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '70%' }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

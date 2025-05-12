'use client';

import React, { memo } from 'react';
import { HiOutlinePlay } from 'react-icons/hi';
import { Handle, NodeProps, Position } from 'reactflow';

export const ActionNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md border-2 bg-green-50 border-green-500">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />

      <div className="flex items-center">
        <HiOutlinePlay className="w-6 h-6 text-green-500 mr-2" />
        <div>
          <div className="font-bold text-sm text-green-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-green-700 mt-1">
              {data.description}
            </div>
          )}
        </div>
      </div>

      {data.config && (
        <div className="mt-2 text-xs text-green-600">
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
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
});

ActionNode.displayName = 'ActionNode';

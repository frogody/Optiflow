'use client';

import React, { memo } from 'react';
import { HiOutlineDatabase } from 'react-icons/hi';
import { Handle, NodeProps, Position } from 'reactflow';

export const DatabaseNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md border-2 bg-red-50 border-red-500">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500"
      />

      <div className="flex items-center">
        <HiOutlineDatabase className="w-6 h-6 text-red-500 mr-2" />
        <div>
          <div className="font-bold text-sm text-red-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-red-700 mt-1">{data.description}</div>
          )}
        </div>
      </div>

      {data.config && (
        <div className="mt-2 text-xs text-red-600">
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
        className="w-3 h-3 bg-red-500"
      />
    </div>
  );
});

DatabaseNode.displayName = 'DatabaseNode';

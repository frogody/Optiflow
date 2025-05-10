'use client';

import React, { memo } from 'react';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { Handle, NodeProps, Position } from 'reactflow';

export const TriggerNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-md border-2 bg-blue-50 border-blue-500">
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="flex items-center">
        <HiOutlineLightningBolt className="w-6 h-6 text-blue-500 mr-2" />
        <div>
          <div className="font-bold text-sm text-blue-900">{data.label}</div>
          {data.description && (
            <div className="text-xs text-blue-700 mt-1">{data.description}</div>
          )}
        </div>
      </div>

      {data.config && (
        <div className="mt-2 text-xs text-blue-600">
          {Object.entries(data.config).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

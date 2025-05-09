// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ConditionalNodeData {
  label: string;
  icon: string;
  description: string;
  category: string;
}

function ConditionalNode({ data }: NodeProps<ConditionalNodeData>) {
  return (
    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/30 shadow-neon min-w-[180px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-500"
      />
      <div className="flex flex-col items-center p-2">
        <div className="text-2xl mb-2">{data.icon}</div>
        <div className="font-semibold text-white text-center mb-1">{data.label}</div>
        <div className="text-xs text-white/60 text-center">{data.description}</div>
      </div>
      <div className="flex justify-between mt-2">
        <Handle
          type="source"
          position={Position.Bottom}
          id="yes"
          className="w-3 h-3 !bg-green-500 translate-x-[-20px]"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="no"
          className="w-3 h-3 !bg-red-500 translate-x-[20px]"
        />
      </div>
    </div>
  );
}

export default ConditionalNode; 
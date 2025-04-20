'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface TriggerNodeData {
  label: string;
  icon: string;
  description: string;
  category: string;
}

function TriggerNode({ data }: NodeProps<TriggerNodeData>) {
  return (
    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/30 shadow-neon min-w-[180px]">
      <div className="flex flex-col items-center p-2">
        <div className="text-2xl mb-2">{data.icon}</div>
        <div className="font-semibold text-white text-center mb-1">{data.label}</div>
        <div className="text-xs text-white/60 text-center">{data.description}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
}

export default TriggerNode; 
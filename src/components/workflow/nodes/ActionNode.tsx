'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ActionNodeData {
  label: string;
  icon: string;
  description: string;
  category: string;
}

function ActionNode({ data }: NodeProps<ActionNodeData>) {
  return (
    <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 shadow-neon min-w-[180px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary"
      />
      <div className="flex flex-col items-center p-2">
        <div className="text-2xl mb-2">{data.icon}</div>
        <div className="font-semibold text-white text-center mb-1">{data.label}</div>
        <div className="text-xs text-white/60 text-center">{data.description}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary"
      />
    </div>
  );
}

export default ActionNode; 
'use client';

import { useMemo } from 'react';
import { NodeTypes } from 'reactflow';
import AIAgentNode from './AIAgentNode';

export default function useNodeTypes(): NodeTypes {
  // Define all custom node types here
  const nodeTypes = useMemo(() => ({
    aiAgent: AIAgentNode,
    // Add other custom node types here
  }), []);

  return nodeTypes;
} 
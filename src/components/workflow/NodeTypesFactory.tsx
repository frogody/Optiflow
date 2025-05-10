'use client';

import { useMemo } from 'react';
import { NodeTypes } from 'reactflow';

import AIAgentNode from './AIAgentNode';
import DefaultNode from './DefaultNode';

export default function useNodeTypes(): NodeTypes {
  // Define all custom node types here
  const nodeTypes = useMemo(
    () => ({
      aiAgent: AIAgentNode,
      default: DefaultNode,
      // Add other custom node types here
    }),
    []
  );

  return nodeTypes;
}

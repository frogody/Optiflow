import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { HiOutlineCog } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { NodeProps, NodeData } from '../types';

interface PipedreamNodeData extends NodeData {
  appName: string;
  actionType: string;
  configuration: Record<string, any>;
}

export default function PipedreamNode({ data, selected }: NodeProps<PipedreamNodeData>) {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigClick = () => {
    setIsConfiguring(true);
  };

  return (
    <motion.div
      className={`relative p-4 rounded-lg border ${
        selected ? 'border-blue-500' : 'border-gray-200'
      } bg-white shadow-lg min-w-[200px]`}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{data.appName}</h3>
        <button
          onClick={handleConfigClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiOutlineCog className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        {data.actionType}
      </div>

      {Object.entries(data.configuration).length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <h4 className="font-medium mb-1">Configuration:</h4>
          {Object.entries(data.configuration).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{key}:</span>
              <span className="text-gray-800">{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />

      {isConfiguring && (
        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg shadow-xl z-10 p-4">
          {/* Configuration UI will go here */}
          <button
            onClick={() => setIsConfiguring(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            ×
          </button>
        </div>
      )}
    </motion.div>
  );
} 
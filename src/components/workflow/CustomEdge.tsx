'use client';

import { useState } from 'react';
import { EdgeProps, getBezierPath, getMarkerEnd, MarkerType } from 'reactflow';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const markerEndId = getMarkerEnd(markerEnd as MarkerType);

  // Label for the edge, can be customized based on the connection type
  const edgeLabel = data?.label || '';

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="react-flow__edge-custom"
    >
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={isHovered ? 3 : 2}
        markerEnd={markerEndId}
        style={{
          ...style,
          stroke: isHovered ? '#6366f1' : '#4f46e5',
          strokeDasharray: data?.dashed ? '5,5' : undefined,
          transition: 'stroke-width 0.2s, stroke 0.2s',
        }}
      />

      {/* Optional edge label */}
      {edgeLabel && (
        <foreignObject
          width={100}
          height={40}
          x={(sourceX + targetX) / 2 - 50}
          y={(sourceY + targetY) / 2 - 20}
          className="react-flow__edge-label"
          style={{ pointerEvents: 'all' }}
        >
          <div
            className="px-2 py-1 text-xs rounded-md bg-dark-100 text-white text-center border border-gray-700 shadow-md"
            style={{ 
              opacity: isHovered ? 1 : 0.9,
              transition: 'opacity 0.2s'
            }}
          >
            {edgeLabel}
          </div>
        </foreignObject>
      )}

      {/* Delete button that appears on hover */}
      {isHovered && (
        <foreignObject
          width={24}
          height={24}
          x={(sourceX + targetX) / 2 - 12}
          y={(sourceY + targetY) / 2 - 12 + (edgeLabel ? 30 : 0)}
          className="react-flow__edge-button"
          style={{ pointerEvents: 'all' }}
        >
          <button
            className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
            onClick={(event) => {
              event.stopPropagation();
              if (data?.onDelete) {
                data.onDelete(id);
              }
            }}
          >
            <TrashIcon className="w-3 h-3" />
          </button>
        </foreignObject>
      )}
    </g>
  );
} 
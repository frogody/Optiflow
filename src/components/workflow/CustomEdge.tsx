'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { getBezierPath, getMarkerEnd } from 'reactflow';
import type { EdgeProps, MarkerType } from 'reactflow';

import styles from './CustomEdge.module.css';

export default function CustomEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, markerEnd, data, style } = props;
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
        className={`react-flow__edge-path ${styles['edgePath']} ${isHovered ? styles['edgePathHovered'] : ''} ${data?.dashed ? styles['dashed'] : ''}`}
        d={edgePath}
        strokeWidth={isHovered ? 3 : 2}
        markerEnd={markerEndId}
      />

      {/* Optional edge label */}
      {edgeLabel && (
        <foreignObject
          width={100}
          height={40}
          x={(sourceX + targetX) / 2 - 50}
          y={(sourceY + targetY) / 2 - 20}
          className={`react-flow__edge-label ${styles['edgeLabel']}`}
        >
          <div
            className={`px-2 py-1 text-xs rounded-md bg-dark-100 text-white text-center border border-gray-700 shadow-md ${styles['labelDiv']} ${isHovered ? styles['labelDivHovered'] : ''}`}
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
          className={`react-flow__edge-button ${styles['edgeButton']}`}
        >
          <button
            title="Delete edge"
            aria-label="Delete edge"
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
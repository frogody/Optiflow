import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
}

export function AnimatedEdge(props: EdgeProps) {
  return (
    <CustomEdge
      {...props}
      style={{
        ...props.style,
        strokeDasharray: '5 5',
        animation: 'flow 30s linear infinite',
      }}
    />
  );
}

export function DashedEdge(props: EdgeProps) {
  return (
    <CustomEdge {...props} style={{ ...props.style, strokeDasharray: '5 5' }} />
  );
}

export function DottedEdge(props: EdgeProps) {
  return (
    <CustomEdge {...props} style={{ ...props.style, strokeDasharray: '2 4' }} />
  );
}

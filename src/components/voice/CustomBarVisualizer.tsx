import React, { useEffect, useState } from 'react';

interface CustomBarVisualizerProps {
  width: number;
  height: number;
  barCount: number;
  isActive?: boolean;
  className?: string;
}

/**
 * A custom audio visualization component that renders animated bars
 * Simple replacement for @livekit/components-react BarVisualizer that avoids React DOM issues
 */
const CustomBarVisualizer: React.FC<CustomBarVisualizerProps> = ({
  width,
  height,
  barCount,
  isActive = false,
  className = '',
}) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  console.log('CustomBarVisualizer render', { width, height, barCount, isActive });
  
  // Update bars periodically to create animation
  useEffect(() => {
    console.log('CustomBarVisualizer useEffect running', { isActive });
    
    // Generate initial bar heights
    updateBars();
    
    // Set up animation interval
    const interval = setInterval(() => {
      if (isActive) {
        console.log('Animation tick - updating bars');
        updateBars();
      }
    }, 100); // Update every 100ms when active
    
    return () => {
      console.log('Cleaning up animation interval');
      clearInterval(interval);
    };
  }, [isActive, height, barCount]);
  
  // Function to update bar heights
  const updateBars = () => {
    const maxBarHeight = height * 0.9;
    const newHeights = [];
    
    for (let i = 0; i < barCount; i++) {
      // Generate random height for each bar
      const barHeight = isActive 
        ? Math.max(5, Math.random() * maxBarHeight)
        : Math.max(3, Math.random() * (maxBarHeight * 0.3));
      
      newHeights.push(barHeight);
    }
    
    setBarHeights(newHeights);
  };

  // Render the bars based on current heights
  const renderBars = () => {
    const bars = [];
    const barWidth = width / barCount - 2; // 2px gap between bars
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = barHeights[i] || 5; // Default height if not set
      const xPos = i * (barWidth + 2);
      const yPos = height - barHeight;
      
      // Use style instead of className for transitions and colors
      const fillColor = isActive ? '#22D3EE' : '#4B5563';
      
      bars.push(
        <rect
          key={i}
          x={xPos}
          y={yPos}
          width={barWidth}
          height={barHeight}
          rx={2}
          style={{
            transition: 'all 100ms',
            fill: fillColor
          }}
        />
      );
    }
    return bars;
  };

  return (
    <svg 
      width={width} 
      height={height} 
      style={{
        backgroundColor: '#23243a',
        borderRadius: '4px',
        margin: className?.includes('my-2') ? '8px 0' : '0'
      }}
    >
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      
      {/* Render the bars */}
      <g style={{ fill: 'url(#barGradient)' }}>
        {renderBars()}
      </g>
    </svg>
  );
};

export default CustomBarVisualizer; 
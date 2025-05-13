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
  
  // Update bars periodically to create animation
  useEffect(() => {
    // Generate initial bar heights
    updateBars();
    
    // Set up animation interval
    const interval = setInterval(() => {
      if (isActive) {
        updateBars();
      }
    }, 100); // Update every 100ms when active
    
    return () => clearInterval(interval);
  }, [isActive]);
  
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
      
      bars.push(
        <rect
          key={i}
          x={xPos}
          y={yPos}
          width={barWidth}
          height={barHeight}
          rx={2}
          className={`transition-all duration-100 ${isActive ? 'fill-[#22D3EE]' : 'fill-[#4B5563]'}`}
        />
      );
    }
    return bars;
  };

  return (
    <svg 
      width={width} 
      height={height} 
      className={`bg-[#23243a] rounded-md ${className}`}
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
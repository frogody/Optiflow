import React, { useEffect, useState } from 'react';

interface DivBarVisualizerProps {
  width: number;
  height: number;
  barCount: number;
  isActive?: boolean;
  className?: string;
}

/**
 * A custom audio visualization component that renders animated bars using DIVs
 * Avoids any potential SVG/React DOM issues that might occur
 */
const DivBarVisualizer: React.FC<DivBarVisualizerProps> = ({
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
    
    // Set up animation interval if active
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        updateBars();
      }, 100); // Update every 100ms when active
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, height, barCount]);
  
  // Function to update bar heights
  const updateBars = () => {
    const maxBarHeight = height * 0.8; // 80% of container height
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

  // Calculate bar width considering gaps
  const barWidth = Math.max(2, Math.floor((width - (barCount - 1) * 2) / barCount));

  return (
    <div 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#23243a',
        borderRadius: '4px',
        margin: className?.includes('my-2') ? '8px 0' : '0',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 4px'
      }}
    >
      {barHeights.map((barHeight, i) => (
        <div
          key={i}
          style={{
            width: `${barWidth}px`,
            height: `${barHeight}px`,
            marginLeft: i > 0 ? '2px' : '0',
            background: 'linear-gradient(180deg, #22D3EE 0%, #A855F7 100%)',
            borderRadius: '2px',
            transition: 'height 100ms ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default DivBarVisualizer; 
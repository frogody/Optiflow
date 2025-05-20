'use client';

import React, { Suspense } from 'react';

// A simple loader component while dynamic import resolves
const IconLoader = () => (
  <div className="inline-block w-5 h-5 animate-pulse bg-gray-300 rounded-sm"></div>
);

// A wrapper component to safely render heroicons or provide fallbacks
const IconWrapper = ({ 
  icon: Icon, 
  className = '', 
  fallbackClassName = 'w-5 h-5',
  ...props
}) => {
  // If no icon is provided, render a simple fallback
  if (!Icon) {
    return (
      <div className={`${fallbackClassName} ${className}`} {...props} />
    );
  }

  // Otherwise, render the actual icon with a suspense boundary
  return (
    <Suspense fallback={<IconLoader />}>
      <Icon className={className} {...props} />
    </Suspense>
  );
};

export default IconWrapper; 
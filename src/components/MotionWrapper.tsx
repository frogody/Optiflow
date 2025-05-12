'use client';

import React from 'react';
import { HTMLMotionProps } from 'framer-motion';
import dynamic from 'next/dynamic';

// Safely load motion.div with consistent React runtime
const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { 
    loading: () => <div />,
    ssr: false
  }
);

// Type definition
interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

// Safer wrapper for motion components
export function MotionWrapper(props: MotionWrapperProps) {
  // Using useState to ensure client-side only rendering
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything during SSR
  if (!mounted) {
    return <div {...props} style={{ ...props.style }}>{props.children}</div>;
  }
  
  // On client, render the actual motion component
  return <MotionDiv {...props} />;
} 
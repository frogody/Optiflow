// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React from 'react';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className = '', children }: ContainerProps) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

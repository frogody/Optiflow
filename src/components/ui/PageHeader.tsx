'use client';

import React from 'react';

import { Container } from './Container';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-3xl"
            style={{
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.3,
              transform: `translate(-50%, -50%)`,
            }}
          ></div>
        ))}
      </div>

      <Container>
        <div className="text-center py-12 md:py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </Container>
    </header>
  );
}

/* Grid pattern for the background */
const bgGridStyle = `
  .bg-grid-pattern { background-image: 
      linear-gradient(90deg, rgba(60, 223, 255, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(74, 255, 212, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
      }
`;

// Add the style to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = bgGridStyle;
  document.head.appendChild(styleElement);
}

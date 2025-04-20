'use client';

import React from 'react';
import Image from 'next/image';

interface HeaderProps {
  isAdvancedMode: boolean;
  onToggleMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdvancedMode, onToggleMode }) => {
  return (
    <header className="bg-dark-100/50 border-b border-primary/20 backdrop-blur-md px-6 py-4">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="ISYNCSO" 
              width={180}
              height={48}
              className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
              style={{ maxWidth: '180px' }}
            />
          </div>
          <span className="text-sm px-3 py-1 bg-dark-50/50 text-primary/90 border border-primary/20 rounded-full shadow-neon">
            {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleMode}
            className="glow-effect px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:from-primary-dark hover:to-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-dark-100 transition-all duration-200"
          >
            Switch to {isAdvancedMode ? 'Simple' : 'Advanced'} Mode
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-primary bg-dark-50/50 border border-primary/20 rounded-md hover:bg-dark-100 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-dark-100 transition-all duration-200 shadow-neon"
          >
            Documentation
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );
} 
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import VoiceAgentInterface with client-side only rendering
const VoiceAgentInterface = dynamic(
  () => import('@/components/voice/VoiceAgentInterface'),
  { ssr: false }
);

const VoiceTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Voice Agent Test Page</h1>
      <div className="mb-10 max-w-2xl text-center">
        <p className="text-gray-300 mb-4">
          This page tests the Voice Agent functionality directly without requiring a login.
          It uses the debug endpoints to bypass authentication in development mode.
        </p>
        <p className="text-gray-400 text-sm">
          Click the "Connect to Sync" button below to start the voice agent.
        </p>
      </div>
      
      {/* The Voice Agent interface will appear at the bottom right corner */}
      <VoiceAgentInterface />
    </div>
  );
};

export default VoiceTestPage; 
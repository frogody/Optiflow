'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ElevenLabsAgentWidgetProps {
  agentId: string;
  onWorkflowGenerated: (workflow: any) => void;
}

export const ElevenLabsAgentWidget: React.FC<ElevenLabsAgentWidgetProps> = ({ 
  agentId,
  onWorkflowGenerated 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Set up message listener for cross-domain communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify message origin (should match ElevenLabs domain)
      if (event.origin !== 'https://elevenlabs.io' && 
          !event.origin.includes('elevenlabs.io')) {
        return;
      }
      
      // Check if it's a workflow message
      if (event.data && event.data.type === 'workflow_generated') {
        console.log('Received workflow from ElevenLabs:', event.data.workflow);
        onWorkflowGenerated(event.data.workflow);
      }
    };
    
    // Add event listener
    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onWorkflowGenerated]);
  
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <div className="elevenlabs-widget-wrapper fixed bottom-8 right-8 z-[9999]">
      {isInitialized && (
        // Create a simple button that, when clicked, opens ElevenLabs in a new window
        <button
          onClick={() => {
            // Generate the callback URL to our API endpoint
            const callbackUrl = `${window.location.origin}/api/elevenlabs-callback`;
            
            // Try different URL formats for the ElevenLabs agent
            // Option 1: /chat endpoint
            // const elevenLabsURL = `https://elevenlabs.io/chat?agent=${agentId}&callback=${encodeURIComponent(callbackUrl)}`;
            
            // Option 2: /voiceflow endpoint
            const elevenLabsURL = `https://elevenlabs.io/voiceflow?agent=${agentId}&callback=${encodeURIComponent(callbackUrl)}`;
            
            // Option 3: Direct use of the agent URL with the ID
            // const elevenLabsURL = `https://elevenlabs.io/agent/${agentId}?callback=${encodeURIComponent(callbackUrl)}`;
            
            // Open in a popup window
            window.open(elevenLabsURL, 'elevenlabs_convai', 'width=400,height=600');
            
            console.log('Opening ElevenLabs URL:', elevenLabsURL);
          }}
          className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500"
          title="Open ElevenLabs Voice Assistant"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-white" 
            fill="none" 
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
        </button>
      )}
    </div>
  );
}; 
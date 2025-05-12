'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { safeAsync } from '@/lib/error-handler';

// Import VoiceAgentInterface only on client side with error handling
const VoiceAgentInterface = dynamic(
  () => import('@/components/voice/VoiceAgentInterface').catch(error => {
    console.error('Error loading VoiceAgentInterface:', error);
    // Return a minimal component instead of crashing
    return () => null;
  }),
  { 
    ssr: false,
    loading: () => null 
  }
);

export default function ClientVoiceWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure we only render the voice interface on the client
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Wrap in a try-catch to prevent rendering errors from breaking the whole app
  try {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <VoiceAgentInterface />
      </div>
    );
  } catch (error) {
    console.error('Error rendering VoiceAgentInterface:', error);
    return null;
  }
} 
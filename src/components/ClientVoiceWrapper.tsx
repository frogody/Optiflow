'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { safeAsync } from '@/lib/error-handler';

// Import VoiceAgentInterface only on client side with safer error handling
const VoiceAgentInterface = dynamic(
  () => import('@/components/voice/VoiceAgentInterface')
    .then(mod => mod.default)
    .catch(error => {
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
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // Ensure we only render the voice interface on the client
    try {
      setMounted(true);
    } catch (error) {
      console.error('Error mounting voice component:', error);
      if (error instanceof Error) {
        setLoadError(error);
      } else {
        setLoadError(new Error('Unknown error mounting voice component'));
      }
    }
  }, []);

  // Don't render anything during SSR or if not mounted
  if (!mounted) {
    return null;
  }

  // Show error state if loading failed
  if (loadError) {
    console.error('Voice component error:', loadError);
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
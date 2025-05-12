'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import VoiceAgentInterface only on client side with safer error handling
// Using a simpler pattern recommended in Next.js docs
const VoiceAgentInterface = dynamic(
  () => import('@/components/voice/VoiceAgentInterface'),
  { 
    ssr: false,
    loading: () => null
  }
);

export default function ClientVoiceWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure we only render the voice interface on the client
    try {
      setMounted(true);
    } catch (error) {
      console.error('Error mounting voice component:', error);
    }
  }, []);

  // Don't render anything during SSR or if not mounted
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
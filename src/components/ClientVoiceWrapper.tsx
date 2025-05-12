'use client';

import dynamic from 'next/dynamic';

// Import VoiceAgentInterface only on client side
const VoiceAgentInterface = dynamic(
  () => import('@/components/voice/VoiceAgentInterface'),
  { ssr: false }
);

export default function ClientVoiceWrapper() {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
      <VoiceAgentInterface />
    </div>
  );
} 
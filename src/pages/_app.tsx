import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';

import nextI18NextConfig from '../../next-i18next.config.cjs';
import VoiceOrb from '../components/VoiceOrb';

function MyApp({ Component, pageProps }: AppProps) {
  const { data: session, status } = useSession();
  // Handler for when the user speaks
  const handleTranscript = async (t: string) => {
    // Use real userId if available
    const userId = session?.user?.id;
    if (!userId) return;
    const res = await fetch('/api/agent/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: t, userId }),
    });
    const data = await res.json();
    alert(data.confirmation);
  };

  // --- Presence/heartbeat logic ---
  const userId = session?.user?.id;
  const inactivityTimeout = 10 * 60 * 1000; // 10 minutes
  const heartbeatInterval = 30 * 1000; // 30 seconds
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  const isInactive = useRef(false);

  // Send presence to backend
  const sendPresence = async (inactive = false) => {
    if (!userId) return;
    await fetch('/api/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, inactive }),
    });
    isInactive.current = inactive;
  };

  // Reset inactivity timer on user activity
  const resetInactivity = () => {
    if (!userId) return;
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (isInactive.current) sendPresence(false);
    isInactive.current = false;
    inactivityTimer.current = setTimeout(() => {
      sendPresence(true);
    }, inactivityTimeout);
  };

  useEffect(() => {
    if (!userId) return;
    // Start heartbeat
    heartbeatTimer.current = setInterval(() => {
      sendPresence(false);
    }, heartbeatInterval);
    // Listen for user activity
    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    window.addEventListener('touchstart', resetInactivity);
    // Listen for tab close/hidden
    const handleVisibility = () => {
      if (document.hidden) sendPresence(true);
      else resetInactivity();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    // Initial presence
    sendPresence(false);
    resetInactivity();
    return () => {
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      window.removeEventListener('touchstart', resetInactivity);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [userId]);
  // --- End presence/heartbeat logic ---

  return (
    <SessionProvider>
      <Component {...pageProps} />
      <VoiceOrb onTranscript={handleTranscript} />
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);

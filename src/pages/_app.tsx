import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Import custom i18n setup
import '../lib/i18n';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config.cjs';

// Dynamically import VoiceOrb to ensure it only loads client-side
const VoiceOrb = dynamic(() => import('../components/VoiceOrb'), {
  ssr: false,
});

// Separate client component to handle session-dependent logic
function ClientContent({ Component, pageProps }: AppProps) {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handler for when the user speaks
  const handleTranscript = async (t: string) => {
    // Use real userId if available
    const userId = session?.user?.id;
    if (!userId) return;
    
    try {
      const res = await fetch('/api/agent/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: t, userId }),
      });
      const data = await res.json();
      
      if (data.confirmation) {
        alert(data.confirmation);
      }
    } catch (error) {
      console.error('Error handling transcript:', error);
    }
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
    if (!userId || !isClient) return;
    
    try {
      await fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, inactive }),
      });
      isInactive.current = inactive;
    } catch (error) {
      console.error('Error sending presence:', error);
    }
  };

  // Reset inactivity timer on user activity
  const resetInactivity = () => {
    if (!userId || !isClient) return;
    
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (isInactive.current) sendPresence(false);
    isInactive.current = false;
    inactivityTimer.current = setTimeout(() => {
      sendPresence(true);
    }, inactivityTimeout);
  };

  useEffect(() => {
    if (!userId || !isClient) return;
    
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
  }, [userId, isClient]); // Only run when userId or isClient changes
  // --- End presence/heartbeat logic ---

  return (
    <>
      <Component {...pageProps} />
      {isClient && <VoiceOrb onTranscript={handleTranscript} />}
    </>
  );
}

// Main app component that wraps everything in the SessionProvider
function MyApp(props: AppProps) {
  return (
    <SessionProvider session={props.pageProps.session}>
      <ClientContent {...props} />
    </SessionProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);

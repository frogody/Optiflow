import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../../next-i18next.config.cjs';

import VoiceOrb from '../components/VoiceOrb';

function MyApp({ Component, pageProps }: AppProps) {
  // Handler for when the user speaks
  const handleTranscript = async (t: string) => {
    // Mock userId for now
    const userId = 'user-123';
    const res = await fetch('/api/agent/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: t, userId }),
    });
    const data = await res.json();
    alert(data.confirmation);
  };

  return (
    <>
      <Component {...pageProps} />
      <VoiceOrb onTranscript={handleTranscript} />
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);

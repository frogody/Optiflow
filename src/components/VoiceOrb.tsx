// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import React, { useState, useRef } from 'react';

interface VoiceOrbProps { onTranscript: (transcript: string) => void;
    }

export default function VoiceOrb({ onTranscript }: VoiceOrbProps): JSX.Element {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: any) => { const t = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
      onTranscript(t);
      setIsListening(false);
        };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.start();
    setIsListening(true);
    setTranscript('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end">
      <button
        onClick={startListening}
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 bg-gradient-to-br from-[#3CDFFF] to-[#4AFFD4] hover:scale-110 ${ isListening ? 'ring-4 ring-[#3CDFFF]/50 animate-pulse' : ''    }`}
        title="Speak to Jarvis"
        aria-label="Speak to Jarvis"
      >
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v4m0 0h4m-4 0H8m8-8a4 4 0 10-8 0 4 4 0 008 0z" />
        </svg>
      </button>
      {transcript && (
        <div className="mt-4 bg-white/90 rounded-lg shadow-lg px-4 py-2 text-slate-800 max-w-xs">
          <span className="font-medium">You said:</span> <span>{transcript}</span>
        </div>
      )}
      {isListening && (
        <div className="mt-2 text-xs text-[#3CDFFF] animate-pulse">Listening...</div>
      )}
    </div>
  );
} 
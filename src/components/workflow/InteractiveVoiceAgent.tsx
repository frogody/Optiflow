'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveVoiceAgentProps {
  onWorkflowGenerated: (workflow: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const WaveformAnimation = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-white rounded-full"
          animate={{
            height: ["15%", "100%", "15%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const PulsingCircle = () => {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-white/40"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.7, 0.2, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </div>
  );
};

export const InteractiveVoiceAgent: React.FC<InteractiveVoiceAgentProps> = ({ onWorkflowGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
        setIsExpanded(true);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcriptResult = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(transcriptResult);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    } catch (err) {
      setError('Failed to initialize speech recognition.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not initialized.');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setTranscript('');
        setFeedback(null);
        setAudioSrc(null);
        setError(null);
        
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle speech recognition');
      setIsListening(false);
    }
  };

  const processCommand = async () => {
    if (!transcript || processing) return;
    
    try {
      setProcessing(true);
      setFeedback('Processing your request...');
      
      console.log('InteractiveVoiceAgent: Starting voice command processing with text:', transcript);
      
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'processVoiceCommand',
          text: transcript
        })
      });
      
      console.log('InteractiveVoiceAgent: Process command response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Failed to process voice command:', errorData);
        throw new Error('Failed to process voice command');
      }
      
      const workflow = await response.json();
      console.log('InteractiveVoiceAgent: Received workflow data:', workflow);
      
      if (workflow) {
        const confirmationText = `I've created a workflow based on your request: "${workflow.name}". ${workflow.description}`;
        console.log('InteractiveVoiceAgent: Generating voice feedback:', confirmationText);
        
        const audioResponse = await fetch('/api/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'textToSpeech',
            text: confirmationText
          })
        });
        
        console.log('InteractiveVoiceAgent: Text-to-speech response status:', audioResponse.status, audioResponse.statusText);
        
        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          console.log('InteractiveVoiceAgent: Received audio data of length:', audioData?.audio?.length || 0);
          setAudioSrc(`data:audio/mpeg;base64,${audioData.audio}`);
        } else {
          const errorData = await audioResponse.json().catch(() => null);
          console.error('Failed to generate speech:', errorData);
        }
        
        setFeedback(confirmationText);
        console.log('InteractiveVoiceAgent: Calling onWorkflowGenerated with workflow data');
        onWorkflowGenerated(workflow);
      } else {
        setFeedback('Sorry, I could not generate a workflow from your command.');
        console.warn('InteractiveVoiceAgent: No workflow data received');
      }
    } catch (err: any) {
      console.error('InteractiveVoiceAgent: Error processing command:', err);
      setError(err.message || 'Failed to process your command');
      setFeedback('Sorry, there was an error processing your request.');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioSrc]);

  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-[9999]"
      animate={{ scale: 1 }}
      initial={{ scale: 0 }}
      exit={{ scale: 0 }}
    >
      <motion.div
        className={`flex items-center gap-4 ${isExpanded ? 'bg-slate-800/95 p-4 rounded-2xl shadow-xl backdrop-blur-lg voice-agent-panel' : ''}`}
        animate={{ width: isExpanded ? 'auto' : 'auto' }}
      >
        <motion.button
          onClick={toggleListening}
          className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-colors duration-300 ${
            isListening 
              ? 'bg-red-500 shadow-red-500/50 voice-agent-listening' 
              : processing 
                ? 'bg-amber-500 shadow-amber-500/50' 
                : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-violet-500/50 voice-agent-button'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isListening && <PulsingCircle />}
          <motion.div
            className="relative z-10"
            animate={{
              rotate: isListening ? [0, 360] : 0,
            }}
            transition={{
              duration: 2,
              repeat: isListening ? Infinity : 0,
              ease: "linear"
            }}
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
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-white overflow-hidden"
            >
              <div className="w-80">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 p-3 rounded-lg mb-3 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <WaveformAnimation />
                    <div className="text-sm text-center mt-2">Listening...</div>
                  </motion.div>
                )}

                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div className="text-xs text-slate-400 mb-1">Your command:</div>
                    <div className="bg-white/10 p-3 rounded-lg text-sm">
                      {transcript}
                    </div>
                  </motion.div>
                )}

                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div className="text-xs text-slate-400 mb-1">Response:</div>
                    <div className="bg-white/10 p-3 rounded-lg text-sm">
                      {feedback}
                    </div>
                  </motion.div>
                )}

                {!isListening && transcript && (
                  <motion.button
                    onClick={processCommand}
                    disabled={processing}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      processing
                        ? 'bg-amber-500/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-fuchsia-500 hover:to-violet-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Create Workflow'
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} className="hidden" />
      )}
    </motion.div>
  );
}; 
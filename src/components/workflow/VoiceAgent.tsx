'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFloating, offset, flip, shift, useHover, useInteractions } from '@floating-ui/react';

interface VoiceAgentProps {
  onWorkflowGenerated: (workflow: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({ onWorkflowGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(10), flip(), shift()],
  });
  
  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);
  
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      console.error('Speech recognition not supported');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result received', event);
        const transcriptResult = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTranscript(transcriptResult);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setError('Failed to initialize speech recognition. Please try reloading the page.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const toggleListening = () => {
    console.log('Toggle listening clicked', { isListening, recognitionRef: !!recognitionRef.current });
    
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      setError('Speech recognition is not initialized. Please try reloading the page.');
      return;
    }

    try {
      if (isListening) {
        console.log('Attempting to stop speech recognition');
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        console.log('Attempting to start speech recognition');
        setTranscript('');
        setFeedback(null);
        setAudioSrc(null);
        setError(null);
        
        // Ensure we create a new instance if needed
        if (!recognitionRef.current) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) {
            throw new Error('Speech recognition not supported in this browser');
          }
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          
          // Re-attach event handlers
          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setError(null);
          };
          
          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsListening(false);
          };
          
          recognitionRef.current.onresult = (event: any) => {
            console.log('Speech recognition result received', event);
            const transcriptResult = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join('');
            setTranscript(transcriptResult);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event);
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
          };
        }
        
        // Request microphone permission explicitly
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            console.log('Microphone permission granted');
            recognitionRef.current?.start();
          })
          .catch((err) => {
            console.error('Microphone permission denied:', err);
            setError('Please allow microphone access to use voice commands.');
          });
      }
    } catch (err) {
      console.error('Error toggling speech recognition:', err);
      setError(`Failed to toggle speech recognition: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsListening(false);
    }
  };
  
  const processCommand = async () => {
    if (!transcript || processing) return;
    
    try {
      setProcessing(true);
      setFeedback('Processing your request...');
      
      console.log('Starting voice command processing with text:', transcript);
      
      // Use the API route to process the voice command
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'processVoiceCommand',
          text: transcript
        })
      });
      
      console.log('Process command response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Failed to process voice command:', errorData);
        throw new Error(errorData?.error || 'Failed to process voice command');
      }
      
      const workflow = await response.json();
      console.log('Received workflow data:', workflow);
      
      if (workflow) {
        // Generate voice feedback using the API route
        const confirmationText = `I've created a workflow based on your request: "${workflow.name}". ${workflow.description}`;
        console.log('Generating voice feedback:', confirmationText);
        
        const audioResponse = await fetch('/api/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'textToSpeech',
            text: confirmationText
          })
        });
        
        console.log('Text-to-speech response status:', audioResponse.status, audioResponse.statusText);
        
        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          console.log('Received audio data of length:', audioData?.audio?.length || 0);
          setAudioSrc(`data:audio/mpeg;base64,${audioData.audio}`);
        } else {
          const errorData = await audioResponse.json().catch(() => null);
          console.error('Failed to generate speech:', errorData);
        }
        
        setFeedback(confirmationText);
        console.log('Calling onWorkflowGenerated with data');
        onWorkflowGenerated(workflow);
      } else {
        setFeedback('Sorry, I could not generate a workflow from your command.');
        console.warn('No workflow data received');
      }
    } catch (err: any) {
      console.error('Error processing command:', err);
      setError(err.message || 'Failed to process your command');
      setFeedback('Sorry, there was an error processing your request.');
    } finally {
      setProcessing(false);
    }
  };
  
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play audio:', err);
      });
    }
  }, [audioSrc]);
  
  // Add cleanup function
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping speech recognition during cleanup:', err);
        }
      }
    };
  }, []);
  
  return (
    <>
      <div className="fixed bottom-8 right-8 z-[9999]">
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          onClick={toggleListening}
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ${
            isListening 
              ? 'bg-red-500 animate-pulse shadow-red-500/50' 
              : processing 
                ? 'bg-amber-500 shadow-amber-500/50' 
                : 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] shadow-[#3CDFFF]/50 hover:from-[#4AFFD4] hover:to-[#3CDFFF]'
          }`}
          title={isListening ? 'Stop Recording' : 'Start Recording'}
          type="button"
          aria-label="Toggle voice recording"
        >
          <span className="sr-only">Voice Assistant</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 text-white transition-transform duration-300 ${isListening ? 'scale-110' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
        
        {context.open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-slate-800 p-4 rounded-lg shadow-xl w-80"
          >
            <div className="text-sm text-white">
              <h3 className="font-medium mb-2">Voice Assistant</h3>
              <p className="text-slate-300 text-xs mb-4">
                Describe the workflow you want to create using natural language
              </p>
              
              {error && (
                <div className="bg-red-900/50 p-2 rounded text-xs text-red-200 mb-3">
                  {error}
                </div>
              )}
              
              {transcript && (
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-1">Your command:</div>
                  <div className="bg-slate-700 p-2 rounded text-white text-sm max-h-32 overflow-y-auto">
                    {transcript}
                  </div>
                </div>
              )}
              
              {feedback && (
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-1">Response:</div>
                  <div className="bg-slate-700 p-2 rounded text-white text-sm max-h-32 overflow-y-auto">
                    {feedback}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={toggleListening}
                  className={`px-3 py-1 rounded-full text-xs ${
                    isListening ? 'bg-red-500 text-white' : 'bg-slate-600 text-white'
                  }`}
                >
                  {isListening ? 'Stop' : 'Record'}
                </button>
                
                <button
                  onClick={processCommand}
                  disabled={!transcript || processing || isListening}
                  className={`px-3 py-1 rounded-full text-xs ${
                    !transcript || processing || isListening
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#3CDFFF] to-[#4AFFD4] text-slate-800'
                  }`}
                >
                  {processing ? 'Processing...' : 'Create Workflow'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} className="hidden" />
      )}
    </>
  );
}; 
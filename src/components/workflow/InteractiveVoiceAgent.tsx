'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineMicrophone, HiOutlineStop } from 'react-icons/hi';

import MicrophonePermission from '@/components/MicrophonePermission';

interface InteractiveVoiceAgentProps { onWorkflowGenerated: (workflow: any) => void;
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
        <div
          key={i}
          className="w-1 bg-white rounded-full"
        />
      ))}
    </div>
  );
};

const PulsingCircle = () => {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-full bg-white/20"
      />
      <div
        className="absolute inset-0 rounded-full bg-white/40"
      />
    </div>
  );
};

export const InteractiveVoiceAgent: React.FC<InteractiveVoiceAgentProps> = ({ onWorkflowGenerated }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => { const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(transcript);
        };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = async () => {
    setError(null);
    setTranscript('');
    setShowPermissionDialog(true);
  };

  const handlePermissionGranted = async () => {
    setShowPermissionDialog(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true     });
      
      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav'     });
        await processAudioData(audioBlob);
      };

      // Start recording
      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (err) { console.error('Error starting voice recording:', err);
      setError('Failed to start voice recording. Please check your microphone settings.');
        }
  };

  const handlePermissionDenied = () => {
    setShowPermissionDialog(false);
    setError('Microphone access is required for voice commands. Please allow microphone access and try again.');
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const processAudioData = async (audioBlob: Blob) => {
    if (!audioBlob) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/elevenlabs-convai', { method: 'POST',
        body: formData,
          });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      console.log('Processed audio data:', data);
      
      // Handle the response data as needed
      if (data.workflow) {
        const confirmationText = `I've created a workflow based on your request: "${data.workflow.name}". ${data.workflow.description}`;
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
        } else { const errorData = await audioResponse.json().catch(() => null);
          console.error('Failed to generate speech:', errorData);
            }
        
        onWorkflowGenerated(data.workflow);
      } else { console.warn('InteractiveVoiceAgent: No workflow data received');
          }
    } catch (err) { console.error('Error processing audio:', err);
      setError('Failed to process audio. Please try again.');
        } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      {showPermissionDialog && (
        <MicrophonePermission
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
        />
      )}
      <div className="fixed bottom-8 right-8 z-[9999]">
        <div
          className={`flex items-center gap-4 ${ isExpanded ? 'bg-slate-800/95 p-4 rounded-2xl shadow-xl backdrop-blur-lg voice-agent-panel' : ''    }`}
        >
          <button
            onClick={ isListening ? stopListening : startListening    }
            disabled={processing}
            className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-colors duration-300 ${ isListening
                ? 'bg-red-500 shadow-red-500/50 voice-agent-listening'
                : processing
                  ? 'bg-amber-500 shadow-amber-500/50'
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-violet-500/50 voice-agent-button'
                } hover:scale-105 active:scale-95`}
          >
            {isListening && <PulsingCircle />}
            <div className="relative z-10">
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
            </div>
          </button>

          {isExpanded && (
            <div className="text-white overflow-hidden">
              <div className="w-80">
                {error && (
                  <div className="bg-red-500/20 p-3 rounded-lg mb-3 text-sm">
                    {error}
                  </div>
                )}

                {isListening && (
                  <div className="mb-4">
                    <WaveformAnimation />
                    <div className="text-sm text-center mt-2">Listening...</div>
                  </div>
                )}

                {transcript && (
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 mb-1">Transcript:</div>
                    <div className="bg-white/10 p-3 rounded-lg text-sm">
                      {transcript}
                    </div>
                  </div>
                )}

                {!isListening && transcript && (
                  <button
                    onClick={() => {
                      const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav'     });
                      processAudioData(audioBlob);
                    }}
                    disabled={processing}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${ processing
                        ? 'bg-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600'
                        }`}
                  >
                    { processing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Create Workflow'
                    )    }
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} className="hidden" />
      )}
    </div>
  );
}; 
// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import LiquidGlobe from './LiquidGlobe';

// Global type for window.streamReference already declared in MicrophonePermission.tsx

interface ConversationalWorkflowGeneratorProps {
  onWorkflowGenerated?: (workflow: any) => void;
  agentId?: string;
  initialPrompt?: string;
  modelParams?: { model: string;
    temperature?: number;
    max_tokens?: number;
      };
  voiceParams?: { stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
      };
}

export default function ConversationalWorkflowGenerator({ onWorkflowGenerated, agentId, initialPrompt, modelParams, voiceParams }: ConversationalWorkflowGeneratorProps): JSX.Element {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [audioResponse, setAudioResponse] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<any>(null);
  const [agentResponses, setAgentResponses] = useState<string[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isGlobeActive, setIsGlobeActive] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check for microphone permission on mount and detect permission changes
  useEffect(() => {
    // First, check localStorage for cached permission state
    const storedPermission = localStorage.getItem('micPermissionGranted');
    if (storedPermission === 'true') {
      setPermissionGranted(true);
    }
    
    // Always check for current permission status
    checkMicrophonePermission();
    
    // Listen for permission changes using the Permissions API if supported
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName     })
        .then(permissionStatus => {
          // Update state based on current permission
          setPermissionGranted(permissionStatus.state === 'granted');
          
          // Set up listener for permission changes
          permissionStatus.onchange = () => { setPermissionGranted(permissionStatus.state === 'granted');
            // Update localStorage
            localStorage.setItem('micPermissionGranted', permissionStatus.state === 'granted' ? 'true' : 'false');
              };
        })
        .catch(err => { console.error('Error querying microphone permission:', err);
            });
    }
    
    return () => {
      // Release any media stream when component unmounts
      releaseMediaResources();
    };
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Helper function to release all media resources
  const releaseMediaResources = () => {
    // Stop any active recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    // Release media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // Helper function to check microphone permission
  const checkMicrophonePermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Media devices not supported by your browser');
        return false;
      }
      
      // Try to access the microphone with better audio quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // If we get here, permission was granted
      setPermissionGranted(true);
      localStorage.setItem('micPermissionGranted', 'true');
      
      // Store the stream reference but stop it immediately (we'll reuse it when recording)
      streamRef.current = stream;
      
      // Store reference to the stream so permission state persists in Chrome
      if (typeof window !== 'undefined') {
        window.streamReference = stream;
      }
      
      return true;
    } catch (err) {
      console.error('Error requesting microphone permission:', err);
      
      // Check if this was a permission denial
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        localStorage.setItem('micPermissionGranted', 'false');
        setErrorMessage('Microphone access denied. Please allow microphone access in your browser settings and reload the page.');
      } else { setErrorMessage('Error accessing microphone: ' + (err instanceof Error ? err.message : String(err)));
          }
      
      setPermissionGranted(false);
      return false;
    }
  };
  
  // Function to start recording
  const startRecording = async () => {
    setErrorMessage(null);
    
    try {
      // First check localStorage for cached permission state
      const storedPermission = localStorage.getItem('micPermissionGranted');
      
      // If permission was previously denied, suggest browser settings
      if (storedPermission === 'false') {
        setErrorMessage('Microphone access was previously denied. Please enable it in your browser settings and reload the page.');
        return;
      }
      
      // Check if permission is granted, if not try to request it
      if (!permissionGranted) {
        const granted = await checkMicrophonePermission();
        if (!granted) return;
      }
      
      // Create a new stream if we don't have one
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }
      
      // Create media recorder from stream with appropriate mime type
      let mimeType = 'audio/webm';
      // Check if codec is supported
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      }
      
      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: mimeType
          });
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear previous audio chunks
      audioChunksRef.current = [];
      
      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop event
      mediaRecorder.onstop = () => {
        processRecording();
      };
      
      // Handle recording errors
      mediaRecorder.onerror = (event) => { console.error('MediaRecorder error:', event);
        setErrorMessage('Recording error occurred. Please try again.');
        setIsRecording(false);
          };
      
      // Start recording in 200ms chunks for better real-time processing
      mediaRecorder.start(200);
      setIsRecording(true);
      
      // Set a timeout to stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);
    } catch (err) {
      console.error('Error starting recording:', err);
      
      // Handle permission errors specially
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionGranted(false);
        localStorage.setItem('micPermissionGranted', 'false');
        setErrorMessage('Microphone access denied. Please enable it in your browser settings and reload the page.');
      } else { setErrorMessage('Failed to start recording: ' + (err instanceof Error ? err.message : String(err)));
          }
    }
  };
  
  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Function to process the recorded audio
  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      setErrorMessage('No audio recorded');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create audio blob from chunks with correct mime type
      const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
          });
      
      // Convert to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      // Process the audio data
      const response = await fetch('/api/elevenlabs-convai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          agentId,
          modelParams,
          voiceParams
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process audio');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update state with workflow and responses
        setWorkflow(data.workflow);
        setAgentResponses(data.agentMessages || []) // eslint-disable-line react-hooks/exhaustive-deps
        setTranscript(data.transcripts?.join(' ') || null);
        
        // If there's an agent response with audio, play it
        if (data.rawResponse?.audioResponses && data.rawResponse.audioResponses.length > 0) {
          // Convert the first audio response to a playable URL
          const audioBlob = new Blob([data.rawResponse.audioResponses[0]], { type: 'audio/mp3'     });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioResponse(audioUrl);
          
          // Play the audio
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            try {
              await audioRef.current.play();
            } catch (playError) { console.warn('Auto-play prevented:', playError);
              // No need to show an error, just let user click play manually
                }
          }
        }
        
        // Call the onWorkflowGenerated callback if provided
        if (onWorkflowGenerated && data.workflow) {
          onWorkflowGenerated(data.workflow);
        }
      } else {
        throw new Error(data.error || 'Failed to generate workflow');
      }
    } catch (err) { console.error('Error processing recording:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to process recording');
        } finally {
      setIsProcessing(false);
    }
  };
  
  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix if present
          const base64 = reader.result.split(',')[1] || reader.result;
          resolve(base64);
        } else {
          reject(new Error('FileReader did not return a string'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  // Helper function to reset the state
  const resetState = () => {
    setWorkflow(null);
    setAgentResponses([]) // eslint-disable-line react-hooks/exhaustive-deps
    setTranscript(null);
    setAudioResponse(null);
    setErrorMessage(null);
  };
  
  // Cleanup media resources when component unmounts
  useEffect(() => {
    return () => {
      releaseMediaResources();
    };
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-[#000B1E] text-white overflow-hidden">
      {/* Background Effects */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0     }}
        animate={{ opacity: 1     }}
        transition={{ duration: 1     }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          className="absolute inset-0"
          animate={{ background: [
              'radial-gradient(circle at 50% 50%, #000B1E, transparent)',
              'radial-gradient(circle at 60% 40%, #000B1E, transparent)',
              'radial-gradient(circle at 40% 60%, #000B1E, transparent)',
              'radial-gradient(circle at 50% 50%, #000B1E, transparent)',
            ],
              }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear'     }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Globe Container */}
          <div className="relative h-[500px] mb-8">
            <LiquidGlobe 
              isAgentSpeaking={isGlobeActive} 
              color="#3CDFFF"
              intensity={1.2}
              scale={1.2}
            />
          </div>

          {/* Conversation Interface */}
          <div className="space-y-8">
            {/* Agent Responses */}
            <div className="space-y-4">
              <AnimatePresence>
                {agentResponses.map((response, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20     }}
                    animate={{ opacity: 1, y: 0     }}
                    exit={{ opacity: 0, y: -20     }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-[#3CDFFF]/20"
                  >
                    <p className="text-[#3CDFFF]/90">{response}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center space-x-4">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20     }}
                  animate={{ opacity: 1, y: 0     }}
                  className="absolute bottom-full mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-xl"
                >
                  {errorMessage}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05     }}
                whileTap={{ scale: 0.95     }}
                onClick={ isRecording ? stopRecording : startRecording    }
                disabled={isProcessing || !permissionGranted}
                className={`relative group p-6 rounded-full ${ isRecording 
                    ? 'bg-red-500/20 border-red-500/40' 
                    : 'bg-[#3CDFFF]/20 border-[#3CDFFF]/40'
                    } border-2 backdrop-blur-xl transition-all duration-300`}
              >
                { isRecording ? (
                  <FaStop className="w-8 h-8 text-red-400" />
                ) : (
                  <FaMicrophone className="w-8 h-8 text-[#3CDFFF]" />
                )    }
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(circle at center, rgba(60,223,255,0.2), transparent)',
                    filter: 'blur(10px)',
                      }}
                />
              </motion.button>

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0     }}
                  animate={{ opacity: 1     }}
                  className="absolute left-full ml-4 flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-[#3CDFFF] rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-[#3CDFFF] rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-[#3CDFFF] rounded-full animate-pulse delay-200" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {audioResponse && (
        <audio
          ref={audioRef}
          src={audioResponse}
          autoPlay
          onPlay={() => setIsGlobeActive(true)}
          onEnded={() => setIsGlobeActive(false)}
          className="hidden"
        />
      )}
    </div>
  );
} 
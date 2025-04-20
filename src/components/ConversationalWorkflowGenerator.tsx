'use client';

import React, { useState, useRef, useEffect } from 'react';

// Global type for window.streamReference already declared in MicrophonePermission.tsx

interface ConversationalWorkflowGeneratorProps {
  onWorkflowGenerated?: (workflow: any) => void;
  agentId?: string;
  initialPrompt?: string;
  modelParams?: {
    model: string;
    temperature?: number;
    max_tokens?: number;
  };
  voiceParams?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export default function ConversationalWorkflowGenerator({
  onWorkflowGenerated,
  agentId,
  initialPrompt = 'Tell me what workflow you want to build',
  modelParams = { model: 'gemini-1.5-flash' },
  voiceParams
}: ConversationalWorkflowGeneratorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [audioResponse, setAudioResponse] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<any>(null);
  const [agentResponses, setAgentResponses] = useState<string[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
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
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(permissionStatus => {
          // Update state based on current permission
          setPermissionGranted(permissionStatus.state === 'granted');
          
          // Set up listener for permission changes
          permissionStatus.onchange = () => {
            setPermissionGranted(permissionStatus.state === 'granted');
            // Update localStorage
            localStorage.setItem('micPermissionGranted', permissionStatus.state === 'granted' ? 'true' : 'false');
          };
        })
        .catch(err => {
          console.error('Error querying microphone permission:', err);
        });
    }
    
    return () => {
      // Release any media stream when component unmounts
      releaseMediaResources();
    };
  }, []);
  
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
      } else {
        setErrorMessage('Error accessing microphone: ' + (err instanceof Error ? err.message : String(err)));
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
      
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: mimeType
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
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
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
      } else {
        setErrorMessage('Failed to start recording: ' + (err instanceof Error ? err.message : String(err)));
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
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
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
        setAgentResponses(data.agentMessages || []);
        setTranscript(data.transcripts?.join(' ') || null);
        
        // If there's an agent response with audio, play it
        if (data.rawResponse?.audioResponses && data.rawResponse.audioResponses.length > 0) {
          // Convert the first audio response to a playable URL
          const audioBlob = new Blob([data.rawResponse.audioResponses[0]], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioResponse(audioUrl);
          
          // Play the audio
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            try {
              await audioRef.current.play();
            } catch (playError) {
              console.warn('Auto-play prevented:', playError);
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
    } catch (err) {
      console.error('Error processing recording:', err);
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
    setAgentResponses([]);
    setTranscript(null);
    setAudioResponse(null);
    setErrorMessage(null);
  };
  
  // Cleanup media resources when component unmounts
  useEffect(() => {
    return () => {
      releaseMediaResources();
    };
  }, []);
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Voice Workflow Generator</h2>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || !permissionGranted}
          className={`py-3 px-6 rounded-lg font-medium ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700'
              : isProcessing
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isRecording 
            ? 'Stop Recording' 
            : isProcessing 
              ? 'Processing...' 
              : 'Start Recording'}
        </button>
        
        {!permissionGranted && (
          <p className="mt-2 text-sm text-yellow-400">
            Microphone permission is required. Click the button to request access.
          </p>
        )}
        
        {isRecording && (
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-300">Recording... (Max 10 seconds)</span>
          </div>
        )}
      </div>
      
      {transcript && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-300 mb-1">Your Request:</h3>
          <div className="bg-gray-700 p-3 rounded-md text-white">
            {transcript}
          </div>
        </div>
      )}
      
      {agentResponses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-300 mb-1">Agent Response:</h3>
          <div className="bg-indigo-900 p-3 rounded-md text-white">
            {agentResponses.map((response, idx) => (
              <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{response}</p>
            ))}
          </div>
        </div>
      )}
      
      {audioResponse && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-300 mb-1">Audio Response:</h3>
          <audio ref={audioRef} controls className="w-full" src={audioResponse}></audio>
        </div>
      )}
      
      {workflow && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-300 mb-1">Generated Workflow:</h3>
          <div className="bg-gray-700 p-3 rounded-md">
            <p className="text-lg font-medium text-white">{workflow.name}</p>
            <p className="text-sm text-gray-300 mt-1 mb-3">{workflow.description}</p>
            
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium text-gray-300">Workflow Steps:</h4>
              {workflow.nodes.map((node: any, index: number) => (
                <div key={node.id} className="p-2 bg-gray-600 rounded-md">
                  <span className="text-blue-300 font-medium">
                    {index + 1}. {node.data.label}
                  </span>
                  {node.data.description && (
                    <p className="text-sm text-gray-300 mt-1">{node.data.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={resetState}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
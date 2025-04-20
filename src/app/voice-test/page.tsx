'use client';

import { useState, useEffect, useRef } from 'react';
import { ElevenLabsConversationalService, TranscriptionEvent } from '@/services/ElevenLabsConversationalService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface WorkflowNode {
  id: string;
  type: string;
  title?: string;
  description?: string;
  edges: {
    target_node_id: string;
    edge_type: 'success' | 'failure' | string;
  }[];
  parameters?: Record<string, any>;
}

interface WorkflowResponse {
  steps?: WorkflowNode[];
  nodes?: WorkflowNode[];
  parameters: Record<string, any>;
  name: string;
  description: string;
  transcriptions?: string[];
  audioResponses?: Uint8Array[];
  conversation?: Message[];
  isComplete?: boolean;
}

// Define types for the editor nodes and edges
interface EditorNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    id: string;
    label: string;
    description: string;
    type: string;
    parameters: Record<string, any>;
  };
}

interface EditorEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  type?: string;
  label?: string;
}

export default function VoiceWorkflowPage() {
  const [status, setStatus] = useState('Ready to start recording');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasMicPermission(result.state === 'granted');
        
        // Listen for permission changes
        result.onchange = () => {
          setHasMicPermission(result.state === 'granted');
        };
      } catch (error) {
        console.log('Permission API not supported, will check when recording');
      }
    };
    
    checkMicPermission();
    
    // Initialize speech recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Update UI with interim results
          if (interimTranscript) {
            setLiveTranscription(interimTranscript);
          }
          
          // Add final transcript to messages
          if (finalTranscript) {
            console.log('Final transcript:', finalTranscript);
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setHasMicPermission(false);
            setError('Microphone permission denied. Please allow microphone access.');
          }
        };
      } else {
        console.warn('Speech Recognition API not supported in this browser');
      }
    }
    
    return () => {
      // Clean up recognition on unmount
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on stop
        }
      }
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscription]);
  
  // Auto-play audio response when available
  useEffect(() => {
    if (workflow?.audioResponses && workflow.audioResponses.length > 0) {
      try {
        const audioBlob = new Blob(
          workflow.audioResponses.map(buffer => new Uint8Array(buffer)),
          { type: 'audio/mpeg' }
        );
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Auto-play the audio when available
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.warn('Auto-play prevented by browser:', err);
              // Show a message to the user about auto-play being blocked
              setStatus('Audio ready - click play to hear response');
            });
          }
        }
        
        return () => {
          if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
      } catch (error) {
        console.error('Error creating audio blob:', error);
      }
    }
  }, [workflow?.audioResponses]);

  // Use the Web Speech API for speech synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Optional: customize voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') && voice.lang.includes('en-US')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      console.log('Speech synthesis finished');
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Start recording audio
  const startRecording = async () => {
    try {
      setStatus('Requesting microphone access...');
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Update permission state
      setHasMicPermission(true);
      
      // Store permission in localStorage for persistence
      localStorage.setItem('micPermissionGranted', 'true');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };
      
      // Start recording in 200ms chunks for better real-time processing
      mediaRecorder.start(200);
      
      // Also start browser speech recognition for immediate feedback
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Error starting speech recognition:', e);
        }
      }
      
      setIsRecording(true);
      setStatus('Recording... Speak now');
      
      // Reset state for new recording
      setLiveTranscription('');
    } catch (error) {
      console.error('Error starting recording:', error);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setHasMicPermission(false);
        // Store denied state in localStorage
        localStorage.setItem('micPermissionGranted', 'false');
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else {
        setError('Failed to access microphone. Please check your hardware or try a different browser.');
      }
      
      setStatus('Error accessing microphone');
    }
  };
  
  // Stop recording audio
  const stopRecording = () => {
    // Stop media recorder
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors on stop
      }
    }
    
    setIsRecording(false);
    setStatus('Processing audio...');
  };
  
  // Process audio and get workflow
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    // Add processing indicator messages
    setStatus('Processing audio...');
    const processingSteps = [
      'Converting audio...',
      'Sending to API...',
      'Generating workflow...',
      'Finalizing results...'
    ];
    
    let stepIndex = 0;
    const processingTimer = setInterval(() => {
      setStatus(processingSteps[stepIndex % processingSteps.length]);
      stepIndex++;
    }, 2000);
    
    // Set a maximum processing time of 20 seconds
    const processingTimeout = setTimeout(() => {
      if (isProcessing) {
        clearInterval(processingTimer);
        setStatus('Processing is taking longer than expected...');
      }
    }, 20000);
    
    try {
      // Save the transcription as a user message if we have it
      if (liveTranscription) {
        setMessages(prev => [...prev, {
          role: 'user',
          content: liveTranscription,
          timestamp: Date.now()
        }]);
        setLiveTranscription('');
      }
      
      // Convert audio to base64
      const elevenLabsService = new ElevenLabsConversationalService();
      
      // Create a temporary audio element to play the blob
      const audio = new Audio();
      audio.src = URL.createObjectURL(audioBlob);
      
      // Wait for audio to load
      await new Promise((resolve) => {
        audio.onloadedmetadata = resolve;
      });
      
      // Create a MediaStream from the audio element
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      
      // Convert to base64
      const base64Audio = await elevenLabsService.convertBrowserAudioToBase64(
        destination.stream
      );
      
      // Send to API with transcription callback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/elevenlabs-convai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audioData: base64Audio,
          agentId: 'i3gU7j7TnkhSqx3MNkhu'
        }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data: WorkflowResponse = await response.json();
      console.log('API response:', data);
      
      // Update workflow state
      setWorkflow(data);
      
      // Update chat with API response
      if (data.conversation && data.conversation.length > 0) {
        setMessages(data.conversation);
        
        // Find the assistant message to speak
        const assistantMessage = data.conversation.find(msg => msg.role === 'assistant');
        if (assistantMessage) {
          // If we don't have audio or it fails to play, use speech synthesis as fallback
          if (!data.audioResponses || data.audioResponses.length === 0) {
            speakText(assistantMessage.content);
          }
        }
      } else {
        // If no conversation data, add a fallback message
        const fallbackMessage = data.name ? 
          `I've created the "${data.name}" workflow based on your request.` : 
          'I\'ve created a workflow based on your request.';
          
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: fallbackMessage,
          timestamp: Date.now()
        }]);
        
        // Use speech synthesis for the fallback message
        speakText(fallbackMessage);
      }
      
      setStatus('Ready for next recording');
    } catch (error) {
      console.error('Error processing audio:', error);
      setStatus('Error processing audio');
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        setError('Request timed out. Please try again with a shorter recording.');
      } else {
        setError(error instanceof Error ? error.message : String(error));
      }
      
      // Add an error message to the chat
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I had trouble processing your audio. Please try again or speak more clearly.',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Read the error message aloud
      speakText(errorMessage.content);
    } finally {
      clearInterval(processingTimer);
      clearTimeout(processingTimeout);
      setIsProcessing(false);
      setLiveTranscription('');
    }
  };
  
  // Save workflow to editor
  const saveToEditor = () => {
    if (!workflow) return;
    
    try {
      // Log the original workflow
      console.log('Original workflow:', workflow);
      
      // Create a simple graph model the editor can display
      const editorNodes: EditorNode[] = [];
      const editorEdges: EditorEdge[] = [];
      
      // Process nodes
      const nodes = workflow.steps || workflow.nodes || [];
      
      nodes.forEach((node, index) => {
        // Ensure we have a stable ID
        const nodeId = node.id || `node-${index}`;
        
        // Create a structured grid layout
        const posX = 400; // Center of the editor
        const posY = 100 + (index * 250); // Top-down progression 
        
        editorNodes.push({
          id: nodeId,
          type: 'default', // Use default node type for guaranteed compatibility
          position: { x: posX, y: posY },
          data: {
            id: nodeId,
            label: node.title || node.type || 'Node',
            description: node.description || '',
            type: node.type || 'default',
            parameters: node.parameters || {}
          }
        });
        
        // Create edges between consecutive nodes
        if (index > 0) {
          const prevNodeId = nodes[index - 1].id || `node-${index - 1}`;
          editorEdges.push({
            id: `edge-${index}`,
            source: prevNodeId,
            target: nodeId,
            type: 'default', // Use default edge type instead of custom
            animated: true
          });
        }
      });
      
      // Create the simplified workflow structure
      const editorWorkflow = {
        name: workflow.name || 'Generated Workflow',
        description: workflow.description || 'Voice-generated workflow',
        nodes: editorNodes,
        edges: editorEdges
      };
      
      // Save to sessionStorage with debugging
      console.log('Saving workflow to editor:', editorWorkflow);
      sessionStorage.setItem('generatedWorkflow', JSON.stringify(editorWorkflow));
      
      // Display the workflow data in the console in a formatted way to help debugging
      console.log('Workflow Data Structure:');
      console.log('Nodes:', editorWorkflow.nodes.length);
      editorWorkflow.nodes.forEach((node, i) => {
        console.log(`Node ${i}:`, {
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data
        });
      });
      console.log('Edges:', editorWorkflow.edges.length);
      editorWorkflow.edges.forEach((edge, i) => {
        console.log(`Edge ${i}:`, {
          id: edge.id,
          source: edge.source,
          target: edge.target
        });
      });
      
      // Tell the user what's happening
      speakText("Opening your workflow in the editor");
      
      // Add a slight delay to ensure storage is set before navigating
      setTimeout(() => {
        window.location.href = '/workflow-editor';
      }, 100);
    } catch (error) {
      console.error('Error saving workflow to editor:', error);
      setError('Failed to save workflow to editor. Please try again.');
    }
  };

  // Add a permission debugging section
  const [permissionDetails, setPermissionDetails] = useState<string>('');
  
  const checkPermissionDetails = async () => {
    try {
      // Clear previous details
      setPermissionDetails('');
      
      let details = '';
      
      // Check localStorage first
      const storedPermission = localStorage.getItem('micPermissionGranted');
      details += `LocalStorage permission state: ${storedPermission || 'not set'}\n`;
      
      // Check Permissions API
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          details += `Permissions API state: ${permissionStatus.state}\n`;
        } catch (err) {
          details += `Permissions API error: ${err instanceof Error ? err.message : String(err)}\n`;
        }
      } else {
        details += `Permissions API: Not supported by this browser\n`;
      }
      
      // Try to get user media to check actual permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        details += `getUserMedia test: Success\n`;
        
        // Get audio tracks info
        const audioTracks = stream.getAudioTracks();
        details += `Audio tracks available: ${audioTracks.length}\n`;
        
        if (audioTracks.length > 0) {
          details += `Default microphone: ${audioTracks[0].label}\n`;
          details += `Track constraints: ${JSON.stringify(audioTracks[0].getConstraints())}\n`;
        }
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        details += `getUserMedia test: Failed - ${err instanceof Error ? err.message : String(err)}\n`;
      }
      
      // Get browser details
      const userAgent = navigator.userAgent;
      details += `\nBrowser: ${userAgent}\n`;
      
      // Check if running in secure context
      details += `Secure context: ${window.isSecureContext ? 'Yes' : 'No'}\n`;
      
      setPermissionDetails(details);
    } catch (error) {
      setPermissionDetails(`Error checking permissions: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        Voice Workflow Generator
      </h1>
      
      {/* Microphone permission status */}
      {hasMicPermission === false && (
        <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-red-700 font-medium">Microphone access denied</p>
              <p className="text-red-600 text-sm mt-1">
                Please allow microphone access in your browser settings to use the voice features.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded border border-red-300 text-sm hover:bg-red-200"
              >
                Retry permission
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-blue-800">
          <strong>How to use:</strong> Click the record button and describe the workflow you want to create.
          Speak clearly and include details about what the workflow should do.
          When finished, click stop and wait for the AI to generate your workflow.
        </p>
      </div>
      
      {audioUrl && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">AI Response</h3>
          <div className="flex items-center">
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            <button 
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.play().catch(console.error);
                }
              }}
              className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              title="Play response again"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex mb-4 gap-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || hasMicPermission === false}
          className={`flex-1 py-3 flex items-center justify-center font-semibold rounded-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200`}
        >
          {isRecording ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Recording
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Recording
            </>
          )}
        </button>
        
        {workflow && (
          <button
            onClick={saveToEditor}
            className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Open in Editor
          </button>
        )}
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isRecording ? 'bg-red-500 animate-pulse' : 
            isProcessing ? 'bg-yellow-500 animate-pulse' : 
            'bg-green-500'
          }`}></span>
          Status: {status}
        </div>
        
        {isRecording && liveTranscription && (
          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
            <span className="font-semibold">Hearing: </span>
            {liveTranscription}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conversation History */}
        <div className="border rounded-lg p-4 flex flex-col h-[400px]">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Conversation
          </h2>
          
          <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center p-4 flex flex-col items-center justify-center h-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start a conversation by recording your voice
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-3 p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 ml-auto max-w-[80%]' 
                      : 'bg-gray-200 mr-auto max-w-[80%]'
                  }`}
                >
                  <div className="font-semibold mb-1 flex items-center">
                    {msg.role === 'user' ? (
                      <>
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        You
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        AI Assistant
                      </>
                    )}
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))
            )}
            
            {isRecording && liveTranscription && (
              <div className="mb-3 p-3 rounded-lg bg-blue-50 ml-auto max-w-[80%] animate-pulse">
                <div className="font-semibold mb-1 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  You (speaking)
                </div>
                <div>{liveTranscription}</div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Workflow Visualization */}
        <div className="border rounded-lg p-4 flex flex-col h-[400px]">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Generated Workflow
          </h2>
          
          {!workflow ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 flex-col">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Record your voice to generate a workflow
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold">{workflow.name}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              
              {(workflow.steps?.length === 0 && workflow.nodes?.length === 0) ? (
                <div className="text-gray-500 text-center p-4">
                  No steps in the workflow yet
                </div>
              ) : (
                <div className="space-y-4">
                  {(workflow.steps || workflow.nodes || []).map((node, index) => (
                    <div key={index} className="border rounded p-3 bg-white shadow-sm">
                      <div className="font-semibold">{node.title || node.type}</div>
                      {node.description && (
                        <div className="text-sm text-gray-600 mt-1">{node.description}</div>
                      )}
                      {node.parameters && Object.keys(node.parameters).length > 0 && (
                        <div className="mt-2 text-xs">
                          <div className="font-semibold">Parameters:</div>
                          <pre className="bg-gray-100 p-1 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(node.parameters, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Permission Debugging Section */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Microphone Permission Diagnostics</h3>
        
        <button
          onClick={checkPermissionDetails}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
        >
          Check Microphone Details
        </button>
        
        {permissionDetails && (
          <pre className="bg-gray-900 p-4 rounded text-green-400 text-sm mt-2 whitespace-pre-wrap">
            {permissionDetails}
          </pre>
        )}
      </div>
    </div>
  );
} 
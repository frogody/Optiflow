'use client';

import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Audio Visualizer Component
const AudioVisualizer = ({ isActive, color = '#4299e1', debug = false }: { isActive: boolean, color?: string, debug?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make canvas responsive
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get width and height
    const width = canvas.width;
    const height = canvas.height;
    
    // Check if we should animate - ONLY animate when actually speaking or in debug mode
    if (!isActive && !debug) {
      // Clear canvas if not active and not in debug mode
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationRef.current);
      return;
    }
    
    // Modern circular visualizer configuration
    const dotCount = 5;
    const centerX = width / 2;
    const maxRadius = Math.min(width, height * 2) * 0.4;
    const minRadius = maxRadius * 0.6; // Base size for dots
    
    // Dot states with different phases for natural movement
    const dots = Array(dotCount).fill(0).map((_, i) => ({
      radius: minRadius * (0.5 + Math.random() * 0.5),
      speed: 0.02 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      x: 0, // Will be calculated
      y: 0, // Will be calculated
      targetScale: 1.0,
      scale: 1.0,
      opacity: 0.7 + Math.random() * 0.3
    }));
    
    // Animation timing
    let time = 0;
    
    const animate = () => {
      // Clear canvas with each frame
      ctx.clearRect(0, 0, width, height);
      
      // Update time
      time += 0.03;
      
      // Create background glow effect
      const gradient = ctx.createRadialGradient(
        centerX, height / 2, 0,
        centerX, height / 2, maxRadius * 1.2
      );
      
      // Determine base colors from the provided color
      const baseColor = color;
      const baseColorLighter = color === '#4299e1' ? '#63b3ed' : color; // Lighten if using default blue
      
      // Soft ambient glow in background
      gradient.addColorStop(0, `${baseColorLighter}10`);
      gradient.addColorStop(0.7, `${baseColorLighter}05`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Calculate layout with dots positioned for balanced look
      const positions = [];
      const spacing = 1.7; // Space between dots
      
      // Middle dot
      positions.push({ x: centerX, y: height / 2 });
      
      // Calculate outer dot positions
      if (dotCount > 1) {
        const leftX = centerX - minRadius * spacing;
        const rightX = centerX + minRadius * spacing;
        
        // Add left and right dots
        positions.push({ x: leftX, y: height / 2 });
        positions.push({ x: rightX, y: height / 2 });
        
        // Add more dots in a curved pattern if needed
        if (dotCount > 3) {
          const farLeftX = centerX - minRadius * spacing * 1.8;
          const farRightX = centerX + minRadius * spacing * 1.8;
          positions.push({ x: farLeftX, y: height / 2 });
          positions.push({ x: farRightX, y: height / 2 });
        }
      }
      
      // Limit to actual dot count
      const actualPositions = positions.slice(0, dotCount);
      
      // Draw dots with glowing effect
      actualPositions.forEach((pos, i) => {
        const dot = dots[i];
        
        // Update dot animation
        // Use sin wave for pulsating effect based on individual dot phase
        const pulseAmount = (isActive ? 0.2 : 0.1) * Math.sin(time * dot.speed + dot.phase) + 1;
        
        // Smooth transition for scale
        dot.targetScale = pulseAmount;
        dot.scale += (dot.targetScale - dot.scale) * 0.1;
        
        // Dot position
        dot.x = pos.x;
        dot.y = pos.y;
        
        // Draw dot with glow effect
        const radius = dot.radius * dot.scale;
        
        // Main glow
        const glowGradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, radius * 1.5
        );
        
        glowGradient.addColorStop(0, `${baseColor}ff`);
        glowGradient.addColorStop(0.6, `${baseColor}40`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Core dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Continue animation only if still active or in debug mode
      if (isActive || debug) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, color, debug]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-16 mb-4 rounded-md"
      style={{ display: 'block' }}
    />
  );
};

// Type declarations
interface Workflow {
  // Define the shape of your workflow object
  id: string;
  name: string;
  steps: any[];
  [key: string]: any;
}
interface AgentChatMessage {
  role: 'agent' | 'user';
  text: string;
}
interface ConfirmationData {
  summary: string;
  [key: string]: any;
}
declare global {
  interface Window {
    livekitRoom?: any;
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function VoiceAgentClient() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: "Hi there! I'm your Optiflow voice assistant. Click the button below to start talking.", isUser: false}
  ]);
  const [isListening, setIsListening] = useState(false);
  const [recognitionRunning, setRecognitionRunning] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    type: 'openai', // 'browser' or 'openai'
    browserVoice: {
      rate: 1.0,
      pitch: 1.0,
      voiceName: '',
    },
    openai: {
      voice: 'alloy', // alloy, echo, fable, onyx, nova, shimmer
      model: 'nova', // nova or hd
      speed: 1.0,
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Add debug mode state
  const [debugVisualizer, setDebugVisualizer] = useState(false);
  // Conversation mode disabled by default; user must click to start listening
  const [conversationMode, setConversationMode] = useState(false);
  // Add debug mode 
  const [debugMode, setDebugMode] = useState(false);
  
  // Move voiceEnabled declaration here, before any useEffect that references it
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const volumeLevelRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef<number>(0);
  
  // References for audio processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Silence detection variables
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimestampRef = useRef<number>(Date.now());
  const silenceThresholdRef = useRef<number>(2000); // 2 seconds of silence
  
  // Add state for continuous recognition
  const [continuousRecognition, setContinuousRecognition] = useState(false);
  
  // Use a consistent date-based room name that matches the agent
  const todayDate = new Date().toISOString().split('T')[0];
  const defaultRoomName = `optiflow-voice-${todayDate}`;
  const [roomName, setRoomName] = useState<string>(defaultRoomName);
  
  // Add state for data channel messages
  const [agentConnected, setAgentConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const router = useRouter();
  const [pendingConfirmation, setPendingConfirmation] = useState<ConfirmationData | null>(null);
  const [escalationMessage, setEscalationMessage] = useState<string | null>(null);
  const [workflowHistory, setWorkflowHistory] = useState<Workflow[]>([]);
  const [workflowPointer, setWorkflowPointer] = useState(0);
  const [highlightedNodes, setHighlightedNodes] = useState<Record<string, any>>({});
  const [agentMode, setAgentMode] = useState<string>(() => localStorage.getItem('voiceAgentMode') || 'Sales mode');
  const [agentChat, setAgentChat] = useState<AgentChatMessage[]>([]);
  
  const didAutoGreet = useRef(false);
  const lastAgentUtterance = useRef<string>(''); // For echo detection

  // Robust Speech Recognition Lifecycle
  const recognitionRef = useRef<any>(null); // This will hold the single SpeechRecognition instance
  const [isRecognizing, setIsRecognizing] = useState(false);
  const restartAttemptsRef = useRef(0);
  const MAX_RESTART_ATTEMPTS = 10;
  const audioContextRef = useRef<AudioContext | null>(null); // Ensure this is available for resetAudioResources

  // Placeholder for actual audio source if using Web Audio API for playback, adjust as needed
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null); 

  useEffect(() => {
    console.log('Using LiveKit room:', roomName);
  }, [roomName]);

  const resetAudioResources = () => {
    console.log('[recognition] resetAudioResources called', { isRecognizing, voiceEnabled, stack: new Error().stack });
    // Stop and clear any Web Audio API playback nodes
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      } catch(e) {
        console.warn("Error stopping or disconnecting audio source:", e);
      }
      audioSourceRef.current = null;
    }

    // Stop HTMLAudioElement playback if used for TTS
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Clear source to release resources
    }

    // Cancel any browser's native speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Clear TTS queue
    ttsQueueRef.current = [];
    
    console.log('Audio resources reset');
  };
  
  const startRecognitionInternal = () => {
    console.log('[recognition] startRecognitionInternal called', { isRecognizing, voiceEnabled, stack: new Error().stack });
    if (isRecognizing || !recognitionRef.current) {
      console.log('[recognition] Recognition already active or not initialized, cannot start.', { isRecognizing, voiceEnabled, stack: new Error().stack });
      return;
    }
    try {
      recognitionRef.current.start();
      console.log('[recognition] recognition.start() called', { isRecognizing, voiceEnabled, stack: new Error().stack });
    } catch (e) {
      console.error('[recognition] Error issuing recognition.start():', e, { stack: new Error().stack });
      setIsRecognizing(false);
      if (restartAttemptsRef.current < MAX_RESTART_ATTEMPTS) {
        setTimeout(() => {
          resetAudioResources();
          startRecognitionInternal();
          restartAttemptsRef.current++;
        }, Math.min(1000 * restartAttemptsRef.current, 5000));
      } else {
        console.error('[recognition] Max recognition restart attempts reached after immediate start error.', { stack: new Error().stack });
      }
    }
  };

  const stopRecognitionInternal = () => {
    console.log('[recognition] stopRecognitionInternal called', { isRecognizing, voiceEnabled, stack: new Error().stack });
    if (!isRecognizing || !recognitionRef.current) {
      console.log('[recognition] Recognition not active or not initialized, cannot stop.', { isRecognizing, voiceEnabled, stack: new Error().stack });
      return;
    }
    try {
      recognitionRef.current.stop();
      console.log('[recognition] recognition.stop() called', { isRecognizing, voiceEnabled, stack: new Error().stack });
    } catch (e) {
      console.error('[recognition] Error issuing recognition.stop():', e, { stack: new Error().stack });
      setIsRecognizing(false);
    }
  };
  
  // Initialize recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        // Attach all event handlers with detailed logging and stack traces
        recognition.onstart = () => {
          console.log('[recognition] onstart', { isRecognizing, voiceEnabled, stack: new Error().stack });
          setIsRecognizing(true);
          setIsListening(true);
          setAgentState('listening');
          restartAttemptsRef.current = 0;
          lastSpeechTimestampRef.current = Date.now();
        };
        recognition.onaudiostart = () => {
          console.log('[recognition] onaudiostart', { isRecognizing, voiceEnabled, stack: new Error().stack });
        };
        recognition.onaudioend = () => {
          console.log('[recognition] onaudioend', { isRecognizing, voiceEnabled, stack: new Error().stack });
        };
        recognition.onsoundstart = () => {
          console.log('[recognition] onsoundstart', { isRecognizing, voiceEnabled, stack: new Error().stack });
        };
        recognition.onsoundend = () => {
          console.log('[recognition] onsoundend', { isRecognizing, voiceEnabled, stack: new Error().stack });
        };
        recognition.onspeechstart = () => {
          console.log('[recognition] onspeechstart', { isRecognizing, voiceEnabled, stack: new Error().stack });
        };
        recognition.onspeechend = () => {
          console.log('[recognition] onspeechend', { isRecognizing, voiceEnabled, stack: new Error().stack });
        };
        recognition.onend = () => {
          console.log('[recognition] onend', { isRecognizing, voiceEnabled, stack: new Error().stack });
          const previousIsRecognizing = isRecognizing;
          setIsRecognizing(false);
          setIsListening(false);
          if (voiceEnabled && previousIsRecognizing && restartAttemptsRef.current < MAX_RESTART_ATTEMPTS) {
            console.log(`[recognition] Auto-restarting continuous recognition. Retry count: ${restartAttemptsRef.current + 1}`, { stack: new Error().stack });
            setTimeout(() => {
              if (voiceEnabled) {
                resetAudioResources();
                startRecognitionInternal();
                restartAttemptsRef.current++;
              }
            }, Math.min(1000 * restartAttemptsRef.current, 5000));
          } else if (restartAttemptsRef.current >= MAX_RESTART_ATTEMPTS) {
            console.error('[recognition] Max recognition restart attempts reached. Recognition will not automatically restart.', { stack: new Error().stack });
            setError('Speech recognition failed after multiple attempts. Please try reloading or check microphone permissions.');
          } else {
            console.log('[recognition] Not restarting recognition (intentionally stopped, voice disabled, or max attempts).', { stack: new Error().stack });
          }
        };
        recognition.onerror = (event) => {
          console.error('[recognition] onerror', event.error, { isRecognizing, voiceEnabled, stack: new Error().stack });
          const previousIsRecognizing = isRecognizing;
          setIsRecognizing(false);
          setIsListening(false);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setError(`Microphone access was not allowed or the speech service is unavailable (${event.error}).`);
            setVoiceEnabled(false);
            return;
          }
          if (event.error === 'aborted') {
            console.log('[recognition] Not restarting recognition due to error: aborted', { stack: new Error().stack });
            return;
          }
          if (previousIsRecognizing && restartAttemptsRef.current < MAX_RESTART_ATTEMPTS) {
            console.log(`[recognition] Recognition error (${event.error}). Attempting restart ${restartAttemptsRef.current + 1}/${MAX_RESTART_ATTEMPTS}`, { stack: new Error().stack });
            resetAudioResources();
            setTimeout(() => {
              if (voiceEnabled) {
                startRecognitionInternal();
                restartAttemptsRef.current++;
              }
            }, Math.min(1000 * restartAttemptsRef.current, 5000));
          } else if (restartAttemptsRef.current >= MAX_RESTART_ATTEMPTS) {
            console.error('[recognition] Max recognition restart attempts reached after error. Recognition will not automatically restart.', { stack: new Error().stack });
            setError('Speech recognition failed after multiple error attempts.');
          } else {
            console.log(`[recognition] Recognition error (${event.error}), but not restarting (was not recognizing or max attempts).`, { stack: new Error().stack });
          }
        };
        recognition.onresult = (event) => {
          console.log('[recognition] onresult', { isRecognizing, voiceEnabled, event, stack: new Error().stack });
          lastSpeechTimestampRef.current = Date.now();
          restartAttemptsRef.current = 0;
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          console.log('[recognition] Interim:', interimTranscript);
          console.log('[recognition] Final:', finalTranscript);
          if (finalTranscript.trim()) {
            const text = finalTranscript.trim();
            const confidence = event.results[event.results.length - 1][0].confidence || 0.9;
            console.log('[recognition] Final transcript:', text, 'Confidence:', confidence);
            if (isSpeaking) {
              console.log('[recognition] Ignoring speech input: Agent is currently speaking.');
              return;
            }
            const timeSinceAgentSpoke = Date.now() - lastAgentSpeakTimeRef.current;
            if (lastAgentUtterance.current && calculateSimilarity(text, lastAgentUtterance.current) > SIMILARITY_THRESHOLD && timeSinceAgentSpoke < 2000) {
              console.log(`[recognition] Ignoring echo of agent speech (similarity: ${calculateSimilarity(text, lastAgentUtterance.current).toFixed(2)})`);
              return;
            }
            if (isSpeaking) {
              console.log('[recognition] User interrupted agent - stopping speech');
              stopTTSLoop();
              ttsInterruptedRef.current = true;
              ttsQueueRef.current = [];
              if (streamingControllerRef.current) {
                streamingControllerRef.current.abort();
              }
              setIsSpeaking(false);
            }
            handleVoiceInput(text);
          }
        };
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
      setIsLoading(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onaudiostart = null;
          recognitionRef.current.onaudioend = null;
          recognitionRef.current.onsoundstart = null;
          recognitionRef.current.onsoundend = null;
          recognitionRef.current.onspeechstart = null;
          recognitionRef.current.onspeechend = null;
          recognitionRef.current.abort();
        } catch (e) {
          console.warn('[recognition] Error during recognition cleanup:', e, { stack: new Error().stack });
        }
        recognitionRef.current = null;
      }
    };
  }, [voiceEnabled, setIsLoading, setError]);

  // Load available browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Get initial voices
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        
        // Set default voice (prefer Google US English voice if available)
        const defaultVoice = voices.find(voice => 
          voice.name.includes('Google') && voice.lang.includes('en-US')
        ) || voices.find(voice => 
          voice.lang.includes('en-US')
        ) || voices[0];
        
        if (defaultVoice) {
          setVoiceSettings(prev => ({
            ...prev, 
            browserVoice: {...prev.browserVoice, voiceName: defaultVoice.name}
          }));
        }
      }
      
      // Handle voices loaded event
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        setAvailableVoices(updatedVoices);
        
        // Set default voice if not already set
        if (!voiceSettings.browserVoice.voiceName && updatedVoices.length > 0) {
          const defaultVoice = updatedVoices.find(voice => 
            voice.name.includes('Google') && voice.lang.includes('en-US')
          ) || updatedVoices.find(voice => 
            voice.lang.includes('en-US')
          ) || updatedVoices[0];
          
          if (defaultVoice) {
            setVoiceSettings(prev => ({
              ...prev, 
              browserVoice: {...prev.browserVoice, voiceName: defaultVoice.name}
            }));
          }
        }
      };
    }
  }, []);
  
  // Create audio element for OpenAI TTS
  useEffect(() => {
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      audioRef.current.onplay = () => {
        console.log('Browser speech started');
        setIsSpeaking(true);
      };
      
      audioRef.current.onended = () => {
        console.log('Browser speech ended');
        setIsSpeaking(false);
      };
      
      audioRef.current.onerror = () => {
        setIsSpeaking(false); ttsQueueRef.current = [];
        console.error('Audio playback error');
        toast.error('Speech error occurred');
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    // Do not enable conversation mode or start listening here
    return () => {
      cleanupAudio();
    };
  }, []);

  // Remove auto-start from conversationMode useEffect
  useEffect(() => {
    // Only start/stop listening if user has enabled the agent
    if (!voiceEnabled) return;
    if (!conversationMode) {
      if (continuousRecognition) stopContinuousListening();
      return;
    }
    startContinuousListening();
    return () => {
      if (continuousRecognition) stopContinuousListening();
    };
  }, [conversationMode, voiceEnabled]);

  // Helper to estimate speech duration from text length
  const estimateSpeechDuration = (text: string) => {
    // Average speaking rate in characters per second (English)
    const charsPerSecond = 15;
    
    // Calculate estimated duration in milliseconds
    const duration = (text.length / charsPerSecond) * 1000;
    
    // Add minimum duration and return
    return Math.max(2000, duration);
  };

  // Set up volume visualization
  const setupVolumeMeter = async () => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Create analyzer
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyserRef.current);
      
      // Create buffer for visualization
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Update volume meter
      volumeIntervalRef.current = window.setInterval(() => {
        if (analyserRef.current && volumeLevelRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let values = 0;
          for (let i = 0; i < bufferLength; i++) {
            values += dataArray[i];
          }
          const average = values / bufferLength;
          
          // Update volume bar (0-100%)
          const volume = Math.min(100, Math.max(0, average * 2));
          volumeLevelRef.current.style.width = `${volume}%`;
        }
      }, 100);
    } catch (err) {
      console.error('Error setting up volume meter:', err);
      toast.error('Failed to access microphone');
    }
  };
  
  // Clean up audio resources
  const cleanupAudio = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    if (volumeLevelRef.current) {
      volumeLevelRef.current.style.width = '0%';
    }
    
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Clear silence detection timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Stop recognition if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
      recognitionRef.current = null;
    }
  };
  
  // Add a message to the conversation
  const addMessage = (text: string, isUser: boolean) => {
    setMessages(prev => [...prev, { text, isUser }]);
  };
  
  // Speak using browser's native speech synthesis
  const speakWithBrowser = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      // Stop recognition while speaking
      stopContinuousListening();
      // Don't use any SSML tags or special markup - use text directly
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply selected voice if available
      if (voiceSettings.browserVoice.voiceName) {
        const selectedVoice = availableVoices.find(v => v.name === voiceSettings.browserVoice.voiceName);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      // Apply voice settings
      utterance.rate = voiceSettings.browserVoice.rate;
      utterance.pitch = voiceSettings.browserVoice.pitch;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        console.log('Browser speech started');
        setIsSpeaking(true);
      };
      utterance.addEventListener('end', () => { 
        setIsSpeaking(false);
        if (conversationMode) {
          stopContinuousListening();
          setTimeout(() => {
            startContinuousListening();
          }, 300);
        }
      });
      utterance.onerror = (e) => {
        console.error('Browser speech error:', e);
        setIsSpeaking(false);
        toast.error('Speech error occurred');
        if (conversationMode) {
          stopContinuousListening();
          setTimeout(() => {
            startContinuousListening();
          }, 300);
        }
      };
      
      window.speechSynthesis.speak(utterance);
      return true;
    }
    
    return false;
  };
  
  // Utility: Split text into chunks for TTS
  function splitIntoChunks(text: string, maxLen = 1000) {
    // Split by sentence, then group into chunks of maxLen
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let current = '';
    for (const s of sentences) {
      if ((current + s).length > maxLen) {
        if (current) chunks.push(current);
        current = s;
      } else {
        current += s;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }
  
  // Add agent state for UI feedback
  const [agentState, setAgentState] = useState<'idle'|'connecting'|'listening'|'speaking'|'thinking'>('idle');

  // Utility: Cancelable controller for streaming fetch
  const streamingControllerRef = useRef<AbortController | null>(null);
  // TTS queue and playback loop refs
  const ttsQueueRef = useRef<string[]>([]);
  const ttsLoopActiveRef = useRef(false);
  const ttsInterruptedRef = useRef(false);

  // Add needed state and refs for echo detection
  const lastAgentSpeakTimeRef = useRef<number>(0);
  const MIN_CONFIDENCE_THRESHOLD = 0.4; // Lower confidence threshold (was 0.7)
  const SIMILARITY_THRESHOLD = 0.8; // Higher similarity required to be considered echo (was 0.7)
  const MIN_TIME_SINCE_AGENT_SPEECH = 100; // Reduced delay after agent speech (was 300ms)

  // Add agent personality characteristics
  const AGENT_PERSONALITY = {
    name: 'Sync',
    style: 'friendly yet professional',
    traits: [
      'uses conversational language instead of formal speak',
      'occasionally uses light humor',
      'speaks concisely without unnecessary corporatespeak',
      'acts like a helpful teammate rather than a robot',
      'responds with enthusiasm but stays professional',
      'uses more contractions (I\'m, you\'re, let\'s) for natural speech'
    ],
    greetings: [
      "Hey there! I'm Sync, your AI assistant. How can I help you today?",
      "Hi! Sync here. What can I help you with?",
      "Hey! I'm Sync, your assistant. What are we working on today?"
    ]
  };

  // Make the initial greeting more conversational by using the personality
  const getRandomGreeting = () => {
    const randomIndex = Math.floor(Math.random() * AGENT_PERSONALITY.greetings.length);
    return AGENT_PERSONALITY.greetings[randomIndex];
  };

  // Function to calculate text similarity (0-1)
  const calculateSimilarity = (str1: string, str2: string): number => {
    // Simple case - direct substring match suggests echo
    if (str1.toLowerCase().includes(str2.toLowerCase()) || 
        str2.toLowerCase().includes(str1.toLowerCase())) {
      return 1.0;
    }

    // Convert to lowercase and remove punctuation for comparison
    const clean1 = str1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    const clean2 = str2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();

    // Split into words for comparison
    const words1 = clean1.split(/\s+/);
    const words2 = clean2.split(/\s+/);
    
    // Count matching words
    let matches = 0;
    for (const word of words1) {
      if (words2.includes(word) && word.length > 2) { // Only count substantial words
        matches++;
      }
    }
    
    // Calculate similarity score
    const totalWords = Math.max(words1.length, words2.length);
    return totalWords > 0 ? matches / totalWords : 0;
  };

  // Add agent mode system prompts
  const AGENT_MODE_PROMPTS: Record<string, string> = {
    'Sales mode': "You are a sales-focused AI assistant helping with Optiflow's workflow automation platform. Highlight key features, pricing benefits, and ROI. Keep responses brief, enthusiastic, and emphasize business value and competitive advantages.",
    'Support mode': "You are a support-focused AI assistant for Optiflow. Help users troubleshoot issues, explain how features work, and provide technical guidance. Be patient, clear, and focus on resolving user problems efficiently.",
    'Integration mode': "You are an integration specialist for Optiflow. Explain how Optiflow connects with other platforms like Gmail, Slack, and CRMs. Focus on API capabilities, webhook options, and data synchronization features. Be technical but accessible."
  };

  // Stop continuous listening - define this before using it
  const stopContinuousListening = () => {
    console.log("Attempting to stop continuous listening (robust version)...");
    if (recognitionRef.current && isRecognizing) {
      stopRecognitionInternal(); // Uses the new robust stop
    } else {
      console.log("Continuous listening already stopped or recognition not initialized.");
    }
    // isRecognizing and isListening states are managed by onend/onerror handlers
    // setContinuousRecognition(false); // This state might be redundant if isRecognizing covers it
  };
  
  // Modify handleVoiceInput to remove loading toast and improve speech handling
  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;
    addMessage(text, true);
    setAgentState('thinking');
    
    // Abort any previous streaming fetch (for interruption)
    if (streamingControllerRef.current) {
      streamingControllerRef.current.abort();
    }
    // Interrupt TTS and clear queue
    stopTTSLoop();
    ttsQueueRef.current = [];
    ttsInterruptedRef.current = false;
    startTTSLoop();

    try {
      if (!roomName) {
        console.warn('Room name not set, skipping server request');
        // toast.dismiss(loadingToastId);
        // ... fallback ...
      } else {
        // Include the agent mode in the request
        const controller = new AbortController();
        streamingControllerRef.current = controller;
        const response = await fetch('/api/livekit/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'transcription',
            roomName: roomName,
            participantId: 'browser-user',
            text,
            agentMode: agentMode,
            systemPrompt: AGENT_MODE_PROMPTS[agentMode as keyof typeof AGENT_MODE_PROMPTS] || AGENT_MODE_PROMPTS['Sales mode']
          }),
          signal: controller.signal
        });
        // toast.dismiss(loadingToastId);
        if (!response.body) throw new Error('No response body');
        const reader = response.body.getReader();
        let fullText = '';
        let buffer = '';
        setAgentState('speaking');
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          // Parse SSE data
          for (const line of chunk.split(/\r?\n/)) {
            if (line.startsWith('data: ')) {
              const token = line.replace('data: ', '');
              if (token === '[DONE]') continue;
              fullText += token;
              buffer += token;
              // Use much smaller chunks for more continuous speech
              // Queue more frequently with shorter text to reduce pauses
              if (/[.!?]\s$|[.!?]$/.test(buffer) || buffer.length > 40) {
                ttsQueueRef.current.push(buffer.trim());
                buffer = '';
              }
            }
          }
        }
        // Play any remaining buffer
        if (buffer.trim()) {
          ttsQueueRef.current.push(buffer.trim());
        }
        // Wait for all TTS to finish
        while (ttsQueueRef.current.length > 0 || isSpeaking) {
          await new Promise(res => setTimeout(res, 0));
        }
        addMessage(fullText, false);
        setAgentState('listening');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setAgentState('listening');
      } else {
        console.error('Error processing voice input:', err);
        // toast.error('Error processing your request');
        setAgentState('listening');
      }
    }
  };
  
  // Modify speak function for smoother playback
  const speak = async (text: string) => {
    return new Promise<void>((resolve) => {
      // Record this utterance for echo detection
      lastAgentUtterance.current = text; // Use .current for ref
      lastAgentSpeakTimeRef.current = Date.now();
      
      setAgentState('speaking'); // Moved earlier
      setIsSpeaking(true); // Moved earlier

      console.log("Speak function called. Stopping recognition.");
      // IMPORTANT: Completely stop speech recognition before TTS starts
      // Use the robust stop, but ensure it doesn't trigger auto-restart if we are just pausing for TTS
      // This requires careful management of the 'explicitly stopped' state.
      // For now, we rely on isSpeaking flag in onEnd/onError to prevent restart.
      if (isRecognizing) {
         stopRecognitionInternal(); // Request stop
      }
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setAgentState('listening'); // Or 'idle' depending on flow
          URL.revokeObjectURL(url);
          console.log("speak(): TTS ended. Restarting recognition if in conversation mode.");
          if (conversationMode && voiceEnabled) {
            // Delay slightly to avoid immediate self-triggering if mic is hot
            setTimeout(() => {
              if (voiceEnabled && conversationMode && !isRecognizing) { // Check if already restarted
                 resetAudioResources(); // Clean before starting
                 startRecognitionInternal(); // Use the new robust start
              }
            }, 100); 
          }
          resolve();
        };
        audioRef.current.onerror = () => {
          setIsSpeaking(false);
          setAgentState('listening');
          console.warn("speak(): audioRef.current is null after TTS blob received.");
          if (conversationMode && voiceEnabled && !isRecognizing) {
             setTimeout(() => {
                resetAudioResources();
                startRecognitionInternal();
             },100);
          }
          resolve();
        };
      }
      
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsSpeaking(true);
      
      // Use OpenAI TTS API with error handling
      fetch('/api/openai-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: voiceSettings.openai.voice,
          model: voiceSettings.openai.model,
          // Increase speed slightly for more natural flow
          speed: Math.min(1.0, voiceSettings.openai.speed + 0.05),
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`TTS API responded with status: ${res.status}`);
          }
          return res.blob();
        })
        .then(blob => {
          if (audioRef.current) {
            const url = URL.createObjectURL(blob);
            audioRef.current.src = url;
            
            // Play with retry logic
            const playWithRetry = (attempts = 0) => {
              if (audioRef.current) {
                audioRef.current.play()
                  .catch(err => {
                    console.error('Audio play error:', err);
                    if (attempts < 3) {
                      // Retry with exponential backoff
                      setTimeout(() => playWithRetry(attempts + 1), 50);
                    } else {
                      setIsSpeaking(false);
                      // toast.error('Could not play audio');
                      URL.revokeObjectURL(url);
                      setTimeout(() => {
                        if (conversationMode && voiceEnabled) {
                          startContinuousListening();
                        }
                      }, 100);
                      resolve();
                    }
                  });
              }
            };
            
            playWithRetry();
            
            // Clean up the blob URL when done
            audioRef.current.onended = () => {
              setIsSpeaking(false);
              setAgentState('listening'); // Or 'idle' depending on flow
              URL.revokeObjectURL(url);
              console.log("speak(): TTS ended. Restarting recognition if in conversation mode.");
              if (conversationMode && voiceEnabled) {
                // Delay slightly to avoid immediate self-triggering if mic is hot
                setTimeout(() => {
                  if (voiceEnabled && conversationMode && !isRecognizing) { // Check if already restarted
                     resetAudioResources(); // Clean before starting
                     startRecognitionInternal(); // Use the new robust start
                  }
                }, 100); 
              }
              resolve();
            };
          } else {
            setIsSpeaking(false);
            setAgentState('listening');
            console.warn("speak(): audioRef.current is null after TTS blob received.");
            if (conversationMode && voiceEnabled && !isRecognizing) {
               setTimeout(() => {
                  resetAudioResources();
                  startRecognitionInternal();
               },100);
            }
            resolve();
          }
        })
        .catch(err => {
          console.error('TTS fetch error:', err);
          setIsSpeaking(false);
          setAgentState('listening');
          toast.error('Speech generation failed');
           if (conversationMode && voiceEnabled && !isRecognizing) {
             setTimeout(() => {
                resetAudioResources();
                startRecognitionInternal();
             },100);
          }
          resolve();
        });
    });
  };

  // Modify persistent TTS queue loop for faster processing and smoother playback
  const startTTSLoop = () => {
    if (ttsLoopActiveRef.current) return;
    ttsLoopActiveRef.current = true;
    (async () => {
      while (ttsLoopActiveRef.current) {
        if (ttsInterruptedRef.current) {
          ttsQueueRef.current = [];
          ttsInterruptedRef.current = false;
        }
        const segment = ttsQueueRef.current.shift();
        if (typeof segment === 'string') {
          // Stop listening completely during TTS to prevent self-triggering
          // The speak() function now handles stopping recognition.
          // stopContinuousListening(); 
          // setIsListening(false);
          
          await speak(segment);
          
          // ... existing code ...
        } else {
          // No segment, wait a shorter bit for more responsive handling
          await new Promise(res => setTimeout(res, 0));
        }
      }
    })();
  };

  const stopTTSLoop = () => {
    ttsLoopActiveRef.current = false;
    ttsInterruptedRef.current = true; // Signal interruption
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ''; // Clear src to stop download/playback
    }
    setIsSpeaking(false);
    setAgentState('listening'); // Or idle
    console.log("TTS loop stopped. Restarting recognition if needed.");
    // Restart recognition if it was stopped for TTS and should be active
    if (conversationMode && voiceEnabled && !isRecognizing) {
      setTimeout(() => { // Add a small delay
        if (voiceEnabled && conversationMode && !isRecognizing) {
            resetAudioResources();
            startRecognitionInternal();
        }
      }, 150); // Slightly longer delay after full stop
    }
  };

  // Modify startContinuousListening to use the new robust lifecycle
  const startContinuousListening = () => {
    console.log('Attempting to start continuous listening (robust version)...');
    if (!voiceEnabled) {
      console.log("Voice not enabled, aborting startContinuousListening.");
      return;
    }
    if (!recognitionRef.current) {
      console.error("Recognition not initialized. Trying to initialize now.");
      // This scenario should ideally be handled by the main useEffect initializer for recognition.
      // However, if it can happen, explicitly re-triggering initialization or ensuring it's ready is key.
      // For now, assume the main useEffect has/will set up recognitionRef.current.
      // If not, this call might fail or do nothing.
      // A more robust approach might be to queue the start request until recognitionRef.current is ready.
      // Or, call a function that ensures initialization then starts.
      // Let's assume initializeRecognition (called from useEffect) does its job.
      // If not, the startRecognitionInternal will guard against null ref.
       initializeRecognition(); // Ensure it's initialized
       // Add a small delay to allow initialization to complete if called immediately
       setTimeout(() => {
        if (recognitionRef.current && !isRecognizing) {
            resetAudioResources();
            startRecognitionInternal();
        } else if (isRecognizing) {
            console.log("Continuous listening already active (isRecognizing is true).");
        } else {
            console.error("Failed to start: recognitionRef still null or already recognizing somehow.");
        }
       }, 100);

    } else if (!isRecognizing) {
      console.log("Recognition initialized, but not running. Starting now.");
      resetAudioResources(); // Clean up before starting
      startRecognitionInternal();
    } else {
      console.log("Continuous listening already active.");
    }
  };

  // Ensure this function exists and is called if it handles the initial setup of recognitionRef.current
  // This might be what the robust useEffect replaced.
  const initializeRecognition = () => {
    // This function's body has been largely moved into the main useEffect for recognition.
    // It can be a wrapper or removed if the useEffect handles all initialization.
    // For now, let's assume the useEffect is the primary source of truth for init.
    // If startContinuousListening needs to *force* an init, it should call whatever sets up recognitionRef.current.
    // The main useEffect for recognition is now responsible for setting up recognitionRef.current
    console.log("initializeRecognition called (new structure). Main setup in useEffect.");
    if (!recognitionRef.current && typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
        // This indicates the main useEffect didn't run or failed.
        // Forcing re-initialization here could be a fallback.
        console.warn("RecognitionRef is null in initializeRecognition. Main useEffect should handle this.");
        // Manually creating it here would bypass the structured setup. Best to rely on the useEffect.
        // Perhaps trigger a state that causes the useEffect to re-run if needed, but that's tricky.
        // For now, this function will be a no-op if useEffect is working.
    }
  };

  // Toggle conversation mode
  const toggleConversationMode = () => {
    // If turning off conversation mode while listening
    if (conversationMode) {
      stopContinuousListening();
    }
    
    // Toggle the mode
    setConversationMode(!conversationMode);
    
    // Show a message
    toast.success(conversationMode 
      ? 'Conversation mode disabled. You need to click the button to speak.' 
      : 'Conversation mode enabled. You can now speak anytime and even interrupt.');
  };

  // Modified start listening for manual mode
  const startListening = () => {
    // If in conversation mode, just ensure continuous recognition is running
    if (conversationMode && voiceEnabled) {
      if (!isRecognizing) { // Check robust state
        console.log("Manual startListening: In conversation mode, ensuring continuous listening is active.");
        startContinuousListening(); // This will use the robust start
      }
      return;
    }
    
    // Manual, non-continuous mode (single shot recognition)
    // This part needs to use a *separate* SpeechRecognition instance or reconfigure the main one
    // if we want to stick to the "single instance" principle strictly for continuous.
    // For simplicity of this refactor, let's assume manual mode might need its own temporary instance
    // or we adjust the main one's `continuous` property temporarily.
    // The guide focuses on ROBUST CONTINUOUS. Manual clicks are simpler.
    // Let's adapt the existing manual logic to use the robust start/stop but configure for non-continuous.

    if (isSpeaking || isRecognizing) { // Check robust state
      console.log("Manual startListening: Already speaking or recognizing.");
      return;
    }
    
    if (!recognitionRef.current) {
        toast.error('Speech recognition system not ready.');
        console.error("Manual startListening: recognitionRef is null.");
        initializeRecognition(); // Try to set it up
        return;
    }

    // Configure for non-continuous (manual) recognition
    recognitionRef.current.continuous = false; 
    recognitionRef.current.interimResults = false; // Usually false for one-shot commands

    // Temporarily override onend for manual mode to not auto-restart
    const originalOnEnd = recognitionRef.current.onend;
    recognitionRef.current.onend = () => {
      console.log('Manual Recognition: ENDED');
      setIsRecognizing(false);
      setIsListening(false);
      recognitionRef.current.continuous = true; // Restore default
      recognitionRef.current.interimResults = true; // Restore default
      recognitionRef.current.onend = originalOnEnd; // Restore original onend
    };
    
    // Temporarily override onerror for manual mode
    const originalOnError = recognitionRef.current.onerror;
    recognitionRef.current.onerror = (event:any) => {
        console.error('Manual Recognition Error:', event.error);
        setIsRecognizing(false);
        setIsListening(false);
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
            toast.error(`Recognition error: ${event.error}`);
        }
        recognitionRef.current.continuous = true; // Restore
        recognitionRef.current.interimResults = true; // Restore
        recognitionRef.current.onerror = originalOnError; // Restore
        recognitionRef.current.onend = originalOnEnd; // Restore (in case error happens before onend)
    };

    // Use the internal start function
    console.log("Manual startListening: Starting one-shot recognition.");
    // setupVolumeMeter().catch(console.error); // Consider if this is needed for one-shot
    resetAudioResources(); // Clean before starting
    startRecognitionInternal(); 
    toast.success('Listening (manual)...');
  };

  // Test the current voice
  const testVoice = () => {
    speak("Hello, I'm your Optiflow voice assistant using " + 
      (voiceSettings.type === 'openai' ? "OpenAI's voice models" : "the browser's voice engine") + 
      ". How can I help you today?");
    
    // Force visualizer to show in debug mode temporarily
    setDebugVisualizer(true);
    setTimeout(() => setDebugVisualizer(false), 8000); // Disable debug mode after 8 seconds
  };
  
  // Toggle debug mode for visualizer
  const toggleDebugVisualizer = () => {
    setDebugVisualizer(!debugVisualizer);
    toast.success(debugVisualizer ? 'Visualizer debug mode disabled' : 'Visualizer debug mode enabled');
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast.success(debugMode ? 'Debug mode disabled' : 'Debug mode enabled');
  };

  // LiveKit data channel handler (now listens for global 'agent-data' event)
  useEffect(() => {
    function handleAgentData(event: CustomEvent) {
      try {
        const data = JSON.parse(new TextDecoder().decode(event.detail));
        if (data.type === 'navigate' && data.target) {
          if (window.confirm('The agent wants to navigate you to the right place. Proceed?')) {
            router.push(data.target);
          }
        } else if (data.type === 'confirm_action') {
          setPendingConfirmation(data);
        } else if (data.type === 'escalate') {
          setEscalationMessage(data.reason || 'This request requires human assistance.');
        } else if (data.type === 'workflow_update') {
          setWorkflowHistory(prev => prev.slice(0, workflowPointer + 1).concat([data.workflow]));
          setWorkflowPointer(ptr => ptr + 1);
        }
      } catch (e) {
        console.error('Failed to parse agent message:', e);
      }
    }
    window.addEventListener('agent-data', handleAgentData as EventListener);
    return () => window.removeEventListener('agent-data', handleAgentData as EventListener);
  }, [router, workflowPointer]);

  // Undo/redo logic
  function undo() {
    if (workflowPointer > 0) setWorkflowPointer(workflowPointer - 1);
  }
  function redo() {
    if (workflowPointer < workflowHistory.length - 1) setWorkflowPointer(workflowPointer + 1);
  }

  // Confirm action modal
  function handleConfirm(accept: any) {
    setPendingConfirmation(null);
  }

  const [widgetMinimized, setWidgetMinimized] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [widgetPosition, setWidgetPosition] = useState<{ x: number, y: number }>(() => {
    const saved = localStorage.getItem('voiceAgentWidgetPos');
    if (saved) return JSON.parse(saved);
    // Default to bottom right
    return { x: window.innerWidth - 420, y: window.innerHeight - 120 };
  });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Drag handlers
  const onWidgetMouseDown = (e: React.MouseEvent) => {
    if (widgetRef.current && e.button === 0) {
      setDragging(true);
      setDragOffset({
        x: e.clientX - widgetPosition.x,
        y: e.clientY - widgetPosition.y,
      });
    }
  };
  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e: MouseEvent) => {
      setWidgetPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, dragOffset]);

  // Modify handleEnableVoice to remove toast notifications
  const handleEnableVoice = async () => {
    setVoiceEnabled(true);
    setAudioError(null);
    setAgentState('connecting');

    // Ensure browser global objects are available
    if (typeof window === 'undefined') {
        setError("Window object not found. Cannot enable voice agent.");
        setVoiceEnabled(false);
        setAgentState('idle');
        return;
    }
    
    // Check for SpeechRecognition API support
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        setError('Speech recognition is not supported in this browser.');
        toast.error('Speech recognition is not supported in this browser.');
        setVoiceEnabled(false);
        setAgentState('idle');
        return;
    }

    // Check and resume AudioContext if suspended
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        console.log("AudioContext resumed successfully.");
      } catch (err) {
        console.error("Failed to resume AudioContext:", err);
        setError("Failed to resume audio context. Please interact with the page.");
        // toast.error("Could not activate audio. Please click on the page and try again.");
        // setVoiceEnabled(false); // Optionally disable if audio context is crucial and fails to resume
        // setAgentState('idle');
        // return;
      }
    } else if (!audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            console.log("AudioContext initialized successfully.");
        } catch (err) {
            console.error("Failed to initialize AudioContext:", err);
            setError("Failed to initialize audio context.");
            // toast.error("Could not initialize audio context.");
        }
    }

    // Request microphone permissions explicitly and then start
    try {
        console.log("Requesting microphone permissions for enabling voice...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Got permission, can stop the dummy stream.
        console.log("Microphone permission granted for enabling voice.");

        // Ensure recognition is initialized (the useEffect should handle this, but as a safeguard)
        if (!recognitionRef.current) {
            console.warn("Recognition not yet initialized when enabling voice, will rely on useEffect.");
            // The useEffect dependency on voiceEnabled should trigger initialization.
        }
        
        setConversationMode(true); // Enable conversation mode by default when voice is enabled
        // setAgentState('listening'); // State will be updated by recognition.onstart
        
        // Start continuous listening only after ensuring voice is enabled and permissions are granted.
        // The useEffect for recognition with voiceEnabled dependency will handle starting.
        // Or, we can explicitly call it here.
        // Let's explicitly call it to be sure, as useEffect might have timing issues.
        if (voiceEnabled && !isRecognizing) { // Check current state to avoid multiple starts
             console.log("handleEnableVoice: calling startContinuousListening");
             startContinuousListening();
        }


        if (!didAutoGreet.current) {
          didAutoGreet.current = true;
          const greeting = getRandomGreeting();
          addMessage(greeting, false);
          // setAgentState('speaking'); // speak() will set this
          await speak(greeting); // This will pause recognition and resume it
          // setAgentState('listening'); // speak() onended will handle this transition
        }

    } catch (err: any) {
        console.error('Failed to get microphone permissions or start recognition:', err);
        setError(err.message || 'Failed to enable voice. Check microphone permissions.');
        toast.error(err.message || 'Failed to enable voice. Check microphone permissions.');
        setVoiceEnabled(false);
        setAgentState('idle');
    }
  };

  useEffect(() => {
    localStorage.setItem('voiceAgentMode', agentMode);
  }, [agentMode]);
  useEffect(() => {
    localStorage.setItem('voiceAgentWidgetPos', JSON.stringify(widgetPosition));
  }, [widgetPosition]);

  // Always render the widget in the bottom right, draggable
  return (
    <div>
      {/* Floating Widget Button (when minimized) */}
      {widgetMinimized && (
        <button
          className="fixed bottom-6 right-6 z-[1000] bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-2xl border-4 border-white"
          onClick={() => setWidgetMinimized(false)}
          aria-label="Open Voice Assistant"
        >
          <span role="img" aria-label="Assistant">🗣️</span>
        </button>
      )}
      {/* Floating Widget (when open) */}
      {!widgetMinimized && (
        <div
          ref={widgetRef}
          className="fixed z-[1000] bg-[#181C23] bg-opacity-95 text-white rounded-2xl shadow-2xl border border-[#2AF5EC]/30 flex items-center px-6 py-4 gap-4"
          style={{
            left: widgetPosition.x,
            top: widgetPosition.y,
            width: 420,
            minHeight: 80,
            maxHeight: '90vh',
            transition: 'box-shadow 0.2s',
            cursor: dragging ? 'grabbing' : 'grab',
            borderRadius: 24,
          }}
        >
          {/* Power or waveform */}
          {voiceEnabled ? (
            <div className="flex items-center justify-center w-16 h-16">
              {/* Animated waveform */}
              <svg width="48" height="48" viewBox="0 0 48 48">
                <g>
                  {[8, 16, 24, 32, 40].map((x, i) => (
                    <rect key={i} x={x} y={16 - Math.abs(i-2)*4} width="4" height={16 + Math.abs(i-2)*8} rx="2" fill="#2AF5EC">
                      <animate attributeName="height" values={`16;${32 - Math.abs(i-2)*8};16`} dur="1s" repeatCount="indefinite" begin={`${i*0.1}s`} />
                      <animate attributeName="y" values={`${16 - Math.abs(i-2)*4};${8 + Math.abs(i-2)*4};${16 - Math.abs(i-2)*4}`} dur="1s" repeatCount="indefinite" begin={`${i*0.1}s`} />
                    </rect>
                  ))}
                </g>
              </svg>
            </div>
          ) : (
            <button
              className="flex items-center justify-center w-16 h-16 rounded-full border border-[#2AF5EC]/30 text-[#2AF5EC]/40 bg-[#23272F]"
              onClick={handleEnableVoice}
              aria-label="Enable Voice Agent"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2AF5EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" opacity="0.2"/><path d="M12 8v4"/><path d="M12 16h.01"/><circle cx="12" cy="12" r="10"/></svg>
            </button>
          )}
          {/* Mode dropdown */}
          <select
            aria-label="Agent mode"
            className="bg-[#23272F] text-white px-4 py-2 rounded-lg border border-[#2AF5EC]/20 focus:outline-none focus:ring-2 focus:ring-[#2AF5EC]/40 text-lg font-medium shadow"
            value={agentMode}
            onChange={e => setAgentMode(e.target.value)}
          >
            <option>Sales mode</option>
            <option>Support mode</option>
            <option>Integration mode</option>
          </select>
          {/* Mic button */}
          <button
            className={`flex items-center justify-center w-16 h-16 rounded-full border-2 ${voiceEnabled ? 'border-[#2AF5EC] bg-gradient-to-tr from-[#2AF5EC]/20 to-[#2AF5EC]/40 shadow-lg animate-glow' : 'border-[#2AF5EC]/20 bg-[#23272F] text-[#2AF5EC]/40'} transition-all duration-300`}
            disabled={!voiceEnabled}
            aria-label="Microphone"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={voiceEnabled ? '#2AF5EC' : '#2AF5EC40'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
          </button>
        </div>
      )}
    </div>
  );
} 
import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceRecognitionState, VoiceRecognitionConfig } from '@/types/voice';

const DEFAULT_CONFIG: VoiceRecognitionConfig = {
  language: 'en-US',
  continuous: true,
  interimResults: true,
  maxAlternatives: 1,
  sampleRate: 16000,
  bufferSize: 4096,
};

export const useVoiceRecognition = (config: Partial<VoiceRecognitionConfig> = {}) => {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    error: null,
    interimTranscript: '',
  });

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const startListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isListening: true, error: null }));

      // Initialize audio context and stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(
        finalConfig.bufferSize,
        1,
        1
      );
      processorRef.current = processor;

      // Connect audio processing
      source.connect(processor);
      processor.connect(audioContext.destination);

      // Initialize WebSocket connection to Deepgram
      const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
        'token',
        process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || '',
      ]);

      socketRef.current = socket;

      socket.onopen = () => {
        setState(prev => ({ ...prev, isProcessing: true }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel) {
          const transcript = data.channel.alternatives[0].transcript;
          if (data.is_final) {
            setState(prev => ({
              ...prev,
              transcript: prev.transcript + ' ' + transcript,
              interimTranscript: '',
            }));
          } else {
            setState(prev => ({
              ...prev,
              interimTranscript: transcript,
            }));
          }
        }
      };

      socket.onerror = (error) => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket error occurred',
          isListening: false,
          isProcessing: false,
        }));
      };

      socket.onclose = () => {
        setState(prev => ({
          ...prev,
          isListening: false,
          isProcessing: false,
        }));
      };

      // Process audio data
      processor.onaudioprocess = (e) => {
        if (socket.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
          }
          socket.send(pcmData.buffer);
        }
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start voice recognition',
        isListening: false,
        isProcessing: false,
      }));
    }
  }, [finalConfig.bufferSize]);

  const stopListening = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
    if (socketRef.current) {
      socketRef.current.close();
    }

    setState(prev => ({
      ...prev,
      isListening: false,
      isProcessing: false,
    }));
  }, []);

  const reset = useCallback(() => {
    stopListening();
    setState({
      isListening: false,
      isProcessing: false,
      transcript: '',
      error: null,
      interimTranscript: '',
    });
  }, [stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    reset,
  };
}; 
'use client';

import { useState, useEffect, useRef } from 'react';
// Remove backend service import, add SDK import
// import { ElevenLabsConversationalService } from '@/services/ElevenLabsConversationalService'; 
import { 
  Conversation, 
  Role, 
  // Remove specific response types as they might not be exported directly
  // AgentResponse, 
  // UserResponse, 
  // ToolResponse, 
  // AudioResponse, 
  // ConversationMessage 
} from '@11labs/client';

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
  display_name?: string;
  edges: {
    target_node_id: string;
    edge_type: 'success' | 'failure' | string;
  }[];
  parameters?: {
    text?: string;
    audio?: string;
    isFinal?: boolean;
    [key: string]: any;
  };
}

interface WorkflowResponse {
  nodes?: WorkflowNode[];
  steps?: WorkflowNode[];
  parameters: Record<string, any>;
  name: string;
  description: string;
  transcripts?: string[];
  transcriptions?: string[];
  audioResponses?: Uint8Array[];
  agentMessages?: string[];
  isComplete?: boolean;
  conversation?: Message[];
  processingError?: string;
}

export default function ConversationalTestPage() {
  const [status, setStatus] = useState('Ready to start conversation');
  const [messages, setMessages] = useState<Message[]>([]);
  // const [inputText, setInputText] = useState(''); // Remove text input for now, focus on voice
  const [isProcessing, setIsProcessing] = useState(false); // Keep for general loading state
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null); // Keep workflow state
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // Keep for playing agent audio
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if agent is speaking
  const [isConnected, setIsConnected] = useState(false); // Track connection status
  
  // Add state for the Conversation instance
  const [conversation, setConversation] = useState<Conversation | null>(null);

  // Keep model/voice params if needed for SDK config (or remove if managed by agent)
  const [modelParams, setModelParams] = useState({
    model: 'eleven_turbo_v2', // This might be controlled by the agent now
    temperature: 0.7,
    max_tokens: 4000
  });
  const [voiceParams, setVoiceParams] = useState({
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Remove MediaRecorder refs, SDK handles mic
  // const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null); // Keep for playing audio
  const audioQueueRef = useRef<HTMLAudioElement[]>([]); // Queue for playing audio chunks
  const isPlayingRef = useRef(false); // Ref to track if audio is currently playing

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- SDK Based Conversation Handling ---

  const startConversation = async () => {
    setError(null);
    setStatus('Initializing...');
    setIsProcessing(true);
    setMessages([]); // Clear previous messages
    setWorkflow(null); // Clear previous workflow
    setLiveTranscription('');

    try {
      // Request microphone permission explicitly, though SDK might handle it
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('Connecting...');

      // --- IMPORTANT: Replace with your Agent ID ---
      const agentId = 'i3gU7j7TnkhSqx3MNkhu'; 
      // ---

      // --- Optional: Fetch Signed URL for private agents ---
      // const signedUrl = await getSignedUrl(); // Implement this if needed
      // ---

      // Define callback types explicitly
      type TranscriptionEvent = { type: 'partial' | 'final'; text: string };
      type MessageEvent = { source: 'user' | 'agent' | 'tool'; text?: string; audio?: ArrayBuffer; toolName?: string; data?: any; message?: any };
      type ModeChangeEvent = { mode: 'listening' | 'speaking' | 'thinking' };
      type ErrorEvent = Error | any;

      const conv = await Conversation.startSession({
        agentId: agentId, // Use agentId for public agents
        // signedUrl: signedUrl, // Use signedUrl for private agents
        // Optional: Pass params if needed, though agent config might suffice
        // modelParameters: modelParams,
        // voiceParameters: voiceParams,
        // serverLocation: 'us', // Or your preferred location

        onConnect: () => {
          setStatus('Connected. Listening...');
          setIsConnected(true);
          setIsProcessing(false);
          console.log('Conversation connected.');
        },
        onDisconnect: () => {
          setStatus('Disconnected. Ready to start.');
          setIsConnected(false);
          setIsProcessing(false);
          setConversation(null);
          setLiveTranscription('');
          setIsSpeaking(false);
          console.log('Conversation disconnected.');
        },
        onError: (err: ErrorEvent) => {
          console.error('Conversation error:', err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          setError(`Conversation error: ${errorMessage}`);
          setStatus('Error');
          setIsConnected(false);
          setIsProcessing(false);
          setConversation(null); // Clear conversation on error
        },
        onModeChange: (modeEvent: ModeChangeEvent) => {
          console.log('Agent mode changed:', modeEvent.mode);
          setIsSpeaking(modeEvent.mode === 'speaking');
          setStatus(modeEvent.mode === 'speaking' ? 'Agent speaking...' : 'Listening...');
          if (modeEvent.mode === 'listening') {
            setLiveTranscription(''); // Clear transcription when agent starts listening
          }
        },
        onMessage: (msgEvent: MessageEvent) => {
          console.log('Received message event:', msgEvent);

          // Agent response with text and possibly audio
          if (msgEvent.source === 'agent' && typeof msgEvent.text === 'string') {
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: msgEvent.text, timestamp: Date.now() }
              ]);
              // TODO: Add logic here to parse assistant message content for workflow updates if needed
              // Check for audio in agent response
              if (msgEvent.audio instanceof ArrayBuffer) {
                  playAudio(msgEvent.audio);
              } else if (msgEvent.audio) {
                  console.warn('Received non-ArrayBuffer audio data from agent');
              }
          } else if (msgEvent.source === 'user' && typeof msgEvent.text === 'string') { // Likely UserResponse
              setMessages((prev) => {
                const lastUserIndex = prev.slice().reverse().findIndex(m => m.role === 'user');
                if (lastUserIndex !== -1) {
                  const actualIndex = prev.length - 1 - lastUserIndex;
                  if (prev[actualIndex].content !== msgEvent.text) {
                     const updatedMessages = [...prev];
                     updatedMessages[actualIndex] = { ...updatedMessages[actualIndex], content: msgEvent.text };
                     return updatedMessages;
                  }
                } else {
                  // Add new user message if none exists (less common with transcription first)
                  return [...prev, { role: 'user', content: msgEvent.text, timestamp: Date.now() }];
                }
                return prev; // No change
              });
          } else if (msgEvent.source === 'tool' && typeof msgEvent.toolName === 'string') { // Likely ToolResponse
             const toolResponse = msgEvent as any;
             console.log('Tool response:', msgEvent.toolName, msgEvent.data);
             if (msgEvent.toolName === 'WorkflowAPI' && msgEvent.data?.workflow) {
               // setWorkflow(parseWorkflowFromTool(msgEvent.data.workflow)); 
             }
          } else if (msgEvent.source === 'agent' && msgEvent.audio instanceof ArrayBuffer && !msgEvent.text) { // Likely AudioResponse only
              const audioResponse = msgEvent as any;
              if (audioResponse.audio instanceof ArrayBuffer) {
                  playAudio(audioResponse.audio);
              } else {
                   console.warn('Received non-ArrayBuffer audio data');
              }
          } else {
              // Handle other message types or string messages if applicable
              const content = typeof msgEvent.message === 'string' ? msgEvent.message : JSON.stringify(msgEvent); 
              console.log('Received unhandled message format:', content);
              // Optionally add to messages if needed
              // setMessages((prev) => [
              //   ...prev,
              //   { role: 'system', content: `Unhandled message: ${content}`, timestamp: Date.now() }
              // ]);
          }
        },
        // Add onTranscription back with explicit type
        onTranscription: (transcription: TranscriptionEvent) => {
          setLiveTranscription(transcription.text);
          if (transcription.type === 'partial' && transcription.text.length > 0) {
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (!lastMessage || lastMessage.role !== 'user' || !lastMessage.content.startsWith('You (speaking)')) {
                  return [...prev, { role: 'user', content: `You (speaking): ${transcription.text}`, timestamp: Date.now() }];
                } else {
                  const updatedMessages = [...prev];
                  updatedMessages[prev.length - 1].content = `You (speaking): ${transcription.text}`;
                  return updatedMessages;
                }
              });
          } else if (transcription.type === 'final') {
              console.log('Final transcription received via callback:', transcription.text);
              // Final text is typically handled by the onMessage userResponse event
          }
        },
      });

      setConversation(conv);

    } catch (error) {
      console.error('Failed to start conversation:', error);
      setError(`Failed to start conversation: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('Error');
      setIsProcessing(false);
    }
  };

  const stopConversation = async () => {
    setStatus('Stopping conversation...');
    if (conversation) {
      try {
        await conversation.endSession();
        console.log("Conversation ended via stop button.");
      } catch (error) {
        console.error("Error ending conversation:", error);
        setError(`Error stopping conversation: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        // Ensure state is reset even if endSession fails
        setConversation(null);
        setIsConnected(false);
        setIsProcessing(false);
        setStatus('Disconnected. Ready to start.');
        setLiveTranscription('');
        setIsSpeaking(false);
         // Clear audio queue on stop
         audioQueueRef.current = [];
         if (audioRef.current) {
           audioRef.current.pause();
           audioRef.current.src = '';
         }
         isPlayingRef.current = false;
      }
    } else {
        // Reset state if conversation wasn't properly set but user clicks stop
        setIsConnected(false);
        setIsProcessing(false);
        setStatus('Disconnected. Ready to start.');
        setLiveTranscription('');
        setIsSpeaking(false);
    }
  };

  // Function to queue and play audio
  const playAudio = async (audioData: ArrayBuffer) => {
    try {
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);

      audioQueueRef.current.push(newAudio);

      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    } catch (err) {
      console.error("Error creating or queuing audio:", err);
    }
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioToPlay = audioQueueRef.current.shift();

    if (audioToPlay) {
      // Use the existing audio element if possible, or just play directly
       if (audioRef.current) {
         audioRef.current.src = audioToPlay.src; // Set src to the new URL
         audioRef.current.play().catch(e => console.error("Audio play failed:", e));
         audioRef.current.onended = () => {
            console.log("Audio finished playing");
            URL.revokeObjectURL(audioToPlay.src); // Clean up blob URL
            playNextInQueue(); // Play next audio in queue
         };
         audioRef.current.onerror = (e) => {
            console.error("Error playing audio:", e);
            URL.revokeObjectURL(audioToPlay.src); // Clean up blob URL on error
            playNextInQueue(); // Try next audio
         };
       } else {
           console.error("Audio ref not available");
           isPlayingRef.current = false; // Reset if ref is missing
       }

    } else {
      playNextInQueue(); // Skip if somehow got undefined audio
    }
  };


  // Remove old backend-based functions
  // const startRecording = async () => { ... };
  // const stopRecording = () => { ... };
  // const processAudio = async (audioBlob: Blob) => { ... };
  // const sendTextMessage = async () => { ... };

  // Remove effect for playing audio via audioUrl state
  // useEffect(() => { ... old audio playing logic ... }, [workflow?.audioResponses]);
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">ElevenLabs Conversational AI Test (SDK)</h1>
      
      <div className="mb-4">
        <button
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
        </button>
        
        {showAdvancedSettings && (
          <div className="mt-3 p-4 border rounded bg-gray-50">
            <h3 className="font-semibold mb-2">Model Parameters (May be overridden by Agent Config)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <select
                  value={modelParams.model}
                  onChange={(e) => setModelParams({...modelParams, model: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="eleven_turbo_v2">Eleven Turbo v2</option>
                  <option value="eleven_multilingual_v2">Eleven Multilingual v2</option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Temperature ({modelParams.temperature})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={modelParams.temperature}
                  onChange={(e) => setModelParams({...modelParams, temperature: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
            
            <h3 className="font-semibold mb-2">Voice Parameters (May be overridden by Agent Config)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stability ({voiceParams.stability})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceParams.stability}
                  onChange={(e) => setVoiceParams({...voiceParams, stability: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Similarity Boost ({voiceParams.similarity_boost})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceParams.similarity_boost}
                  onChange={(e) => setVoiceParams({...voiceParams, similarity_boost: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Style ({voiceParams.style})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceParams.style}
                  onChange={(e) => setVoiceParams({...voiceParams, style: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="speaker-boost"
                  checked={voiceParams.use_speaker_boost}
                  onChange={(e) => setVoiceParams({...voiceParams, use_speaker_boost: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="speaker-boost" className="text-sm font-medium">
                  Use Speaker Boost
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-4 p-2 bg-gray-100 rounded flex items-center">
         <audio ref={audioRef} controls className="w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chat Interface */}
        <div className="border rounded-lg p-4 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold mb-2">Conversation</h2>
          
          <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center p-4">
                {isConnected ? 'Listening...' : 'Click Start Conversation to begin'}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={`${msg.timestamp}-${index}`}
                  className={`mb-3 p-3 rounded-lg break-words ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 ml-auto max-w-[80%]' 
                      : 'bg-gray-200 mr-auto max-w-[80%]'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {msg.role === 'user' ? 'You' : 'Sync'}
                  </div>
                  {msg.content.startsWith('You (speaking):') ? (
                     <div className="text-gray-600 italic">{msg.content.substring('You (speaking):'.length)}</div>
                   ) : (
                     <div>{msg.content}</div>
                   )}
                </div>
              ))
            )}
            
            {isConnected && !isSpeaking && liveTranscription && (
               <div className="mb-3 p-3 rounded-lg bg-blue-50 ml-auto max-w-[80%] animate-pulse">
                 <div className="font-semibold mb-1">You (speaking)</div>
                 <div>{liveTranscription}</div>
               </div>
             )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={isConnected ? stopConversation : startConversation}
              disabled={isProcessing && !isConnected}
              className={`px-6 py-3 rounded-full font-semibold text-white ${
                isConnected 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              } disabled:bg-gray-400 transition-colors duration-200`}
            >
              {isConnected ? 'Stop Conversation' : 'Start Conversation'}
            </button>
          </div>
          
          <div className="mt-2 text-sm text-gray-600 text-center">
            Status: {status} {isSpeaking ? '🔊' : isConnected ? '🎤' : ''}
          </div>
          
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        {/* Workflow Visualization */}
        <div className="border rounded-lg p-4 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold mb-2">Workflow</h2>
          
          {!workflow ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Workflow will appear here based on the conversation.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="mb-4">
                <h3 className="font-semibold">{workflow.name}</h3>
                <p className="text-sm text-gray-600">{workflow.description}</p>
                
                {/* Add an "Open in Editor" button */}
                <button 
                  onClick={() => {
                    // Save the workflow to sessionStorage
                    try {
                      // Transform the workflow for the editor
                      const editorWorkflow = {
                        name: workflow.name,
                        description: workflow.description,
                        nodes: workflow.steps?.map((node, index) => {
                          // Create a structured grid layout for nodes
                          // Each node gets its own row at 250px vertical spacing
                          // Nodes are centered horizontally along a line
                          const gridX = 400; // Center of the editor
                          const gridY = 100 + (index * 250); // Top-down progression with good spacing
                          
                          return {
                            id: node.id || `node-${index}`,
                            type: node.type === 'workflow' || node.type === 'aiAgent' ? 'aiAgent' : 'default',
                            position: { x: gridX, y: gridY },
                            data: {
                              id: node.id || `node-${index}`,
                              type: node.type || 'default',
                              label: node.title || 'Node',
                              description: node.description || '',
                              settings: node.parameters || {}
                            }
                          };
                        }) || [],
                        edges: workflow.steps?.map((node, index, arr) => {
                          if (index < arr.length - 1) {
                            return {
                              id: `edge-${index}`,
                              source: node.id || `node-${index}`,
                              target: arr[index + 1].id || `node-${index + 1}`,
                              type: 'custom',
                              animated: true,
                              data: { label: 'Next Step' }
                            };
                          }
                          return null;
                        }).filter(Boolean) || []
                      };
                      
                      // Save to sessionStorage
                      sessionStorage.setItem('generatedWorkflow', JSON.stringify(editorWorkflow));
                      
                      // Redirect to workflow editor
                      window.location.href = '/workflow-editor';
                    } catch (error) {
                      console.error('Error saving workflow:', error);
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Open in Workflow Editor
                </button>
              </div>
              
              {workflow.steps?.length === 0 ? (
                <div className="text-gray-500 text-center p-4">
                  No nodes in the workflow yet
                </div>
              ) : (
                <div className="space-y-4">
                  {workflow.steps?.map((node, index) => (
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
    </div>
  );
} 
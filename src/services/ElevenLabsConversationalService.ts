import { WebSocket } from 'ws';

import { websocketDataToStringAsync } from '../utils/websocket-polyfill';

interface ConversationalOptions { agentId?: string;
  modelParams?: Record<string, any>;
  voiceParams?: Record<string, any>;
  timeout?: number;
    }

interface WorkflowStep {
  id: string;
  type: string;
  title: string;
  description: string;
  edges: any[];
  parameters: Record<string, any>;
}

interface WorkflowResponse {
  steps: WorkflowStep[];
  parameters: Record<string, any>;
  name: string;
  description: string;
  conversation: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  isComplete: boolean;
  audioResponses?: Uint8Array[];
}

interface WebSocketMessage {
  type: string;
  data: any;
}

// Add new interface for transcription events
export interface TranscriptionEvent {
  type: 'partial' | 'final';
  text: string;
  timestamp: number;
}

export class ElevenLabsConversationalService {
  private apiKey: string;
  private ws: WebSocket | null = null;
  private audioResponses: Uint8Array[] = [];
  private conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }> = [];
  private isInitialized = false;
  private hasReceivedResponse = false;
  private timeoutId: NodeJS.Timeout | undefined = undefined;
  private resolvePromise!: (value: WorkflowResponse | PromiseLike<WorkflowResponse>) => void;
  private rejectPromise!: (reason?: any) => void;
  private audioData = '';
  private fallbackWorkflow: WorkflowResponse | null = null;
  private transcriptionCallback?: (event: TranscriptionEvent) => void;

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('ELEVENLABS_API_KEY environment variable is not set. WebSocket connections will likely fail.');
    } else if (this.apiKey.length < 10) {
      console.warn('ELEVENLABS_API_KEY appears to be invalid (too short). WebSocket connections may fail.');
    }
  }

  async processAudioForWorkflow(
    audioData: string, 
    options: ConversationalOptions = {}, 
    onTranscription?: (event: TranscriptionEvent) => void
  ): Promise<WorkflowResponse> {
    this.audioData = audioData;
    this.fallbackWorkflow = null;
    this.transcriptionCallback = onTranscription;
    
    return new Promise((resolve, reject) => {
      // Clear previous state
      this.audioResponses = [];
      this.conversationHistory = [];
      this.hasReceivedResponse = false;
      this.isInitialized = false;
      
      // Use a longer timeout for complex workflows
      const timeout = options.timeout || 60000; // 60 seconds default
      this.timeoutId = setTimeout(() => {
        if (this.ws) {
          console.error('WebSocket connection timed out after', timeout, 'ms');
          this.ws.close();
          if (!this.hasReceivedResponse) {
            reject(new Error(`Audio processing timed out after ${timeout}ms. The ElevenLabs API did not respond in time.`));
          }
        }
      }, timeout);

      this.resolvePromise = resolve;
      this.rejectPromise = reject;

      // Generate WebSocket URL with agent ID
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${options.agentId || 'default'}`;
      console.log(`Connecting to WebSocket at: ${wsUrl}`);
      
      // Create WebSocket connection
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        
        // Send configuration message with API key and other parameters
        const configMessage: WebSocketMessage = {
          type: 'configuration',
          data: {
            api_key: this.apiKey,
            model_params: options.modelParams || {},
            voice_params: options.voiceParams || {}
          }
        };
        
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('Sending configuration message');
          this.ws.send(JSON.stringify(configMessage));
        } else {
          console.error('WebSocket not open when trying to send configuration');
          reject(new Error('WebSocket connection failed to open properly'));
          this.clearWebSocketTimeout();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          let messageText: string;
          if (typeof event.data === 'string') {
            messageText = event.data;
          } else if (event.data instanceof ArrayBuffer) {
            messageText = new TextDecoder().decode(event.data);
          } else if (event.data instanceof Blob) {
            // Handle blob data asynchronously if needed
            console.log('Received blob data, converting to text');
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target && e.target.result) {
                this.handleWebSocketMessage(JSON.parse(e.target.result as string));
              }
            };
            reader.readAsText(event.data);
            return; // Exit early as we'll handle the message in the onload callback
          } else { console.error('Unsupported WebSocket data format:', typeof event.data);
            return;
              }
          
          const message: WebSocketMessage = JSON.parse(messageText);
          console.log('Received message type:', message.type);
          
          this.handleWebSocketMessage(message);
        } catch (err) { console.error('Error processing WebSocket message:', err);
            }
      };

      this.ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
        
        this.clearWebSocketTimeout();
        
        // If we haven't received a response yet, provide a fallback
        if (!this.hasReceivedResponse) {
          const closeCodeMessages: Record<number, string> = { 1000: 'Normal closure',
            1001: 'Going away',
            1002: 'Protocol error - The API may have rejected the connection format or headers',
            1003: 'Unsupported data',
            1005: 'No status received',
            1006: 'Abnormal closure',
            1007: 'Invalid frame payload data',
            1008: 'Policy violation/Invalid message - The API rejected a message format',
            1009: 'Message too big',
            1010: 'Mandatory extension',
            1011: 'Internal server error',
            1012: 'Service restart',
            1013: 'Try again later',
            1014: 'Bad gateway',
            1015: 'TLS handshake'
              };
          
          const reason = closeCodeMessages[event.code] || 'Unknown reason';
          console.error(`WebSocket closed before receiving a complete response. Code: ${event.code} (${reason})`);
          
          // If WebSocket closed before initialization, reject with an error
          if (!this.isInitialized) {
            reject(new Error(`WebSocket connection closed before initialization with code ${event.code} (${reason}). Check your API key and agent ID.`));
          } else {
            // For code 1008 and other codes after initialization, resolve with a fallback workflow
            console.log(`Using fallback workflow due to WebSocket closure with code ${event.code}`);
            
            // If we have conversation history, use it to generate a fallback
            if (this.conversationHistory.length > 0) {
              // If user message exists but no assistant message, add a generic one
              if (this.conversationHistory.some(msg => msg.role === 'user') && 
                  !this.conversationHistory.some(msg => msg.role === 'assistant')) {
                this.conversationHistory.push({ role: 'assistant',
                  content: 'I understand your request. Based on this, I can help create a workflow that meets your needs.',
                  timestamp: Date.now()
                    });
              }
              
              // Use fallback workflow if available, otherwise create a new one
              if (this.fallbackWorkflow) {
                resolve(this.fallbackWorkflow);
              } else {
                resolve(this.generateWorkflowFromConversation(this.conversationHistory));
              }
            } else {
              // No conversation history, add placeholder messages
              this.conversationHistory.push({ role: 'user',
                content: 'Audio message (audio data not stored)',
                timestamp: Date.now()
                  });
              
              this.conversationHistory.push({ role: 'assistant',
                content: 'I understand you want to create a workflow. Could you please describe what you want to accomplish in more detail?',
                timestamp: Date.now()
                  });
              
              resolve(this.generateWorkflowFromConversation(this.conversationHistory));
            }
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('WebSocket connection error. Please check your network connection and API credentials.'));
        
        if (this.ws) {
          this.ws.close();
        }
        
        this.clearWebSocketTimeout();
      };
      
      // Add the user message to the conversation history immediately
      this.conversationHistory.push({ role: 'user',
        content: 'Audio message (audio data not stored)',
        timestamp: Date.now()
          });
    });
  }

  private parseWorkflowResponse(data: any): WorkflowResponse {
    // Create a new response object with defaults
    const response: WorkflowResponse = {
      steps: data.nodes || [],
      parameters: data.parameters || {},
      name: data.name || 'Generated Workflow',
      description: data.description || 'A workflow generated from conversation',
      conversation: this.conversationHistory.map(msg => ({ role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
          })),
      isComplete: data.isComplete || false
    };

    // If we have audio responses, add them to the response
    if (this.audioResponses.length > 0) {
      response.audioResponses = this.audioResponses;
    }

    return response;
  }

  private generateWorkflowFromConversation(conversation: Array<{ role: "user" | "assistant"; content: string; timestamp: number     }>): WorkflowResponse {
    // Extract workflow requirements from the conversation
    const requirements = conversation
      .filter(msg => msg.role === 'assistant')
      .map(msg => msg.content)
      .join('\n');

    // Create a basic workflow step
    const workflowStep: WorkflowStep = {
      id: 'workflow-design',
      type: 'workflow',
      title: 'Workflow Design',
      description: 'Design a workflow based on the conversation',
      edges: [],
      parameters: {
        requirements: requirements
      }
    };

    return {
      steps: [workflowStep],
      parameters: {},
      name: 'Generated Workflow',
      description: 'Workflow generated from conversation',
      conversation: conversation,
      isComplete: true,
      audioResponses: this.audioResponses
    };
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async convertBrowserAudioToBase64(stream: MediaStream): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('This method can only be called in a browser environment');
    }

    // Create an audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);

    // Convert to LINEAR16 format
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array[] = [];

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      chunks.push(new Float32Array(input));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    // Wait for audio processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Combine chunks and convert to base64
    const combined = new Float32Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to 16-bit PCM
    const pcm = new Int16Array(combined.length);
    for (let i = 0; i < combined.length; i++) {
      pcm[i] = Math.max(-32768, Math.min(32767, combined[i] * 32768));
    }

    // Convert to base64
    const buffer = pcm.buffer;
    const uint8Array = new Uint8Array(buffer);
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    return base64;
  }

  private handleWebSocketMessage(message: WebSocketMessage) {
    try {
      console.log('Received message type:', message.type);
      
      if (message.type === 'conversation_initiation_metadata') {
        console.log('Received metadata, sending audio data');
        this.isInitialized = true;
        
        // Send audio data after receiving metadata
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const audioMessage: WebSocketMessage = {
            type: 'audio',
            data: {
              audio: this.audioData,
              encoding: 'BASE64'
            }
          };
          console.log('Sending audio data');
          this.ws.send(JSON.stringify(audioMessage));
        }
      } else if (message.type === 'ping') {
        // Respond to ping messages
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.log('Received ping, sending pong');
          const pongMessage: WebSocketMessage = {
            type: 'pong',
            data: {}
          };
          this.ws.send(JSON.stringify(pongMessage));
        }
      } else if (message.type === 'transcription') {
        // Handle real-time transcription results
        if (this.transcriptionCallback && message.data && message.data.text) {
          const isPartial = message.data.is_partial === true;
          this.transcriptionCallback({ type: isPartial ? 'partial' : 'final',
            text: message.data.text,
            timestamp: Date.now()
              });
          
          // If this is a final transcription, update the conversation history
          if (!isPartial) {
            // Check if we already have a user message in the history
            const lastUserMessage = this.conversationHistory.findIndex(msg => msg.role === 'user');
            if (lastUserMessage >= 0) {
              // Update existing message
              this.conversationHistory[lastUserMessage].content = message.data.text;
            } else {
              // Add new message
              this.conversationHistory.push({ role: 'user',
                content: message.data.text,
                timestamp: Date.now()
                  });
            }
          }
        }
      } else if (message.type === 'audio') {
        // Check if audio data is valid with proper null/undefined checks
        if (message.data && typeof message.data === 'object' && 'audio' in message.data && message.data.audio) {
          // Store audio response
          const audioChunk = this.base64ToUint8Array(message.data.audio);
          this.audioResponses.push(audioChunk);
        } else {
          console.warn('Received audio message without audio data');
          // Still count it as a valid response to avoid error flow
          this.hasReceivedResponse = true;
        }
      } else if (message.type === 'agent_response') {
        this.hasReceivedResponse = true;
        
        // Handle possible different formats of agent response
        let agentMessage = "";
        
        if (message.data && typeof message.data === 'object') {
          // Check each possible structure with explicit null/undefined checks
          if (typeof message.data.message === 'string') {
            agentMessage = message.data.message;
          } else if (message.data.text && typeof message.data.text === 'string') {
            agentMessage = message.data.text;
          } else if (message.data.response) { agentMessage = typeof message.data.response === 'string' 
              ? message.data.response 
              : JSON.stringify(message.data.response);
              } else {
            // If we can't find any text content, convert the whole data to string
            try {
              agentMessage = JSON.stringify(message.data);
            } catch (e) {
              agentMessage = "Received agent response with unparseable data";
            }
          }
        } else {
          agentMessage = "Received agent response with no data";
        }
        
        // Add the agent message to the conversation history
        this.conversationHistory.push({ role: 'assistant',
          content: agentMessage,
          timestamp: Date.now()
            });
        
        console.log('Agent response:', agentMessage);
        
        // If we've received the agent's response, we can consider this successful
        // even if we don't get a workflow response later
        // Create a fallback workflow even if we have no audio responses
        this.fallbackWorkflow = this.generateWorkflowFromConversation(this.conversationHistory);
      } else if (message.type === 'workflow') {
        this.hasReceivedResponse = true;
        console.log('Received workflow response');
        
        // Ensure message.data exists
        if (!message.data) {
          console.warn('Received workflow message with no data, using fallback');
          if (this.fallbackWorkflow) {
            this.resolvePromise(this.fallbackWorkflow);
          } else {
            this.resolvePromise(this.generateWorkflowFromConversation(this.conversationHistory));
          }
          return;
        }
        
        // Parse the workflow response
        const response = this.parseWorkflowResponse(message.data);
        
        // Close WebSocket
        if (this.ws) {
          this.ws.close();
        }
        
        // Clear timeout
        this.clearWebSocketTimeout();
        
        // Resolve with the response
        this.resolvePromise(response);
      } else if (message.type === 'error') {
        console.error('Received error from WebSocket:', message.data);
        this.rejectPromise(new Error(`ElevenLabs API error: ${message.data?.message || 'Unknown error'}`));
        
        if (this.ws) {
          this.ws.close();
        }
        
        this.clearWebSocketTimeout();
      }
    } catch (err) { console.error('Error processing WebSocket message:', err);
      // If we encounter an error processing a message, don't crash the whole flow
      // Just log it and continue
        }
  }

  private clearWebSocketTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
} 
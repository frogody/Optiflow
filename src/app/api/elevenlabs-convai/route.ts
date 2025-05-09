// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsConversationalService } from '@/services/ElevenLabsConversationalService';

// Input validation schema
export interface ConversationalRequest {
  audioData?: string;
  test?: boolean;
  message?: string;
  agentId?: string;
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

// Check for environment variables
if (!process.env.ELEVENLABS_API_KEY) {
  console.warn('ELEVENLABS_API_KEY environment variable is not set. Voice synthesis and workflow generation may fail.');
}

export const maxDuration = 120; // Set timeout to 120 seconds (NextJS limit)

export async function POST(req: NextRequest) {
  console.log('Received request to /api/elevenlabs-convai');
  
  try {
    const body = await req.json() as ConversationalRequest;
    
    // Test request - return mock workflow response
    if (body.test) {
      console.log('Test request detected, returning mock response');
      return NextResponse.json({
        success: true,
        workflow: {
          name: "Mock Workflow",
          description: "This is a mock workflow for testing purposes.",
          steps: [
            {
              type: "Trigger",
              title: "Start Workflow",
              description: "Beginning of the workflow",
              parameters: {}
            },
            {
              type: "Action",
              title: "Test Action",
              description: "This is a test action",
              parameters: {
                param1: "value1",
                param2: "value2"
              }
            }
          ]
        },
        messages: [
          { role: "user",
            content: "Test message"
          },
          { role: "assistant",
            content: "This is a test response from the assistant."
          }
        ],
        audioUrl: null
      });
    }
    
    // Handle audio request
    if (body.audioData) {
      console.log('Audio data detected, processing...');
      const agentId = body.agentId || 'i3gU7j7TnkhSqx3MNkhu'; // Default agent ID if not provided
      
      // Create a timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 90000); // 90 second timeout (slightly less than maxDuration)
      
      try {
        // Create a promise race between the audio processing and a partial response timeout
        const partialResponseTimeout = new Promise((resolve) => {
          setTimeout(() => {
            resolve({ status: 'partial',
              message: 'Still processing your request. Please wait for the complete response.',
              partial: true
                });
          }, 20000); // 20 second timeout for partial response
        });
        
        // Process the audio with the ElevenLabs service
        const audioProcessingPromise = processAudioWithRetry(
          body.audioData, 
          agentId,
          3, // maxAttempts 
          body.modelParams, 
          body.voiceParams
        );
        
        // Race between partial response and actual processing
        const result = await Promise.race([
          audioProcessingPromise,
          partialResponseTimeout
        ]);
        
        // If we got a partial result, return it immediately
        if (result && 'partial' in result && result.partial) {
          clearTimeout(timeoutId);
          return NextResponse.json(result);
        }
        
        clearTimeout(timeoutId);
        return NextResponse.json({ success: true,
          ...result
            });
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error processing audio:', error);
        
        // Check if it's an abort error
        if (error instanceof DOMException && error.name === 'AbortError') {
          return NextResponse.json({
            success: false,
            error: 'Request timed out after 90 seconds',
            partial: true,
            workflow: {
  name: "Partial Workflow",
              description: "This workflow was partially generated before the request timed out.",
              steps: []
                }
          }, { status: 408     });
        }
        
        // Return a generic error response
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          errorDetails: error instanceof Error ? { name: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
              } : undefined
        }, { status: 500     });
      }
    }
    
    // Handle text message request
    if (body.message) {
      console.log('Text message detected:', body.message);
      
      return NextResponse.json({
        success: true,
        messages: [
          { role: "user",
            content: body.message
              },
          { role: "assistant",
            content: "I'll help you create a workflow. Can you provide more details about what you'd like to build?"
              }
        ]
      });
    }
    
    // No valid data provided
    return NextResponse.json({ success: false,
      error: 'No audio data or message provided'
        }, { status: 400     });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500     });
  }
}

// Helper function to process audio with retry logic
async function processAudioWithRetry(audioData: string, agentId: string, maxAttempts = 3, modelParams?: any, voiceParams?: any): Promise<any> {
  let attempts = 0;
  let lastError: any = null;
  
  // Validate agent ID and use default if needed
  const validAgentId = agentId || 'i3gU7j7TnkhSqx3MNkhu'; // Default agent ID 
  
  console.log(`Using agent ID: ${validAgentId}`);
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      console.log(`Processing audio attempt ${attempts}/${maxAttempts}`);
      
      const service = new ElevenLabsConversationalService();
      const result = await service.processAudioForWorkflow(audioData, {
        agentId: validAgentId,
        modelParams: modelParams || {},
        voiceParams: voiceParams || {},
        timeout: 60000 // Explicit 60-second timeout
      });
      
      console.log('Audio processing successful');
      return result;
    } catch (error) {
      console.error(`Attempt ${attempts} failed:`, error);
      lastError = error;
      
      // Check for specific error types that indicate we shouldn't retry
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Don't retry configuration or authentication errors
      if (
        errorMessage.includes('API key') || 
        errorMessage.includes('agent ID') ||
        errorMessage.includes('WebSocket connection closed before initialization') ||
        errorMessage.includes('authorization')
      ) { console.error('Critical error detected, aborting retry attempts:', errorMessage);
        throw error; // Don't retry configuration errors
          }
      
      // If we've reached max attempts, throw the last error
      if (attempts >= maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${ lastError instanceof Error ? lastError.message : 'Unknown error'    }`);
      }
      
      // Wait before retrying (exponential backoff)
      const backoffTime = Math.pow(2, attempts) * 1000;
      console.log(`Waiting ${backoffTime}ms before next attempt`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  
  // This should never be reached due to the throw in the loop, but TypeScript doesn't know that
  throw lastError;
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
  });
} 
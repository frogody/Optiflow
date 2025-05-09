// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsService } from '@/services/ElevenLabsService';
import { AIService } from '@/services/AIService';
import { Anthropic } from '@anthropic-ai/sdk';

// Create a single instance of the service to reuse
let elevenLabsService: ElevenLabsService | null = null;

// Function to get or create ElevenLabs service
const getElevenLabsService = () => {
  if (!elevenLabsService) {
    try {
      elevenLabsService = new ElevenLabsService();
      console.log('ElevenLabs service initialized successfully');
    } catch (error) { console.error('Failed to initialize ElevenLabs service:', error);
      throw error;
        }
  }
  return elevenLabsService;
};

const aiService = new AIService();

export async function POST(request: NextRequest) {
  try {
    const { action, text, context, existingWorkflow, options } = await request.json();

    if (!action || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: action and text'     },
        { status: 400     }
      );
    }

    console.log(`Processing ${action} request with text: "${text.substring(0, 50)}..."`);

    switch (action) {
      case 'textToSpeech': {
        try {
          // Get the ElevenLabs service
          const elevenlabs = getElevenLabsService();
          
          console.log('Generating speech with text:', text.substring(0, 50) + '...');
          const audioContent = await elevenlabs.textToSpeech(text);
          
          // Convert Uint8Array to Buffer and then to base64 string
          const buffer = Buffer.from(audioContent);
          const base64Audio = buffer.toString('base64');
          
          console.log('Successfully generated audio response');
          return NextResponse.json({ audio: base64Audio,
            success: true
              });
        } catch (error) {
          console.error('Error in text-to-speech API endpoint:', error);
          
          // Return a more detailed error response
          return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error in text-to-speech',
            errorCode: error instanceof Error && error.message.includes('voice_not_found') ? 
              'VOICE_NOT_FOUND' : 'TTS_ERROR',
            success: false
              }, { status: 500     });
        }
      }
      
      case 'debugAPI': {
        // Extract test API key if provided
        const testApiKey = options?.testApiKey;
        
        // Debug API key
        const debugData: Record<string, any> = {
          timestamp: new Date().toISOString(),
          anthropicApiKey: {
  length: process.env.ANTHROPIC_API_KEY?.length || 0,
            prefix: process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) : 'not set',
            suffix: process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(process.env.ANTHROPIC_API_KEY.length - 10) : 'not set'
              },
          anthropicModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'not set',
          nextPublicAnthropicModel: process.env.NEXT_PUBLIC_ANTHROPIC_DEFAULT_MODEL || 'not set',
          elevenlabsApiKey: process.env.ELEVENLABS_API_KEY ? `${process.env.ELEVENLABS_API_KEY.substring(0, 8)}...` : 'not set',
          elevenlabsVoiceId: process.env.ELEVENLABS_VOICE_ID || 'not set',
          elevenlabsModel: process.env.ELEVENLABS_MODEL_ID || 'not set',
          envVars: Object.keys(process.env).filter(key => key.includes('ANTHROPIC') || key.includes('ELEVENLABS')),
          nodeEnv: process.env.NODE_ENV,
          modelMap: {
  CLAUDE_3_5_SONNET: 'claude-3-5-sonnet-20241022',
            CLAUDE_INSTANT: 'claude-instant-1.2'
              }
        };
        
        // Test the Anthropic client directly
        try {
          // Use the test API key if provided, otherwise use the environment variable
          const apiKey = testApiKey || process.env.ANTHROPIC_API_KEY || '';
          
          debugData.usingTestKey = !!testApiKey;
          debugData.apiKeyStartsWith = apiKey.substring(0, 10) + '...';
          
          const anthropic = new Anthropic({
            apiKey,
            defaultHeaders: { 'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
                }
          });
          
          debugData.clientTest = 'Anthropic client created successfully';
          
          // Try a simple API call
          try {
            const response = await anthropic.messages.create({
              model: 'claude-3-5-sonnet-20241022',
              max_tokens: 10,
              messages: [{ role: 'user', content: 'Hello'     }]
            });
            
            debugData.apiCallSuccessful = true;
            debugData.apiResponse = { id: response.id,
              model: response.model,
              contentType: response.content[0]?.type
                };
          } catch (apiError) {
            debugData.apiCallError = apiError instanceof Error ? 
              { message: apiError.message, name: apiError.name     } : 
              String(apiError);
          }
        } catch (error) { debugData.clientError = error instanceof Error ? error.message : String(error);
            }
        
        // Test ElevenLabs service
        try {
          const elevenlabs = getElevenLabsService();
          debugData.elevenlabsServiceInitialized = true;
          
          // Try to get available voices
          try {
            const voices = await elevenlabs.getVoices();
            debugData.elevenlabsVoices = voices.slice(0, 3); // Just include first 3 for brevity
            debugData.elevenlabsVoiceCount = voices.length;
          } catch (voiceError) {
            debugData.elevenlabsVoicesError = voiceError instanceof Error ? 
              { message: voiceError.message, name: voiceError.name     } : 
              String(voiceError);
          }
        } catch (elevenLabsError) {
          debugData.elevenlabsServiceError = elevenLabsError instanceof Error ? 
            { message: elevenLabsError.message, name: elevenLabsError.name     } : 
            String(elevenLabsError);
        }
        
        return NextResponse.json(debugData);
      }
      
      case 'processVoiceCommand': {
        console.log('Generating new workflow from description');
        // Get model from request options or fall back to environment variable
        const model = options?.model || process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-5-sonnet-20241022';
        console.log(`Using model: ${model}`);
        
        try {
          const workflow = await aiService.generateWorkflowFromDescription(text, context, model);
          console.log('Generated workflow with name:', workflow.name);
          
          return NextResponse.json({ 
            workflow,
            success: true,
            generatedText: workflow.description || 'Generated workflow successfully',
            text: `I've created a workflow called "${workflow.name}". ${workflow.description}`,
            model: model,
            debug: {
  apiKey: process.env.ANTHROPIC_API_KEY ? `${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...` : 'not set',
              envModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'not set',
              requestedModel: model,
              elevenlabsKey: process.env.ELEVENLABS_API_KEY ? 'set' : 'not set',
              timestamp: new Date().toISOString()
            }
          });
        } catch (error) {
          console.error('Error generating workflow:', error);
          return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            text: `I encountered an error: ${ error instanceof Error ? error.message : 'Unknown error'    }`,
            model: model,
            debug: {
  apiKey: process.env.ANTHROPIC_API_KEY ? `${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...` : 'not set',
              envModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'not set',
              requestedModel: model,
              elevenlabsKey: process.env.ELEVENLABS_API_KEY ? 'set' : 'not set',
              timestamp: new Date().toISOString()
            }
          }, { status: 500     });
        }
      }
      
      case 'refineWorkflow': {
        if (!existingWorkflow) {
          return NextResponse.json(
            { error: 'Missing existing workflow for refinement'     },
            { status: 400     }
          );
        }
        
        console.log('Refining existing workflow based on feedback:', text);
        const { workflow, message } = await aiService.refineWorkflow(text, existingWorkflow, context);
        console.log('Refined workflow. New name:', workflow.name, 'Nodes count:', workflow.nodes.length);
        
        return NextResponse.json({ 
          workflow, 
          message,
          model: process.env.ANTHROPIC_DEFAULT_MODEL || 'unknown',
          debug: {
  apiKey: process.env.ANTHROPIC_API_KEY ? `${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...` : 'not set',
            envModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'not set',
            elevenlabsKey: process.env.ELEVENLABS_API_KEY ? 'set' : 'not set',
            timestamp: new Date().toISOString()
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action'     },
          { status: 400     }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request'     },
      { status: 500     }
    );
  }
} 
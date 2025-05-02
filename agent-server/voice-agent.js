require('dotenv').config();
const { cli } = require('@livekit/agents');
const { OpenAILLM, OpenAITTS } = require('@livekit/agents-plugin-openai');
const { SileroVAD } = require('@livekit/agents-plugin-silero');
const { DeepgramSTT } = require('@livekit/agents-plugin-deepgram');

/**
 * LiveKit Agents entrypoint function
 */
async function entrypoint(job) {
  console.log('Agent job starting:', job.roomName);
  
  // Connect to the LiveKit room
  const room = await job.createRoom();
  console.log('Connected to room:', room.name);
  
  // Initialize AI components
  const vad = new SileroVAD();
  const stt = new DeepgramSTT({ model: 'nova-2' });
  const llm = new OpenAILLM({ model: 'gpt-4o' });
  const tts = new OpenAITTS({ voice: 'alloy' });
  
  // Create an agent with our business logic
  const agent = {
    instructions: `You are a helpful voice assistant for Optiflow. 
    You help users create and manage workflows through voice commands.
    When users want to create a workflow, ask for the name and steps.
    When users want to send a message, ask for the service, recipient, and content.
    Always be polite, concise, and helpful.`,
    
    tools: [
      {
        name: 'create_workflow',
        description: 'Create a new workflow',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the workflow'
            },
            steps: {
              type: 'array',
              description: 'Steps in the workflow',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Name of the step' },
                  type: { type: 'string', description: 'Type of the step' },
                  description: { type: 'string', description: 'Description of the step' }
                }
              }
            }
          },
          required: ['name']
        },
        execute: async (params) => {
          console.log('Creating workflow:', params);
          
          try {
            // Create a workflow object compatible with the app
            const workflow = {
              name: params.name,
              description: `Workflow created via voice command: ${params.name}`,
              nodes: (params.steps || []).map((step, index) => ({
                id: `node-${Date.now()}-${index}`,
                type: 'default',
                position: { x: 100, y: 100 + (index * 150) },
                data: {
                  label: step.name || `Step ${index + 1}`,
                  description: step.description || '',
                  type: step.type || 'default',
                  settings: {}
                }
              })),
              edges: []
            };
            
            // Connect nodes with edges if there are multiple steps
            if (params.steps && params.steps.length > 1) {
              for (let i = 0; i < params.steps.length - 1; i++) {
                workflow.edges.push({
                  id: `edge-${Date.now()}-${i}`,
                  source: workflow.nodes[i].id,
                  target: workflow.nodes[i+1].id,
                  type: 'custom',
                  animated: true,
                  data: { label: `Connection ${i+1}` }
                });
              }
            }
            
            // This is where you would call your API to create the workflow
            const apiUrl = process.env.OPTIFLOW_API_BASE || 'http://localhost:3000';
            console.log(`Would call: ${apiUrl}/api/workflows to create workflow`);
            
            return `Successfully created workflow "${params.name}" with ${params.steps ? params.steps.length : 0} steps.`;
          } catch (error) {
            console.error('Error creating workflow:', error);
            return `Sorry, I couldn't create the workflow. Error: ${error.message}`;
          }
        }
      },
      {
        name: 'send_message',
        description: 'Send a message to someone',
        parameters: {
          type: 'object',
          properties: {
            service: {
              type: 'string',
              description: 'Service to use (slack, email, etc.)',
              enum: ['slack', 'email', 'gmail', 'outlook']
            },
            recipient: {
              type: 'string',
              description: 'Message recipient (email address, channel name, etc.)'
            },
            content: {
              type: 'string',
              description: 'Message content'
            }
          },
          required: ['service', 'recipient', 'content']
        },
        execute: async (params) => {
          console.log('Sending message:', params);
          
          try {
            // This is where you would call your API to send the message
            const apiUrl = process.env.OPTIFLOW_API_BASE || 'http://localhost:3000';
            console.log(`Would call: ${apiUrl}/api/actions/${params.service}/send-message to send message`);
            
            return `Message sent to ${params.recipient} via ${params.service}.`;
          } catch (error) {
            console.error('Error sending message:', error);
            return `Sorry, I couldn't send the message. Error: ${error.message}`;
          }
        }
      }
    ]
  };
  
  // Start the agent session and run the pipeline
  console.log('Starting speech pipeline...');
  
  // Create a processing pipeline
  const pipeline = room.createAudioProcessingPipeline({
    vad,
    stt,
    llm,
    tts,
    agent: agent
  });
  
  // Start the pipeline
  await pipeline.start();
  
  // Have the agent send a greeting
  await pipeline.generateMessage({
    text: 'Hello! I am your Optiflow assistant. How can I help you today with your workflows or messages?'
  });
  
  console.log('Agent ready and waiting for interactions.');
  
  // Keep the job running until disconnected
  return new Promise((resolve) => {
    room.once('disconnected', () => {
      console.log('Room disconnected, ending job');
      resolve();
    });
  });
}

// Run the agent using the CLI
if (require.main === module) {
  cli.runApp({
    entrypointFn: entrypoint
  });
} 
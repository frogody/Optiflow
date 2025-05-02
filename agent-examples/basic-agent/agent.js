require('dotenv').config();
const { WorkerOptions, cli } = require('@livekit/agents');
const { OpenAILLM, OpenAITTS } = require('@livekit/agents-plugin-openai');
const { SileroVAD } = require('@livekit/agents-plugin-silero');
const { DeepgramSTT } = require('@livekit/agents-plugin-deepgram');

/**
 * Entrypoint for the agent
 */
async function entrypoint(job) {
  console.log('Agent starting for room:', job.roomName);
  
  // Connect to the LiveKit room
  const room = await job.createRoom();
  console.log('Connected to room:', room.name);
  
  // Wait for a participant to join
  console.log('Waiting for a participant to join the room...');
  const participant = await job.waitForParticipant();
  console.log(`Participant joined: ${participant.identity}`);
  
  // Create the agent with instructions and tools
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
          
          // This would typically call an API to create the workflow
          return `Successfully created workflow "${params.name}" with ${params.steps ? params.steps.length : 0} steps.`;
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
          
          // This would typically call an API to send the message
          return `Message sent to ${params.recipient} via ${params.service}.`;
        }
      }
    ]
  };
  
  // Set up AI components
  const vad = new SileroVAD();
  const stt = new DeepgramSTT({ model: 'nova-2', language: 'en' });
  const llm = new OpenAILLM({ model: 'gpt-4o' });
  const tts = new OpenAITTS({ voice: 'alloy' });
  
  // Create a processing pipeline connecting the AI components
  console.log('Starting audio processing pipeline...');
  const pipeline = room.createAudioProcessingPipeline({
    agent,
    vad,
    stt,
    llm,
    tts
  });
  
  // Start the pipeline
  await pipeline.start();
  
  // Send a greeting message
  await pipeline.generateMessage({
    text: 'Hello! I am your Optiflow assistant. How can I help you today with your workflows or messages?'
  });
  
  console.log('Agent is ready and waiting for interactions.');
  
  // Keep the job running until the room is disconnected
  return new Promise((resolve) => {
    room.once('disconnected', () => {
      console.log('Room disconnected, ending job');
      resolve();
    });
  });
}

// Run the agent using the CLI with the file path as the agent
const options = new WorkerOptions({
  agent: __filename
});

cli.runApp(options); 
require('dotenv').config();
const fetch = require('node-fetch');

// API base URL for the Next.js app
const API_BASE_URL = process.env.OPTIFLOW_API_BASE || 'http://localhost:3001';

// This function will be called by the LiveKit Agents CLI for each job
// The parameter structure follows the LiveKit Agents CLI requirements
async function entrypoint(job) {
  try {
    console.log('Agent job starting:', job.roomName);
    
    // Connect to the LiveKit room
    const room = await job.createRoom();
    console.log('Connected to room:', room.name);
    
    // Wait for a participant to join
    console.log('Waiting for participant...');
    const participant = await room.waitForParticipant();
    console.log('Participant joined:', participant.identity);
    
    // Create a speech pipeline
    const pipeline = room.createAudioProcessingPipeline({
      // Configure the system prompt for the agent
      initialPrompt: `You are a helpful assistant for Optiflow.
        Help users with creating workflows and sending messages.
        Be friendly, concise, and helpful.`,
      
      // Define the tools the agent can use
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
              
              // Send the workflow to the API
              const response = await fetch(`${API_BASE_URL}/api/workflows`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.API_KEY}`
                },
                body: JSON.stringify(workflow)
              });
              
              if (!response.ok) {
                throw new Error(`Failed to create workflow: ${response.statusText}`);
              }
              
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
              // Determine which Pipedream action to use based on service
              let apiEndpoint, payload;
              
              if (params.service.toLowerCase() === 'slack') {
                apiEndpoint = `${API_BASE_URL}/api/actions/slack/send-message`;
                payload = {
                  channel: params.recipient,
                  text: params.content
                };
              } else if (params.service.toLowerCase() === 'email' || params.service.toLowerCase() === 'gmail') {
                apiEndpoint = `${API_BASE_URL}/api/actions/gmail/send-email`;
                payload = {
                  to: params.recipient,
                  subject: 'Message from Optiflow',
                  body: params.content
                };
              } else if (params.service.toLowerCase() === 'outlook') {
                apiEndpoint = `${API_BASE_URL}/api/actions/outlook/send-email`;
                payload = {
                  to: params.recipient,
                  subject: 'Message from Optiflow',
                  body: params.content
                };
              } else {
                throw new Error(`Unsupported service: ${params.service}`);
              }
              
              // Send the request to the API, which will use Pipedream
              const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.API_KEY}`
                },
                body: JSON.stringify(payload)
              });
              
              if (!response.ok) {
                throw new Error(`Failed to send message: ${response.statusText}`);
              }
              
              return `Message sent to ${params.recipient} via ${params.service}.`;
            } catch (error) {
              console.error('Error sending message:', error);
              return `Sorry, I couldn't send the message. Error: ${error.message}`;
            }
          }
        }
      ]
    });
    
    // Start the pipeline
    await pipeline.start();
    console.log('Agent pipeline started successfully');
    
    // Send a greeting message
    await pipeline.generateMessage({
      text: 'Hello! I am your Optiflow assistant. How can I help you today with workflows or messages?'
    });
    
    // Keep the agent alive until the room is disconnected
    return new Promise((resolve) => {
      room.once('disconnected', () => {
        console.log('Room disconnected, ending job');
        resolve();
      });
    });
  } catch (error) {
    console.error('Error in agent job:', error);
    throw error;
  }
}

// Export the entrypoint function for LiveKit Agents CLI
module.exports = entrypoint; 
require('dotenv').config();
const { cli, WorkerOptions } = require('@livekit/agents');
const { realtime } = require('@livekit/agents-plugin-openai');

// The main entrypoint function that will be called for each job
async function entrypoint(ctx) {
  console.log('Starting agent in room:', ctx.roomName);
  
  // Connect to the LiveKit room
  await ctx.connect();
  console.log('Connected to room');
  
  // Wait for a participant to join
  console.log('Waiting for participant...');
  const participant = await ctx.waitForParticipant();
  console.log('Participant joined:', participant.identity);
  
  // Create the OpenAI realtime model
  const model = new realtime.RealtimeModel({
    instructions: `You are a helpful assistant for Optiflow.
      Help users with creating workflows and sending messages.
      Be friendly, concise, and helpful.`,
    voice: 'alloy'
  });
  
  // Start the agent with the participant
  console.log('Starting agent...');
  const session = await model.start(ctx.room, participant);
  console.log('Agent started successfully');
  
  // Create initial message
  session.conversation.item.create({
    role: 'assistant',
    text: 'Hello! I am your Optiflow assistant. How can I help you today with workflows or messages?'
  });
  
  // Start generating a response
  session.response.create();
  
  // Keep the session running until the room is disconnected
  return new Promise((resolve) => {
    ctx.room.once('disconnected', () => {
      console.log('Room disconnected, ending session');
      resolve();
    });
  });
}

// Start the agent with explicit LiveKit credentials
const options = new WorkerOptions({
  agent: __filename,
  apiKey: process.env.LIVEKIT_API_KEY,
  apiSecret: process.env.LIVEKIT_API_SECRET,
  wsUrl: process.env.LIVEKIT_URL
});

cli.runApp(options); 
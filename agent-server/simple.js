require('dotenv').config();
const { cli, WorkerOptions } = require('@livekit/agents');
const { pipeline } = require('@livekit/agents-plugin-openai');
const { STT } = require('@livekit/agents-plugin-deepgram');
const fetch = require('node-fetch');

// API base URL for the Next.js app
const API_BASE_URL = process.env.OPTIFLOW_API_BASE || 'http://localhost:3001';

/**
 * Simple LiveKit agent for Optiflow
 * This is a simpler implementation that should work with the CLI
 */
async function entrypoint(job) {
  try {
    console.log('Agent job starting:', job.roomName);
    
    // Connect to the LiveKit room
    await job.connect();
    console.log('Connected to room:', job.roomName);
    
    // Wait for a participant to join
    console.log('Waiting for participant...');
    const participant = await job.waitForParticipant();
    console.log('Participant joined:', participant.identity);
    
    // Set up the system prompt
    const systemPrompt = 
      'You are a helpful assistant for Optiflow. ' +
      'Help users with creating workflows and sending messages. ' +
      'Be friendly, concise, and helpful.';
    
    // Create a speech processing pipeline
    const speech = job.createSpeechPipeline({
      systemPrompt,
      participant
    });
    
    // Start the pipeline
    await speech.start();
    console.log('Speech pipeline started');
    
    // Send a greeting
    await speech.say('Hello! I am your Optiflow assistant. How can I help you today with workflows or messages?');
    
    // Keep the agent alive until the room is disconnected
    return new Promise((resolve) => {
      job.room.once('disconnected', () => {
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

// Run the agent if this script is executed directly
if (require.main === module) {
  const options = new WorkerOptions({
    agent: __filename
  });
  
  cli.runApp(options);
} 
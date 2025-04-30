require('dotenv').config();
const { Agent, createWorker } = require('@livekit/agents');

async function main() {
  // Create a worker that will handle agent instances
  const worker = await createWorker({
    apiKey: process.env.LIVEKIT_API_KEY,
    apiSecret: process.env.LIVEKIT_API_SECRET,
    serverUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL,
  });

  // Define agent behavior
  worker.onDispatch(async (job) => {
    const agent = new Agent({
      // Configure speech-to-text
      stt: {
        provider: 'whisper',
        config: {
          language: 'en',
        },
      },
      // Configure text-to-speech
      tts: {
        provider: 'elevenlabs',
        config: {
          voice: 'default',
        },
      },
      // Configure LLM
      llm: {
        provider: 'openai',
        config: {
          model: 'gpt-4-turbo-preview',
        },
      },
    });

    // Handle incoming messages
    agent.onMessage(async (message, context) => {
      console.log('Received message:', message);

      // Process the message with GPT-4
      const response = await agent.llm.chat([
        {
          role: 'system',
          content: `You are a helpful assistant that helps users create and manage workflows. 
                   You can understand voice commands and respond naturally.
                   When users want to create a workflow, ask for the necessary details.
                   When users want to send a message, ask for the recipient and content.`,
        },
        {
          role: 'user',
          content: message,
        },
      ]);

      // Send response back to user
      await context.reply(response);
    });

    // Define workflow-related commands
    agent.defineCommand('create_workflow', {
      description: 'Create a new workflow',
      parameters: {
        name: { type: 'string', description: 'Name of the workflow' },
        steps: { type: 'array', description: 'Steps in the workflow' },
      },
      handler: async (params, context) => {
        // TODO: Implement workflow creation
        await context.reply(`Creating workflow: ${params.name}`);
      },
    });

    agent.defineCommand('send_message', {
      description: 'Send a message to someone',
      parameters: {
        recipient: { type: 'string', description: 'Message recipient' },
        content: { type: 'string', description: 'Message content' },
      },
      handler: async (params, context) => {
        // TODO: Implement message sending
        await context.reply(`Sending message to ${params.recipient}`);
      },
    });

    // Start processing the job
    await agent.handleJob(job);
  });

  // Start the worker
  await worker.start();
  console.log('Agent worker started successfully');
}

main().catch((error) => {
  console.error('Error starting agent worker:', error);
  process.exit(1);
}); 
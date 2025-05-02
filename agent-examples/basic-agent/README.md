# LiveKit Voice Agent Example

This is a simple example of a voice agent using the LiveKit Agents framework. The agent can:

1. Understand voice commands
2. Create workflows based on user instructions
3. Send messages to various services

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the environment file example:
   ```
   cp .env.example .env
   ```

3. Update `.env` with your LiveKit and AI provider credentials.

## Running the Agent

There are multiple ways to run the agent:

### Console Mode (Local Testing)

Test the agent in your terminal with local audio input/output:

```
npm run console
```

### Development Mode (Connect to LiveKit)

Run the agent in development mode, connecting to LiveKit and refreshing on file changes:

```
npm run dev
```

### Production Mode

Run the agent in production mode:

```
npm run start
```

### Connect to a Specific Room

Connect to an existing LiveKit room:

```
npm run connect -- --room <room-name>
```

## Interacting with the Agent

Once the agent is running, you can interact with it:

1. Via the [LiveKit Agents Playground](https://agents-playground.livekit.io/)
2. From a custom web or mobile app using a LiveKit client SDK
3. Through a phone call if you have set up telephony integration

## Available Commands

The agent understands the following commands:

- Create a workflow (with name and steps)
- Send a message (via Slack, email, Gmail, or Outlook)

## Customizing the Agent

To customize the agent, edit the `agent.js` file to:

- Change the agent's instructions
- Add more tools/functions
- Modify the AI components (STT, LLM, TTS) 
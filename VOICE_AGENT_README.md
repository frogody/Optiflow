# Voice Agent for Workflow Creation

This feature allows users to create entire workflows using only their voice, without requiring detailed technical knowledge. The voice agent leverages ElevenLabs for high-quality text-to-speech and browser's native speech recognition APIs.

## How It Works

1. **Voice Input**: Users can click the microphone button in the workflow editor to start speaking their workflow requirements.
2. **Speech-to-Text**: The browser's speech recognition API transcribes the spoken commands.
3. **AI Processing**: The transcribed text is sent to an AI service that converts natural language into a structured workflow definition.
4. **Workflow Generation**: The AI generates a complete workflow with appropriate nodes and connections.
5. **Voice Feedback**: ElevenLabs text-to-speech provides spoken confirmation of the created workflow.

## Example Voice Commands

Users can describe workflows in natural language like these examples:

- "I need a workflow that monitors our company Twitter account for mentions and sends notifications to our Slack channel with sentiment analysis of each tweet."

- "Create a workflow that checks our Shopify store every hour, and if any product inventory falls below 10 items, send an email to our purchasing team and update our inventory spreadsheet."

- "I want to automate lead generation. Take new leads from HubSpot, enrich their data with Clearbit, score them based on company size and industry, then send high-scoring leads to the sales team via email and add the rest to a nurture campaign."

- "I have a list of SQLs in my HubSpot pipe. I want to reach out to all of them today with one super personalized email showing great research effort and then two simple follow-up emails. When they don't reply to the third email, take them out of my active pipe."

## Setup

1. Obtain an ElevenLabs API key from [ElevenLabs](https://elevenlabs.io/).

2. Add the following environment variables to your `.env` file:
   ```
   ELEVENLABS_API_KEY=your-api-key
   ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Default Adam voice
   ELEVENLABS_MODEL_ID=eleven_turbo_v2
   ```

3. Install the required dependencies:
   ```
   npm install elevenlabs-node @floating-ui/react
   ```

## Implementation Details

- The voice agent uses browser's native SpeechRecognition API for speech-to-text.
- ElevenLabs API is used for high-quality text-to-speech responses.
- AI-powered workflow generation uses system prompts to convert natural language to structured workflow definitions.
- The voice agent interface is implemented as a floating button in the workflow editor.

## Limitations

- Speech recognition requires browser support (Chrome, Edge, Safari).
- ElevenLabs API requires an API key and has usage limits.
- Complex workflows may require adjustments after generation.
- Currently only supports English language.

## Future Enhancements

- Multi-language support
- Voice-based workflow editing and modification
- Custom voice selection
- Improved error handling and fallback mechanisms
- Integration with other speech-to-text providers 
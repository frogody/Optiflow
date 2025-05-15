# Optiflow Voice Agent Setup Guide

This guide will help you set up and deploy the Optiflow Voice Agent service, which enables voice interaction capabilities on your website.

## Prerequisites

- Python 3.8 or higher
- A server or hosting platform for your voice agent service (e.g., Render, Heroku, AWS, etc.)
- Basic knowledge of environment variables and CORS configuration

## Local Development Setup

1. **Clone the repository:**

   If not already done, clone the Optiflow repository:
   ```bash
   git clone https://github.com/your-username/Optiflow.git
   cd Optiflow
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install the required packages:**

   ```bash
   cd voice-agent-service
   pip install -r requirements.txt
   ```

4. **Run the voice agent service:**

   ```bash
   python main.py
   ```

   This will start the service on port 8000 by default. You can change the port using the `PORT` environment variable.

5. **Test the service:**

   Open the test HTML page in your browser:
   ```bash
   cd ..  # Return to the main directory
   open voice-agent-test.html
   ```

   Use the test page to check if the endpoints are working correctly.

## Configuration Options

The voice agent service can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port on which the service runs | `8000` |
| `CORS_ALLOW_ORIGIN` | Comma-separated list of allowed origins | `https://app.isyncso.com,http://localhost:3000` |
| `CORS_ALLOW_METHODS` | HTTP methods allowed for CORS | `GET,POST,OPTIONS` |
| `CORS_ALLOW_HEADERS` | Headers allowed for CORS | `Content-Type,Authorization` |
| `LIVEKIT_URL` | URL for the LiveKit server | `wss://example.livekit.cloud` |

## Deploying to Production

### Deployment to Render.com

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Select the `voice-agent-service` directory as your root directory
4. Set the build command to: `pip install -r requirements.txt`
5. Set the start command to: `python main.py`
6. Add the necessary environment variables:
   - `PORT`: 10000 (default port for Render web services)
   - `CORS_ALLOW_ORIGIN`: Your website domain (e.g., `https://app.isyncso.com`)
   - Other environment variables as needed

### Connecting the Frontend

1. In your frontend Next.js application, set the following environment variables:
   - `NEXT_PUBLIC_VOICE_AGENT_URL`: The URL of your deployed voice agent service
   - `NEXT_PUBLIC_VOICE_AGENT_ENABLED`: Set to `true` to enable the voice agent feature

2. Add the voice agent component to your application:
   ```tsx
   import VoiceAgentClient from "@/components/voice/VoiceAgentClient";

   export default function YourPage() {
     return (
       <div>
         <h1>Your Application</h1>
         <VoiceAgentClient />
       </div>
     );
   }
   ```

## Troubleshooting

### CORS Issues

If you're experiencing CORS issues (errors in the browser console stating "Access to fetch at 'x' from origin 'y' has been blocked by CORS policy"):

1. Make sure your `CORS_ALLOW_ORIGIN` environment variable includes your website's domain
2. Verify that the voice agent service is properly handling OPTIONS preflight requests
3. Check that your frontend is using the correct URL for the voice agent service

### API Endpoint Issues

If endpoints are returning 404 errors:

1. Make sure the voice agent service is running
2. Verify the URL being used in your frontend matches the deployed service
3. Check the service logs for any errors

## Additional Features

To implement full voice conversation capabilities, you'll need to:

1. Set up a LiveKit account and configure the service with your API keys
2. Implement the speech-to-text and text-to-speech functionality
3. Connect to a language model (like OpenAI's GPT) for generating responses

Refer to the LiveKit and OpenAI documentation for detailed setup instructions.

## Next Steps

After setting up the voice agent service, consider:

1. Customizing the voice agent's responses to match your brand
2. Adding domain-specific knowledge to improve conversation quality
3. Implementing analytics to track conversation metrics
4. Setting up monitoring and alerts for the service

## Support

If you encounter any issues or have questions, please:

1. Check the logs of your voice agent service for error messages
2. Review the troubleshooting section in this document
3. Open an issue in the GitHub repository for assistance 
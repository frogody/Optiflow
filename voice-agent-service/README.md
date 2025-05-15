# Optiflow Voice Agent Service

This service provides the backend API for the Optiflow voice agent feature, allowing voice interactions with AI agents.

## Features

- Real-time voice communication via LiveKit
- CORS-enabled API endpoints for web integration
- Simple token generation for authentication
- Health check endpoint

## API Endpoints

- **GET /health** - Check if the service is running
- **POST /agent/dispatch** - Initialize a voice agent session
- **GET /agent/token** - Generate an authentication token

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the service on | `8000` |
| `CORS_ALLOW_ORIGIN` | Comma-separated list of allowed origins | `https://app.isyncso.com,http://localhost:3000` |
| `LIVEKIT_URL` | URL for the LiveKit WebSocket server | `wss://example.livekit.cloud` |
| `DEBUG` | Enable debug logging | `False` |

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the service:
   ```bash
   python main.py
   ```

3. Test the API:
   ```bash
   curl http://localhost:8000/health
   ```

## Deployment

This service is designed to be deployed on [Render.com](https://render.com).

### Deploying to Render

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Web Service pointing to this repository
4. Configure the environment variables
5. Deploy the service

For more detailed deployment instructions, see the [Render deployment guide](../VOICE_AGENT_RENDER_DEPLOY.md).

## CORS Configuration

This service is configured to handle CORS requests properly, allowing it to be called from web browsers. The `CORS_ALLOW_ORIGIN` environment variable should include all domains that will access this API.

## Troubleshooting

If you encounter CORS errors:

1. Verify that your frontend domain is listed in the `CORS_ALLOW_ORIGIN` environment variable
2. Check that OPTIONS requests are being handled correctly (status code 200)
3. Ensure the appropriate CORS headers are being returned:
   - Access-Control-Allow-Origin
   - Access-Control-Allow-Methods
   - Access-Control-Allow-Headers
   - Access-Control-Allow-Credentials

For more help, see the [CORS troubleshooting guide](../VOICE_AGENT_RENDER_DEPLOY.md#troubleshooting). 
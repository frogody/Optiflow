# Deploying Optiflow Voice Agent to Render.com

This guide explains how to deploy the Optiflow Voice Agent service to Render.com.

## Pre-deployment Checklist

1. Make sure your code has the correct CORS configuration:
   - app.py and voice-agent-service/main.py should have proper CORS middleware
   - OPTIONS endpoints should return 200 status codes
   - CORS headers should include your website domain in allow-origins

2. Ensure requirements.txt has all necessary packages:
   - fastapi
   - uvicorn
   - python-multipart
   - pydantic
   - websockets
   - requests
   - python-dotenv

3. Configure your environment variables:
   - CORS_ALLOW_ORIGIN=https://app.isyncso.com,http://localhost:3000
   - LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
   - PORT=8000 (Render will override this)

## Deployment Steps

### Option 1: Using the Automated Script

1. Run the deployment script:
   ```bash
   ./deploy-voice-agent-to-render.sh
   ```

2. Follow the instructions provided by the script to complete the deployment.

### Option 2: Manual Deployment

1. Commit your changes:
   ```bash
   git add voice-agent-service/main.py voice-agent-service/config.py voice-agent-service/requirements.txt voice-agent-service/render.yaml app.py
   git commit -m "Update voice agent service with improved CORS configuration"
   git push origin main
   ```

2. Log into your Render.com dashboard at https://dashboard.render.com

3. Click "New +" and select "Blueprint" or "Web Service"

4. Connect to your GitHub repository (https://github.com/frogody/optiflow-voice-agent)

5. For manual setup (without render.yaml):
   - Name: optiflow-voice-agent
   - Runtime: Python
   - Build Command: pip install -r requirements.txt
   - Start Command: python main.py
   - Set the following environment variables:
     - CORS_ALLOW_ORIGIN=https://app.isyncso.com,http://localhost:3000
     - LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud

6. Deploy the service

## Testing Your Deployment

1. Check the health endpoint:
   ```
   https://optiflow-voice-agent.onrender.com/health
   ```

2. Test CORS configuration:
   ```bash
   curl -X OPTIONS -H "Origin: https://app.isyncso.com" \
   -H "Access-Control-Request-Method: POST" \
   -H "Access-Control-Request-Headers: Content-Type" \
   https://optiflow-voice-agent.onrender.com/agent/dispatch
   ```

## Troubleshooting

### CORS Issues

If you're still experiencing CORS issues:

1. Check Render.com logs for any errors
2. Ensure the correct domains are in your CORS_ALLOW_ORIGIN
3. Verify the OPTIONS endpoint returns 200 status
4. Try setting Access-Control-Allow-Origin to "*" temporarily for testing

### Deployment Failures

1. Check Render.com build logs
2. Verify requirements.txt has all necessary dependencies
3. Ensure your main.py runs locally without errors
4. Check for Python version compatibility issues

## Frontend Integration

Update your frontend to connect to the Render.com endpoint:

```javascript
const VOICE_AGENT_URL = "https://optiflow-voice-agent.onrender.com";
```

## Monitoring

Monitor your service health and performance in the Render.com dashboard. Set up uptime monitoring and notifications for any service disruptions. 
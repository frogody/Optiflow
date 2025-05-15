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

### Understanding CORS Errors

CORS (Cross-Origin Resource Sharing) errors occur when a web page tries to make a request to a domain that's different from the one serving the web page. The browser enforces this security mechanism.

When your browser console shows something like:
```
Access to fetch at 'https://optiflow-voice-agent.onrender.com/agent/dispatch' from origin 'https://app.isyncso.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Remember these key points:
1. CORS errors are **browser errors**, not server errors
2. The server needs to include special headers to tell the browser it's safe to allow the cross-origin request
3. For requests with credentials, specific origins must be listed (wildcard `*` won't work)

### How Browser CORS Works

When a web page makes a cross-origin request:

1. For simple requests, the browser adds an `Origin` header to the request
2. For complex requests (like POST with JSON), the browser first sends a "preflight" OPTIONS request
3. The server must respond to the OPTIONS request with proper CORS headers
4. The browser checks these headers to decide whether to allow the actual request

### CORS Troubleshooting Steps

If you're still experiencing CORS issues:

1. **Check server logs** in the Render.com dashboard to see if OPTIONS requests are being received
   
2. **Verify your environment variables**:
   - Ensure `CORS_ALLOW_ORIGIN` includes your frontend domain **exactly as it appears in the browser**
   - Check for typos and make sure there are no trailing slashes
   - Example: `https://app.isyncso.com` not `https://app.isyncso.com/`

3. **Test with curl** to see if the server is responding properly:
   ```bash
   curl -v -X OPTIONS -H "Origin: https://app.isyncso.com" \
   -H "Access-Control-Request-Method: POST" \
   -H "Access-Control-Request-Headers: Content-Type" \
   https://optiflow-voice-agent.onrender.com/agent/dispatch
   ```
   
   Look for these headers in the response:
   ```
   Access-Control-Allow-Origin: https://app.isyncso.com
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
   Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
   ```

4. **Try temporary solutions for local testing**:
   - For Chrome: Install the [Allow CORS extension](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
   - For Firefox: Install the [CORS Everywhere extension](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)
   
   Note: These are for development only and won't help your end users.

5. **Check header values**:
   - If using credentials, `Access-Control-Allow-Origin` cannot be `*`
   - `Access-Control-Allow-Credentials` must be set to `true` when using credentials
   - Ensure your `Access-Control-Allow-Headers` includes all headers your frontend is sending

### Advanced Solution: Using a Proxy

If you can't modify the server directly or need a more robust solution:

1. Create a proxy server that forwards requests to your voice agent service
2. The proxy server adds the correct CORS headers to responses
3. Your frontend connects to the proxy instead of directly to the voice agent service

This approach works because CORS is enforced by browsers but not by server-to-server communication.

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
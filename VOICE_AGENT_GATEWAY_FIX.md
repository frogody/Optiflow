# Voice Agent AWS API Gateway Fix

## Problem

The voice agent in the Optiflow application was previously using a temporary mock/bypass solution for AWS API Gateway calls, which led to 403 Forbidden errors. When implementing proper API key authentication, we discovered that the API Gateway endpoints don't exist, resulting in 404 Not Found errors.

## Root Cause Analysis

1. **Incorrect API Gateway Configuration**:
   - The API Gateway ID (`sfd8q2ch3k.execute-api.us-east-2.amazonaws.com`) either does not exist or is not accessible
   - The endpoints we're testing (`/agent/dispatch`, `/agent/token`, etc.) return 404 Not Found errors
   - None of the tested path prefixes (`/prod/`, `/api/`, `/v1/`) work

2. **Current Voice Agent Implementation**:
   - The voice agent component already has direct URL support through `NEXT_PUBLIC_VOICE_AGENT_URL`
   - The AWS API Gateway was intended as an alternative method but was not properly set up

## Solution: Direct URL-Based Approach

Since the API Gateway is not working correctly and the application already has support for direct voice agent URLs, we've updated the implementation to:

1. **Prioritize Direct Voice Agent URL**:
   - When `NEXT_PUBLIC_VOICE_AGENT_URL` is set, use it exclusively for agent communication
   - Only fall back to AWS API Gateway if the direct URL is not available

2. **Disable AWS API Gateway**:
   - Clear the hardcoded API Gateway ID to prevent 404 errors
   - Make the system gracefully handle the absence of AWS API Gateway

3. **Improve Error Handling and Logging**:
   - Added better detection of voice agent endpoints
   - Improved logging to help diagnose connection issues

## How to Apply the Fix

### Option 1: Run the Fix Script

We've created a script that implements all the necessary changes:

```bash
./fix-voice-agent-connection.sh
```

The script will:
- Back up your existing .env.local file
- Ask for your voice agent URL
- Update environment variables to disable AWS API Gateway
- Build the application with the new configuration

### Option 2: Manual Configuration

If you prefer to make changes manually:

1. **Set Direct Voice Agent URL**:
   - Add `NEXT_PUBLIC_VOICE_AGENT_URL=https://your-voice-agent-url.com` to your .env.local file

2. **Disable AWS API Gateway**:
   - Set `NEXT_PUBLIC_AWS_API_ENDPOINT=""` and `NEXT_PUBLIC_AWS_API_KEY=""` in your .env.local file

3. **Rebuild the Application**:
   ```bash
   npm run build
   ```

## Testing the Fix

1. **Run the Application**:
   ```bash
   npm run dev
   ```

2. **Open the Browser Console**:
   - Monitor requests to your voice agent URL
   - Check for successful connections in the console logs

3. **Interact with the Voice Agent**:
   - Click "Connect to Sync" in the voice agent interface
   - Check that it connects without errors

4. **Verify Endpoint Detection**:
   - Run `window.printAwsEndpoints()` in the browser console
   - This will show all detected voice agent endpoints

## Future Considerations

If you want to re-enable AWS API Gateway integration in the future:

1. **Create a Proper API Gateway**:
   - Set up the API Gateway with the correct endpoints (`/agent/dispatch`, `/agent/token`, `/agent/force-join`)
   - Configure API key authentication for all endpoints
   - Associate the API key with a usage plan

2. **Update Environment Variables**:
   - Set `NEXT_PUBLIC_AWS_API_ENDPOINT` to your API Gateway ID
   - Set `NEXT_PUBLIC_AWS_API_KEY` to your API key
   - (Optional) Clear `NEXT_PUBLIC_VOICE_AGENT_URL` to force AWS API Gateway usage

## Troubleshooting

If you continue to experience issues:

1. **Check Direct URL Connectivity**:
   - Verify that the voice agent URL is accessible from your environment
   - Test basic connectivity with: `curl https://your-voice-agent-url.com/health`

2. **Check Network Requests**:
   - Use browser developer tools to monitor network requests
   - Look for any 4xx or 5xx errors in the Network tab

3. **Inspect Console Logs**:
   - Look for `[Voice Agent]` logs in the browser console
   - Check for any connection errors or warnings

For further issues, please refer to the LiveKit and voice agent documentation. 
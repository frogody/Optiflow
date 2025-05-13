# Voice Agent Debug Guide

This guide explains how to use the debug features for the voice agent in development mode.

## Overview

When developing and testing the voice agent functionality, you may want to bypass authentication to test the voice agent directly without having to log in. The debug endpoints allow you to do this in development mode.

## Debug Endpoints

Three debug endpoints have been created to facilitate development and testing:

1. `/api/livekit/debug-token` - Generates LiveKit tokens without requiring authentication
2. `/api/livekit/debug-dispatch` - Dispatches a LiveKit agent without authentication
3. `/api/livekit/debug-force-join` - Forces an agent to join a room without authentication

These endpoints are automatically used by the VoiceAgentInterface component when:
- The application is running in development mode (`NODE_ENV === 'development'`)
- The user is not authenticated (no session or no user ID)

## Test Page

A test page has been created at `/voice-test` to test the voice agent functionality directly without requiring a login. This page uses the debug endpoints automatically in development mode.

## Environment Variables

Make sure these environment variables are correctly set in your `.env.local` file:

```
LIVEKIT_API_KEY="your_api_key"
LIVEKIT_API_SECRET="your_api_secret"
LIVEKIT_URL="wss://your-livekit-instance.livekit.cloud"
NEXT_PUBLIC_LIVEKIT_URL="wss://your-livekit-instance.livekit.cloud"
```

Make sure the URL values match exactly to avoid connection issues.

## Test Script

A test script has been created to verify that the debug endpoints are working correctly:

```bash
node test-livekit-client.js
```

This script tests all three debug endpoints and should output success messages if everything is working correctly.

## Debugging Tips

1. Look for the yellow "Using debug endpoints (auth bypassed)" text in the voice agent interface to confirm that it's using the debug endpoints.

2. Check the console for log messages about which endpoints are being used.

3. If you're having issues with the voice agent, try using the Force Join button or the Reconnect Agent button in the interface.

4. Use the test script to verify that the debug endpoints are working correctly.

## Limitations

1. These debug endpoints should only be used in development mode for testing purposes.

2. They bypass authentication and should never be used in production.

3. The debug endpoints will not work if the environment variables are not set correctly.

## License

This code is licensed under the same license as the rest of the project. 
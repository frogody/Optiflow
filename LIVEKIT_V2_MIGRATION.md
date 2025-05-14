# LiveKit v2 Migration Guide

This document outlines the steps required to migrate from LiveKit v1 to LiveKit v2 in the Optiflow platform.

## Overview

LiveKit v2 introduces several major changes:
- New event handling system based on EventEmitter
- Updated component API
- Pipeline-based agent configuration
- New room connection patterns
- Identity-focused participant management

## Prerequisites

- Node.js 16+
- PostgreSQL database with Prisma setup
- LiveKit Server v2

## Migration Steps

### 1. Environment Variable Standardization

The first step is to standardize environment variables across the codebase:

```bash
# Run the standardization script
./fix-livekit-url.sh
```

This script ensures:
- `LIVEKIT_URL` is used consistently (replacing `LIVEKIT_WS_URL`)
- `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are properly formatted

### 2. Package Updates

Update the package.json dependencies:

```json
{
  "dependencies": {
    "@livekit/components-react": "^2.0.0",
    "@livekit/components-styles": "^2.0.0",
    "livekit-client": "^2.0.0"
  }
}
```

Run `npm install` to update the packages.

### 3. Database Schema Updates

Run the Prisma migration to update the database schema:

```bash
npx prisma migrate deploy
```

This applies the migration in `prisma/migrations/20250514173935_livekit_v2_migration/migration.sql`.

### 4. Client-Side Changes

#### VoiceAgent.tsx Updates

1. Update imports:
```typescript
import { LiveKitRoom, useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState, Room, RoomEvent, DataPacket_Kind } from 'livekit-client';
```

2. Update Room configuration:
```typescript
const room = new Room({
  adaptiveStream: true,
  dynacast: true,
  disconnectOnWidgetClose: false
});

await room.connect(url, token);
```

3. Update event listeners:
```typescript
room.addEventListener(RoomEvent.ParticipantConnected, () => {
  console.log('Remote participant connected');
});

room.addEventListener(RoomEvent.DataReceived, (data) => {
  try {
    const jsonData = JSON.parse(data.data);
    // Handle received data
  } catch (err) {
    console.error('Error parsing received data:', err);
  }
});
```

4. Update participant access:
```typescript
// Old: room.participants
// New: room.remoteParticipants
const remoteParticipants = room.remoteParticipants;
```

5. Update data publishing:
```typescript
room.localParticipant.publishData(jsonData, {
  reliable: true,
  identities: [], // For broadcast, leave empty
});
```

### 5. Server-Side Changes

#### main_agent.py Updates

1. Update imports:
```python
from livekit import agents
from livekit.plugins.openai import OpenAITTSPlugin, OpenAIASRPlugin, OpenAIChatCompletionPlugin
```

2. Update agent initialization:
```python
agent_session = agents.AgentSession(
    livekit_url=os.environ.get("LIVEKIT_URL"),
    api_key=livekit_api_key,
    api_secret=livekit_api_secret,
    identity="voice-agent",
)
```

3. Create pipeline with nodes:
```python
pipeline = agent_session.create_pipeline(room_name="test-room")

# Add nodes to pipeline
pipeline.add_node(agents.nodes.AudioTranscriptionNode(plugin=asr_plugin))
pipeline.add_node(agents.nodes.ChatCompletionNode(plugin=llm_plugin, tools=tools))
pipeline.add_node(agents.nodes.TextToSpeechNode(plugin=tts_plugin))
```

4. Register tools and start pipeline:
```python
# Register tool handlers
pipeline.register_tool("get_weather", get_weather)

# Start the pipeline
await pipeline.start()
```

### 6. API Changes

1. Update token generation in `/api/livekit/token` 
2. Update room dispatch in `/api/livekit/dispatch`
3. Update LiveKit service methods

### 7. Testing

1. Test basic voice agent functionality
2. Verify room connection and event listeners
3. Test data publishing and receiving
4. Validate voice agent pipeline functionality

### Troubleshooting

1. Check environment variables if connection issues occur
2. Verify database migration was applied correctly
3. Clear browser cache if client components aren't updating
4. Check for console errors related to event handling

## Rollback Plan

If issues arise during migration:

1. Revert package.json to previous versions
2. Run database rollback migration
3. Restore original environment variables
4. Revert code changes in VoiceAgent.tsx and main_agent.py

## Additional Resources

- [LiveKit v2 Documentation](https://docs.livekit.io)
- [LiveKit Agents Documentation](https://docs.livekit.io/agents)
- [LiveKit Components](https://github.com/livekit/components-js) 
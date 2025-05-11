export const runtime = 'edge';

export async function GET() {
  const upgrade = Reflect.get(globalThis, 'socket')?.upgrade;

  if (!upgrade) {
    return new Response('WebSocket upgrade not supported', {
      status: 426,
    });
  }

  const webSocket = new WebSocket();

  webSocket.onopen = () => {
    console.log('WebSocket opened');

    // Setup heartbeat
    const pingInterval = setInterval(() => {
      if (webSocket.readyState === webSocket.OPEN) {
        webSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 15000);

    webSocket.onclose = () => {
      console.log('WebSocket closed');
      clearInterval(pingInterval);
    };
  };

  upgrade(webSocket, {
    protocol: '',
  });

  return new Response(null, { status: 101 });
}

// Handle WebSocket upgrade
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Test WebSocket connection to echo.websocket.org
    // which is a simple echo service that will send back any message we send
    console.log('Testing WebSocket connection (alternate endpoint)...');

    const wsTest = await testWebSocketConnection();
    return NextResponse.json({
      success: true,
      message: 'WebSocket test completed successfully',
      result: wsTest,
    });
  } catch (error) {
    console.error('WebSocket test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'WebSocket test failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Function to test WebSocket connection
async function testWebSocketConnection() {
  return new Promise((resolve, reject) => {
    const wsUrl = 'wss://echo.websocket.org/';
    const options = createWebSocketOptions({});

    console.log('Connecting to echo WebSocket...');
    const ws = new WebSocket(wsUrl, options);

    // Track whether we've already resolved/rejected
    let settled = false;

    // Setup timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        try {
          ws.close();
        } catch {/* intentionally empty: ignore close errors */}
        reject(new Error('WebSocket connection timed out after 5 seconds'));
      }
    }, 5000);

    ws.onopen = () => {
      console.log('Echo WebSocket connected');

      try {
        // Send a test message
        const testMessage = JSON.stringify({ test: 'message' });
        ws.send(testMessage);
        console.log('Sent test message:', testMessage);
      } catch (error) {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          try {
            ws.close();
          } catch {/* intentionally empty: ignore close errors */}
          reject(error);
        }
      }
    };

    ws.onmessage = (event) => {
      try {
        console.log('Received echo response:', event.data);
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          try {
            ws.close();
          } catch {/* intentionally empty: ignore close errors */}
          resolve({
            success: true,
            data:
              typeof event.data === 'string'
                ? event.data
                : 'Received non-string data',
          });
        }
      } catch (error) {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          try {
            ws.close();
          } catch {/* intentionally empty: ignore close errors */}
          reject(error);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('Echo WebSocket error:', error);
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        try {
          ws.close();
        } catch {/* intentionally empty: ignore close errors */}
        reject(new Error(`WebSocket error: ${error}`));
      }
    };

    ws.onclose = (event) => {
      console.log(`Echo WebSocket closed with code ${event.code}`);
      clearTimeout(timeoutId);

      if (!settled) {
        settled = true;
        reject(new Error(`WebSocket closed with code ${event.code}`));
      }
    };
  });
}

// Simple script to test LiveKit debug endpoints
const tokenUrl = 'http://localhost:4000/api/livekit/debug-token';
const dispatchUrl = 'http://localhost:4000/api/livekit/debug-dispatch';
const forceJoinUrl = 'http://localhost:4000/api/livekit/debug-force-join';

// 1. Test the debug token endpoint
async function testLivekitDebugToken() {
  try {
    console.log('Testing LiveKit debug token endpoint...');
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        room: 'debug-test-room-' + Date.now(),
        userId: 'debug-test-user-' + Date.now()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('LiveKit debug token response:', data);
    return data;
  } catch (error) {
    console.error('Error testing LiveKit debug token:', error.message);
    throw error;
  }
}

// 2. Test the debug dispatch endpoint
async function testLivekitDebugDispatch() {
  try {
    console.log('\nTesting LiveKit debug dispatch endpoint...');
    const response = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        roomName: 'debug-test-room-' + Date.now()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('LiveKit debug dispatch response:', data);
    return data;
  } catch (error) {
    console.error('Error testing LiveKit debug dispatch:', error.message);
    throw error;
  }
}

// 3. Test the debug force-join endpoint
async function testLivekitDebugForceJoin() {
  try {
    console.log('\nTesting LiveKit debug force-join endpoint...');
    const testRoomName = 'debug-test-room-' + Date.now();
    const response = await fetch(forceJoinUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        roomName: testRoomName
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('LiveKit debug force-join response:', data);
    return data;
  } catch (error) {
    console.error('Error testing LiveKit debug force-join:', error.message);
    throw error;
  }
}

// Run the tests sequentially
async function runTests() {
  try {
    // Test 1: Get a debug token
    const tokenData = await testLivekitDebugToken();
    console.log('Token test completed successfully');
    
    // Test 2: Dispatch an agent
    const dispatchData = await testLivekitDebugDispatch();
    console.log('Dispatch test completed successfully');
    
    // Test 3: Force join an agent
    const forceJoinData = await testLivekitDebugForceJoin();
    console.log('Force join test completed successfully');
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.log('Tests failed:', error.message);
  }
}

// Run the tests
runTests(); 
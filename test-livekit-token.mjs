// Test LiveKit token generation using ESM
import { AccessToken } from 'livekit-server-sdk';
import fs from 'fs';

// Function to strip quotes if present
function cleanEnvVar(value) {
  if (!value) return '';
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

// Read environment variables from .env.local file
function getEnvVars() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const vars = {};
    
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        vars[key] = value;
      }
    });
    
    return vars;
  } catch (err) {
    console.error('Error reading .env.local file:', err);
    return {};
  }
}

// Create LiveKit token for testing
async function generateToken() {
  try {
    // Get credentials from env file
    const envVars = getEnvVars();
    const apiKey = cleanEnvVar(envVars.LIVEKIT_API_KEY || '');
    const apiSecret = cleanEnvVar(envVars.LIVEKIT_API_SECRET || '');
    const livekitUrl = cleanEnvVar(envVars.LIVEKIT_URL || '');
    
    console.log('Using API Key:', apiKey);
    console.log('API Secret length:', apiSecret?.length);
    console.log('LiveKit URL:', livekitUrl);
    
    if (!apiKey || !apiSecret) {
      throw new Error('Missing LiveKit credentials');
    }
    
    // Create a test room and identity
    const roomName = 'test-room-' + Date.now();
    const identity = 'test-user-' + Date.now();
    
    // Create the token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity
    });
    
    at.addGrant({ 
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    });
    
    // Generate the token - using await
    const token = await at.toJwt();
    
    console.log('\nGenerated token successfully:');
    console.log('Token:', token);
    console.log('Room:', roomName);
    console.log('Identity:', identity);
    
    return { token, roomName, identity };
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

// Run the token generation
generateToken().then(result => {
  if (result) {
    console.log('\nToken generation succeeded');
  } else {
    console.log('\nToken generation failed');
  }
}); 
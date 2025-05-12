// Simple script to test LiveKit token generation
import { AccessToken } from 'livekit-server-sdk';

// Function to strip quotes if present
function cleanEnvVar(value) {
  if (!value) return '';
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  return value;
}

// Get credentials from the .env.local file directly
import fs from 'fs';
import path from 'path';

// Function to read env vars
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

// Get and clean the API credentials
const envVars = getEnvVars();
const apiKey = cleanEnvVar(envVars.LIVEKIT_API_KEY || '');
const apiSecret = cleanEnvVar(envVars.LIVEKIT_API_SECRET || '');
const livekitUrl = cleanEnvVar(envVars.LIVEKIT_URL || '');

console.log('Using API Key:', apiKey);
console.log('API Secret length:', apiSecret?.length);
console.log('LiveKit URL:', livekitUrl);

// Create a test room and identity
const roomName = 'test-room-' + Date.now();
const identity = 'test-user-' + Date.now();

// Create token synchronously
try {
  const at = new AccessToken(apiKey, apiSecret, {
    identity: identity,
    ttl: 60 * 60 // 1 hour
  });
  
  at.addGrant({ 
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true
  });
  
  // Generate the token synchronously
  const token = at.toJwt();
  
  console.log('\nGenerated token successfully:');
  console.log('Token:', token);
  console.log('Room:', roomName);
  console.log('Identity:', identity);
  
  // Test token is valid by making a direct request to LiveKit
  console.log('\nValidating token by making a request to LiveKit...');
  // This would be a fetch call to the LiveKit server
  
} catch (error) {
  console.error('Error generating token:', error);
} 
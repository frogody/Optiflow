#!/usr/bin/env node

/**
 * This script generates a secure random string to use as NEXTAUTH_SECRET
 * Run with: node scripts/generate-secret.js
 */

const crypto = require('crypto');

// Generate a random secret of 32 bytes (256 bits) and convert to base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated NEXTAUTH_SECRET:');
console.log('\x1b[32m%s\x1b[0m', secret);
console.log('\nAdd this to your .env.production file as:');
console.log('\x1b[33m%s\x1b[0m', `NEXTAUTH_SECRET=${secret}`);
console.log('\n'); 
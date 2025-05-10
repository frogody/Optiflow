/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Mock OAuth Server for Testing
 * 
 * This simple Express server mocks the OAuth provider (like Google, GitHub) 
 * and Pipedream services for automated testing.
 * 
 * Run with: node tests/mock-oauth-server.js
 */

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.MOCK_OAUTH_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store OAuth state for verification
const pendingAuthRequests = new Map();

// Mock OAuth authorization page
app.get('/mock-oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, state, scope, response_type } = req.query;
  
  // Store the state for verification
  pendingAuthRequests.set(state, { client_id, redirect_uri });

  // Return a mock OAuth page
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mock OAuth Provider</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { border: 1px solid #ccc; padding: 20px; border-radius: 5px; }
          .btn { padding: 10px 15px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .btn-deny { background: #f44336; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Mock OAuth Authorization</h2>
          <p>An application is requesting access to your account:</p>
          <ul>
            <li>Client ID: ${client_id}</li>
            <li>Redirect URI: ${redirect_uri}</li>
            <li>Scope: ${scope}</li>
          </ul>
          <form id="authForm" method="GET" action="/mock-oauth/approve">
            <input type="hidden" name="state" value="${state}" />
            <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
            <button type="submit" class="btn">Approve</button>
            <button type="button" class="btn btn-deny" onclick="denyAccess()">Deny</button>
          </form>
        </div>
        <script>
          function denyAccess() {
            const redirectUri = "${redirect_uri}";
            window.location.href = redirectUri + "?error=access_denied&state=${state}";
          }
        </script>
      </body>
    </html>
  `);
});

// Handle approvals
app.get('/mock-oauth/approve', (req, res) => {
  const { state, redirect_uri } = req.query;
  
  // Verify state
  if (!pendingAuthRequests.has(state)) {
    return res.status(400).send('Invalid state parameter');
  }
  
  // Generate a mock authorization code
  const authCode = `mock_auth_code_${Date.now()}`;
  
  // Redirect back to the client application
  const redirectUrl = `${redirect_uri}?code=${authCode}&state=${state}`;
  res.redirect(redirectUrl);
});

// Mock token endpoint
app.post('/mock-oauth/token', (req, res) => {
  const { code, client_id, client_secret, redirect_uri, grant_type } = req.body;
  
  // Validate the request
  if (!code || !client_id || grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'invalid_request' });
  }
  
  // Return a mock token response
  res.json({
    access_token: `mock_access_token_${Date.now()}`,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: `mock_refresh_token_${Date.now()}`,
  });
});

// Mock Pipedream API endpoints
app.get('/mock-pipedream/api/user', (req, res) => {
  // Check for auth header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Return mock user data
  res.json({
    id: 'mock_user_id',
    name: 'Test User',
    email: 'test@example.com',
  });
});

// List mock services/integrations
app.get('/mock-pipedream/api/services', (req, res) => {
  res.json({
    services: [
      { id: 'google_sheets', name: 'Google Sheets', auth_type: 'oauth2' },
      { id: 'slack', name: 'Slack', auth_type: 'oauth2' },
      { id: 'github', name: 'GitHub', auth_type: 'oauth2' },
      { id: 'airtable', name: 'Airtable', auth_type: 'api_key' },
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`Mock OAuth server running at http://localhost:${port}`);
  console.log(`Mock OAuth authorize URL: http://localhost:${port}/mock-oauth/authorize`);
});

// Export for programmatic use in tests
module.exports = app; 
// Import the pipedream client with conditional logic to prevent crashes
let pd = null;
try {
  // Dynamically import the pipedream client
  const pdModule = await import('./pipedream-client.js').catch(() => null);
  pd = pdModule?.default || null;

  // Import the createUserConnectToken function as well
  if (pdModule && typeof pdModule.createUserConnectToken === 'function') {
    console.log('Found createUserConnectToken function');
  } else {
    console.warn('createUserConnectToken function not found in pipedream-client.js');
  }
} catch (error) {
  console.warn('Pipedream client not available:', error.message);
}

/**
 * Creates a connect token for the specified user
 * @param {Object} params - Function parameters
 * @param {string} params.external_user_id - The ID of the user in your system
 * @returns {Promise<{token: string, expires_at: string}>} The generated token and expiration
 */
export async function serverConnectTokenCreate({ external_user_id }) {
  try {
    // Check if the pipedream client is available
    if (!pd) {
      console.warn('Pipedream client not initialized, returning mock token');
      // Return a mock token for development/testing
      return {
        token: `mock_token_${external_user_id}_${Date.now()}`,
        expires_at: new Date(Date.now() + 300000).toISOString() // 5 minutes from now
      };
    }

    // Create a connect token using the backend client
    const { data } = await pd.connect.tokens.create({
      external_user_id,
      // Optional: set custom expiration (default is 5 minutes)
      // expires_in: 300
    });
    
    return {
      token: data.token,
      expires_at: data.expires_at
    };
  } catch (error) {
    console.error('Error creating connect token:', error);
    // Return a mock token as fallback in case of error
    return {
      token: `error_token_${external_user_id}_${Date.now()}`,
      expires_at: new Date(Date.now() + 300000).toISOString(),
      error: error.message
    };
  }
}

// Re-export the createUserConnectToken function from pipedream-client.js
export { createUserConnectToken } from './pipedream-client.js'; 
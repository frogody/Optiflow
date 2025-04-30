import pd from './pipedream-client';

/**
 * Creates a connect token for the specified user
 * @param {Object} params - Function parameters
 * @param {string} params.external_user_id - The ID of the user in your system
 * @returns {Promise<{token: string, expires_at: string}>} The generated token and expiration
 */
export async function serverConnectTokenCreate({ external_user_id }) {
  try {
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
    throw error;
  }
} 
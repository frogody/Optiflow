/**
 * Mock Pipedream client for development
 * This prevents errors when the real Pipedream client is not available
 */

const mockPipedreamClient = {
  connect: {
    tokens: {
      create: async ({ external_user_id }) => {
        console.log('Mock Pipedream: Creating token for user', external_user_id);
        return {
          data: {
            token: `mock_pd_token_${external_user_id}_${Date.now()}`,
            expires_at: new Date(Date.now() + 300000).toISOString() // 5 minutes from now
          }
        };
      }
    }
  }
};

/**
 * Creates a connect token for the specified user
 * @param {string} userId - The ID of the user in your system
 * @returns {Promise<{token: string, expires_at: string}>} The generated token and expiration
 */
export async function createUserConnectToken(userId) {
  try {
    // Use the mock client to create a token
    const response = await mockPipedreamClient.connect.tokens.create({
      external_user_id: userId
    });
    
    return {
      token: response.data.token,
      expires_at: response.data.expires_at
    };
  } catch (error) {
    console.error('Error creating connect token:', error);
    throw error;
  }
}

export default mockPipedreamClient; 
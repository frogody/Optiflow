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

export default mockPipedreamClient; 
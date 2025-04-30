/**
 * Script to create a Pipedream connect token using fetch API
 */

// Replace these variables with your actual values
const projectId = 'your-project-id';
const accessToken = 'your-access-token';
const externalUserId = 'your-external-user-id';

async function createConnectToken() {
  try {
    const response = await fetch(`https://api.pipedream.com/v1/connect/${projectId}/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PD-Environment': 'development',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        external_user_id: externalUserId
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Connect token created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating connect token:', error);
    throw error;
  }
}

// Execute the function
createConnectToken();

// Example of how to use this in an async context:
/*
async function main() {
  const tokenData = await createConnectToken();
  console.log('Token:', tokenData.token);
  console.log('Expires at:', tokenData.expires_at);
}
main();
*/ 
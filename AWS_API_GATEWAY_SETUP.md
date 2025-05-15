# AWS API Gateway Integration for Optiflow Voice Agent

This document explains how to set up and configure AWS API Gateway integration for the Optiflow Voice Agent.

## Prerequisites

1. An AWS account with permissions to create API Gateway resources
2. AWS CLI installed and configured (run `aws configure` if not set up)
3. Basic understanding of API Gateway concepts

## Setup Process

### 1. Automatic Setup (Recommended)

We've provided a script to streamline the AWS API Gateway setup process:

```bash
# Make the script executable if needed
chmod +x setup-aws-api-key.sh

# Run the setup script
./setup-aws-api-key.sh
```

The script will:
- Generate a new API key for your API Gateway
- Create a usage plan with appropriate limits
- Configure the environment variables for local and production use
- (Optional) Update Vercel environment variables

### 2. Manual Setup

If you prefer to set up the AWS API Gateway integration manually:

1. **Create an API Key in AWS API Gateway**:
   - Go to the AWS Console > API Gateway > API Keys
   - Create a new API key
   - Note the API key value

2. **Create a Usage Plan**:
   - Go to Usage Plans in API Gateway
   - Create a new usage plan with appropriate throttling and quota limits
   - Associate your API with the usage plan
   - Add your API key to the usage plan

3. **Configure Environment Variables**:
   - Add these variables to your `.env.local` and `.env.production` files:
     ```
     NEXT_PUBLIC_AWS_API_KEY="your-api-key-here"
     NEXT_PUBLIC_AWS_API_ENDPOINT="your-api-id.execute-api.us-east-2.amazonaws.com"
     ```
   - For Vercel deployment, add these environment variables in the Vercel dashboard

## AWS API Gateway Configuration

The API Gateway needs to be configured to require API keys for endpoints. For each method in your API:

1. Go to Method Request
2. Set "API Key Required" to "true"
3. Deploy the API to apply changes

## Troubleshooting

### 403 Forbidden Errors

If you're still receiving 403 Forbidden errors:

1. **Check API Key Configuration**:
   - Verify the API key is correctly associated with your usage plan
   - Ensure the API key is enabled
   - Check the API key is included in requests as the `x-api-key` header

2. **Check API Gateway Settings**:
   - Confirm "API Key Required" is set to true for your methods
   - Ensure CORS settings include the `x-api-key` header in `Access-Control-Allow-Headers`

3. **Check Console for Errors**:
   - Look for messages about missing or invalid API keys
   - Check for warnings about permission issues

### Testing API Key

To test if your API key is working correctly:

```bash
curl -H "x-api-key: YOUR_API_KEY" https://your-api-id.execute-api.us-east-2.amazonaws.com/stage/your-endpoint
```

## Security Considerations

- Never commit API keys to version control
- Consider using AWS IAM roles for production environments instead of API keys
- Implement proper throttling in your usage plan to prevent abuse
- Review CloudTrail logs periodically for suspicious activity

## Additional Resources

- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)
- [Managing API Keys](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-key-source.html)
- [Usage Plans and API Keys](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html) 
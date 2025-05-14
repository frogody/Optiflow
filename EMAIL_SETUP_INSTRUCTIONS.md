# Email Setup Instructions for Beta Registration System

## Issue Identified: Missing Email Workflow Configuration

The beta request approval system is working correctly up to the point of approving requests, but users are not receiving emails with their invite codes because the Pipedream workflow for sending emails is not configured.

## Steps to Fix the Email Sending Functionality

### 1. Set Up a Pipedream Email Workflow

1. Log in to your Pipedream account at https://pipedream.com
2. Create a new workflow
3. Configure the workflow to send emails
   - The workflow should expect input with: `to`, `subject`, `body`, `isHtml`, etc.
   - Use an Email or SMTP action step that can send emails
4. Deploy the workflow
5. Copy the workflow ID (usually starts with "p_" or similar)

### 2. Add the Workflow ID to Environment Variables

Add the following environment variable to your deployment:

```
PIPEDREAM_WORKFLOW_SEND_EMAIL=your-pipedream-workflow-id
```

#### For Local Development:

Create or edit the `.env.local` file in your project root and add:

```
PIPEDREAM_WORKFLOW_SEND_EMAIL=your-pipedream-workflow-id
```

#### For Vercel Deployment:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add a new variable named `PIPEDREAM_WORKFLOW_SEND_EMAIL` with your workflow ID
4. Save the changes and redeploy your application

### 3. Verify Email Functionality

After setting up the environment variable:

1. Try approving a new beta request
2. Check your Pipedream dashboard to verify the workflow was triggered
3. Confirm the email was sent to the user

## Additional Configuration Notes

- The email sending functionality uses the Pipedream integration defined in `src/lib/pipedream/server.ts`
- The email content is defined in `src/app/api/beta-access/approve/route.ts`
- Make sure your Pipedream workflow can handle HTML emails as the approval email contains formatted HTML

If you need to modify the email template, update the HTML content in `src/app/api/beta-access/approve/route.ts`. 
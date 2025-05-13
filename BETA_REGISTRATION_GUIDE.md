# Beta Registration System Guide

## Overview

The Beta Registration System provides a complete workflow for managing access to your application's beta program:

1. Users request beta access through a multi-step registration form
2. Administrators review and approve/reject applications
3. Approved users receive invite codes via email
4. Users register with invite codes to gain access

## Setup Instructions

### 1. Database Migration

The system requires the `BetaAccessRequest` model in your database. The migration has already been applied, but if you need to run it manually:

```bash
npx prisma migrate dev --name add_beta_access_requests
```

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```
# Beta Access System
ADMIN_EMAIL=admin@isyncso.com
SEND_REJECTION_EMAILS=false

# Email Service (if using Pipedream)
PIPEDREAM_WORKFLOW_SEND_EMAIL=your-pipedream-workflow-id
```

### 3. Testing the System

#### 3.1. Request Beta Access

1. Navigate to `/beta-registration`
2. Fill out the multi-step form with user and company information
3. Submit the application

#### 3.2. Administrative Review

1. Log in as an admin user (must have `role: "admin"` in the database)
2. Navigate to `/admin/beta-requests`
3. View pending requests in the dashboard
4. Click on a request to view full details
5. Add any notes and approve or reject the request
   - Approving generates a unique invite code
   - Approving sends an email with the invite code if email is configured

#### 3.3. User Registration

1. Navigate to `/signup`
2. Enter the invite code received via email
3. Verify the invite code (it will pre-fill user information if valid)
4. Complete the signup form

## Architecture Details

### API Endpoints

- `POST /api/beta-access/request`: Submit a beta access request
- `GET /api/beta-access/list`: List all beta access requests (admin only)
- `POST /api/beta-access/approve`: Approve a request and generate invite code
- `POST /api/beta-access/reject`: Reject a request
- `POST /api/beta-access/verify-invite`: Verify an invite code

### Email Configuration

The system uses the Pipedream integration for sending emails. In development, emails are logged to the console instead of being sent, unless configured otherwise.

You can control email behavior with these environment variables:

- `DISABLE_EMAILS=true` will prevent actual email sending in development
- `DEFAULT_EMAIL_SENDER` sets the default sender address
- `PIPEDREAM_WORKFLOW_SEND_EMAIL` specifies the Pipedream workflow ID for sending emails

## Troubleshooting

### Common Issues

1. **Email Sending Fails**: Check that Pipedream is properly configured and the workflow ID is set.

2. **Invite Code Verification Fails**: Ensure the code was not already used and that the request status is "APPROVED".

3. **Admin Dashboard Not Accessible**: Verify the user has the admin role in the database. You can update a user's role with:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

4. **Database Migration Issues**: If you encounter database migration issues, try:
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

## Adding to Production

When deploying to production:

1. Set `SEND_REJECTION_EMAILS=true` if you want to send rejection emails
2. Configure a proper email service with Pipedream or another provider
3. Set `ADMIN_EMAIL` to your actual admin notification email
4. Ensure database migrations are applied to your production database

## Security Considerations

- Invite codes are unique and can only be used once
- Admin routes are protected by session-based authorization
- Emails contain only the necessary information, not full application details 
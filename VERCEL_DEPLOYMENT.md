# Deploying to Vercel

This guide will help you deploy your Optiflow application to Vercel.

## Prerequisites

1. [GitHub](https://github.com/) account
2. [Vercel](https://vercel.com/) account
3. Your project pushed to a GitHub repository

## Deployment Steps

### 1. Push your code to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/optiflow.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Select the repository you just pushed to

### 3. Configure Project Settings

1. **Project Name**: Use default or customize as desired
2. **Framework Preset**: Next.js (should be auto-detected)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `.next` (default)

### 4. Environment Variables

Add the following environment variables in the Vercel project settings:

```
# Required environment variables
NODE_ENV=production
PIPEDREAM_CLIENT_ID=your_pipedream_client_id
PIPEDREAM_CLIENT_SECRET=your_pipedream_client_secret
PIPEDREAM_PROJECT_ID=your_pipedream_project_id
PIPEDREAM_ENVIRONMENT=production
```

Add any other environment variables from your `.env.example` file that your application requires.

### 5. Deploy

Click "Deploy" and wait for the deployment to complete.

### 6. Custom Domain (Optional)

1. In your project in the Vercel dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the verification steps

## Troubleshooting

### Build Failures

1. Check the build logs in Vercel for specific errors
2. Ensure all required environment variables are set
3. Verify your project builds locally with `npm run build`

### Runtime Errors

1. Check the Function Logs in Vercel's dashboard
2. Use Vercel's "Development" mode for real-time debugging

## Continuous Deployment

Vercel automatically deploys when you push changes to your GitHub repository. You can configure deployment settings in the Vercel dashboard under "Settings" > "Git".

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/solutions/nextjs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables) 
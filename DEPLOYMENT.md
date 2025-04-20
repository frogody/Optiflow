# Deployment Configuration

## Project Details
- **Team:** ISYNCSO (Pro Trial)
- **Project Name:** optiflow
- **Production Domain:** app.isyncso.com
- **Vercel Project URL:** https://vercel.com/isyncso/optiflow

## Deployment Process
1. Ensure you're in the correct Vercel scope and project:
   ```bash
   vercel link --project optiflow --scope isyncso --yes
   ```

2. Deploy to production:
   ```bash
   vercel deploy --prod
   ```

## Domain Configuration
- Primary Domain: app.isyncso.com
- Additional Domains:
  - optiflow-pink.vercel.app
  - +2 other aliases

## Important Notes
- Always deploy to the `optiflow` project under the ISYNCSO team
- Do NOT deploy to other projects like:
  - `optiflow-git11rvn6-isyncso`
  - Any other similarly named projects
- The project should be accessible at https://app.isyncso.com after deployment

## Environment Variables
Required environment variables for the project:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL`
- Other environment-specific variables

## Deployment Verification
After deployment, verify:
1. The application is accessible at app.isyncso.com
2. Authentication is working (login/signup buttons visible)
3. Session handling is functioning
4. All API endpoints are responding correctly

## Troubleshooting
If you see deployments going to wrong URLs like:
- optiflow-git11rvn6-isyncso-*.vercel.app
- optiflow-*-isyncso.vercel.app

This indicates you're deploying to the wrong project. Use the commands in the "Deployment Process" section to link to the correct project. 
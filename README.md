# Optiflow - API and Workflow Automation Platform

Optiflow is a modern platform for connecting and automating APIs and workflows with a focus on simplicity and powerful integration capabilities.

## Features

- User authentication and session management
- API connectivity with popular services (Clay, HubSpot, n8n, Gmail)
- Workflow creation and management
- Dashboard for monitoring connections and workflows
- Modern, responsive UI with dark mode
- Create custom workflows with drag and drop interface
- Connect with popular services via OAuth
- Execute workflows automatically or manually
- AI-powered workflow recommendations
- Voice-activated assistant using LiveKit for hands-free operation
- Multi-tenant data layer with personal and organization knowledge bases
- Accessibility features with ARIA support

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **State Management**: Zustand
- **Authentication**: Custom implementation with bcrypt and cookies
- **API Integration**: Pipedream SDK
- **Voice Assistant**: LiveKit, ElevenLabs
- **Database**: PostgreSQL with Prisma ORM
- **Monitoring**: Pino logging, Sentry error tracking
- **AI**: Claude (Anthropic) for natural language understanding
- **Styling**: TailwindCSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Pipedream account for integration capabilities

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/optiflow.git
   cd optiflow
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pipedream Integration Setup

Optiflow uses Pipedream for connecting to third-party services. Follow these steps to set up the integration:

1. Create a Pipedream account at [https://pipedream.com](https://pipedream.com)

2. Create a new project in the Pipedream dashboard

3. Set up OAuth2 clients:
   - Go to **Settings** > **OAuth** > **New OAuth App**
   - Create OAuth apps for each service you want to integrate (Slack, GitHub, etc.)
   - Note the OAuth client ID for each app

4. Create Connect token:
   - Go to **Settings** > **API** > **Create Token**
   - Give it a name like "Optiflow Integration"
   - Copy the token

5. Update your `.env.local` file with the Pipedream credentials:
   ```
   NEXT_PUBLIC_PIPEDREAM_CLIENT_ID=your_client_id_here
   PIPEDREAM_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_PIPEDREAM_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_PIPEDREAM_TOKEN=your_token_here
   NEXT_PUBLIC_PIPEDREAM_FRONTEND_HOST=pipedream.com
   ```

6. Configure a callback URL in your Pipedream OAuth settings:
   - For local development: `http://localhost:3000/api/oauth/callback`
   - For production: `https://your-domain.com/api/oauth/callback`

## Available Integrations

Optiflow supports connections to the following services through Pipedream:

- Slack
- Gmail
- GitHub
- Google Sheets
- Airtable
- Stripe
- And many more!

## Deployment

### Building for Production

```bash
npm run build
npm run start
```

### Deployment on Vercel

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy with default settings

### Deployment on Other Platforms

The application can be deployed to any platform that supports Node.js:

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

## Project Structure

```
optiflow/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries and authentication
│   ├── services/       # API services and integrations
│   └── types/          # TypeScript type definitions
├── .env.example        # Example environment variables
├── middleware.ts       # Next.js middleware for authentication
└── package.json        # Project dependencies and scripts
```

## Utility Scripts

Optiflow includes several utility scripts to help fix common issues:

### Fix Scripts

We provide several scripts for automating fixes and ensuring compatibility:

```bash
# Run all fixes at once
node fix_all.js

# Fix specific issues
node fix_safari.js         # Fix Safari compatibility issues
node fix_environment_vars.js # Fix environment variables
node fix_animations.js     # Optimize animations
```

For more details on these scripts, see [FIXES.md](FIXES.md).

## Authentication Flow

1. User registers or logs in
2. Session is stored in:
   - Zustand store for runtime
   - Cookie for persistent sessions
3. SessionInitializer component restores the user session
4. Protected routes are guarded by middleware

## API Integration

Optiflow uses Pipedream SDK to connect to external services. For each integration:

1. Configure connection in the Connections page
2. Authenticate with the external service
3. Use the connection in workflows

## Voice Assistant Setup

Optiflow features a powerful voice assistant that allows hands-free operation of the platform:

1. Set up LiveKit for real-time communication:
   - Create an account at [LiveKit Cloud](https://livekit.io)
   - Create a new project and obtain API key and secret
   - Update your `.env.local` with LiveKit credentials:
   ```
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   LIVEKIT_URL=wss://your-livekit-instance.livekit.cloud
   ```

2. Configure ElevenLabs for speech synthesis:
   - Create an account at [ElevenLabs](https://elevenlabs.io)
   - Generate an API key and select a voice
   - Update your `.env.local` with ElevenLabs credentials:
   ```
   ELEVENLABS_API_KEY=your_api_key
   ELEVENLABS_VOICE_ID=your_selected_voice_id
   ```

3. Voice agent deployment:
   - The voice agent server is automatically deployed with the main application
   - Configuration happens through environment variables

### Voice Commands

Users can interact with Optiflow using voice commands such as:

- "Go to dashboard"
- "Create new workflow"
- "Connect to Slack"
- "Show my recent workflows"
- "Send email to [contact]"

For a complete guide on voice routing conventions, see [Voice Routing Conventions](docs/VOICE_ROUTING_CONVENTION.md).

## Multi-Tenant Data Architecture

Optiflow uses a multi-tenant architecture that enforces data isolation between organizations:

- Row-level security via Prisma middleware
- Personal and team knowledge bases
- Organization-based permissions system

For more details, see [DATABASE.md](DATABASE.md).

## Development Workflow

### Quality Gates

Optiflow includes several quality gates to ensure code quality:

```bash
# Run lint checks
npm run lint

# Run voice routing validation
npm run voice-check

# Run bundle size analysis
npm run build:analyze

# Run all tests
npm run test
```

### CI Pipeline

Our GitHub Actions CI pipeline automatically runs the following checks:

1. Linting and type checking
2. Voice routing convention validation
3. Unit and integration tests
4. Bundle size analysis

## Monitoring and Observability

Optiflow includes built-in monitoring and observability features:

- Sentry integration for error tracking
- Pino logging with configurable log levels
- Performance metrics for voice interactions and workflows

Configure your monitoring in `.env.local`:
```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info # trace, debug, info, warn, error, or fatal
```

## License

[MIT](LICENSE)

## Credits

- Built by the Optiflow Team
- Icons and illustrations from various sources 
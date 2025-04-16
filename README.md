# Optiflow - API and Workflow Automation Platform

Optiflow is a modern platform for connecting and automating APIs and workflows with a focus on simplicity and powerful integration capabilities.

## Features

- User authentication and session management
- API connectivity with popular services (Clay, HubSpot, n8n, Gmail)
- Workflow creation and management
- Dashboard for monitoring connections and workflows
- Modern, responsive UI with dark mode

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **State Management**: Zustand
- **Authentication**: Custom implementation with bcrypt and cookies
- **API Integration**: Pipedream SDK
- **Styling**: TailwindCSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to Pipedream account (for API integrations)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/optiflow.git
   cd optiflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## License

[MIT](LICENSE)

## Credits

- Built by the Optiflow Team
- Icons and illustrations from various sources 
# FlowOrchestrator

FlowOrchestrator is a web application that enables users to design, visualize, and adjust workflows involving multiple applications connected via the Model Context Protocol (MCP). The application provides a natural language interface for workflow modifications and intelligent orchestration capabilities.

## Features

- Natural language interface for workflow modifications
- Visual workflow editor with advanced mode
- MCP integration for application communication
- Real-time workflow validation and updates
- Intelligent workflow orchestration

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flow-orchestrator.git
cd flow-orchestrator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
flow-orchestrator/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── services/         # Service implementations
│   │   └── mcp/         # MCP service
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
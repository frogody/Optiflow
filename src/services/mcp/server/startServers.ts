import { DataExporterServer } from './DataExporterServer';
import { DataProcessorServer } from './DataProcessorServer';
import { DataValidatorServer } from './DataValidatorServer';

async function startServers() {
  try {
    const servers = [
      new DataProcessorServer(),
      new DataValidatorServer(),
      new DataExporterServer(),
    ];

    for (const server of servers) {
      server.start();
    }

    console.log('All MCP servers started successfully');
  } catch (error) {
    console.error('Failed to start MCP servers:', error);
    process.exit(1);
  }
}

startServers();

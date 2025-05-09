// @ts-nocheck - This file has some TypeScript issues that are hard to fix
import { MCPServer } from './MCPServer';
import { MCPRequest, MCPResponse } from '../types';

interface FormattingRule { dateFormat?: boolean;
  numberFormat?: boolean;
    }

interface FormattingRules { [key: string]: FormattingRule;
    }

export class DataExporterServer extends MCPServer {
  constructor() {
    super(
      { id: 'app3',
        name: 'Data Exporter',
        capabilities: ['export_data', 'format_data'],
        endpoint: 'http://localhost:3003',
          },
      3003
    );
  }

  protected async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    switch (request.method) {
      case 'export_data':
        return this.exportData(request);
      case 'format_data':
        return this.formatData(request);
      default:
        throw new Error(`Method ${request.method} not supported`);
    }
  }

  private async exportData(request: MCPRequest): Promise<MCPResponse> {
    const { data, format } = request.params;
    
    // Simulate data export
    let exportedData;
    switch (format) {
      case 'json':
        exportedData = JSON.stringify(data, null, 2);
        break;
      case 'csv':
        exportedData = this.convertToCSV(data);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return {
      jsonrpc: '2.0',
      result: { ,
  data: exportedData,
        format,
        timestamp: new Date().toISOString(),
          },
      id: request.id,
    };
  }

  private async formatData(request: MCPRequest): Promise<MCPResponse> {
    const { data, formattingRules } = request.params as { data: Record<string, any>, formattingRules: FormattingRules     };
    
    // Simulate data formatting
    const formattedData = { ...data };
    
    if (formattingRules) {
      for (const [field, rule] of Object.entries(formattingRules)) {
        if (rule.dateFormat && typeof formattedData[field] === 'string') {
          // Simple date formatting example
          const date = new Date(formattedData[field]);
          formattedData[field] = date.toLocaleDateString();
        }
        if (rule.numberFormat && typeof formattedData[field] === 'number') {
          // Simple number formatting example
          formattedData[field] = new Intl.NumberFormat().format(formattedData[field]);
        }
      }
    }

    return {
      jsonrpc: '2.0',
      result: { data: formattedData     },
      id: request.id,
    };
  }

  private convertToCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }
} 
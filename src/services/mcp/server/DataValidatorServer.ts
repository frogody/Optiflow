import { MCPServer } from './MCPServer';
import { MCPRequest, MCPResponse } from '../types';

export class DataValidatorServer extends MCPServer {
  constructor() {
    super(
      {
        id: 'app2',
        name: 'Data Validator',
        capabilities: ['validate_data', 'clean_data'],
        endpoint: 'http://localhost:3002',
      },
      3002
    );
  }

  protected async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    switch (request.method) {
      case 'validate_data':
        return this.validateData(request);
      case 'clean_data':
        return this.cleanData(request);
      default:
        throw new Error(`Method ${request.method} not supported`);
    }
  }

  private async validateData(request: MCPRequest): Promise<MCPResponse> {
    const { data, rules } = request.params;
    
    // Simulate data validation
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Simple validation rules
    if (rules) {
      for (const [field, rule] of Object.entries(rules)) {
        if (rule.required && !data[field]) {
          validationResults.isValid = false;
          validationResults.errors.push({
            field,
            message: `${field} is required`,
          });
        }
      }
    }

    return {
      jsonrpc: '2.0',
      result: { validation: validationResults },
      id: request.id,
    };
  }

  private async cleanData(request: MCPRequest): Promise<MCPResponse> {
    const { data, cleaningRules } = request.params;
    
    // Simulate data cleaning
    const cleanedData = { ...data };
    
    if (cleaningRules) {
      for (const [field, rule] of Object.entries(cleaningRules)) {
        if (rule.trim && typeof cleanedData[field] === 'string') {
          cleanedData[field] = cleanedData[field].trim();
        }
        if (rule.lowercase && typeof cleanedData[field] === 'string') {
          cleanedData[field] = cleanedData[field].toLowerCase();
        }
      }
    }

    return {
      jsonrpc: '2.0',
      result: { data: cleanedData },
      id: request.id,
    };
  }
} 
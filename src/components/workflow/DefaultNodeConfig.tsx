// @ts-nocheck - This file has some TypeScript issues that are hard to fix
'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ExclamationCircleIcon, 
  DocumentTextIcon,
  EnvelopeIcon, 
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ServerIcon,
  CloudIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  UserIcon,
  TableCellsIcon,
  BeakerIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ChartBarIcon,
  FolderIcon,
  PaperAirplaneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Map of node types to icons for representation
const nodeTypeIcons: Record<string, any> = { 'extract-webpage': DocumentTextIcon,
  'send-email': EnvelopeIcon,
  'wait': ClockIcon,
  'api': ServerIcon,
  'process-data': AdjustmentsHorizontalIcon,
  'cloud-function': CloudIcon,
  'chatbot': ChatBubbleLeftRightIcon,
  'conditional': ArrowPathIcon,
  'contact': UserIcon,
  'database': TableCellsIcon,
  'transform': BeakerIcon,
  'code': CodeBracketIcon,
  'ml-model': CpuChipIcon,
  'analytics': ChartBarIcon,
  'file-manager': FolderIcon,
  'social-post': PaperAirplaneIcon,
  'scheduler': CalendarIcon,
  'default': AdjustmentsHorizontalIcon
    };

// Field type definitions
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'url' | 'select' | 'checkbox' | 'date' | 'time' | 'json' | 'code' | 'color';

export type FieldConfig = {
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  visibleWhen?: Record<string, any>;
};

// Map of node types to their field configurations
const nodeConfigs: Record<string, Record<string, FieldConfig>> = {
  'extract-webpage': {
    url: {
      type: 'url',
      label: 'URL',
      description: 'The webpage URL to extract data from',
      placeholder: 'https://example.com',
      required: true
    },
    selector: {
      type: 'text',
      label: 'CSS Selector',
      description: 'CSS selector to extract specific elements',
      placeholder: '.main-content'
    },
    includeImages: {
      type: 'checkbox',
      label: 'Include Images',
      description: 'Whether to include images in extraction'
    },
    maxDepth: {
      type: 'number',
      label: 'Max Depth',
      description: 'Maximum crawl depth for linked pages',
      defaultValue: 1
    },
    // Authentication
    authType: {
      type: 'select',
      label: 'Authentication Type',
      description: 'How to authenticate with the website',
      options: [
        { label: 'None', value: 'none'     },
        { label: 'Basic Auth', value: 'basic'     },
        { label: 'Cookie', value: 'cookie'     },
        { label: 'OAuth', value: 'oauth'     }
      ],
      defaultValue: 'none'
    },
    authConfig: {
      type: 'json',
      label: 'Authentication Configuration',
      description: 'Authentication configuration based on selected type',
      placeholder: '{ "username": "user", "password": "pass"    }',
      visibleWhen: { authType: ['basic', 'cookie', 'oauth']     }
    },
    // Browser Settings
    browserType: {
      type: 'select',
      label: 'Browser Type',
      description: 'Browser engine to use for rendering',
      options: [
        { label: 'Chrome', value: 'chrome'     },
        { label: 'Firefox', value: 'firefox'     },
        { label: 'Safari', value: 'safari'     }
      ],
      defaultValue: 'chrome'
    },
    headless: {
      type: 'checkbox',
      label: 'Headless Mode',
      description: 'Run browser in headless mode',
      defaultValue: true
    },
    viewport: {
      type: 'json',
      label: 'Viewport Settings',
      description: 'Browser viewport configuration',
      placeholder: '{ "width": 1920, "height": 1080    }',
      defaultValue: '{ "width": 1920, "height": 1080    }'
    },
    // JavaScript Settings
    waitForSelector: {
      type: 'text',
      label: 'Wait For Selector',
      description: 'CSS selector to wait for before extracting',
      placeholder: '.dynamic-content'
    },
    waitForTimeout: {
      type: 'number',
      label: 'Wait Timeout',
      description: 'Maximum time to wait for selector in milliseconds',
      defaultValue: 5000
    },
    executeScript: {
      type: 'textarea',
      label: 'Execute Script',
      description: 'JavaScript to execute before extraction',
      placeholder: 'document.querySelector(".cookie-banner").remove();'
    },
    // Rate Limiting
    rateLimit: {
      type: 'number',
      label: 'Rate Limit',
      description: 'Maximum requests per minute',
      defaultValue: 60
    },
    rateLimitStrategy: {
      type: 'select',
      label: 'Rate Limit Strategy',
      description: 'How to handle rate limiting',
      options: [
        { label: 'Fail Fast', value: 'fail'     },
        { label: 'Queue', value: 'queue'     },
        { label: 'Throttle', value: 'throttle'     }
      ],
      defaultValue: 'throttle'
    },
    // Proxy Settings
    useProxy: {
      type: 'checkbox',
      label: 'Use Proxy',
      description: 'Use a proxy for requests',
      defaultValue: false
    },
    proxyConfig: {
      type: 'json',
      label: 'Proxy Configuration',
      description: 'Proxy server configuration',
      placeholder: '{ "host": "proxy.isyncso.com", "port": 8080    }',
      visibleWhen: { useProxy: true     }
    },
    // Advanced Settings
    timeout: {
      type: 'number',
      label: 'Timeout',
      description: 'Request timeout in seconds',
      defaultValue: 30
    },
    retryCount: {
      type: 'number',
      label: 'Retry Count',
      description: 'Number of retries on failure',
      defaultValue: 3
    },
    retryDelay: {
      type: 'number',
      label: 'Retry Delay',
      description: 'Delay between retries in seconds',
      defaultValue: 1
    },
    // Content Processing
    extractText: {
      type: 'checkbox',
      label: 'Extract Text',
      description: 'Extract text content from elements',
      defaultValue: true
    },
    extractLinks: {
      type: 'checkbox',
      label: 'Extract Links',
      description: 'Extract links from elements',
      defaultValue: false
    },
    extractMetadata: {
      type: 'checkbox',
      label: 'Extract Metadata',
      description: 'Extract meta tags and other metadata',
      defaultValue: false
    },
    // Output Format
    outputFormat: {
      type: 'select',
      label: 'Output Format',
      description: 'Format of the extracted data',
      options: [
        { label: 'JSON', value: 'json'     },
        { label: 'HTML', value: 'html'     },
        { label: 'Text', value: 'text'     },
        { label: 'Markdown', value: 'markdown'     }
      ],
      defaultValue: 'json'
    }
  },
  'send-email': {
    provider: {
      type: 'select',
      label: 'Email Provider',
      description: 'Select your email provider',
      options: [
        { label: 'Gmail', value: 'gmail'     },
        { label: 'Outlook', value: 'outlook'     },
        { label: 'SMTP', value: 'smtp'     },
        { label: 'SendGrid', value: 'sendgrid'     },
        { label: 'Mailgun', value: 'mailgun'     }
      ],
      required: true
    },
    to: {
      type: 'email',
      label: 'To Email',
      description: 'Recipient email address',
      placeholder: 'recipient@example.com',
      required: true
    },
    subject: {
      type: 'text',
      label: 'Subject',
      description: 'Email subject line',
      placeholder: 'Important: Your notification'
    },
    body: {
      type: 'textarea',
      label: 'Body',
      description: 'Email body content',
      placeholder: 'Enter your email content here...'
    },
    attachments: {
      type: 'text',
      label: 'Attachments',
      description: 'Comma-separated file paths to attach',
      placeholder: '/path/to/file1.pdf, /path/to/file2.jpg'
    },
    sendAt: {
      type: 'date',
      label: 'Send At',
      description: 'Schedule email for later delivery'
    },
    // Provider-specific settings
    gmailSettings: {
      type: 'json',
      label: 'Gmail Settings',
      description: 'Gmail-specific settings (only shown when Gmail is selected)',
      placeholder: '{ "labels": ["Important"], "threadId": "optional-thread-id"    }',
      visibleWhen: { provider: 'gmail'     }
    },
    outlookSettings: {
      type: 'json',
      label: 'Outlook Settings',
      description: 'Outlook-specific settings (only shown when Outlook is selected)',
      placeholder: '{ "importance": "high", "categories": ["Work"]    }',
      visibleWhen: { provider: 'outlook'     }
    },
    smtpSettings: {
      type: 'json',
      label: 'SMTP Settings',
      description: 'SMTP server configuration (only shown when SMTP is selected)',
      placeholder: '{ "host": "smtp.isyncso.com", "port": 587, "secure": true    }',
      visibleWhen: { provider: 'smtp'     }
    }
  },
  'wait': {
    duration: {
      type: 'number',
      label: 'Duration',
      description: 'Wait duration in seconds',
      placeholder: '30',
      required: true
    },
    waitUntil: {
      type: 'time',
      label: 'Wait Until',
      description: 'Wait until specific time (optional)'
    },
    condition: {
      type: 'text',
      label: 'Condition',
      description: 'Wait until this condition is met',
      placeholder: '{{variable}} == "value"'
    }
  },
  'api': {
    url: {
      type: 'text',
      label: 'API URL',
      description: 'The URL of the API endpoint',
      placeholder: 'https://api.isyncso.com/data',
      required: true
    },
    method: {
      type: 'select',
      label: 'HTTP Method',
      description: 'The HTTP method to use',
      options: [
        { label: 'GET', value: 'GET'     },
        { label: 'POST', value: 'POST'     },
        { label: 'PUT', value: 'PUT'     },
        { label: 'PATCH', value: 'PATCH'     },
        { label: 'DELETE', value: 'DELETE'     },
        { label: 'HEAD', value: 'HEAD'     },
        { label: 'OPTIONS', value: 'OPTIONS'     }
      ],
      defaultValue: 'GET'
    },
    headers: {
      type: 'textarea',
      label: 'Headers',
      description: 'HTTP headers as JSON object',
      placeholder: '{ "Content-Type": "application/json", "Authorization": "Bearer token"    }'
    },
    body: {
      type: 'textarea',
      label: 'Request Body',
      description: 'Request body as JSON object',
      placeholder: '{ "key": "value"    }',
      visibleWhen: { method: ['POST', 'PUT', 'PATCH']     }
    },
    // Authentication
    authType: {
      type: 'select',
      label: 'Authentication Type',
      description: 'How to authenticate with the API',
      options: [
        { label: 'None', value: 'none'     },
        { label: 'Basic Auth', value: 'basic'     },
        { label: 'Bearer Token', value: 'bearer'     },
        { label: 'API Key', value: 'apiKey'     },
        { label: 'OAuth 2.0', value: 'oauth2'     },
        { label: 'AWS Signature', value: 'aws'     }
      ],
      defaultValue: 'none'
    },
    authConfig: {
      type: 'json',
      label: 'Authentication Configuration',
      description: 'Authentication configuration based on selected type',
      placeholder: '{ "username": "user", "password": "pass"    }',
      visibleWhen: { authType: ['basic', 'bearer', 'apiKey', 'oauth2', 'aws']     }
    },
    // Rate Limiting
    rateLimit: {
      type: 'number',
      label: 'Rate Limit',
      description: 'Maximum requests per minute',
      defaultValue: 60
    },
    rateLimitStrategy: {
      type: 'select',
      label: 'Rate Limit Strategy',
      description: 'How to handle rate limiting',
      options: [
        { label: 'Fail Fast', value: 'fail'     },
        { label: 'Queue', value: 'queue'     },
        { label: 'Throttle', value: 'throttle'     }
      ],
      defaultValue: 'throttle'
    },
    // Caching
    cacheEnabled: {
      type: 'checkbox',
      label: 'Enable Caching',
      description: 'Cache API responses',
      defaultValue: false
    },
    cacheTTL: {
      type: 'number',
      label: 'Cache TTL',
      description: 'Time to live for cached responses in seconds',
      defaultValue: 300,
      visibleWhen: { cacheEnabled: true     }
    },
    cacheStrategy: {
      type: 'select',
      label: 'Cache Strategy',
      description: 'How to handle caching',
      options: [
        { label: 'Memory', value: 'memory'     },
        { label: 'Redis', value: 'redis'     },
        { label: 'File System', value: 'filesystem'     }
      ],
      defaultValue: 'memory',
      visibleWhen: { cacheEnabled: true     }
    },
    // Response Handling
    responseFormat: {
      type: 'select',
      label: 'Response Format',
      description: 'Expected response format',
      options: [
        { label: 'JSON', value: 'json'     },
        { label: 'XML', value: 'xml'     },
        { label: 'Text', value: 'text'     },
        { label: 'Binary', value: 'binary'     }
      ],
      defaultValue: 'json'
    },
    responseTransform: {
      type: 'textarea',
      label: 'Response Transform',
      description: 'JavaScript code to transform the response',
      placeholder: 'return response.data.map(item => ({ id: item.id, name: item.name     }));'
    },
    // Error Handling
    retryCount: {
      type: 'number',
      label: 'Retry Count',
      description: 'Number of retries on failure',
      defaultValue: 3
    },
    retryDelay: {
      type: 'number',
      label: 'Retry Delay',
      description: 'Delay between retries in seconds',
      defaultValue: 1
    },
    errorHandler: {
      type: 'textarea',
      label: 'Error Handler',
      description: 'JavaScript code to handle errors',
      placeholder: 'if (error.response.status === 429) { /* handle rate limit */ }'
    },
    // Timeouts
    timeout: {
      type: 'number',
      label: 'Timeout',
      description: 'Request timeout in seconds',
      defaultValue: 30
    },
    // Proxy
    useProxy: {
      type: 'checkbox',
      label: 'Use Proxy',
      description: 'Use a proxy for the request',
      defaultValue: false
    },
    proxyConfig: {
      type: 'json',
      label: 'Proxy Configuration',
      description: 'Proxy server configuration',
      placeholder: '{ "host": "proxy.isyncso.com", "port": 8080    }',
      visibleWhen: { useProxy: true     }
    }
  },
  'process-data': {
    inputFormat: {
      type: 'select',
      label: 'Input Format',
      description: 'Format of the input data',
      options: [
        { label: 'JSON', value: 'json'     },
        { label: 'CSV', value: 'csv'     },
        { label: 'XML', value: 'xml'     },
        { label: 'Text', value: 'text'     },
        { label: 'YAML', value: 'yaml'     },
        { label: 'Binary', value: 'binary'     }
      ],
      defaultValue: 'json'
    },
    outputFormat: {
      type: 'select',
      label: 'Output Format',
      description: 'Format of the output data',
      options: [
        { label: 'JSON', value: 'json'     },
        { label: 'CSV', value: 'csv'     },
        { label: 'XML', value: 'xml'     },
        { label: 'Text', value: 'text'     },
        { label: 'YAML', value: 'yaml'     },
        { label: 'Binary', value: 'binary'     }
      ],
      defaultValue: 'json'
    },
    // Schema Validation
    validateSchema: {
      type: 'checkbox',
      label: 'Validate Schema',
      description: 'Validate input data against a schema',
      defaultValue: false
    },
    inputSchema: {
      type: 'textarea',
      label: 'Input Schema',
      description: 'JSON Schema for input validation',
      placeholder: '{"type": "object", "properties": {...}}',
      visibleWhen: { validateSchema: true     }
    },
    outputSchema: {
      type: 'textarea',
      label: 'Output Schema',
      description: 'JSON Schema for output validation',
      placeholder: '{"type": "object", "properties": {...}}',
      visibleWhen: { validateSchema: true     }
    },
    // Data Transformation
    transformationType: {
      type: 'select',
      label: 'Transformation Type',
      description: 'Type of transformation to apply',
      options: [
        { label: 'Mapping', value: 'mapping'     },
        { label: 'Filter', value: 'filter'     },
        { label: 'Aggregate', value: 'aggregate'     },
        { label: 'Custom', value: 'custom'     }
      ],
      defaultValue: 'mapping'
    },
    fieldMapping: {
      type: 'textarea',
      label: 'Field Mapping',
      description: 'Map input fields to output fields',
      placeholder: '{ "output.field1": "input.field1", "output.field2": "input.field2"    }',
      visibleWhen: { transformationType: 'mapping'     }
    },
    filterCondition: {
      type: 'text',
      label: 'Filter Condition',
      description: 'Filter data based on this condition',
      placeholder: 'data.age > 30 && data.status === "active"',
      visibleWhen: { transformationType: 'filter'     }
    },
    aggregationConfig: {
      type: 'json',
      label: 'Aggregation Config',
      description: 'Configuration for data aggregation',
      placeholder: '{"groupBy": ["category"], "aggregations": { "count": "count", "sum": "sum(amount)"    }}',
      visibleWhen: { transformationType: 'aggregate'     }
    },
    customTransform: {
      type: 'textarea',
      label: 'Custom Transform',
      description: 'Custom JavaScript transformation function',
      placeholder: 'return data.map(item => ({ ...item, processed: true     }));',
      visibleWhen: { transformationType: 'custom'     }
    },
    // Data Cleaning
    cleanData: {
      type: 'checkbox',
      label: 'Clean Data',
      description: 'Apply data cleaning operations',
      defaultValue: false
    },
    cleaningOperations: {
      type: 'json',
      label: 'Cleaning Operations',
      description: 'Data cleaning operations to apply',
      placeholder: '{ "removeNulls": true, "trimStrings": true, "normalizeCase": "lower"    }',
      visibleWhen: { cleanData: true     }
    },
    // Error Handling
    errorStrategy: {
      type: 'select',
      label: 'Error Strategy',
      description: 'How to handle transformation errors',
      options: [
        { label: 'Fail', value: 'fail'     },
        { label: 'Skip', value: 'skip'     },
        { label: 'Default Value', value: 'default'     }
      ],
      defaultValue: 'fail'
    },
    defaultValues: {
      type: 'json',
      label: 'Default Values',
      description: 'Default values for error cases',
      placeholder: '{ "field1": null, "field2": ""    }',
      visibleWhen: { errorStrategy: 'default'     }
    },
    // Performance
    batchSize: {
      type: 'number',
      label: 'Batch Size',
      description: 'Number of items to process in each batch',
      defaultValue: 1000
    },
    parallelProcessing: {
      type: 'checkbox',
      label: 'Parallel Processing',
      description: 'Enable parallel processing of data',
      defaultValue: false
    },
    maxWorkers: {
      type: 'number',
      label: 'Max Workers',
      description: 'Maximum number of parallel workers',
      defaultValue: 4,
      visibleWhen: { parallelProcessing: true     }
    }
  },
  'database': {
    provider: {
      type: 'select',
      label: 'Database Provider',
      description: 'Select your database provider',
      options: [
        { label: 'PostgreSQL', value: 'postgresql'     },
        { label: 'MySQL', value: 'mysql'     },
        { label: 'MongoDB', value: 'mongodb'     },
        { label: 'Redis', value: 'redis'     },
        { label: 'DynamoDB', value: 'dynamodb'     }
      ],
      required: true
    },
    connectionType: {
      type: 'select',
      label: 'Connection Type',
      description: 'How to connect to the database',
      options: [
        { label: 'Connection String', value: 'string'     },
        { label: 'Individual Parameters', value: 'params'     }
      ],
      defaultValue: 'string'
    },
    connectionString: {
      type: 'text',
      label: 'Connection String',
      description: 'Database connection string',
      placeholder: 'postgresql://user:password@db.isyncso.com:5432/dbname',
      visibleWhen: { connectionType: 'string'     }
    },
    host: {
      type: 'text',
      label: 'Host',
      description: 'Database host',
      placeholder: 'db.isyncso.com',
      visibleWhen: { connectionType: 'params'     }
    },
    port: {
      type: 'number',
      label: 'Port',
      description: 'Database port',
      placeholder: '5432',
      visibleWhen: { connectionType: 'params'     }
    },
    username: {
      type: 'text',
      label: 'Username',
      description: 'Database username',
      visibleWhen: { connectionType: 'params'     }
    },
    password: {
      type: 'text',
      label: 'Password',
      description: 'Database password',
      visibleWhen: { connectionType: 'params'     }
    },
    database: {
      type: 'text',
      label: 'Database Name',
      description: 'Name of the database',
      visibleWhen: { connectionType: 'params'     }
    },
    query: {
      type: 'textarea',
      label: 'Query',
      description: 'SQL query or database operation to execute',
      placeholder: 'SELECT * FROM users WHERE status = $1',
      required: true
    },
    parameters: {
      type: 'json',
      label: 'Query Parameters',
      description: 'Parameters for the query',
      placeholder: '["active"]'
    },
    postgresqlSettings: {
      type: 'json',
      label: 'PostgreSQL Settings',
      description: 'PostgreSQL-specific settings',
      placeholder: '{ "ssl": true, "poolSize": 10    }',
      visibleWhen: { provider: 'postgresql'     }
    },
    mongodbSettings: {
      type: 'json',
      label: 'MongoDB Settings',
      description: 'MongoDB-specific settings',
      placeholder: '{"collection": "users", "options": { "useNewUrlParser": true    }}',
      visibleWhen: { provider: 'mongodb'     }
    },
    redisSettings: {
      type: 'json',
      label: 'Redis Settings',
      description: 'Redis-specific settings',
      placeholder: '{ "db": 0, "keyPrefix": "app:"    }',
      visibleWhen: { provider: 'redis'     }
    },
    dynamodbSettings: {
      type: 'json',
      label: 'DynamoDB Settings',
      description: 'DynamoDB-specific settings',
      placeholder: '{ "region": "us-east-1", "tableName": "users"    }',
      visibleWhen: { provider: 'dynamodb'     }
    },
    timeout: {
      type: 'number',
      label: 'Timeout',
      description: 'Query timeout in seconds',
      defaultValue: 30
    },
    maxRows: {
      type: 'number',
      label: 'Max Rows',
      description: 'Maximum number of rows to return',
      defaultValue: 1000
    },
    retryCount: {
      type: 'number',
      label: 'Retry Count',
      description: 'Number of retries on failure',
      defaultValue: 3
    },
    transaction: {
      type: 'checkbox',
      label: 'Use Transaction',
      description: 'Whether to wrap the query in a transaction',
      defaultValue: false
    }
  },
  'file-manager': {
    operationType: {
      type: 'select',
      label: 'Operation Type',
      description: 'Type of file operation to perform',
      options: [
        { label: 'Read', value: 'read'     },
        { label: 'Write', value: 'write'     },
        { label: 'Copy', value: 'copy'     },
        { label: 'Move', value: 'move'     },
        { label: 'Delete', value: 'delete'     },
        { label: 'List', value: 'list'     },
        { label: 'Upload', value: 'upload'     },
        { label: 'Download', value: 'download'     }
      ],
      required: true
    },
    storageType: {
      type: 'select',
      label: 'Storage Type',
      description: 'Type of storage to use',
      options: [
        { label: 'Local', value: 'local'     },
        { label: 'S3', value: 's3'     },
        { label: 'Google Cloud Storage', value: 'gcs'     },
        { label: 'Azure Blob', value: 'azure'     },
        { label: 'Dropbox', value: 'dropbox'     },
        { label: 'Google Drive', value: 'gdrive'     }
      ],
      defaultValue: 'local'
    },
    filePath: {
      type: 'text',
      label: 'File Path',
      description: 'Path to the file',
      placeholder: '/path/to/file.txt',
      visibleWhen: { operationType: ['read', 'write', 'delete']     }
    },
    sourcePath: {
      type: 'text',
      label: 'Source Path',
      description: 'Path to the source file',
      placeholder: '/path/to/source.txt',
      visibleWhen: { operationType: ['copy', 'move']     }
    },
    destinationPath: {
      type: 'text',
      label: 'Destination Path',
      description: 'Path to the destination',
      placeholder: '/path/to/destination.txt',
      visibleWhen: { operationType: ['copy', 'move', 'write']     }
    },
    cloudConfig: {
      type: 'json',
      label: 'Cloud Config',
      description: 'Configuration for cloud storage',
      placeholder: '{ "bucket": "my-bucket", "region": "us-east-1"    }',
      visibleWhen: { storageType: ['s3', 'gcs', 'azure']     }
    },
    content: {
      type: 'textarea',
      label: 'Content',
      description: 'Content to write to the file',
      placeholder: 'File content here...',
      visibleWhen: { operationType: 'write'     }
    },
    encoding: {
      type: 'select',
      label: 'Encoding',
      description: 'File encoding to use',
      options: [
        { label: 'UTF-8', value: 'utf8'     },
        { label: 'ASCII', value: 'ascii'     },
        { label: 'Binary', value: 'binary'     }
      ],
      defaultValue: 'utf8',
      visibleWhen: { operationType: ['read', 'write']     }
    },
    compression: {
      type: 'select',
      label: 'Compression',
      description: 'Compression format to use',
      options: [
        { label: 'None', value: 'none'     },
        { label: 'Gzip', value: 'gzip'     },
        { label: 'Zip', value: 'zip'     }
      ],
      defaultValue: 'none'
    },
    uploadConfig: {
      type: 'json',
      label: 'Upload Config',
      description: 'Configuration for file upload',
      placeholder: '{ "maxSize": 10485760, "allowedTypes": ["image/*", "application/pdf"]    }',
      visibleWhen: { operationType: 'upload'     }
    },
    downloadConfig: {
      type: 'json',
      label: 'Download Config',
      description: 'Configuration for file download',
      placeholder: '{ "timeout": 30000, "retries": 3    }',
      visibleWhen: { operationType: 'download'     }
    },
    listConfig: {
      type: 'json',
      label: 'List Config',
      description: 'Configuration for listing files',
      placeholder: '{ "recursive": true, "filter": "*.txt"    }',
      visibleWhen: { operationType: 'list'     }
    },
    errorHandling: {
      type: 'select',
      label: 'Error Handling',
      description: 'How to handle errors',
      options: [
        { label: 'Throw', value: 'throw'     },
        { label: 'Ignore', value: 'ignore'     },
        { label: 'Log', value: 'log'     }
      ],
      defaultValue: 'throw'
    },
    permissions: {
      type: 'json',
      label: 'Permissions',
      description: 'File permissions to set',
      placeholder: '{ "mode": "0644", "owner": "user", "group": "group"    }',
      visibleWhen: { operationType: ['write', 'copy', 'move']     }
    }
  },
  'scheduler': {
    scheduleType: {
      type: 'select',
      label: 'Schedule Type',
      description: 'Type of schedule',
      options: [
        { label: 'One-time', value: 'once'     },
        { label: 'Recurring', value: 'recurring'     }
      ],
      required: true
    },
    startDate: {
      type: 'date',
      label: 'Start Date',
      description: 'When to start the schedule',
      required: true
    },
    cronExpression: {
      type: 'text',
      label: 'Cron Expression',
      description: 'Cron expression for recurring schedules',
      placeholder: '0 9 * * 1-5',
      visibleWhen: { scheduleType: 'recurring'     }
    },
    endDate: {
      type: 'date',
      label: 'End Date',
      description: 'When to end the schedule (optional)',
      visibleWhen: { scheduleType: 'recurring'     }
    },
    timezone: {
      type: 'text',
      label: 'Timezone',
      description: 'Timezone for the schedule',
      placeholder: 'America/New_York',
      defaultValue: 'UTC'
    }
  },
  'contact': {
    provider: {
      type: 'select',
      label: 'CRM Provider',
      description: 'Select your CRM provider',
      options: [
        { label: 'HubSpot', value: 'hubspot'     },
        { label: 'Salesforce', value: 'salesforce'     },
        { label: 'Clay', value: 'clay'     },
        { label: 'Pipedrive', value: 'pipedrive'     },
        { label: 'Zoho CRM', value: 'zoho'     }
      ],
      required: true
    },
    action: {
      type: 'select',
      label: 'Action',
      description: 'Action to perform on the contact',
      options: [
        { label: 'Create', value: 'create'     },
        { label: 'Update', value: 'update'     },
        { label: 'Enrich', value: 'enrich'     },
        { label: 'Delete', value: 'delete'     }
      ],
      required: true
    },
    contactDetails: {
      type: 'json',
      label: 'Contact Details',
      description: 'Contact information to create or update',
      placeholder: '{ "email": "contact@isyncso.com", "firstName": "John", "lastName": "Doe"    }',
      required: true
    },
    hubspotSettings: {
      type: 'json',
      label: 'HubSpot Settings',
      description: 'HubSpot-specific settings',
      placeholder: '{"properties": { "company": "Example Corp", "lifecyclestage": "lead"    }}',
      visibleWhen: { provider: 'hubspot'     }
    },
    salesforceSettings: {
      type: 'json',
      label: 'Salesforce Settings',
      description: 'Salesforce-specific settings',
      placeholder: '{ "objectType": "Lead", "recordType": "New Lead"    }',
      visibleWhen: { provider: 'salesforce'     }
    },
    claySettings: {
      type: 'json',
      label: 'Clay Settings',
      description: 'Clay-specific settings',
      placeholder: '{ "enrichmentFields": ["company", "title", "linkedin"]    }',
      visibleWhen: { provider: 'clay'     }
    }
  },
  'chatbot': {
    model: {
      type: 'select',
      label: 'AI Model',
      description: 'Select the AI model to use',
      options: [
        { label: 'GPT-4', value: 'gpt4'     },
        { label: 'GPT-3.5', value: 'gpt35'     },
        { label: 'Claude 2', value: 'claude2'     },
        { label: 'Claude 3', value: 'claude3'     }
      ],
      required: true,
      defaultValue: 'gpt4'
    },
    systemPrompt: {
      type: 'textarea',
      label: 'System Instructions',
      description: 'Instructions that define the chatbot\'s behavior and role',
      placeholder: 'You are a helpful assistant that...',
      required: true
    },
    temperature: {
      type: 'number',
      label: 'Temperature',
      description: 'Controls randomness in responses (0.0 to 1.0)',
      defaultValue: 0.7,
      required: true
    },
    maxTokens: {
      type: 'number',
      label: 'Max Response Length',
      description: 'Maximum number of tokens in the response',
      defaultValue: 1000,
      required: true
    },
    contextWindow: {
      type: 'number',
      label: 'Context Window',
      description: 'Number of previous messages to include as context',
      defaultValue: 10
    },
    responseFormat: {
      type: 'select',
      label: 'Response Format',
      description: 'Format of the chatbot\'s responses',
      options: [
        { label: 'Text', value: 'text'     },
        { label: 'JSON', value: 'json'     },
        { label: 'Markdown', value: 'markdown'     },
        { label: 'HTML', value: 'html'     }
      ],
      defaultValue: 'text'
    },
    apiKey: {
      type: 'text',
      label: 'API Key',
      description: 'API key for the selected model (if not using global settings)',
      placeholder: 'sk-...'
    },
    fallbackBehavior: {
      type: 'select',
      label: 'Fallback Behavior',
      description: 'What to do if primary model fails',
      options: [
        { label: 'Use Backup Model', value: 'backup'     },
        { label: 'Retry', value: 'retry'     },
        { label: 'Skip', value: 'skip'     },
        { label: 'Error', value: 'error'     }
      ],
      defaultValue: 'retry'
    },
    backupModel: {
      type: 'select',
      label: 'Backup Model',
      description: 'Model to use as fallback',
      options: [
        { label: 'GPT-3.5', value: 'gpt35'     },
        { label: 'Claude 2', value: 'claude2'     }
      ],
      visibleWhen: { fallbackBehavior: 'backup'     }
    },
    retryAttempts: {
      type: 'number',
      label: 'Retry Attempts',
      description: 'Number of retry attempts on failure',
      defaultValue: 3,
      visibleWhen: { fallbackBehavior: 'retry'     }
    },
    retryDelay: {
      type: 'number',
      label: 'Retry Delay',
      description: 'Delay between retries in seconds',
      defaultValue: 1,
      visibleWhen: { fallbackBehavior: 'retry'     }
    },
    rateLimit: {
      type: 'number',
      label: 'Rate Limit',
      description: 'Maximum requests per minute',
      defaultValue: 60
    },
    caching: {
      type: 'checkbox',
      label: 'Enable Response Caching',
      description: 'Cache identical requests to reduce API usage',
      defaultValue: false
    },
    cacheTTL: {
      type: 'number',
      label: 'Cache Duration',
      description: 'How long to cache responses (in seconds)',
      defaultValue: 3600,
      visibleWhen: { caching: true     }
    },
    preprocessor: {
      type: 'textarea',
      label: 'Input Preprocessor',
      description: 'JavaScript code to preprocess input before sending to model',
      placeholder: 'return input.trim();'
    },
    postprocessor: {
      type: 'textarea',
      label: 'Output Postprocessor',
      description: 'JavaScript code to process model output',
      placeholder: 'return output.replace(/\\n+/g, "\\n");'
    }
  }
};

// Get field configuration for a node type and field key
const getFieldConfig = (nodeType: string, fieldKey: string): FieldConfig => {
  // Default configuration to use if no specific config exists
  const defaultConfig: FieldConfig = {
    type: 'text',
    label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1).replace(/([A-Z])/g, ' $1'),
    description: `Configuration for ${fieldKey}`
  };
  
  // Check if the node type and field have a defined configuration
  const config = nodeConfigs[nodeType];
  if (!config) {
    console.warn(`No configuration found for node type ${nodeType}, using default config for ${fieldKey}`);
    return defaultConfig;
  }
  
  if (!config[fieldKey]) {
    console.warn(`No configuration found for field ${fieldKey} in node type ${nodeType}, using default config`);
    return defaultConfig;
  }
  
  return config[fieldKey];
};

// Format field name for display (camelCase to Title Case)
const formatFieldName = (name: string): string => {
  return name
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export interface DefaultNodeData {
  id: string;
  type: string;
  label?: string;
  description?: string;
  settings?: Record<string, any>;
  onConfigChange?: (updatedData: DefaultNodeData) => void;
}

interface DefaultNodeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: DefaultNodeData) => void;
  nodeData: DefaultNodeData;
}

export default function DefaultNodeConfig(props: DefaultNodeConfigProps) {
  const { isOpen, onClose, onSave, nodeData } = props;
  const [localNodeData, setLocalNodeData] = useState<DefaultNodeData>({
    ...nodeData,
    settings: nodeData.settings || {}
  });
  
  useEffect(() => {
    setLocalNodeData({
      ...nodeData,
      settings: nodeData.settings || {}
    });
  }, [nodeData]) // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleSettingChange = (key: string, value: any) => {
    setLocalNodeData(prev => ({
      ...prev,
      settings: { ...prev.settings,
        [key]: value
          }
    }));
  };
  
  const handleLabelChange = (label: string) => {
    setLocalNodeData(prev => ({
      ...prev,
      label
    }));
  };
  
  const handleDescriptionChange = (description: string) => {
    setLocalNodeData(prev => ({
      ...prev,
      description
    }));
  };
  
  const handleSave = () => {
    onSave(localNodeData);
    onClose();
  };

  // Get the appropriate icon for the node type
  const Icon = nodeTypeIcons[localNodeData.type] || nodeTypeIcons.default;
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-100 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 flex items-center gap-2 text-white"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  Configure {localNodeData.type} Node
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  {/* Basic node info */}
                  <div>
                    <label htmlFor="node-label" className="block text-sm font-medium text-gray-300">
                      Label
                    </label>
                    <input
                      type="text"
                      id="node-label"
                      className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                      value={localNodeData.label || ''}
                      onChange={(e) => handleLabelChange(e.target.value)}
                      placeholder="Node Label"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="node-description" className="block text-sm font-medium text-gray-300">
                      Description (optional)
                    </label>
                    <input
                      type="text"
                      id="node-description"
                      className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                      value={localNodeData.description || ''}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Brief description of what this node does"
                    />
                  </div>
                  
                  {/* Dynamic settings based on node type */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-300">Settings</h4>
                    
                    {Object.entries(localNodeData.settings || {}).map(([key, value]) => {
                      const fieldConfig = getFieldConfig(localNodeData.type, key);
                      
                      return (
                        <div key={key} className="space-y-1">
                          <label htmlFor={`setting-${key}`} className="block text-sm font-medium text-gray-300">
                            {fieldConfig.label}
                            {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
                          </label>
                          
                          {fieldConfig.description && (
                            <p className="text-xs text-gray-400">{fieldConfig.description}</p>
                          )}
                          
                          {fieldConfig.type === 'textarea' ? (
                            <textarea
                              id={`setting-${key}`}
                              className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                              value={value || ''}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                              placeholder={fieldConfig.placeholder}
                              rows={4}
                            />
                          ) : fieldConfig.type === 'select' ? (
                            <select
                              id={`setting-${key}`}
                              className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                              value={value || ''}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                            >
                              {fieldConfig.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : fieldConfig.type === 'checkbox' ? (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`setting-${key}`}
                                className="h-4 w-4 rounded text-primary focus:ring-primary"
                                checked={!!value}
                                onChange={(e) => handleSettingChange(key, e.target.checked)}
                              />
                              <label htmlFor={`setting-${key}`} className="ml-2 block text-sm text-gray-300">
                                {fieldConfig.label}
                              </label>
                            </div>
                          ) : (
                            <input
                              type={fieldConfig.type}
                              id={`setting-${key}`}
                              className="mt-1 block w-full rounded-md bg-dark-200 border-gray-700 text-white focus:border-primary focus:ring-primary sm:text-sm"
                              value={value || ''}
                              onChange={ (e) => handleSettingChange(key, e.target.type === 'number' ? Number(e.target.value) : e.target.value)    }
                              placeholder={fieldConfig.placeholder}
                            />
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Add new setting button */}
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-dashed border-gray-500 text-xs text-gray-300 rounded-md hover:bg-dark-200"
                      onClick={() => {
                        const newKey = prompt('Enter setting name:');
                        if (newKey && newKey.trim() !== '') {
                          handleSettingChange(newKey.trim(), '');
                        }
                      }}
                    >
                      + Add Custom Setting
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-dark-200 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-dark-300 focus:outline-none"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import readline from 'readline';
import { promisify } from 'util';

import * as dotenv from 'dotenv';

const execAsync = promisify(exec);

interface EnvVar {
  name: string;
  description: string;
  required: boolean;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  {
    name: 'DEEPGRAM_API_KEY',
    description: 'API key for Deepgram voice recognition service',
    required: true,
  },
  {
    name: 'PIPEDREAM_API_KEY',
    description: 'API key for Pipedream workflow integration',
    required: true,
  },
  {
    name: 'DATABASE_URL',
    description: 'PostgreSQL database connection string',
    required: true,
  },
  {
    name: 'OPENAI_API_KEY',
    description: 'API key for OpenAI services',
    required: true,
  },
  {
    name: 'ANTHROPIC_API_KEY',
    description: 'API key for Anthropic services',
    required: true,
  },
  {
    name: 'NEXT_PUBLIC_DEFAULT_LANGUAGE',
    description: 'Default language for voice recognition (default: en-US)',
    required: false,
  },
  {
    name: 'NEXT_PUBLIC_MAX_CONVERSATION_LENGTH',
    description: 'Maximum conversation history length (default: 10)',
    required: false,
  },
  {
    name: 'NEXT_PUBLIC_TIMEOUT_MS',
    description: 'Timeout for voice recognition in milliseconds (default: 30000)',
    required: false,
  },
];

async function checkLocalEnv(): Promise<string[]> {
  const envPath = path.join(process.cwd(), '.env.local');
  const missingVars: string[] = [];

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  for (const envVar of REQUIRED_ENV_VARS) {
    if (envVar.required && !process.env[envVar.name]) {
      missingVars.push(envVar.name);
    }
  }

  return missingVars;
}

async function checkVercelEnv(): Promise<string[]> {
  try {
    const { stdout } = await execAsync('vercel env ls');
    const vercelEnvVars = stdout.split('\n').map(line => line.trim());
    const missingVars: string[] = [];

    for (const envVar of REQUIRED_ENV_VARS) {
      if (envVar.required && !vercelEnvVars.includes(envVar.name)) {
        missingVars.push(envVar.name);
      }
    }

    return missingVars;
  } catch (error) {
    console.error('Error checking Vercel environment variables:', error);
    return [];
  }
}

async function addEnvToVercel(envVar: string): Promise<void> {
  try {
    await execAsync(`vercel env add ${envVar}`);
    console.log(`Added ${envVar} to Vercel environment variables`);
  } catch (error) {
    console.error(`Error adding ${envVar} to Vercel:`, error);
  }
}

async function main() {
  console.log('🔍 Checking environment variables...\n');

  // Check local environment
  const missingLocalVars = await checkLocalEnv();
  if (missingLocalVars.length > 0) {
    console.log('❌ Missing local environment variables:');
    missingLocalVars.forEach(varName => {
      const envVar = REQUIRED_ENV_VARS.find(v => v.name === varName);
      console.log(`  - ${varName}: ${envVar?.description}`);
    });
    console.log('\nTo add these variables to your local environment:');
    console.log('1. Create or edit .env.local file');
    console.log('2. Add the missing variables in the format:');
    console.log('   VARIABLE_NAME=your_value_here\n');
  } else {
    console.log('✅ All required local environment variables are set\n');
  }

  // Check Vercel environment
  const missingVercelVars = await checkVercelEnv();
  if (missingVercelVars.length > 0) {
    console.log('❌ Missing Vercel environment variables:');
    missingVercelVars.forEach(varName => {
      const envVar = REQUIRED_ENV_VARS.find(v => v.name === varName);
      console.log(`  - ${varName}: ${envVar?.description}`);
    });
    console.log('\nTo add these variables to Vercel:');
    console.log('1. Run the following commands:');
    missingVercelVars.forEach(varName => {
      console.log(`   vercel env add ${varName}`);
    });
    console.log('\n2. Enter the values when prompted');
  } else {
    console.log('✅ All required Vercel environment variables are set\n');
  }

  // Offer to add missing variables to Vercel
  if (missingVercelVars.length > 0) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('Would you like to add the missing variables to Vercel now? (y/n) ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() === 'y') {
      for (const varName of missingVercelVars) {
        await addEnvToVercel(varName);
      }
    }
  }
}

main().catch(console.error); 
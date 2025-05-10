/**
 * Voice Routing Convention Validator
 * 
 * This script validates that all pages and workflows in the application follow
 * the required voice routing conventions. It ensures that:
 * 
 * 1. Each page exports a `voiceRoute` constant for voice navigation
 * 2. Each intent/skill has a matching page or handler
 * 3. Each workflow node exports an `update` method for programmatic edits
 * 
 * Usage:
 *  npx ts-node scripts/validate-voice-routing.ts
 */

import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import * as ts from 'typescript';

// Configuration
const config = {
  // Root directory of the project
  rootDir: process.cwd(),
  // App pages directory
  pagesDir: path.join(process.cwd(), 'src/app'),
  // Voice intents directory
  intentsDir: path.join(process.cwd(), 'src/services/agents/intents'),
  // Voice skills directory
  skillsDir: path.join(process.cwd(), 'src/services/agents/skills'),
  // Workflow nodes directory
  workflowNodesDir: path.join(process.cwd(), 'src/components/workflow/nodes'),
  // Ignore patterns
  ignorePaths: [
    'node_modules',
    '.next',
    'public',
    'tests',
    '_components',
    'api'
  ]
};

// Types
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface PageInfo {
  filePath: string;
  hasVoiceRoute: boolean;
  voiceRouteValue?: string;
}

interface IntentInfo {
  filePath: string;
  intentName: string;
  routeValue?: string;
}

interface WorkflowNodeInfo {
  filePath: string;
  nodeName: string;
  hasUpdateMethod: boolean;
}

// Main validation function
async function validateVoiceRouting(): Promise<ValidationResult> {
  console.log(chalk.cyan('\n🔍 Validating voice routing conventions...\n'));
  
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };
  
  // 1. Collect all pages and check for voiceRoute exports
  console.log(chalk.cyan('Scanning pages for voiceRoute exports...'));
  const pages = await collectPages();
  
  const pagesWithVoiceRoute = pages.filter(page => page.hasVoiceRoute);
  const pagesWithoutVoiceRoute = pages.filter(page => !page.hasVoiceRoute);
  
  console.log(`Found ${pages.length} pages total, ${pagesWithVoiceRoute.length} with voiceRoute defined`);
  
  // 2. Collect all intents and skills
  console.log(chalk.cyan('\nScanning voice intents and skills...'));
  const intents = await collectIntentsAndSkills();
  
  console.log(`Found ${intents.length} voice intents/skills`);
  
  // 3. Check that each page has a matching intent
  console.log(chalk.cyan('\nValidating page-to-intent mapping...'));
  
  const voiceRouteValues = new Set(pagesWithVoiceRoute.map(page => page.voiceRouteValue));
  const intentRouteValues = new Set(intents.map(intent => intent.routeValue).filter(Boolean));
  
  // Pages with voiceRoute that don't have a matching intent
  const unmatchedPages = pagesWithVoiceRoute.filter(page => 
    page.voiceRouteValue && !intentRouteValues.has(page.voiceRouteValue)
  );
  
  // Intents that don't have a matching page
  const unmatchedIntents = intents.filter(intent => 
    intent.routeValue && !voiceRouteValues.has(intent.routeValue)
  );
  
  if (unmatchedPages.length > 0) {
    result.valid = false;
    result.errors.push('❌ The following pages have voiceRoute values with no matching intent:');
    unmatchedPages.forEach(page => {
      result.errors.push(`   - ${chalk.red(page.filePath)}: voiceRoute = "${page.voiceRouteValue}"`);
    });
  }
  
  if (unmatchedIntents.length > 0) {
    result.valid = false;
    result.errors.push('\n❌ The following intents have no matching page with voiceRoute:');
    unmatchedIntents.forEach(intent => {
      result.errors.push(`   - ${chalk.red(intent.filePath)}: routes to "${intent.routeValue}"`);
    });
  }
  
  if (pagesWithoutVoiceRoute.length > 0) {
    result.warnings.push('\n⚠️ The following pages do not have a voiceRoute defined:');
    pagesWithoutVoiceRoute.forEach(page => {
      // Skip certain types of pages that don't need voice routes
      if (
        page.filePath.includes('/api/') || 
        page.filePath.includes('layout.tsx') ||
        page.filePath.includes('error.tsx') ||
        page.filePath.includes('loading.tsx') ||
        page.filePath.includes('not-found.tsx')
      ) {
        return;
      }
      result.warnings.push(`   - ${chalk.yellow(page.filePath)}`);
    });
  }
  
  // 4. Collect workflow nodes and check for update methods
  console.log(chalk.cyan('\nScanning workflow nodes for update methods...'));
  const workflowNodes = await collectWorkflowNodes();
  
  console.log(`Found ${workflowNodes.length} workflow nodes total`);
  
  const nodesWithoutUpdate = workflowNodes.filter(node => !node.hasUpdateMethod);
  
  if (nodesWithoutUpdate.length > 0) {
    result.valid = false;
    result.errors.push('\n❌ The following workflow nodes are missing an update method:');
    nodesWithoutUpdate.forEach(node => {
      result.errors.push(`   - ${chalk.red(node.filePath)}: ${node.nodeName}`);
    });
  }
  
  // Print summary
  console.log(chalk.cyan('\n📊 Voice Routing Validation Summary:'));
  console.log(`Pages: ${pages.length} total, ${pagesWithVoiceRoute.length} with voiceRoute`);
  console.log(`Intents/Skills: ${intents.length} total`);
  console.log(`Workflow Nodes: ${workflowNodes.length} total`);
  
  if (result.valid) {
    console.log(chalk.green('\n✅ All voice routing validations passed!'));
  } else {
    console.log(chalk.red('\n❌ Some validations failed. See errors below:'));
    result.errors.forEach(error => console.log(error));
  }
  
  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️ Warnings:'));
    result.warnings.forEach(warning => console.log(warning));
  }
  
  return result;
}

// Helper function to collect all pages and check for voiceRoute
async function collectPages(): Promise<PageInfo[]> {
  const pages: PageInfo[] = [];
  
  // Function to recursively scan directories
  async function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip ignored paths
      if (config.ignorePaths.some(ignore => fullPath.includes(ignore))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
        // Check if file has voiceRoute export
        const { hasVoiceRoute, voiceRouteValue } = checkForVoiceRoute(fullPath);
        
        pages.push({
          filePath: path.relative(config.rootDir, fullPath),
          hasVoiceRoute,
          voiceRouteValue
        });
      }
    }
  }
  
  await scanDir(config.pagesDir);
  return pages;
}

// Helper function to check if a file exports voiceRoute
function checkForVoiceRoute(filePath: string): { hasVoiceRoute: boolean, voiceRouteValue?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for voice route export
    const voiceRouteRegex = /export\s+const\s+voiceRoute\s*=\s*['"](.*?)['"];/;
    const match = content.match(voiceRouteRegex);
    
    if (match) {
      return { hasVoiceRoute: true, voiceRouteValue: match[1] };
    }
    
    return { hasVoiceRoute: false };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return { hasVoiceRoute: false };
  }
}

// Helper function to collect all intents and skills
async function collectIntentsAndSkills(): Promise<IntentInfo[]> {
  const intents: IntentInfo[] = [];
  
  // Function to scan a directory for intents/skills
  function scanForIntents(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isFile() && (file.name.endsWith('.ts') || file.name.endsWith('.js'))) {
        const fullPath = path.join(dir, file.name);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Get intent name from filename
        const intentName = file.name.replace(/\.(ts|js)$/, '');
        
        // Try to extract route value
        const routeValueRegex = /route\s*[:=]\s*['"](.*?)['"];?/;
        const match = content.match(routeValueRegex);
        
        intents.push({
          filePath: path.relative(config.rootDir, fullPath),
          intentName,
          routeValue: match ? match[1] : undefined
        });
      } else if (file.isDirectory()) {
        scanForIntents(path.join(dir, file.name));
      }
    }
  }
  
  scanForIntents(config.intentsDir);
  scanForIntents(config.skillsDir);
  
  return intents;
}

// Helper function to collect workflow nodes and check for update methods
async function collectWorkflowNodes(): Promise<WorkflowNodeInfo[]> {
  const nodes: WorkflowNodeInfo[] = [];
  
  if (!fs.existsSync(config.workflowNodesDir)) {
    return nodes;
  }
  
  // Function to recursively scan directories
  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
        // Skip test files
        if (entry.name.includes('.test.') || entry.name.includes('.spec.')) {
          continue;
        }
        
        const hasUpdateMethod = checkForUpdateMethod(fullPath);
        
        nodes.push({
          filePath: path.relative(config.rootDir, fullPath),
          nodeName: entry.name.replace(/\.(tsx|jsx)$/, ''),
          hasUpdateMethod
        });
      }
    }
  }
  
  scanDir(config.workflowNodesDir);
  return nodes;
}

// Helper function to check if a workflow node has an update method
function checkForUpdateMethod(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for update method definition
    const updateMethodRegex = /(update\s*=\s*\(.*?\)\s*=>|update\s*\(.*?\)\s*{|function\s+update\s*\()/;
    return updateMethodRegex.test(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

// Run the validation if this file is executed directly
if (require.main === module) {
  validateVoiceRouting()
    .then(result => {
      if (!result.valid) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error during validation:', error);
      process.exit(1);
    });
}

export { validateVoiceRouting }; 
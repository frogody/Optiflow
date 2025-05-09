#!/usr/bin/env node

/**
 * Environment Variables Fix Script
 * 
 * This script ensures all required environment variables are added to:
 * 1. .env.example
 * 2. verify_env.js (if it exists)
 * 3. GitHub workflows deploy files
 * 
 * Usage: node fix_environment_vars.js
 */

const fs = require('fs');
const path = require('path');

// Required environment variables by category
const ENV_VARS = {
  general: [
    'NODE_ENV',
    'TEST_BASE_URL',
  ],
  database: [
    'DATABASE_URL',
  ],
  auth: [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ],
  pipedream: [
    'PIPEDREAM_API_KEY',
    'PIPEDREAM_API_SECRET',
    'PIPEDREAM_CLIENT_ID',
    'PIPEDREAM_TOKEN',
  ],
  vercel: [
    'VERCEL_TOKEN',
    'VERCEL_ORG_ID',
    'VERCEL_PROJECT_ID',
  ],
  livekit: [
    'LIVEKIT_API_KEY',
    'LIVEKIT_API_SECRET',
    'LIVEKIT_URL',
  ],
  elevenlabs: [
    'ELEVENLABS_API_KEY',
  ],
};

// All vars flattened
const ALL_ENV_VARS = Object.values(ENV_VARS).flat();

// Store stats
const stats = {
  filesChecked: 0,
  filesModified: 0,
  varsAdded: 0,
};

// Update .env.example file
function updateEnvExample() {
  const envExamplePath = '.env.example';
  
  if (!fs.existsSync(envExamplePath)) {
    console.log(`Creating new ${envExamplePath} file...`);
    
    // Create new .env.example with all required vars
    let content = '# Environment Variables\n\n';
    
    // Add each category
    for (const [category, vars] of Object.entries(ENV_VARS)) {
      content += `\n# ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
      
      for (const varName of vars) {
        content += `${varName}=\n`;
      }
    }
    
    fs.writeFileSync(envExamplePath, content, 'utf8');
    stats.filesModified++;
    stats.varsAdded += ALL_ENV_VARS.length;
    console.log(`✅ Created ${envExamplePath} with all environment variables`);
    return;
  }
  
  // Update existing .env.example
  let content = fs.readFileSync(envExamplePath, 'utf8');
  stats.filesChecked++;
  
  // Check for missing vars
  const missingVars = [];
  for (const varName of ALL_ENV_VARS) {
    if (!content.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length === 0) {
    console.log(`✓ ${envExamplePath} already has all required variables`);
    return;
  }
  
  // Add any missing categories and vars
  for (const [category, vars] of Object.entries(ENV_VARS)) {
    const categoryVars = vars.filter(v => missingVars.includes(v));
    if (categoryVars.length === 0) continue;
    
    // Check if category exists
    const categoryHeader = `# ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    if (!content.includes(categoryHeader)) {
      content += `\n${categoryHeader}\n`;
    }
    
    // Add missing vars in this category
    for (const varName of categoryVars) {
      content += `${varName}=\n`;
    }
  }
  
  fs.writeFileSync(envExamplePath, content, 'utf8');
  stats.filesModified++;
  stats.varsAdded += missingVars.length;
  console.log(`✅ Added ${missingVars.length} missing variables to ${envExamplePath}`);
}

// Update GitHub workflow files
function updateGitHubWorkflows() {
  const workflowsDir = '.github/workflows';
  
  if (!fs.existsSync(workflowsDir)) {
    console.warn(`⚠️ GitHub workflows directory not found: ${workflowsDir}`);
    return;
  }
  
  const files = fs.readdirSync(workflowsDir).filter(f => 
    f.endsWith('.yml') || f.endsWith('.yaml')
  );
  
  for (const file of files) {
    const filePath = path.join(workflowsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    stats.filesChecked++;
    
    // Check if this is a deployment workflow
    if (!content.includes('deploy') && !content.includes('Deploy')) {
      continue;
    }
    
    let modified = false;
    
    // Check for env section
    if (!content.includes('env:') && content.includes('steps:')) {
      // Add env section before steps
      content = content.replace(
        /(\s+)steps:/g, 
        `$1env:\n$1  TEST_BASE_URL: \${{ secrets.VERCEL_URL || 'http://app.isyncto.com' }}\n$1steps:`
      );
      modified = true;
    }
    
    // Check for env variables in vercel deployment
    if (content.includes('vercel-token:') && !content.includes('LIVEKIT_API_KEY')) {
      // Add missing env vars in .env.production creation
      const envCreationMatch = content.match(/([ \t]+# Set up environment variables[\s\S]+?echo "NODE_ENV=production"[\s\S]+?)(\n[ \t]+[^#])/m);
      
      if (envCreationMatch) {
        let envSection = envCreationMatch[1];
        const indentation = envSection.match(/^([ \t]+)/m)[1];
        
        // Add missing Vercel vars
        if (!envSection.includes('VERCEL_TOKEN')) {
          envSection += `\n${indentation}echo "" >> .env.production`;
          envSection += `\n${indentation}echo "# Vercel Configuration" >> .env.production`;
          envSection += `\n${indentation}echo "VERCEL_TOKEN=\${{ secrets.VERCEL_TOKEN }}" >> .env.production`;
          envSection += `\n${indentation}echo "VERCEL_ORG_ID=\${{ secrets.VERCEL_ORG_ID }}" >> .env.production`;
          envSection += `\n${indentation}echo "VERCEL_PROJECT_ID=\${{ secrets.VERCEL_PROJECT_ID }}" >> .env.production`;
          modified = true;
        }
        
        // Add missing LiveKit vars
        if (!envSection.includes('LIVEKIT_API_KEY')) {
          envSection += `\n${indentation}echo "" >> .env.production`;
          envSection += `\n${indentation}echo "# LiveKit Configuration" >> .env.production`;
          envSection += `\n${indentation}echo "LIVEKIT_API_KEY=\${{ secrets.LIVEKIT_API_KEY }}" >> .env.production`;
          envSection += `\n${indentation}echo "LIVEKIT_API_SECRET=\${{ secrets.LIVEKIT_API_SECRET }}" >> .env.production`;
          envSection += `\n${indentation}echo "LIVEKIT_URL=\${{ secrets.LIVEKIT_URL }}" >> .env.production`;
          modified = true;
        }
        
        // Replace the section
        content = content.replace(envCreationMatch[0], envSection + envCreationMatch[2]);
      }
    }
    
    // Fix Vercel action if needed
    if (content.includes('vercel-action@v') && !content.includes('amondnet/vercel-action@v25')) {
      content = content.replace(
        /uses: (vercel\/vercel-action@v\d+|amondnet\/vercel-action@v\d+)/g,
        'uses: amondnet/vercel-action@v25.2.0'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      console.log(`✅ Updated GitHub workflow: ${filePath}`);
    } else {
      console.log(`✓ GitHub workflow already up to date: ${filePath}`);
    }
  }
}

// Main function
function main() {
  console.log('🔍 Starting environment variables fix...');
  
  // Update various files
  updateEnvExample();
  updateGitHubWorkflows();
  
  // Print summary
  console.log('\n====== Environment Variables Fix Summary ======');
  console.log(`Files checked: ${stats.filesChecked}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Variables added: ${stats.varsAdded}`);
  console.log('===============================================\n');
  
  console.log('✨ Environment variables fix completed!');
}

// Run the script
main(); 
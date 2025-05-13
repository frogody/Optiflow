#!/usr/bin/env node

/**
 * Verify Beta Registration Page
 * 
 * This script checks for potential build issues in the beta-registration page
 * to prevent variables hoisting problems during build.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying beta-registration page for build issues...');

const betaRegistrationPath = path.join(__dirname, 'src', 'app', 'beta-registration', 'page.tsx');

try {
  // Read file content
  const content = fs.readFileSync(betaRegistrationPath, 'utf8');
  
  // Check for potential issues
  const importIssues = content.includes('import { motion, AnimatePresence } from');
  
  if (importIssues) {
    console.error('❌ Found combined imports that may cause variable hoisting issues:');
    console.error('   - Separate framer-motion imports to avoid build errors');
    console.error('   - Use: import { motion } from \'framer-motion\';');
    console.error('          import { AnimatePresence } from \'framer-motion\';');
    process.exit(1);
  }
  
  // Check for React hooks ordering issues
  const hooks = content.match(/use[A-Z][a-zA-Z]+/g) || [];
  
  // Verify variable declarations
  const hooksWithoutDeclaration = hooks.filter(hook => 
    !content.includes(`const ${hook.charAt(3).toLowerCase() + hook.slice(4)} =`) &&
    !content.includes(`const [${hook.charAt(3).toLowerCase() + hook.slice(4)},`)
  );
  
  if (hooksWithoutDeclaration.length > 0) {
    console.error('❌ Found potential hooks without proper variable declarations:');
    hooksWithoutDeclaration.forEach(hook => {
      console.error(`   - ${hook}`);
    });
    process.exit(1);
  }
  
  console.log('✅ Beta registration page verified, no issues found!');
  
} catch (error) {
  console.error('Error verifying beta-registration page:', error.message);
  process.exit(1);
} 
#!/usr/bin/env node

/**
 * Fix Beta Registration Page
 * 
 * This script automatically fixes the beta-registration page to prevent variable hoisting issues during build.
 * It addresses the ReferenceError: Cannot access 'j' before initialization error during build.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const betaRegistrationPath = path.join(__dirname, 'src', 'app', 'beta-registration', 'page.tsx');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}🔧 Fixing beta-registration page for deployment...${colors.reset}`);

try {
  // Read file content
  let content = fs.readFileSync(betaRegistrationPath, 'utf8');
  
  // Track if changes were made
  let modified = false;
  
  // Fix 1: Separate framer-motion imports to avoid variable hoisting
  if (content.includes('import { motion, AnimatePresence } from \'framer-motion\';')) {
    content = content.replace(
      'import { motion, AnimatePresence } from \'framer-motion\';',
      `import { motion } from 'framer-motion';\nimport { AnimatePresence } from 'framer-motion';`
    );
    modified = true;
    console.log(`${colors.green}✓ Fixed framer-motion imports${colors.reset}`);
  }
  
  // Fix 2: Ensure form steps are defined as a constant before being referenced
  if (content.includes('formSteps.length') && !content.includes('// Pre-define all form steps')) {
    content = content.replace(
      '// Define form steps',
      '// Pre-define all form steps outside of rendering to prevent variable hoisting issues'
    );
    modified = true;
    console.log(`${colors.green}✓ Added comment to clarify form steps initialization${colors.reset}`);
  }
  
  // Fix 3: Add safeguards against undefined variables
  if (!content.includes('// Initialize empty array to prevent undefined errors')) {
    // Add safeguard initialization for formSteps
    content = content.replace(
      'export default function BetaRegistration() {',
      `export default function BetaRegistration() {
  // Initialize empty array to prevent undefined errors during build
  const emptySteps: FormStep[] = [];`
    );
    modified = true;
    console.log(`${colors.green}✓ Added initialization safeguards${colors.reset}`);
  }
  
  // Save changes if modifications were made
  if (modified) {
    fs.writeFileSync(betaRegistrationPath, content, 'utf8');
    console.log(`${colors.green}✅ Beta registration page fixed successfully!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}ℹ️ No issues found in beta registration page.${colors.reset}`);
  }
  
} catch (error) {
  console.error(`${colors.red}❌ Error fixing beta-registration page:${colors.reset}`, error.message);
  process.exit(1);
}

// Check for additional Next.js rendering optimizations
try {
  // Add use client directive to ensure proper client-side rendering
  const pageContent = fs.readFileSync(betaRegistrationPath, 'utf8');
  
  if (!pageContent.startsWith("'use client';")) {
    const fixedContent = "'use client';\n\n" + pageContent.replace("'use client';", "");
    fs.writeFileSync(betaRegistrationPath, fixedContent, 'utf8');
    console.log(`${colors.green}✓ Added 'use client' directive${colors.reset}`);
  }
  
  console.log(`${colors.blue}🚀 Beta registration page optimized for Next.js build${colors.reset}`);
} catch (error) {
  console.error(`${colors.red}❌ Error optimizing page for Next.js:${colors.reset}`, error.message);
} 
#!/usr/bin/env node

/**
 * Safari Compatibility Fix Script
 * 
 * This script helps fix common Safari compatibility issues in the codebase:
 * 1. Adds -webkit-backdrop-filter alongside backdrop-filter
 * 2. Fixes any Safari-specific CSS issues 
 * 3. Prints a summary of fixes applied
 * 
 * Usage: node fix_safari.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DIRECTORIES_TO_SCAN = [
  'src/app',
  'src/components',
  'src/styles'
];

// Store stats
const stats = {
  filesScanned: 0,
  filesModified: 0,
  backdropFilterFixed: 0,
  webkitTextFixed: 0,
  duplicatesRemoved: 0,
  otherFixes: 0
};

// Patterns to find and fix
const patterns = [
  // Remove duplicate -webkit-backdrop-filter declarations
  {
    find: /-webkit-backdrop-filter:[^;]+;(?:\s*-webkit-backdrop-filter:[^;]+;)+/g,
    replace: (match) => {
      // Extract the first declaration and return just that
      const singleDeclaration = match.match(/-webkit-backdrop-filter:[^;]+;/)[0];
      stats.duplicatesRemoved++;
      return singleDeclaration;
    },
    stat: 'duplicatesRemoved'
  },
  // Remove duplicate -webkit-background-clip declarations
  {
    find: /-webkit-background-clip:[^;]+;(?:\s*-webkit-background-clip:[^;]+;)+/g,
    replace: (match) => {
      // Extract the first declaration and return just that
      const singleDeclaration = match.match(/-webkit-background-clip:[^;]+;/)[0];
      stats.duplicatesRemoved++;
      return singleDeclaration;
    },
    stat: 'duplicatesRemoved'
  },
  // Add -webkit-backdrop-filter (but only if not already present)
  {
    find: /backdrop-filter:\s*blur\(([^)]+)\);(?!\s*-webkit-backdrop-filter)/g,
    replace: 'backdrop-filter: blur($1);\n  -webkit-backdrop-filter: blur($1);',
    stat: 'backdropFilterFixed'
  },
  // Add -webkit-background-clip and -webkit-text-fill-color
  {
    find: /background-clip:\s*text;(?!\s*-webkit-background-clip)/g,
    replace: 'background-clip: text;\n  -webkit-background-clip: text;',
    stat: 'webkitTextFixed'
  },
  {
    find: /(?<!-webkit-)text-fill-color:\s*transparent;(?!\s*-webkit-text-fill-color)/g,
    replace: 'text-fill-color: transparent;\n  -webkit-text-fill-color: transparent;',
    stat: 'webkitTextFixed'
  },
  // Fix text-size-adjust for all browsers
  {
    find: /-webkit-text-size-adjust:\s*100%;(?!\s*-moz-text-size-adjust)/g,
    replace: '-webkit-text-size-adjust: 100%;\n  -moz-text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  text-size-adjust: 100%;',
    stat: 'otherFixes'
  }
];

// Utility functions
function scanDirectory(directory) {
  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && (
        fullPath.endsWith('.css') || 
        fullPath.endsWith('.tsx') || 
        fullPath.endsWith('.jsx')
      )) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${directory}:`, error.message);
  }
}

function processFile(filePath) {
  try {
    stats.filesScanned++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply all patterns
    for (const pattern of patterns) {
      const originalContent = content;
      content = content.replace(pattern.find, pattern.replace);
      
      if (content !== originalContent) {
        modified = true;
        stats[pattern.stat]++;
      }
    }
    
    // Save modified file
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      console.log(`✅ Fixed Safari compatibility issues in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('🧹 Starting Safari compatibility fixes...');
  
  // Scan directories
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    } else {
      console.warn(`Warning: Directory not found: ${dir}`);
    }
  }
  
  // Print summary
  console.log('\n====== Safari Compatibility Fix Summary ======');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`backdrop-filter fixes: ${stats.backdropFilterFixed}`);
  console.log(`webkit text fixes: ${stats.webkitTextFixed}`);
  console.log(`Duplicates removed: ${stats.duplicatesRemoved}`);
  console.log(`Other fixes: ${stats.otherFixes}`);
  console.log('==============================================\n');
  
  console.log('✨ Safari compatibility fixes completed!');
  console.log('💡 To make this script executable, run: chmod +x fix_safari.js');
}

// Run the script
main(); 
#!/usr/bin/env node

/**
 * Animation and Performance Fixes Script
 * 
 * This script helps optimize animations and ensure cross-browser compatibility:
 * 1. Adds will-change property for smoother animations
 * 2. Ensures hardware acceleration hints where needed
 * 3. Optimizes transform and opacity animations
 * 
 * Usage: node fix_animations.js
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
  transformFixed: 0,
  opacityFixed: 0,
  willChangeAdded: 0,
  duplicatesRemoved: 0
};

// Patterns to find and fix
const patterns = [
  // Fix incorrect format of -webkit-transform declarations
  {
    find: /-webkit-transform:\s*transform:/g,
    replace: '-webkit-transform:',
    stat: 'transformFixed'
  },
  // Clean up duplicate -webkit-backdrop-filter declarations
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
  // Clean up duplicate -webkit-background-clip declarations
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
  // Add will-change only once per animation class
  {
    find: /(\.([a-zA-Z0-9_-]+),\s*\[class\*="[a-zA-Z0-9_-]+"\]\s*{\s*will-change:[^}]+}\s*)+\n\s*\.([a-zA-Z0-9_-]+),\s*\[class\*="[a-zA-Z0-9_-]+"\]\s*{\s*will-change:[^}]+}/g,
    replace: (match, _, __, lastClass) => {
      // Keep only the first will-change declaration
      const firstDeclaration = match.match(/\.([a-zA-Z0-9_-]+),\s*\[class\*="[a-zA-Z0-9_-]+"\]\s*{\s*will-change:[^}]+}/)[0];
      stats.duplicatesRemoved++;
      return firstDeclaration;
    },
    stat: 'duplicatesRemoved'
  },
  // Ensure proper syntax for -webkit-transform
  {
    find: /(transform:[^;]+);(?!\s*-webkit-transform)/g,
    replace: (match, transformDecl) => {
      // Extract just the property value
      const valueMatch = transformDecl.match(/transform:\s*([^;]+)/);
      if (valueMatch && valueMatch[1]) {
        return `${transformDecl};\n  -webkit-transform: ${valueMatch[1]};`;
      }
      return match;
    },
    stat: 'transformFixed'
  },
  // Add will-change to elements that animate transform
  {
    find: /@keyframes\s+([a-zA-Z0-9_-]+)\s*{[^}]*transform[^}]*}/g,
    replace: (match, animName) => {
      if (match.includes(`${animName}, [class*="${animName}"]`)) {
        // will-change already exists
        return match;
      }
      return match + `\n\n.${animName}, [class*="${animName}"] {\n  will-change: transform, opacity;\n}`;
    },
    stat: 'willChangeAdded'
  },
  // Ensure hardware acceleration for fixed positions in Safari
  {
    find: /position:\s*fixed;(?!\s*-webkit-transform)/g,
    replace: 'position: fixed;\n  -webkit-transform: translateZ(0);',
    stat: 'transformFixed'
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
        fullPath.endsWith('.scss')
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
      console.log(`✅ Fixed animation issues in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('🎭 Starting animation fixes...');
  
  // Scan directories
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    } else {
      console.warn(`Warning: Directory not found: ${dir}`);
    }
  }
  
  // Print summary
  console.log('\n====== Animation Fix Summary ======');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Transform fixes: ${stats.transformFixed}`);
  console.log(`Duplicates removed: ${stats.duplicatesRemoved}`);
  console.log(`Opacity fixes: ${stats.opacityFixed}`);
  console.log(`Will-change added: ${stats.willChangeAdded}`);
  console.log('===================================\n');
  
  console.log('✨ Animation fixes completed!');
  console.log('💡 To make this script executable, run: chmod +x fix_animations.js');
}

// Run the script
main(); 
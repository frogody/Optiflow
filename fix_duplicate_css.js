#!/usr/bin/env node

/**
 * CSS Duplicates Cleanup Script
 * 
 * This script cleans up duplicate CSS declarations and fixes syntax issues:
 * 1. Removes duplicate vendor prefixed properties
 * 2. Fixes incorrect transform syntax
 * 3. Removes duplicate class declarations
 * 
 * Usage: node fix_duplicate_css.js
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
  duplicatePropsRemoved: 0,
  transformSyntaxFixed: 0,
  willChangeDuplicatesRemoved: 0
};

// Patterns to find and fix
const patterns = [
  // Fix incorrect -webkit-transform format
  {
    find: /-webkit-transform:\s*transform:/g,
    replace: '-webkit-transform:',
    stat: 'transformSyntaxFixed'
  },
  // Remove duplicate -webkit-backdrop-filter declarations
  {
    find: /(-webkit-backdrop-filter:[^;]+;)(\s*-webkit-backdrop-filter:[^;]+;)+/g,
    replace: '$1',
    stat: 'duplicatePropsRemoved'
  },
  // Remove duplicate -webkit-background-clip declarations
  {
    find: /(-webkit-background-clip:[^;]+;)(\s*-webkit-background-clip:[^;]+;)+/g,
    replace: '$1',
    stat: 'duplicatePropsRemoved'
  },
  // Remove duplicate will-change classes
  {
    find: /(\.([a-zA-Z0-9_-]+),\s*\[class\*="[a-zA-Z0-9_-]+"\]\s*{\s*will-change:[^}]+}\s*)(\n\s*\.([a-zA-Z0-9_-]+),\s*\[class\*="[a-zA-Z0-9_-]+"\]\s*{\s*will-change:[^}]+}\s*)+/g,
    replace: '$1',
    stat: 'willChangeDuplicatesRemoved'
  },
  // Fix incorrect nested transform syntax like -webkit-transform: transform: translateY(0)
  {
    find: /-webkit-transform:\s*transform:\s*([^;]+);/g,
    replace: '-webkit-transform: $1;',
    stat: 'transformSyntaxFixed'
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
        fullPath.endsWith('.css')
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
      console.log(`✅ Fixed duplicate CSS issues in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('🧹 Starting CSS duplicates cleanup...');
  
  // Scan directories
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    } else {
      console.warn(`Warning: Directory not found: ${dir}`);
    }
  }
  
  // Print summary
  console.log('\n====== CSS Cleanup Summary ======');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Duplicate properties removed: ${stats.duplicatePropsRemoved}`);
  console.log(`Will-change duplicates removed: ${stats.willChangeDuplicatesRemoved}`);
  console.log(`Transform syntax fixed: ${stats.transformSyntaxFixed}`);
  console.log('=================================\n');
  
  console.log('✨ CSS cleanup completed!');
  console.log('💡 To make this script executable, run: chmod +x fix_duplicate_css.js');
}

// Run the script
main(); 
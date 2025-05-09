#!/usr/bin/env node

/**
 * TypeScript Syntax Fix Script
 * 
 * This script fixes common TypeScript syntax errors:
 * 1. Fixes missing semicolons
 * 2. Fixes missing arrow functions
 * 3. Fixes property assignment errors
 * 
 * Usage: node fix_typescript_syntax.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DIRECTORIES_TO_SCAN = [
  'src/app',
  'src/components',
  'src/hooks',
  'src/lib',
  'src/services',
  'src/types',
  'src/utils'
];

// Store stats
const stats = {
  filesScanned: 0,
  filesModified: 0,
  semicolonsAdded: 0,
  arrowFunctionsFixed: 0,
  propertyAssignmentsFixed: 0
};

// Common TypeScript syntax patterns to fix
const patterns = [
  // Fix missing semicolons after import statements
  {
    find: /import\s+{[^}]+}\s+from\s+['"][^'"]+['"]\n(?![\s;])/g,
    replace: (match) => {
      stats.semicolonsAdded++;
      return match.replace(/\n$/, ';\n');
    },
    stat: 'semicolonsAdded'
  },
  // Fix missing semicolons after export statements
  {
    find: /export\s+{[^}]+}\s+from\s+['"][^'"]+['"]\n(?![\s;])/g,
    replace: (match) => {
      stats.semicolonsAdded++;
      return match.replace(/\n$/, ';\n');
    },
    stat: 'semicolonsAdded'
  },
  // Fix missing semicolons after const/let declarations
  {
    find: /(const|let|var)\s+[a-zA-Z0-9_]+\s*=\s*[^;{]+\n(?![\s;])/g,
    replace: (match) => {
      stats.semicolonsAdded++;
      return match.replace(/\n$/, ';\n');
    },
    stat: 'semicolonsAdded'
  },
  // Fix missing commas in interface/type definitions
  {
    find: /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?)\n\s*(\w+):/g,
    replace: (match, prop1, type, prop2) => {
      stats.propertyAssignmentsFixed++;
      return `${prop1}: ${type},\n  ${prop2}:`;
    },
    stat: 'propertyAssignmentsFixed'
  },
  // Fix missing arrow in function expressions
  {
    find: /const\s+(\w+)\s*=\s*\(([^)]*)\)\s*{(?!\s*=>)/g,
    replace: (match, name, params) => {
      stats.arrowFunctionsFixed++;
      return `const ${name} = (${params}) => {`;
    },
    stat: 'arrowFunctionsFixed'
  },
  // Fix page components (Next.js) - make sure they're function components, not arrow functions
  {
    find: /export\s+default\s+function\s+(\w+Page)\s*\(\s*([^)]*)\s*\)\s*=>\s*{/g,
    replace: (match, name, params) => {
      stats.arrowFunctionsFixed++;
      return `export default function ${name}(${params}) {`;
    },
    stat: 'arrowFunctionsFixed'
  }
];

// Specific file fixes - these are targeted fixes for specific files with known syntax errors
const fileSpecificFixes = {
  // Fix specific files with known syntax issues
  'src/components/WorkflowCanvas.tsx': (content) => {
    // Fix the handlePaneClick function
    return content.replace(
      /const\s+handlePaneClick\s*=\s*\(\)\s*{/g,
      'const handlePaneClick = () => {'
    );
  },
  'src/app/workflows/page.tsx': (content) => {
    // Fix interface/type definitions
    return content.replace(
      /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?)\n\s*(\w+):/g,
      '$1: $2,\n  $3:'
    );
  },
  'src/app/profile/page.tsx': (content) => {
    // Fix the component definition
    return content.replace(
      /export\s+default\s+function\s+ProfilePage\(\)\s*=>\s*{/g,
      'export default function ProfilePage() {'
    );
  },
  'src/app/settings/page.tsx': (content) => {
    // Fix the component definition
    return content.replace(
      /export\s+default\s+function\s+SettingsPage\(\)\s*=>\s*{/g,
      'export default function SettingsPage() {'
    );
  },
  'src/components/workflow/DefaultNodeConfig.tsx': (content) => {
    // Fix object property assignments
    return content.replace(
      /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?|\{[^}]*\})\n\s*(\w+):/g,
      '$1: $2,\n  $3:'
    );
  },
  'src/components/workflow/PipedreamAppNode.tsx': (content) => {
    // Fix object property assignments
    return content.replace(
      /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?|\{[^}]*\})\n\s*(\w+):/g,
      '$1: $2,\n  $3:'
    );
  },
  'src/components/MCPConnectionsBrowser.tsx': (content) => {
    // Fix object property assignments
    return content.replace(
      /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?|\{[^}]*\})\n\s*(\w+):/g,
      '$1: $2,\n  $3:'
    );
  },
  'src/app/workflows/configure/[agentId]/page.tsx': (content) => {
    // Fix object property assignments
    return content.replace(
      /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?|\{[^}]*\})\n\s*(\w+):/g,
      '$1: $2,\n  $3:'
    );
  }
};

// Find React component files with the error "Property or signature expected"
function getComponentFilesWithSyntaxErrors() {
  const result = [];
  
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (!fs.existsSync(dir)) continue;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        result.push(...getComponentFilesInDirectory(fullPath));
      } else if (
        entry.isFile() && 
        (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) &&
        !fullPath.endsWith('.d.ts') // Skip declaration files
      ) {
        result.push(fullPath);
      }
    }
  }
  
  return result;
}

function getComponentFilesInDirectory(dir) {
  const result = [];
  
  if (!fs.existsSync(dir)) return result;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      result.push(...getComponentFilesInDirectory(fullPath));
    } else if (
      entry.isFile() && 
      (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) &&
      !fullPath.endsWith('.d.ts')
    ) {
      result.push(fullPath);
    }
  }
  
  return result;
}

// Function to fix interface and type definitions
function fixInterfaceDefinitions(content) {
  // Fix interface definitions
  let result = content.replace(
    /interface\s+(\w+)\s*{([^}]*)}/g,
    (match, name, properties) => {
      // Add missing commas between properties
      const fixedProps = properties.replace(
        /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?)\n\s*(\w+):/g,
        '$1: $2,\n  $3:'
      );
      return `interface ${name} {${fixedProps}}`;
    }
  );
  
  // Fix type definitions
  result = result.replace(
    /type\s+(\w+)\s*=\s*{([^}]*)}/g,
    (match, name, properties) => {
      // Add missing commas between properties
      const fixedProps = properties.replace(
        /(\w+):\s*(string|number|boolean|any|\w+(?:\[\])?)\n\s*(\w+):/g,
        '$1: $2,\n  $3:'
      );
      return `type ${name} = {${fixedProps}}`;
    }
  );
  
  return result;
}

// Function to fix property assignments in object literals
function fixPropertyAssignments(content) {
  return content.replace(
    /{\s*([^{}]+)\s*}/g,
    (match, properties) => {
      // Only process if it looks like an object literal with properties
      if (properties.includes(':')) {
        // Add missing commas between properties
        const fixedProps = properties.replace(
          /(\w+):\s*([^,\n]+)\n\s*(\w+):/g,
          '$1: $2,\n  $3:'
        );
        return `{ ${fixedProps} }`;
      }
      return match;
    }
  );
}

// Function to fix a file
function processFile(filePath) {
  try {
    stats.filesScanned++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply file-specific fixes if available
    if (fileSpecificFixes[filePath]) {
      const originalContent = content;
      content = fileSpecificFixes[filePath](content);
      
      if (content !== originalContent) {
        modified = true;
        stats.propertyAssignmentsFixed++;
      }
    }
    
    // Apply interface and type definition fixes
    const originalContent1 = content;
    content = fixInterfaceDefinitions(content);
    
    if (content !== originalContent1) {
      modified = true;
      stats.propertyAssignmentsFixed++;
    }
    
    // Apply property assignment fixes
    const originalContent2 = content;
    content = fixPropertyAssignments(content);
    
    if (content !== originalContent2) {
      modified = true;
      stats.propertyAssignmentsFixed++;
    }
    
    // Apply general patterns
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
      console.log(`✅ Fixed TypeScript syntax in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('🔧 Starting TypeScript syntax fixes...');
  
  // Get all component files
  const componentFiles = getComponentFilesWithSyntaxErrors();
  console.log(`Found ${componentFiles.length} TypeScript/React files to check`);
  
  // Process each file
  for (const filePath of componentFiles) {
    processFile(filePath);
  }
  
  // Print summary
  console.log('\n====== TypeScript Syntax Fix Summary ======');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Semicolons added: ${stats.semicolonsAdded}`);
  console.log(`Arrow functions fixed: ${stats.arrowFunctionsFixed}`);
  console.log(`Property assignments fixed: ${stats.propertyAssignmentsFixed}`);
  console.log('==========================================\n');
  
  console.log('✨ TypeScript syntax fixes completed!');
  console.log('💡 To make this script executable, run: chmod +x fix_typescript_syntax.js');
}

// Run the script
main(); 
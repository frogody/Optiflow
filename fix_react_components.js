#!/usr/bin/env node

/**
 * React Component Syntax Fix Script
 * 
 * This script fixes common React component syntax errors in Next.js pages:
 * 1. Fixes broken Page component declarations
 * 2. Fixes broken interface/type definitions in component files
 * 3. Fixes component props types
 * 
 * Usage: node fix_react_components.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PAGE_DIRECTORIES = [
  'src/app',
  'src/components'
];

// Store stats
const stats = {
  filesScanned: 0,
  filesModified: 0,
  pageComponentsFixed: 0,
  propsInterfacesFixed: 0,
  returnTypesFixed: 0
};

/**
 * Normalize component declaration format across different components.
 * This handles the common pattern of components with syntax errors.
 */
function fixComponentDeclaration(content, componentName) {
  // Fix Page component declarations
  let result = content;
  
  // Fix export default function ComponentName() => { ... pattern
  result = result.replace(
    new RegExp(`export\\s+default\\s+function\\s+${componentName}\\s*\\([^)]*\\)\\s*=>\\s*{`),
    `export default function ${componentName}() {`
  );
  
  // Fix Component declarations with incorrect function format
  result = result.replace(
    new RegExp(`export\\s+const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`),
    `export function ${componentName}() {`
  );
  
  // Fix missing return statement
  result = result.replace(
    new RegExp(`export\\s+default\\s+function\\s+${componentName}\\s*\\([^)]*\\)\\s*{\\s*$`),
    `export default function ${componentName}() {\n  return (`
  );
  
  // Fix missing closing bracket in component returns
  if (result.includes("return (") && !result.includes("return (") && !result.endsWith(");")) {
    // Add closing bracket at the end
    result = result + "\n  );\n}";
  }
  
  return result;
}

/**
 * Fix component props interface/type declarations
 */
function fixComponentPropsInterface(content) {
  let result = content;
  
  // Fix interface declarations
  result = result.replace(
    /interface\s+([A-Za-z0-9_]+Props)\s*{([^}]*)}/g,
    (match, interfaceName, properties) => {
      // Add missing commas between properties
      let fixedProps = properties;
      
      // Fix properties without commas
      fixedProps = fixedProps.replace(
        /(\w+):\s*(string|number|boolean|any|React\.ReactNode|\w+(?:\[\])?)\s*\n\s*(\w+):/g,
        '$1: $2,\n  $3:'
      );
      
      // Fix optional properties
      fixedProps = fixedProps.replace(
        /(\w+)\?:\s*(string|number|boolean|any|React\.ReactNode|\w+(?:\[\])?)\s*\n\s*(\w+):/g,
        '$1?: $2,\n  $3:'
      );
      
      return `interface ${interfaceName} {${fixedProps}}`;
    }
  );
  
  // Fix type declarations
  result = result.replace(
    /type\s+([A-Za-z0-9_]+Props)\s*=\s*{([^}]*)}/g,
    (match, typeName, properties) => {
      // Add missing commas between properties
      let fixedProps = properties;
      
      // Fix properties without commas
      fixedProps = fixedProps.replace(
        /(\w+):\s*(string|number|boolean|any|React\.ReactNode|\w+(?:\[\])?)\s*\n\s*(\w+):/g,
        '$1: $2,\n  $3:'
      );
      
      // Fix optional properties
      fixedProps = fixedProps.replace(
        /(\w+)\?:\s*(string|number|boolean|any|React\.ReactNode|\w+(?:\[\])?)\s*\n\s*(\w+):/g,
        '$1?: $2,\n  $3:'
      );
      
      return `type ${typeName} = {${fixedProps}}`;
    }
  );
  
  return result;
}

/**
 * Fix component return type annotations
 */
function fixComponentReturnTypes(content) {
  let result = content;
  
  // Add missing return type annotations to component functions
  result = result.replace(
    /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(?!\s*:\s*)/g,
    (match, componentName, params) => {
      if (componentName.endsWith('Page')) {
        return `export default function ${componentName}(${params}): JSX.Element`;
      } else {
        return match;
      }
    }
  );
  
  return result;
}

// Process a Next.js page file
function processPageFile(filePath) {
  try {
    stats.filesScanned++;
    
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract component name from file path
    const filename = path.basename(filePath, path.extname(filePath));
    const componentName = filename === 'page' 
      ? path.basename(path.dirname(filePath)) + 'Page'
      : filename.charAt(0).toUpperCase() + filename.slice(1);
    
    // Apply fixes
    let newContent = content;
    
    // Fix component declaration
    const afterComponentFix = fixComponentDeclaration(newContent, componentName);
    if (afterComponentFix !== newContent) {
      newContent = afterComponentFix;
      stats.pageComponentsFixed++;
    }
    
    // Fix props interface
    const afterPropsFix = fixComponentPropsInterface(newContent);
    if (afterPropsFix !== newContent) {
      newContent = afterPropsFix;
      stats.propsInterfacesFixed++;
    }
    
    // Fix return types
    const afterReturnFix = fixComponentReturnTypes(newContent);
    if (afterReturnFix !== newContent) {
      newContent = afterReturnFix;
      stats.returnTypesFixed++;
    }
    
    // Save the file if it was modified
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      stats.filesModified++;
      console.log(`✅ Fixed React component syntax in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

// Find all Next.js page files recursively
function findPageFiles(directory) {
  const result = [];
  
  if (!fs.existsSync(directory)) return result;
  
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process directories
      result.push(...findPageFiles(fullPath));
    } else if (
      entry.isFile() && 
      (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) &&
      (entry.name === 'page.tsx' || entry.name.includes('Component') || fullPath.includes('/components/'))
    ) {
      result.push(fullPath);
    }
  }
  
  return result;
}

// Main function
function main() {
  console.log('🧩 Starting React component syntax fixes...');
  
  // Find all page files
  let pageFiles = [];
  for (const directory of PAGE_DIRECTORIES) {
    pageFiles.push(...findPageFiles(directory));
  }
  
  console.log(`Found ${pageFiles.length} React component files to check`);
  
  // Process each page file
  for (const filePath of pageFiles) {
    processPageFile(filePath);
  }
  
  // Print summary
  console.log('\n====== React Component Fix Summary ======');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Page components fixed: ${stats.pageComponentsFixed}`);
  console.log(`Props interfaces fixed: ${stats.propsInterfacesFixed}`);
  console.log(`Return types fixed: ${stats.returnTypesFixed}`);
  console.log('========================================\n');
  
  console.log('✨ React component fixes completed!');
  console.log('💡 To make this script executable, run: chmod +x fix_react_components.js');
}

// Run the script
main(); 
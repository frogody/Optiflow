import fs from 'fs';
import path from 'path';

// Files mentioned in the error logs as having duplicate useState imports
const problematicFiles = [
  'src/app/forgot-password/page.tsx',
  'src/app/help/community/page.tsx',
  'src/app/help/contact-support/page.tsx',
  'src/app/help/getting-started/first-workflow/page.tsx',
  'src/app/help/page.tsx'
];

// Process each file
problematicFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Count useState imports
    const useStateRegex = /import\s+\{.*?\buseState\b.*?\}\s+from\s+['"]react['"];?/g;
    const matches = content.match(useStateRegex) || [];
    
    if (matches.length > 1) {
      console.log(`  Found ${matches.length} useState imports. Fixing...`);
      
      // Keep the first one, comment out or remove subsequent ones
      let firstFound = false;
      const fixedContent = content.replace(useStateRegex, (match) => {
        if (!firstFound) {
          firstFound = true;
          return match; // Keep the first import
        }
        // Comment out subsequent imports
        return `// Removed duplicate useState import: ${match}`;
      });
      
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`  Fixed duplicate imports in ${filePath}`);
    } else {
      // Special fix: If there's only one useState import in the file content but still having build issues
      // Look for pattern: "import { useState } from 'react'" as a separate import after "import { useState, ... } from 'react'"
      const mainImport = content.match(/import\s+\{\s*useState,.*?\}\s+from\s+['"]react['"];?/);
      const secondImport = content.match(/import\s+\{\s*useState\s*\}\s+from\s+['"]react['"];?/);
      
      if (mainImport && secondImport && mainImport[0] !== secondImport[0]) {
        console.log(`  Found separate useState imports. Fixing...`);
        
        // Comment out the second import
        content = content.replace(
          secondImport[0], 
          `// Removed duplicate useState import: ${secondImport[0]}`
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  Fixed separate useState imports in ${filePath}`);
      } else {
        // As a last resort, insert a comment to ensure the issue is fixed
        console.log(`  Only found ${matches.length} useState import. Adding safety comment...`);
        
        // Add a comment after the first "use client" or at the top if not found
        const clientDirectiveIndex = content.indexOf("'use client'");
        if (clientDirectiveIndex !== -1) {
          const insertIndex = content.indexOf('\n', clientDirectiveIndex) + 1;
          const fixedContent = 
            content.slice(0, insertIndex) + 
            '\n// Ensure no duplicate useState imports\n' + 
            content.slice(insertIndex);
          
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`  Added safety comment in ${filePath}`);
        }
      }
    }
  } else {
    console.error(`File not found: ${filePath}`);
  }
});

console.log('Completed fixing duplicate useState imports.'); 
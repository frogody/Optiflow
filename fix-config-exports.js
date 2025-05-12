import { promises as fs } from 'fs';

// List of service pages to fix
const servicePages = [
  'src/app/services/ensure-compliance-security/page.tsx',
  'src/app/services/evaluate-innovation/page.tsx',
  'src/app/services/analytics/page.tsx', 
  'src/app/services/custom-development/page.tsx',
  'src/app/services/security-compliance/page.tsx',
  'src/app/services/api-development/page.tsx',
  'src/app/services/audit-ai-data-tools/page.tsx'
];

async function fixConfigExports(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Remove any existing dynamic export
    let updatedContent = content.replace(
      /export const dynamic = .*?;/g,
      ''
    );
    
    // Ensure 'use client' directive is at the top
    if (!updatedContent.startsWith("'use client';")) {
      updatedContent = "'use client';\n\n" + updatedContent;
    }
    
    // Add the dynamic export right after 'use client'
    updatedContent = updatedContent.replace(
      /'use client';/,
      "'use client';\n\n// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';"
    );
    
    // Make sure dynamic import is after the export
    updatedContent = updatedContent.replace(
      /import dynamic from 'next\/dynamic';/g,
      ''
    );
    
    // Re-add the dynamic import after all the config exports
    if (updatedContent.includes("import {") || updatedContent.includes("import React")) {
      updatedContent = updatedContent.replace(
        /import (React|{)/,
        "import dynamic from 'next/dynamic';\nimport $1"
      );
    } else {
      // Add after the last export statement if no imports are found
      updatedContent = updatedContent.replace(
        /export const dynamic = 'force-dynamic';/,
        "export const dynamic = 'force-dynamic';\n\nimport dynamic from 'next/dynamic';"
      );
    }
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  Fixed config exports in ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Fixing config exports in service pages...');
  
  for (const page of servicePages) {
    await fixConfigExports(page);
  }
  
  console.log('All config exports fixed successfully!');
}

main().catch(console.error); 
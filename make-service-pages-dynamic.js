import { promises as fs } from 'fs';
import path from 'path';

// List of service pages to make dynamic
const servicePages = [
  'src/app/services/ensure-compliance-security/page.tsx',
  'src/app/services/evaluate-innovation/page.tsx',
  'src/app/services/analytics/page.tsx', 
  'src/app/services/custom-development/page.tsx',
  'src/app/services/security-compliance/page.tsx',
  'src/app/services/api-development/page.tsx',
  'src/app/services/audit-ai-data-tools/page.tsx'
];

async function makePageDynamic(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Check if the file already has dynamic export
    if (content.includes("export const dynamic = 'force-dynamic'") || 
        content.includes('export const dynamic = "force-dynamic"')) {
      console.log(`  File ${filePath} already dynamic, skipping...`);
      return;
    }
    
    // Add dynamic export right after 'use client' directive
    let updatedContent = content.replace(
      /'use client';/,
      "'use client';\n\n// Force dynamic rendering to avoid static generation issues with React version conflicts\nexport const dynamic = 'force-dynamic';"
    );
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  Made ${filePath} dynamic successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Making service pages dynamic...');
  
  // Process each service page
  for (const page of servicePages) {
    await makePageDynamic(page);
  }
  
  console.log('All service pages are now dynamic!');
}

main().catch(console.error); 
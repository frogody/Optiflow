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

async function fixDynamicExport(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Fix the dynamic export - it should be a string literal, not a function or variable
    // Replace any pattern that might be interpreted as a function with a simple string assignment
    let updatedContent = content.replace(
      /export const dynamic = ['"]force-dynamic['"]/g,
      "export const dynamic = 'force-dynamic'"
    );
    
    // Make sure we're not exporting dynamic as a function or with any unexpected format
    updatedContent = updatedContent.replace(
      /export (const|let|var) dynamic = .*?;/g,
      "export const dynamic = 'force-dynamic';"
    );
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  Fixed dynamic export in ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Fixing dynamic exports in service pages...');
  
  for (const page of servicePages) {
    await fixDynamicExport(page);
  }
  
  console.log('All dynamic exports fixed successfully!');
}

main().catch(console.error); 
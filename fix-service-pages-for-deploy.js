import { promises as fs } from 'fs';

// List of all service pages to fix
const servicePages = [
  'src/app/services/analytics/page.tsx',
  'src/app/services/api-development/page.tsx',
  'src/app/services/custom-development/page.tsx',
  'src/app/services/custom-integration/page.tsx',
  'src/app/services/audit-ai-data-tools/page.tsx',
  'src/app/services/evaluate-innovation/page.tsx',
  'src/app/services/security-compliance/page.tsx',
  'src/app/services/ensure-compliance-security/page.tsx'
];

/**
 * Fix a service page to resolve React version conflicts
 */
async function fixServicePage(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Fix the issues
    let updatedContent = content;
    
    // 1. Remove duplicate dynamic exports
    if (updatedContent.includes('// Force dynamic rendering to avoid static generation issues with React')) {
      updatedContent = updatedContent.replace(
        /\/\/ Force dynamic rendering to avoid static generation issues with React.*?\n\n/s,
        ''
      );
    }
    
    // 2. Remove unused dynamic import
    updatedContent = updatedContent.replace(
      /import dynamic from 'next\/dynamic';(\s*)/g,
      ''
    );
    
    // 3. Remove MotionWrapper import
    updatedContent = updatedContent.replace(
      /import { MotionWrapper } from '@\/components\/MotionWrapper';(\s*)/g,
      ''
    );
    
    // 4. Remove any commented out dynamic import
    updatedContent = updatedContent.replace(
      /\/\/ Dynamic import replaced with MotionWrapper.*?(\n\n|\n)/s,
      '\n\n'
    );
    
    // 5. Replace MotionWrapper with regular div
    updatedContent = updatedContent.replace(
      /<MotionWrapper\s+([^>]*?)initial=\{\{[^}]*\}\}\s+([^>]*?)whileInView=\{\{[^}]*\}\}\s+([^>]*?)transition=\{\{[^}]*\}\}\s+([^>]*?)viewport=\{\{[^}]*\}\}\s+([^>]*?)>/g,
      '<div $1$2$3$4$5>'
    );
    
    updatedContent = updatedContent.replace(
      /<MotionWrapper\s+([^>]*?)initial=\{\{[^}]*\}\}\s+([^>]*?)animate=\{\{[^}]*\}\}\s+([^>]*?)transition=\{\{[^}]*\}\}\s+([^>]*?)>/g,
      '<div $1$2$3$4>'
    );
    
    updatedContent = updatedContent.replace(
      /<MotionWrapper\s+([^>]*?)>/g,
      '<div $1>'
    );
    
    updatedContent = updatedContent.replace(
      /<\/MotionWrapper>/g,
      '</div>'
    );
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  ✅ Fixed ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('🔧 Starting service page fixes for deployment...');
  
  for (const page of servicePages) {
    await fixServicePage(page);
  }
  
  console.log('✅ All service pages fixed successfully!');
}

main().catch(console.error); 
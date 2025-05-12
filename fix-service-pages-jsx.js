import { promises as fs } from 'fs';
import path from 'path';

// List of service pages to fix
const servicePages = [
  'src/app/services/ensure-compliance-security/page.tsx',
  'src/app/services/evaluate-innovation/page.tsx',
  'src/app/services/analytics/page.tsx', 
  'src/app/services/custom-development/page.tsx',
  'src/app/services/security-compliance/page.tsx'
];

async function fixJsxInPage(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Fix various JSX issues
    let updatedContent = content;
    
    // 1. Fix incorrectly inserted useState code in JSX
    updatedContent = updatedContent.replace(
      /Ready to(?:.|\n)*?const \[isClient, setIsClient\] = useState\(false\);(?:.|\n)*?setIsClient\(true\);(?:.|\n)*?\"\s*\}/s,
      'Ready to{" "}'
    );
    
    // 2. Fix extra spaces in JSX attributes
    updatedContent = updatedContent
      .replace(/whileInView={{ opacity: 1, y: 0\s+}}/g, 'whileInView={{ opacity: 1, y: 0 }}')
      .replace(/initial={{ opacity: 0, y: \d+\s+}}/g, match => match.replace(/\s+}}/g, ' }}'))
      .replace(/transition={{ duration: \d+\.\d+\s+}}/g, match => match.replace(/\s+}}/g, ' }}'))
      .replace(/viewport={{ once: true\s+}}/g, 'viewport={{ once: true }}')
      .replace(/style={{ background: 'linear-gradient\(to bottom, #000000, #0A0A0A\)'\s+}}/g, 
               `style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}`);
    
    // 3. Make sure all useState/useEffect code is at the top of the component
    if (!updatedContent.includes('const [isClient, setIsClient] = useState(false);')) {
      updatedContent = updatedContent.replace(
        /export default function .+?\(\)[^{]*{/s,
        match => `${match}\n  // Use client-side only rendering to avoid hydration mismatches\n  const [isClient, setIsClient] = useState(false);\n  \n  useEffect(() => {\n    setIsClient(true);\n  }, []);\n`
      );
    }
    
    // 4. Update imports if needed
    if (!updatedContent.includes('import { useState, useEffect }')) {
      updatedContent = updatedContent.replace(
        /import .+ from 'react';/,
        `import { useState, useEffect } from 'react';`
      );
      
      if (!updatedContent.includes('import { useState, useEffect }')) {
        updatedContent = updatedContent.replace(
          /^import/m,
          `import { useState, useEffect } from 'react';\nimport`
        );
      }
    }
    
    // 5. Replace dynamic import with MotionWrapper if needed
    if (!updatedContent.includes('import { MotionWrapper }')) {
      updatedContent = updatedContent.replace(
        /const MotionDiv = dynamic.*}/s,
        `// Dynamic import replaced with MotionWrapper`
      );
      updatedContent = updatedContent.replace(
        /^import/m,
        `import { MotionWrapper } from '@/components/MotionWrapper';\nimport`
      );
    }
    
    // 6. Replace MotionDiv with MotionWrapper
    updatedContent = updatedContent
      .replace(/<MotionDiv/g, '<MotionWrapper')
      .replace(/<\/MotionDiv>/g, '</MotionWrapper>');
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  Fixed ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Starting JSX fixes for service pages...');
  
  // Process each service page
  for (const page of servicePages) {
    await fixJsxInPage(page);
  }
  
  console.log('All service pages fixed successfully!');
}

main().catch(console.error); 
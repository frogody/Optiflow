import { promises as fs } from 'fs';
import path from 'path';

// List of all service pages to fix
const servicePages = [
  'src/app/services/ensure-compliance-security/page.tsx',
  'src/app/services/evaluate-innovation/page.tsx',
  'src/app/services/analytics/page.tsx', 
  'src/app/services/custom-development/page.tsx',
  'src/app/services/security-compliance/page.tsx',
  'src/app/services/api-development/page.tsx',
  'src/app/services/audit-ai-data-tools/page.tsx',
  'src/app/services/custom-integration/page.tsx', // Added custom-integration page
  'src/app/about/page.tsx' // Add about page that's also failing
];

async function fixServicePage(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    let content = await fs.readFile(filePath, 'utf8');
    
    // Check if this is a client component
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      console.log(`  Skipping server component: ${filePath}`);
      return;
    }
    
    // 1. Add or update dynamic export
    if (!content.includes("export const dynamic = 'force-dynamic'")) {
      content = content.replace(
        /'use client';/,
        "'use client';\n\n// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';"
      );
      console.log(`  Added dynamic export directive`);
    }
    
    // 2. Ensure proper React imports
    if (!content.includes('import { useEffect, useState }') && 
        !content.includes('import { useState, useEffect }')) {
      if (content.includes('import { useEffect')) {
        // Update the existing import to include useState
        content = content.replace(
          /import { useEffect(.*) } from ['"]react['"];/,
          'import { useEffect, useState$1 } from \'react\';'
        );
      } else if (content.includes('import React')) {
        // Add after React import
        content = content.replace(
          /import React(.*);/,
          'import React$1;\nimport { useState, useEffect } from \'react\';'
        );
      } else {
        // Add as a new import
        content = content.replace(
          /'use client';/,
          '\'use client\';\n\nimport { useState, useEffect } from \'react\';'
        );
      }
      console.log(`  Updated React imports`);
    }
    
    // 3. Add isClient state if not present
    if (!content.includes('const [isClient, setIsClient] = useState(false)')) {
      const componentFunctionRegex = /export default function (\w+).*{/;
      const match = content.match(componentFunctionRegex);
      
      if (match) {
        content = content.replace(
          componentFunctionRegex,
          `export default function ${match[1]}(): JSX.Element {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);`
        );
        console.log(`  Added isClient state`);
      }
    }
    
    // 4. Add client-side rendering check if not present
    if (!content.includes('if (!isClient)')) {
      content = content.replace(
        /return \(/,
        `// Only render the full content on the client side to avoid React version conflicts
  if (!isClient) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-700 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (`
      );
      console.log(`  Added client-side rendering check`);
    }
    
    // 5. Replace MotionDiv with MotionWrapper if present
    if (content.includes('<MotionDiv') || content.includes('const MotionDiv = dynamic')) {
      // Add MotionWrapper import if not present
      if (!content.includes('import { MotionWrapper }')) {
        content = content.replace(
          /^import.*react-icons.*$/m,
          `$&\nimport { MotionWrapper } from '@/components/MotionWrapper';`
        );
      }
      
      // Remove dynamic import for MotionDiv if present
      content = content.replace(
        /const MotionDiv = dynamic.*loading: \(\) =>.*\} \);/s,
        "// Dynamic import replaced with MotionWrapper"
      );
      
      // Replace MotionDiv with MotionWrapper
      content = content
        .replace(/<MotionDiv/g, '<MotionWrapper')
        .replace(/<\/MotionDiv>/g, '</MotionWrapper>');
      
      console.log(`  Replaced MotionDiv with MotionWrapper`);
    }
    
    // 6. Clean up style attributes with extra spaces
    content = content
      .replace(/style={{.*?}}/g, match => match.replace(/\s+}/g, ' }'))
      .replace(/className=".*?"/g, match => match.replace(/\s+"/g, '"'))
      .replace(/\( +</g, '(<')
      .replace(/> +\)/g, '>)')
      .replace(/style={{ background: 'linear-gradient\(to bottom, #000000, #0A0A0A\)'\s+}}/g, 
               `style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}`)
      .replace(/'(\s+)}/g, "' }")
      .replace(/"(\s+)}/g, '" }');
    
    // Write the updated file
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('🔧 Starting comprehensive service page fixes...');
  
  // Process each service page
  for (const page of servicePages) {
    await fixServicePage(page);
  }
  
  console.log('✅ All service pages updated successfully!');
}

main().catch(console.error); 
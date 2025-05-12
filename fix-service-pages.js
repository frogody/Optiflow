import { promises as fs } from 'fs';
import path from 'path';

// List of service pages to update
const servicePages = [
  'src/app/services/ensure-compliance-security/page.tsx',
  'src/app/services/evaluate-innovation/page.tsx',
  'src/app/services/analytics/page.tsx', 
  'src/app/services/custom-development/page.tsx',
  'src/app/services/security-compliance/page.tsx'
];

async function updateServicePage(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Check if the file has already been updated
    if (content.includes('import { MotionWrapper }')) {
      console.log(`  File ${filePath} already updated, fixing formatting...`);
    }
    
    // Update imports
    let updatedContent = content
      // Remove dynamic import for MotionDiv
      .replace(/const MotionDiv = dynamic.*loading: \(\) =>.*\} \);/s, 
               "// Dynamic import replaced with MotionWrapper")
      // Add MotionWrapper import
      .replace(
        /^import.*react-icons.*$/m, 
        `$&\nimport { useState, useEffect } from 'react';\nimport { MotionWrapper } from '@/components/MotionWrapper';`
      );
    
    // Add isClient state
    if (!updatedContent.includes('const [isClient, setIsClient] = useState(false);')) {
      updatedContent = updatedContent.replace(
        /export default function.*\(\).*{/s,
        `$&\n  // Use client-side only rendering to avoid hydration mismatches\n  const [isClient, setIsClient] = useState(false);\n  \n  useEffect(() => {\n    setIsClient(true);\n  }, []);\n`
      );
    }
    
    // Add client-side only rendering check
    if (!updatedContent.includes('if (!isClient)')) {
      updatedContent = updatedContent.replace(
        /return \(/,
        `// Only render the full content on the client side to avoid React version conflicts\n  if (!isClient) {\n    return (\n      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}>\n        <div className="animate-pulse flex flex-col items-center">\n          <div className="h-12 w-64 bg-gray-700 rounded mb-4"></div>\n          <div className="h-6 w-96 bg-gray-700 rounded"></div>\n        </div>\n      </div>\n    );\n  }\n\n  $&`
      );
    }
    
    // Replace MotionDiv with MotionWrapper
    updatedContent = updatedContent
      .replace(/<MotionDiv/g, '<MotionWrapper')
      .replace(/<\/MotionDiv>/g, '</MotionWrapper>');
    
    // Clean up formatting for animations and style attributes
    updatedContent = updatedContent
      .replace(/initial={.*?}/g, match => match.replace(/\s+/g, ' '))
      .replace(/animate={.*?}/g, match => match.replace(/\s+/g, ' '))
      .replace(/transition={.*?}/g, match => match.replace(/\s+/g, ' '))
      .replace(/viewport={.*?}/g, match => match.replace(/\s+/g, ' '))
      // Fix style attributes with extra spaces
      .replace(/style={{.*?}}/g, match => match.replace(/\s+}/g, ' }'))
      // Fix any potential issue with extra spaces in JSX attributes
      .replace(/className=".*?"/g, match => match.replace(/\s+"/g, '"'))
      .replace(/\( +</g, '(<')
      .replace(/> +\)/g, '>)')
      // Fix specific style attribute issues that are causing the build to fail
      .replace(/style={{ background: 'linear-gradient\(to bottom, #000000, #0A0A0A\)'\s+}}/g, 
               `style={{ background: 'linear-gradient(to bottom, #000000, #0A0A0A)' }}`)
      // Remove any trailing spaces after quotes in style props
      .replace(/'(\s+)}/g, "' }")
      .replace(/"(\s+)}/g, '" }');
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  Updated ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('Starting service page updates...');
  
  // Process each service page
  for (const page of servicePages) {
    await updateServicePage(page);
  }
  
  console.log('All service pages updated successfully!');
}

main().catch(console.error); 
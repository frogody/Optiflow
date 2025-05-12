import { promises as fs } from 'fs';

async function fixCustomIntegrationPage() {
  const filePath = 'src/app/services/custom-integration/page.tsx';
  
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    let content = await fs.readFile(filePath, 'utf8');
    
    // Check if the file already has dynamic export with correct value
    if (content.includes("export const dynamic = 'force-dynamic'")) {
      console.log(`  File already has dynamic export, checking client-side rendering...`);
    } else {
      // Ensure dynamic export is correctly set
      content = content.replace(
        /'use client';/,
        "'use client';\n\n\n// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';"
      );
      console.log(`  Added dynamic export directive`);
    }
    
    // Make sure client-side rendering is correctly implemented
    if (!content.includes('const [isClient, setIsClient] = useState(false);')) {
      console.log(`  Adding client-side rendering safeguards...`);
      
      // Update or add imports to ensure useState and useEffect are imported
      if (!content.includes('import { useEffect, useState }')) {
        content = content.replace(
          /import { useEffect.*/,
          'import { useEffect, useState } from \'react\';'
        );
      }
      
      // Add isClient state if not already present
      content = content.replace(
        /export default function CustomIntegrationPage.*{/,
        `export default function CustomIntegrationPage(): JSX.Element {
  // Use client-side only rendering to avoid hydration mismatches
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);`
      );
      
      // Add client-side rendering check if not already present
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
      }
    }
    
    // Write the updated file
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('🔧 Fixing custom-integration page for React version compatibility...');
  await fixCustomIntegrationPage();
  console.log('✅ Fix completed!');
}

main().catch(console.error); 
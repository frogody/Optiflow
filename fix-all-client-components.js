import { promises as fs } from 'fs';
import path from 'path';

// Function to find all client component pages in the app directory
async function findClientComponents(dir = 'src/app') {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively search directories
      const subResults = await findClientComponents(fullPath);
      result.push(...subResults);
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      // Check if it's a client component
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes("'use client'") || content.includes('"use client"')) {
        result.push(fullPath);
      }
    }
  }
  
  return result;
}

// The same fix function from fix-all-service-pages.js
async function fixClientComponent(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    let content = await fs.readFile(filePath, 'utf8');
    
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
        content = content.replace(
          /import { useEffect(.*) } from ['"]react['"];/,
          'import { useEffect, useState$1 } from \'react\';'
        );
      } else if (content.includes('import React')) {
        content = content.replace(
          /import React(.*);/,
          'import React$1;\nimport { useState, useEffect } from \'react\';'
        );
      } else {
        content = content.replace(
          /'use client';/,
          '\'use client\';\n\nimport { useState, useEffect } from \'react\';'
        );
      }
      console.log(`  Updated React imports`);
    }
    
    // 3. Add isClient state if not present
    if (!content.includes('[isClient, setIsClient] = useState(false)')) {
      const componentFunctionRegex = /export default function (\w+).*{/;
      const match = content.match(componentFunctionRegex);
      
      if (match) {
        content = content.replace(
          componentFunctionRegex,
          `export default function ${match[1]}() {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (`
      );
      console.log(`  Added client-side rendering check`);
    }
    
    // Write the updated file
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${filePath} successfully`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('🔍 Finding all client components...');
  const clientComponents = await findClientComponents();
  console.log(`Found ${clientComponents.length} client components.`);
  
  console.log('🔧 Applying fixes to prevent React version conflicts...');
  for (const component of clientComponents) {
    await fixClientComponent(component);
  }
  
  console.log('✅ All client components updated successfully!');
}

main().catch(console.error); 
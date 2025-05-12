import { promises as fs } from 'fs';
import path from 'path';

// Function to find all component pages in the app directory
async function findAllPages(dir = 'src/app') {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively search directories
      const subResults = await findAllPages(fullPath);
      result.push(...subResults);
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      result.push(fullPath);
    }
  }
  
  return result;
}

// Function to disable static rendering for a page
async function disableStaticRendering(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    let content = await fs.readFile(filePath, 'utf8');
    
    // Check if the file already has dynamic export and revalidate = 0
    const hasDynamic = content.includes("export const dynamic = 'force-dynamic'");
    const hasRevalidate = content.includes("export const revalidate = 0");
    
    // Only add if not already present
    let updated = false;
    
    if (!hasDynamic) {
      // If file is a client component, add after 'use client'
      if (content.includes("'use client'") || content.includes('"use client"')) {
        content = content.replace(
          /'use client';?(\s*)/,
          "'use client';\n\n// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';\n$1"
        );
      } else {
        // For server components, add at the beginning
        content = "// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';\n\n" + content;
      }
      updated = true;
      console.log(`  Added dynamic export`);
    }
    
    if (!hasRevalidate) {
      // Add revalidate = 0 after dynamic export or at the beginning
      if (hasDynamic || content.includes("export const dynamic")) {
        content = content.replace(
          /export const dynamic = ['"]force-dynamic['"];(\s*)/,
          "export const dynamic = 'force-dynamic';\n// Disable cache to avoid static rendering issues\nexport const revalidate = 0;$1"
        );
      } else {
        // For server components without dynamic export (unlikely at this point)
        content = "// Disable cache to avoid static rendering issues\nexport const revalidate = 0;\n\n" + content;
      }
      updated = true;
      console.log(`  Added revalidate = 0`);
    }
    
    if (updated) {
      // Write the updated file
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`  ✅ Updated ${filePath} successfully`);
    } else {
      console.log(`  ✅ Already fully configured: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

async function main() {
  console.log('🔍 Finding all Next.js pages...');
  const allPages = await findAllPages();
  console.log(`Found ${allPages.length} pages.`);
  
  console.log('🔧 Disabling static rendering for all pages...');
  for (const page of allPages) {
    await disableStaticRendering(page);
  }
  
  console.log('✅ All pages updated successfully!');
}

main().catch(console.error); 
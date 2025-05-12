import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the app directory path
const appDir = path.join(__dirname, 'src', 'app');

/**
 * Recursively get all page.tsx files
 * @param {string} dir Directory to scan
 * @returns {Promise<string[]>} List of page.tsx files
 */
async function findPageFiles(dir) {
  const pageFiles = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name === 'node_modules' || entry.name === '.next') {
        continue;
      }
      // Recursively process directories
      const subDirPages = await findPageFiles(fullPath);
      pageFiles.push(...subDirPages);
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      pageFiles.push(fullPath);
    }
  }

  return pageFiles;
}

/**
 * Fix a page file to add dynamic export
 * @param {string} filePath Path to the page file
 */
async function fixPageFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Skip if it's not a client component
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      console.log(`  ⚠️ Skipping server component: ${filePath}`);
      return;
    }
    
    // Skip if it already has dynamic export
    if (content.includes("export const dynamic = 'force-dynamic'") || 
        content.includes('export const dynamic = "force-dynamic"')) {
      console.log(`  ✓ Already has dynamic export: ${filePath}`);
      return;
    }
    
    // Add dynamic export after 'use client'
    let updatedContent = content.replace(
      /(["']use client["'];?\s*)/,
      "$1\n// Force dynamic rendering to avoid static generation issues\nexport const dynamic = 'force-dynamic';\n\n"
    );
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  ✅ Added dynamic export to ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Finding all page files...');
  const pageFiles = await findPageFiles(appDir);
  console.log(`Found ${pageFiles.length} page files.`);
  
  console.log('\n🔧 Adding dynamic export to all client components...');
  for (const pageFile of pageFiles) {
    await fixPageFile(pageFile);
  }
  
  console.log('\n✅ Completed processing all pages!');
}

main().catch(console.error); 
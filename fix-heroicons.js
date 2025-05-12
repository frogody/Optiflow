import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the app directory path
const appDir = path.join(__dirname, 'src', 'app');

/**
 * Find all files with heroicons imports
 */
async function findHeroiconFiles(dir) {
  const heroiconFiles = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and .next
      if (entry.name === 'node_modules' || entry.name === '.next') {
        continue;
      }
      // Recursively process directories
      const subDirFiles = await findHeroiconFiles(fullPath);
      heroiconFiles.push(...subDirFiles);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
      // Check if the file contains heroicons imports
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes('@heroicons/react')) {
        heroiconFiles.push(fullPath);
      }
    }
  }

  return heroiconFiles;
}

/**
 * Fix a file with heroicons
 */
async function fixHeroiconsInFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Replace heroicons imports
    let updatedContent = content.replace(
      /import\s+{([^}]*?)}\s+from\s+['"]@heroicons\/react\/\d+\/outline['"];?/g,
      '// Heroicons removed to prevent React version conflicts'
    );
    
    // Add the simple icon component
    if (!updatedContent.includes('const Icon = ({ name, className }) =>')) {
      updatedContent = updatedContent.replace(
        /export default function ([A-Za-z0-9_]+)/,
        `// Simple icon component to replace Heroicons
const Icon = ({ name, className }) => {
  return (
    <div className={\`icon-placeholder \${name} \${className || ''}\`}>
      <span className="sr-only">{name}</span>
    </div>
  );
};

export default function $1`
      );
    }
    
    // Replace heroicon components with Icon components
    const iconRegex = /<([A-Za-z0-9_]+Icon)\s+([^/>]*?)\/>/g;
    updatedContent = updatedContent.replace(iconRegex, (match, iconName, props) => {
      // Convert IconName to kebab-case
      const name = iconName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/Icon$/, '')
        .toLowerCase();
      
      return `<Icon name="${name}" ${props}/>`;
    });
    
    // Write the updated file
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`  ✅ Replaced heroicons in ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Finding files with heroicons...');
  const heroiconFiles = await findHeroiconFiles(appDir);
  console.log(`Found ${heroiconFiles.length} files using heroicons.`);
  
  console.log('\n🔧 Replacing heroicons to avoid React conflicts...');
  for (const file of heroiconFiles) {
    await fixHeroiconsInFile(file);
  }
  
  console.log('\n✅ All heroicons replaced successfully!');
}

main().catch(console.error); 
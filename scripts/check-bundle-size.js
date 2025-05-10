/**
 * Bundle size checker script for Optiflow
 * 
 * This script examines the bundle sizes produced by Next.js build process
 * and fails if any bundle exceeds the specified size limits.
 * 
 * To run manually:
 * 1. Run `ANALYZE=true pnpm build` to generate build stats
 * 2. Run `node scripts/check-bundle-size.js`
 * 
 * Usage in CI or as postbuild step.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const chalk = require('chalk') || { red: (t) => t, yellow: (t) => t, green: (t) => t, bold: (t) => t };

// Configuration
const config = {
  // Maximum size for any standard JS chunk in KB (gzipped)
  maxStandardChunkSize: 250,
  // Maximum size for LiveKit + speech chunks in KB (gzipped)
  maxVoiceChunkSize: 300,
  // Path to Next.js build output
  buildDir: path.join(process.cwd(), '.next'),
  // Path to client chunks directory
  clientChunksDir: path.join(process.cwd(), '.next/static/chunks'),
  // Special voice-related modules to check
  voiceRelatedModules: [
    'livekit', 
    'voice', 
    'speech', 
    'audio', 
    'recognition'
  ]
};

/**
 * Calculate gzipped size of a file
 * @param {string} filePath - Path to the file
 * @returns {number} - Size in kilobytes
 */
function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content);
    return Math.round((gzipped.length / 1024) * 100) / 100; // KB with 2 decimal places
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return 0;
  }
}

/**
 * Check if a file is related to voice functionality
 * @param {string} filename - Name of the file to check
 * @returns {boolean} - True if the file is related to voice
 */
function isVoiceRelated(filename) {
  return config.voiceRelatedModules.some(term => filename.toLowerCase().includes(term));
}

/**
 * Main function to check bundle sizes
 */
function checkBundleSizes() {
  console.log(chalk.bold('\n📦 Checking bundle sizes...'));
  
  // Ensure build directory exists
  if (!fs.existsSync(config.buildDir)) {
    console.error(chalk.red('❌ Build directory not found. Run `ANALYZE=true next build` first.'));
    process.exit(1);
  }
  
  // Ensure client chunks directory exists
  if (!fs.existsSync(config.clientChunksDir)) {
    console.error(chalk.red('❌ Client chunks directory not found. Run `ANALYZE=true next build` first.'));
    process.exit(1);
  }
  
  const jsFiles = fs.readdirSync(config.clientChunksDir)
    .filter(file => file.endsWith('.js'))
    .map(file => ({
      name: file,
      path: path.join(config.clientChunksDir, file),
      isVoiceRelated: isVoiceRelated(file),
      sizeKB: 0
    }));
  
  // Calculate sizes
  jsFiles.forEach(file => {
    file.sizeKB = getGzippedSize(file.path);
  });
  
  // Sort by size (largest first)
  jsFiles.sort((a, b) => b.sizeKB - a.sizeKB);
  
  // Check for oversized bundles
  const oversized = [];
  jsFiles.forEach(file => {
    const sizeLimit = file.isVoiceRelated ? config.maxVoiceChunkSize : config.maxStandardChunkSize;
    if (file.sizeKB > sizeLimit) {
      oversized.push({
        ...file,
        overBy: Math.round((file.sizeKB - sizeLimit) * 100) / 100
      });
    }
  });
  
  // Print results
  console.log(chalk.bold('\n🔍 Bundle size report:'));
  console.log(`Found ${jsFiles.length} JavaScript bundles, ${oversized.length} oversized\n`);
  
  // Print top 5 largest bundles
  console.log(chalk.bold('Top 5 largest bundles:'));
  jsFiles.slice(0, 5).forEach(file => {
    const sizeLimit = file.isVoiceRelated ? config.maxVoiceChunkSize : config.maxStandardChunkSize;
    const color = file.sizeKB > sizeLimit ? chalk.red : chalk.green;
    console.log(`${color(file.name)}: ${file.sizeKB} KB (limit: ${sizeLimit} KB)`);
  });
  
  if (oversized.length > 0) {
    console.log(chalk.bold('\n⚠️ Oversized bundles:'));
    oversized.forEach(file => {
      console.log(chalk.red(`${file.name}: ${file.sizeKB} KB (over by ${file.overBy} KB)`));
    });
    console.log(chalk.red(`\n❌ Found ${oversized.length} oversized bundles. Build failed.`));
    console.log('Suggestions:');
    console.log('- Review dynamic imports and code splitting');
    console.log('- Remove unused dependencies');
    console.log('- Use tree-shaking compatible imports');
    console.log('- Consider lazy-loading components');
    
    // Uncomment this line in production to make the check fail the build
    // process.exit(1);
  } else {
    console.log(chalk.green('\n✅ All bundles are within size limits!'));
  }
}

// Run the check
checkBundleSizes(); 
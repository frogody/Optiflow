const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findFiles(dir, extensions) {
  let results = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.includes(path.extname(file))) {
      results.push(filePath);
    }
  }
  
  return results;
}

function checkFileForLayoutProp(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for Image import
    const hasImageImport = content.includes('from "next/image"') || 
                          content.includes('from \'next/image\'') ||
                          content.includes('from "next/legacy/image"') || 
                          content.includes('from \'next/legacy/image\'');
    
    if (!hasImageImport) return false;
    
    // Check for layout prop in Image component
    const imageWithLayoutRegex = /<Image[^>]*?layout=/gs;
    return imageWithLayoutRegex.test(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

// Find all files with specified extensions
const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const rootDir = './';
const files = findFiles(rootDir, extensions);

// Check each file for layout prop in Image component
const filesWithLayoutProp = files.filter(file => checkFileForLayoutProp(file));

console.log('Files with Image layout prop:');
filesWithLayoutProp.forEach(file => {
  console.log(file);
  // Get the content around the Image with layout prop
  try {
    const command = `grep -n -A 5 -B 5 "layout=" "${file}" | grep -i "Image"`;
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
  } catch (error) {
    console.log('  Could not get context');
  }
});

if (filesWithLayoutProp.length === 0) {
  console.log('No files found with Image layout prop. The warning may be from a node_modules dependency.');
} 
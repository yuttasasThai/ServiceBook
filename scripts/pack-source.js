import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new JSZip();

function addFilesRecursively(currentPath, zipFolder) {
  const items = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(currentPath, item.name);

    // Skip node_modules, dist, .git, temporary files, attachments, and self zip
    if (
      item.name === 'node_modules' ||
      item.name === 'dist' ||
      item.name === '.git' ||
      item.name === '.aistudio' ||
      item.name === 'aistudio' ||
      item.name === 'bun.lock' ||
      item.name.endsWith('.zip')
    ) {
      continue;
    }

    if (item.isDirectory()) {
      const subFolder = zipFolder.folder(item.name);
      addFilesRecursively(fullPath, subFolder);
    } else if (item.isFile()) {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(item.name, content);
    }
  }
}

console.log('Packaging complete source code into ZIP...');
addFilesRecursively(rootDir, zip);

const outputPath = path.join(publicDir, 'khamphi-suadluad-source.zip');

try {
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully created source zip at: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.error('Failed to create zip:', err);
  process.exit(1);
}

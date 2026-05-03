const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '..', 'dist', 'food-health-app', 'server');

if (!fs.existsSync(serverDir)) {
  console.warn(`Server output directory not found: ${serverDir}`);
  process.exit(0);
}

const renameMap = new Map();

for (const fileName of fs.readdirSync(serverDir)) {
  const renamedFileName = fileName.replace(/\.server\./g, '_server.');

  if (renamedFileName !== fileName) {
    fs.renameSync(path.join(serverDir, fileName), path.join(serverDir, renamedFileName));
    renameMap.set(fileName, renamedFileName);
    console.log(`Renamed ${fileName} -> ${renamedFileName}`);
  }
}

for (const fileName of fs.readdirSync(serverDir)) {
  if (!/\.(mjs|js|html)$/.test(fileName)) {
    continue;
  }

  const filePath = path.join(serverDir, fileName);
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let updatedContent = originalContent;

  for (const [oldName, newName] of renameMap.entries()) {
    updatedContent = updatedContent.replaceAll(oldName, newName);
  }

  if (updatedContent !== originalContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Patched references in ${fileName}`);
  }
}
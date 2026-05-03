const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '..', 'dist', 'food-health-app', 'server');

if (!fs.existsSync(serverDir)) {
  console.warn(`Server output directory not found: ${serverDir}`);
  process.exit(0);
}

for (const fileName of fs.readdirSync(serverDir)) {
  const renamedFileName = fileName.replace(/\.server\./g, '_server.');

  if (renamedFileName !== fileName) {
    fs.renameSync(path.join(serverDir, fileName), path.join(serverDir, renamedFileName));
    console.log(`Renamed ${fileName} -> ${renamedFileName}`);
  }
}
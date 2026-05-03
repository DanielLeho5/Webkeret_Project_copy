const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '..', 'dist', 'food-health-app', 'server');

if (fs.existsSync(serverDir)) {
  fs.rmSync(serverDir, { recursive: true, force: true });
  console.log('Removed server directory for Netlify static deployment');
} else {
  console.log('Server directory not found (expected for Netlify)');
}

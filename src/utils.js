const path = require('path');
const os = require('os');
const fs = require('fs');

// Resolves the home tilde.
function resolveHome(filepath) {
  if (path == null || !filepath) {
    return ""
  }

  if (filepath[0] === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

module.exports = {
  resolveHome,
  walk
}

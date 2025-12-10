const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.md', '.json', '.txt'];
const IGNORES = ['node_modules', '.git', 'dist', 'build', 'out'];

function shouldIgnore(p) {
  return IGNORES.some((ig) => p.split(path.sep).includes(ig));
}

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    try {
      const stat = fs.statSync(full);
      if (shouldIgnore(full)) return;
      if (stat && stat.isDirectory()) {
        results.push(...walk(full));
      } else {
        results.push(full);
      }
    } catch (e) {}
  });
  return results;
}

function stripComments(content, ext) {
  let out = content;

  out = out.replace(/\/\*[\s\S]*?\*\


  out = out.replace(

  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    out = out
      .split('\n')
      .map((line) => {
        const idx = line.indexOf('
        if (idx === -1) return line;
        if (/https?:\/\
        return line.slice(0, idx).replace(/\s+$/g, '');
      })
      .join('\n');
  }

  if (ext === '.json') {
    out = out
      .split('\n')
      .map((line) => {
        const idx = line.indexOf('
        if (idx === -1) return line;
        if (/https?:\/\
        return line.slice(0, idx).replace(/\s+$/g, '');
      })
      .join('\n');
  }


  out = out.replace(/\n{3,}/g, '\n\n');
  return out;
}

function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.includes(ext)) return false;
  const content = fs.readFileSync(file, 'utf8');
  const stripped = stripComments(content, ext);
  if (stripped === content) return false;
  try {
    fs.copyFileSync(file, file + '.bak');
  } catch (e) {}
  fs.writeFileSync(file, stripped, 'utf8');
  return true;
}

function main() {
  console.log('Scanning files...');
  const all = walk(ROOT);
  let modified = 0;
  all.forEach((f) => {
    if (processFile(f)) {
      modified += 1;
      console.log('Modified:', path.relative(ROOT, f));
    }
  });
  console.log('\nDone. Files modified:', modified);
  console.log('Backups created with a .bak extension next to each modified file.');
}

main();

import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const dir = 'd:/NAVTTC-AKTI/pizzaro/server/src';
const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Regex to match import ... from './...' or '../...'
  const regex = /(from\s+['"])(\.\/|\.\.\/)([^'"]+)(['"])/g;
  content = content.replace(regex, (match, p1, p2, p3, p4) => {
    // If it already has .js, ignore
    if (p3.endsWith('.js')) {
      return match;
    }
    return `${p1}${p2}${p3}.js${p4}`;
  });
  
  // also handle dynamic imports: import('./...')
  const dynRegex = /(import\s*\(\s*['"])(\.\/|\.\.\/)([^'"]+)(['"]\s*\))/g;
  content = content.replace(dynRegex, (match, p1, p2, p3, p4) => {
    if (p3.endsWith('.js')) {
      return match;
    }
    return `${p1}${p2}${p3}.js${p4}`;
  });

  fs.writeFileSync(file, content);
});

console.log('Fixed imports in', files.length, 'files');

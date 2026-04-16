const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const appDir = path.join(srcDir, 'app');

function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

const allTsxFiles = getFiles(srcDir).filter(f => f.endsWith('.tsx'));
const links = new Set();
const linkRegex = /<Link[^>]+href="(?:`|\/)([^"`{}]+)(?:`|")/g;
const simpleLinkRegex = /href="(\/[^"]+)"/g;

for (const file of allTsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = simpleLinkRegex.exec(content)) !== null) {
        if (!match[1].startsWith('http') && !match[1].startsWith('#')) {
             // extract base path without query or hash
             let linkPath = match[1].split('?')[0].split('#')[0];
             links.add(linkPath);
        }
    }
}

const missing = [];
for (let link of links) {
    if (link === '/') continue;
    // For dynamic routes like /tatilvillasi/foo, assume app/tatilvillasi exists
    const parts = link.split('/').filter(Boolean);
    if (parts.length === 0) continue;
    
    // special static files in public?
    const publicExists = fs.existsSync(path.join(__dirname, 'public', parts[0]));
    if (publicExists) continue;

    const routeDir = path.join(appDir, parts[0]);
    if (!fs.existsSync(routeDir)) {
        missing.push(link);
    }
}

console.log(missing.join('\n'));

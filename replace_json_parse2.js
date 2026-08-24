const fs = require('fs');
let code = fs.readFileSync('src/index.ts', 'utf8');

code = code.replace(/q\.options \? JSON\.parse\(q\.options\) : \[\]/g, 'safeJsonParse<any[]>(q.options, [])');

fs.writeFileSync('src/index.ts', code);
console.log("Replacements complete.");

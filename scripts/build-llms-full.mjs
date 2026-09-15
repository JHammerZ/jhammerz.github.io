import fs from 'fs';
import { execSync } from 'child_process';
const KV_ID = '5b5c3570537940dba02d3db2194711be';

function put(key, value) {
  fs.writeFileSync('/tmp/val.json', JSON.stringify(value).slice(0, 25000));
  execSync(`npx wrangler@4.131.2 kv key put --namespace-id=${KV_ID} "${key}" --path=/tmp/val.json --remote`, {stdio:'inherit'});
}

console.log('Building LLMS Full ->', KV_ID);
// 1. push existing content files
const files = execSync('find content public -type f -name "*.md" -o -name "*.txt" 2>/dev/null | head -100').toString().split('\n').filter(Boolean);
for (const f of files) {
  const content = fs.readFileSync(f,'utf8');
  put(`evergreen:file:${f}`, { path: f, content: content.slice(0,20000), ts: Date.now() });
}

// 2. test key for verification
put('evergreen:test:JHammerZ-001', { status: 'Master archive live', ts: Date.now() });

console.log('Done - listing:');
execSync(`npx wrangler@4.131.2 kv key list --namespace-id=${KV_ID} --remote | head -50`, {stdio:'inherit'});

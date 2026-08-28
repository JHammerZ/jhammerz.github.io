import fs from 'fs'
import { glob } from 'glob'

const targets = await glob(['scripts/**/*.ts', 'src/**/*.ts'])
let patched = 0

for (const file of targets) {
  let code = fs.readFileSync(file, 'utf8')
  const original = code
  
  // 1. Replace direct Google imports with LysanderCore
  code = code.replace(
    /import\s+{\s*GoogleGenerativeAI.*?}\s+from\s+['"]@google\/generative-ai['"]/g,
    `import { LysanderCore } from '../lysander_core.js'`
  )
  
  // 2. Replace constructor calls
  code = code.replace(
    /new GoogleGenerativeAI\(process\.env\.GOOGLE_API_KEY.*?\)/g,
    `new LysanderCore()`
  )
  
  // 3. Replace model calls
  code = code.replace(
    /const model = genAI\.getGenerativeModel\(.*?\)/g,
    `const ai = new LysanderCore()`
  )
  code = code.replace(/model\.generateContent/g, `ai.generate`)
  
  if (code !== original) {
    fs.writeFileSync(file, code)
    console.log(`Patched: ${file}`)
    patched++
  }
}

console.log(`Fixed ${patched} files. Deleted 0 files.`)
if (patched > 0) process.exit(1) // Fail CI so you commit the fixes

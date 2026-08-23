import fs from 'fs';
import path from 'path';

const OWNER = 'JHammerZ';
const REPO = 'jhammerz.github.io';

// Grab token from env, prioritizing working lowercased aurelius_sovereign_token and LYSANDER_MESH_TOKEN
const token = process.env.aurelius_sovereign_token || process.env.LYSANDER_MESH_TOKEN || process.env.GITHUB_TOKEN || process.env.AURELIUS_SOVEREIGN_TOKEN;

if (!token) {
  console.error("❌ ERROR: No active sovereign or GitHub tokens found in your environment variables.");
  console.log("Please make sure you have added aurelius_sovereign_token or LYSANDER_MESH_TOKEN in your platform settings.");
  process.exit(1);
}

// Function to recursively read all files in a directory
function getAllFiles(dirPath: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    // Ignore specified folders
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.next' || file === 'build') {
      continue;
    }
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

async function run() {
  console.log(`🚀 Initiating high-integrity remote synchronization to https://github.com/${OWNER}/${REPO}...`);
  
  // 1. Fetch remote files to get their SHAs and prevent overwrite conflicts
  console.log(`🔍 Querying remote tree structure from JHammerZ/jhammerz.github.io...`);
  
  let remoteFiles: Record<string, string> = {}; // mapping: repo_path -> sha
  try {
    // A. Get default branch first (usually main)
    const repoRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Aurelius-OS-Sync'
      }
    });
    
    if (!repoRes.ok) {
      throw new Error(`Failed to fetch repo info: ${repoRes.statusText} (${repoRes.status})`);
    }
    
    const repoData: any = await repoRes.json();
    const defaultBranch = repoData.default_branch || 'main';
    console.log(`📌 Default branch identified: ${defaultBranch}`);
    
    // B. Get branch refs to find latest commit sha
    const refRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${defaultBranch}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Aurelius-OS-Sync'
      }
    });
    
    if (!refRes.ok) {
      throw new Error(`Failed to fetch branch ref: ${refRes.statusText} (${refRes.status})`);
    }
    
    const refData: any = await refRes.json();
    const commitSha = refData.object.sha;
    
    // C. Get recursive tree
    const treeRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${commitSha}?recursive=true`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Aurelius-OS-Sync'
      }
    });
    
    if (treeRes.ok) {
      const treeData: any = await treeRes.json();
      if (treeData.tree) {
        for (const item of treeData.tree) {
          if (item.type === 'blob') {
            remoteFiles[item.path] = item.sha;
          }
        }
        console.log(`✅ Retrieved ${Object.keys(remoteFiles).length} remote files and their SHAs.`);
      }
    } else {
      console.warn(`⚠️ Warning: Could not fetch recursive tree. Proceeding with clean uploads (first-time files or brute-push).`);
    }
  } catch (err: any) {
    console.error(`⚠️ Notice: Failed remote verification: ${err.message}. Assuming clean or default repository states.`);
  }
  
  // 2. Identify local files to synchronize
  const workspaceRoot = process.cwd();
  const allLocalFiles = getAllFiles(workspaceRoot);
  
  console.log(`📦 Found ${allLocalFiles.length} local files in current workspace.`);
  
  // 3. Sequential push via GitHub API to avoid throttle
  let successCount = 0;
  let failCount = 0;
  
  for (const localAbsPath of allLocalFiles) {
    // Make relative path for GitHub
    let relPath = path.relative(workspaceRoot, localAbsPath).replace(/\\/g, '/');
    
    // Skip if it contains sensitive files we shouldn't push (like actual .env files containing tokens etc.)
    if (relPath === '.env' || relPath === '.DS_Store' || relPath.startsWith('.env.') || relPath === 'package-lock.json') {
      if (relPath !== '.env.example') {
        continue;
      }
    }
    
    const contentBuffer = fs.readFileSync(localAbsPath);
    const contentBase64 = contentBuffer.toString('base64');
    
    // Get matching remote SHA if it exists
    const matchingSha = remoteFiles[relPath];
    
    const body: any = {
      message: `Sovereign Sync: High-integrity deploy of ${relPath}`,
      content: contentBase64,
      branch: 'main'
    };
    
    if (matchingSha) {
      body.sha = matchingSha;
    }
    
    try {
      const uploadRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${relPath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Aurelius-OS-Sync'
        },
        body: JSON.stringify(body)
      });
      
      const status = uploadRes.status;
      if (uploadRes.ok) {
        console.log(`✅ [SYNCED] ${relPath} (${status === 201 ? 'Created' : 'Updated'})`);
        successCount++;
      } else {
        const errText = await uploadRes.text();
        console.error(`❌ [FAILED] ${relPath} - Status: ${status}. Error: ${errText.slice(0, 150)}`);
        failCount++;
      }
      
      // Delay to avoid secondary rate limit from GitHub API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (pushErr: any) {
      console.error(`❌ [EXCEPTION] ${relPath} - Error: ${pushErr.message}`);
      failCount++;
    }
  }
  
  console.log(`\n==========================================================`);
  console.log(`📊 PUSH REPORT`);
  console.log(`   - Successful uploads: ${successCount}`);
  console.log(`   - Failed uploads: ${failCount}`);
  console.log(`   - Complete Workspace state transmitted: ${failCount === 0 ? '100% SUCCESS' : 'PARTIAL'}`);
  console.log(`==========================================================`);
}

run();

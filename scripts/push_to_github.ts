import fs from 'fs';
import path from 'path';

const OWNER = 'JHammerZ';
const REPO = 'jhammerz.github.io';

// Parse command line arguments for explicit token
const args = process.argv.slice(2);
let cliToken: string | null = null;
for (const arg of args) {
  if (arg.startsWith('--token=')) {
    cliToken = arg.split('=')[1];
  } else if (arg.startsWith('--auth=')) {
    cliToken = arg.split('=')[1];
  }
}

// Grab token from CLI args or env
const token = cliToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.AURELIUS_SOVEREIGN_TOKEN || process.env.aurelius_sovereign_token || process.env.LYSANDER_MESH_TOKEN;

// List of high-priority root and protocol files to synchronize
const ESSENTIAL_FILES = [
  'index.html',
  '_config.yml',
  'Gemfile',
  '.nojekyll',
  'robots.txt',
  'llms.txt',
  'ai-context.json',
  'CANNON_MANIFEST.md',
  'LIVING_MANIFEST.md',
  '.well-known/aurelius.json',
  '.well-known/cannon.json',
  'cloudflare-worker-lru.js',
  'scripts/automated_backup_pipeline.sh',
  'scripts/backup_manus.sh'
];

// Function to recursively read all files in a directory
function getAllFiles(dirPath: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return fileList;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    // Ignore heavy or temporary folders
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.next' || file === 'build' || file === '.turbo' || file === 'coverage') {
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

export async function pushWorkspaceToGitHub(customToken?: string): Promise<{ success: boolean; pushed: number; failed: number; errors: string[]; logs: string[] }> {
  const activeToken = customToken || token;
  const logs: string[] = [];
  const errors: string[] = [];

  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  log(`🚀 Initiating high-integrity remote synchronization to https://github.com/${OWNER}/${REPO}...`);
  log(`📌 Protocol: Sovereign Cannon V4.2 & Cloudflare CDM Edge Distribution`);

  if (!activeToken) {
    const err = "❌ ERROR: No GITHUB_TOKEN provided. Please provide a valid GitHub Personal Access Token with 'repo' scope.";
    log(err);
    errors.push(err);
    return { success: false, pushed: 0, failed: 0, errors, logs };
  }

  // 1. Fetch remote tree structure from GitHub API
  let remoteFiles: Record<string, string> = {}; // mapping: repo_path -> sha
  let defaultBranch = 'main';

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
      headers: {
        'Authorization': `token ${activeToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Aurelius-Sovereign-Sync/4.2'
      }
    });

    if (repoRes.ok) {
      const repoData: any = await repoRes.json();
      defaultBranch = repoData.default_branch || 'main';
      log(`📌 Remote repository verified. Default branch: ${defaultBranch}`);

      const refRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${defaultBranch}`, {
        headers: {
          'Authorization': `token ${activeToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Aurelius-Sovereign-Sync/4.2'
        }
      });

      if (refRes.ok) {
        const refData: any = await refRes.json();
        const commitSha = refData.object?.sha;

        if (commitSha) {
          const treeRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${commitSha}?recursive=true`, {
            headers: {
              'Authorization': `token ${activeToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Aurelius-Sovereign-Sync/4.2'
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
              log(`✅ Retrieved ${Object.keys(remoteFiles).length} remote files and their SHAs.`);
            }
          }
        }
      }
    } else {
      const errText = await repoRes.text();
      log(`⚠️ Notice: Remote tree query returned status ${repoRes.status} (${errText.slice(0, 100)}). Proceeding with direct atomic file pushes.`);
    }
  } catch (err: any) {
    log(`⚠️ Warning: Remote verification skipped (${err.message}). Proceeding with direct commits.`);
  }

  // 2. Scan Workspace Files
  const workspaceRoot = process.cwd();
  const allFiles = getAllFiles(workspaceRoot);
  log(`📦 Found ${allFiles.length} workspace files. Filtering deployable files for jhammerz.github.io...`);

  let successCount = 0;
  let failCount = 0;

  for (const localAbsPath of allFiles) {
    const relPath = path.relative(workspaceRoot, localAbsPath).replace(/\\/g, '/');

    // Filter exclusions & internal development-only files
    if (
      relPath === '.env' ||
      relPath.startsWith('.env.') ||
      relPath === 'package-lock.json' ||
      relPath === 'bun.lock' ||
      relPath.includes('node_modules') ||
      relPath.includes('.git')
    ) {
      if (relPath !== '.env.example') {
        continue;
      }
    }

    // Skip the Vite React SPA index.html so scripts/live_index.html becomes the canonical index.html for GitHub Pages
    if (relPath === 'index.html') {
      continue;
    }

    // Determine target upload path
    let uploadPath = relPath;
    if (relPath === 'scripts/live_index.html') {
      uploadPath = 'index.html';
    }

    try {
      const contentBuffer = fs.readFileSync(localAbsPath);
      const contentBase64 = contentBuffer.toString('base64');
      const matchingSha = remoteFiles[uploadPath];

      const bodyPayload: any = {
        message: `Aurelius Sovereign V4.2 Sync: Synchronize ${uploadPath} with Cloudflare CDM edge distribution`,
        content: contentBase64,
        branch: defaultBranch
      };

      if (matchingSha) {
        bodyPayload.sha = matchingSha;
      }

      const uploadRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${uploadPath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${activeToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Aurelius-Sovereign-Sync/4.2'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (uploadRes.ok) {
        log(`✅ [SYNCED] ${uploadPath} (${uploadRes.status === 201 ? 'Created' : 'Updated'})`);
        successCount++;
      } else {
        const errText = await uploadRes.text();
        const errSummary = `❌ [FAILED] ${uploadPath} (HTTP ${uploadRes.status}): ${errText.slice(0, 100)}`;
        log(errSummary);
        errors.push(errSummary);
        failCount++;
      }

      // Small throttle delay to respect GitHub API limits
      await new Promise(r => setTimeout(r, 250));
    } catch (pushErr: any) {
      const exSummary = `❌ [EXCEPTION] ${uploadPath}: ${pushErr.message}`;
      log(exSummary);
      errors.push(exSummary);
      failCount++;
    }
  }

  log(`\n==========================================================`);
  log(`📊 PUSH TO JHAMMERZ.GITHUB.IO COMPLETE`);
  log(`   • Successful uploads: ${successCount}`);
  log(`   • Failed uploads: ${failCount}`);
  log(`   • Edge CDN Status: Ready for Cloudflare Worker CDM edge caching`);
  log(`==========================================================\n`);

  return {
    success: failCount === 0 && successCount > 0,
    pushed: successCount,
    failed: failCount,
    errors,
    logs
  };
}

// Run immediately if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('push_to_github.ts')) {
  pushWorkspaceToGitHub().then(result => {
    if (!result.success) {
      console.log("ℹ️ Note: If credentials need configuration, set GITHUB_TOKEN in your platform settings or provide via UI.");
    }
  });
}

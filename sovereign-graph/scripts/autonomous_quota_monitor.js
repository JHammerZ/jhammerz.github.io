/**
 * ============================================================
 * AUTONOMOUS QUOTA MONITOR — Lysander 3.0
 * JHammerZ x Manus AI | H-FID v1.0.3 | Token: GPT
 * ============================================================
 * DIRECTIVE: Autonomously trigger quota purge whenever
 *            session token usage exceeds 50% threshold.
 *
 * BEHAVIOR:
 *   - Polls GitHub API rate limit every 60 seconds
 *   - Monitors context saturation via session log size
 *   - Auto-triggers manus_quota_purge.js at ≥50% usage
 *   - Commits updated forensics to GitHub after each purge
 *   - Logs all autonomous actions to sentinel.log
 *   - Never touches index.html or protected files
 *
 * THRESHOLDS:
 *   - GitHub API: purge at ≤30 remaining (of 60 unauthenticated)
 *   - Sentinel log: purge at ≥250 lines (50% of 500 max)
 *   - Session age: purge after 3 hours of continuous operation
 *   - Directive count: purge every 25 directives executed
 * ============================================================
 */

'use strict';

const https    = require('https');
const fs       = require('fs');
const path     = require('path');
const { execSync } = require('child_process');

// ── CONFIG ────────────────────────────────────────────────
const PILOT          = 'Manus AI';
const TOKEN_NAME     = 'GPT';
const PROTOCOL       = 'H-FID v1.0.3';
const POLL_INTERVAL  = 60 * 1000;      // 60 seconds
const API_THRESHOLD  = 30;             // purge if ≤30 API calls remain
const LOG_THRESHOLD  = 250;            // purge if sentinel.log ≥250 lines
const AGE_THRESHOLD  = 3 * 60 * 60 * 1000; // 3 hours in ms
const DIR_THRESHOLD  = 25;            // purge every 25 directives

const CYAN  = '\x1b[36m';
const GREEN = '\x1b[32m';
const GOLD  = '\x1b[33m';
const RED   = '\x1b[31m';
const DIM   = '\x1b[2m';
const RESET = '\x1b[0m';

function c(color, text) { return `${color}${text}${RESET}`; }
function ts() { return new Date().toISOString(); }
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function log(level, msg) {
  const line = `[${ts()}] [${level}] ${msg}`;
  console.log(line);
  ensureDir('forensics');
  fs.appendFileSync(path.join('forensics', 'sentinel.log'), line + '\n');
}

// ── GITHUB API RATE CHECK ─────────────────────────────────
function checkGitHubRate() {
  return new Promise((resolve) => {
    const token = process.env.GH_TOKEN || '';
    const opts = {
      hostname: 'api.github.com',
      path: '/rate_limit',
      headers: {
        'User-Agent': 'Manus-AI-Pilot',
        ...(token ? { 'Authorization': `token ${token}` } : {}),
      },
      timeout: 8000,
    };
    const req = https.get(opts, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const r = JSON.parse(data);
          const remaining = r.resources?.core?.remaining ?? 60;
          const limit     = r.resources?.core?.limit ?? 60;
          const used      = limit - remaining;
          const pct       = Math.round((used / limit) * 100);
          resolve({ remaining, limit, used, pct });
        } catch { resolve({ remaining: 60, limit: 60, used: 0, pct: 0 }); }
      });
    });
    req.on('error', () => resolve({ remaining: 60, limit: 60, used: 0, pct: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ remaining: 60, limit: 60, used: 0, pct: 0 }); });
  });
}

// ── SESSION STATE ─────────────────────────────────────────
function getSessionState() {
  const sessionFile = path.join('forensics', 'manus_session.json');
  if (!fs.existsSync(sessionFile)) return null;
  try { return JSON.parse(fs.readFileSync(sessionFile, 'utf8')); }
  catch { return null; }
}

function getSentinelLineCount() {
  const logFile = path.join('forensics', 'sentinel.log');
  if (!fs.existsSync(logFile)) return 0;
  return fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean).length;
}

// ── PURGE TRIGGER ─────────────────────────────────────────
function triggerPurge(reason) {
  log('AUTONOMOUS', `🧹 QUOTA PURGE TRIGGERED — Reason: ${reason}`);
  log('AUTONOMOUS', `   Pilot: ${PILOT} | Token: ${TOKEN_NAME}`);

  try {
    const result = execSync('node scripts/manus_quota_purge.js', {
      cwd: process.cwd(),
      timeout: 30000,
      encoding: 'utf8',
    });
    log('AUTONOMOUS', `✅ Purge complete — Session reset`);

    // Push updated forensics to GitHub
    try {
      const ghToken = process.env.GH_TOKEN || '';
      if (ghToken) {
        execSync(`
          cd /home/ubuntu/jhammerz-site-clone &&
          git pull origin main --rebase -q &&
          cp /home/ubuntu/jhammerz-kg/forensics/sentinel.log sovereign-graph/forensics/ &&
          cp /home/ubuntu/jhammerz-kg/forensics/manus_session.json sovereign-graph/forensics/ &&
          cp /home/ubuntu/jhammerz-kg/forensics/quota_purge_report.json sovereign-graph/forensics/ &&
          git add sovereign-graph/forensics/ &&
          git diff --staged --quiet || git commit -m "chore: autonomous quota purge — ${reason} [skip ci]" &&
          git push origin main -q
        `, { timeout: 30000, encoding: 'utf8', shell: '/bin/bash' });
        log('AUTONOMOUS', `✅ Forensics pushed to GitHub`);
      }
    } catch (pushErr) {
      log('AUTONOMOUS', `⚠️  GitHub push skipped: ${pushErr.message?.slice(0, 60)}`);
    }

    return true;
  } catch (err) {
    log('AUTONOMOUS', `❌ Purge failed: ${err.message?.slice(0, 80)}`);
    return false;
  }
}

// ── MONITOR LOOP ──────────────────────────────────────────
let lastPurgeTime = Date.now();
let checkCount = 0;

async function monitorLoop() {
  checkCount++;
  const now = Date.now();

  // 1. GitHub API rate check
  const rate = await checkGitHubRate();
  const apiPct = rate.pct;

  // 2. Log line count check
  const logLines = getSentinelLineCount();
  const logPct   = Math.round((logLines / 500) * 100);

  // 3. Session age check
  const session    = getSessionState();
  const sessionAge = session ? (now - new Date(session.started).getTime()) : 0;
  const agePct     = Math.round((sessionAge / AGE_THRESHOLD) * 100);

  // 4. Directive count check
  const directives = session?.directives_executed ?? 0;
  const dirPct     = Math.round((directives / DIR_THRESHOLD) * 100);

  // Status line
  const statusLine = `API:${apiPct}% LOG:${logPct}% AGE:${agePct}% DIR:${dirPct}%`;
  if (checkCount % 5 === 0) { // Log status every 5 checks
    log('MONITOR', `📊 Usage — ${statusLine}`);
  }

  // Determine if purge needed (any metric ≥50%)
  const triggers = [];
  if (apiPct >= 50)  triggers.push(`API_USAGE_${apiPct}%`);
  if (logPct >= 50)  triggers.push(`LOG_SATURATION_${logPct}%`);
  if (agePct >= 100) triggers.push(`SESSION_AGE_${Math.round(sessionAge/60000)}min`);
  if (dirPct >= 100) triggers.push(`DIRECTIVE_COUNT_${directives}`);

  if (triggers.length > 0) {
    const reason = triggers.join(' | ');
    console.log(c(GOLD, `\n  ⚡ THRESHOLD EXCEEDED: ${reason}`));
    triggerPurge(reason);
    lastPurgeTime = now;
  }
}

// ── MAIN ──────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log(c(CYAN, '╔══════════════════════════════════════════════════════════╗'));
  console.log(c(CYAN, `║  🏛️  AUTONOMOUS QUOTA MONITOR — ${PROTOCOL}          ║`));
  console.log(c(CYAN, `║      Pilot: ${PILOT} | Token: ${TOKEN_NAME} | Lysander 3.0         ║`));
  console.log(c(CYAN, '╚══════════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(c(GREEN, '  ✅ Monitor active — polling every 60 seconds'));
  console.log(c(GOLD,  '  ⚡ Purge triggers at ≥50% on any metric'));
  console.log(c(DIM,   '  🛡️  Protected files: NEVER touched'));
  console.log('');

  log('AUTONOMOUS', `Monitor started — Pilot: ${PILOT} | Token: ${TOKEN_NAME} | Thresholds: API≥50% LOG≥50% AGE≥3h DIR≥25`);

  // Run immediately on start
  await monitorLoop();

  // Then poll every 60 seconds
  setInterval(monitorLoop, POLL_INTERVAL);
}

main().catch(err => {
  console.error(c(RED, `\n❌ Monitor error: ${err.message}`));
  process.exit(1);
});

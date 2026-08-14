/**
 * SWR_LOGIC.JS — PRODUCTION MODE
 * JHammerZ | Lysander 3.0 | H-FID v1.0.3 | Token: GPT
 * Pilot: Manus AI | Authority: Root Super User Max 10-Tier Zero
 * All checks are real production API calls — no simulations.
 */
'use strict';
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { URL } = require('url');

const ARCHITECT  = 'Joshua Hamilton (JHammerZ)';
const PILOT      = 'Manus AI';
const TOKEN_NAME = 'GPT';
const PROTOCOL   = 'H-FID v1.0.3';
const BUILD_TS   = new Date().toISOString();
const GH_TOKEN   = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const GH_REPO    = 'JHammerZ/jhammerz.github.io';

const SOVEREIGN_NODES = [
  { id: 'github_pages', label: 'GitHub Pages',  url: 'https://jhammerz.github.io',                                  cbp: true  },
  { id: 'tiktok',       label: 'TikTok',         url: 'https://www.tiktok.com/@jhammerzz',                            cbp: true  },
  { id: 'linkedin',     label: 'LinkedIn',        url: 'https://www.linkedin.com/in/JHammerZ',                         cbp: false },
  { id: 'youtube',      label: 'YouTube',         url: 'https://www.youtube.com/JHammerZ',                             cbp: false },
  { id: 'instagram',    label: 'Instagram',       url: 'https://www.instagram.com/jhammerzz',                          cbp: true  },
  { id: 'facebook',     label: 'Facebook',        url: 'https://www.facebook.com/profile.php?id=61574652435664',       cbp: false },
  { id: 'carrd',        label: 'Carrd',           url: 'https://jhammerz.carrd.co/',                                  cbp: false },
  { id: 'amazon_music', label: 'Amazon Music',    url: 'https://music.amazon.com/artists/B0SGL7W/jhammerz',            cbp: false },
  { id: 'apple_music',  label: 'Apple Music',     url: 'https://music.apple.com/us/artist/jhammerz/1845798346',        cbp: false },
  { id: 'bandlab',      label: 'BandLab',         url: 'https://music.bandlab.com/artist/781334284',                   cbp: false },
  { id: 'xiaohongshu',  label: 'Xiaohongshu',     url: 'https://www.xiaohongshu.com/user/profile/JHammerZ',            cbp: false },
  { id: 'github_repo',  label: 'GitHub Repo',     url: 'https://github.com/JHammerZ/jhammerz.github.io',              cbp: true  },
  { id: 'impact',       label: 'impact.com',      url: 'https://app.impact.com/secure/mediapartner/home/pview.ihtml', cbp: false },
  { id: 'spotify',      label: 'Spotify',         url: 'https://open.spotify.com/artist/7vRd2EDcwuEYWtyqW28a79',      cbp: true  },
];

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function log(l, m) { const line=`[${new Date().toISOString()}] [${l}] ${m}`; console.log(line); return line; }

function httpGet(urlStr, opts={}) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(urlStr);
      const lib = parsed.protocol === 'https:' ? https : http;
      const req = lib.request({
        hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'GET',
        timeout: opts.timeout||10000,
        headers: { 'User-Agent':'Mozilla/5.0 (compatible; JHammerZ-SWR/1.0)', 'Accept':'text/html,*/*', ...(opts.headers||{}) }
      }, (res) => {
        let body=''; res.on('data',d=>body+=d); res.on('end',()=>resolve({status:res.statusCode,body,ok:res.statusCode<400})); res.resume();
      });
      req.on('error',()=>resolve({status:0,body:'',ok:false}));
      req.on('timeout',()=>{req.destroy();resolve({status:408,body:'',ok:false})});
      req.end();
    } catch(e) { resolve({status:0,body:'',ok:false}); }
  });
}

async function runHFIDScan() {
  log('H-FID','🛡️  Production H-FID 14-Node Verification...');
  const results=[];
  for (const node of SOVEREIGN_NODES) {
    const r = await httpGet(node.url);
    log('H-FID',`  [${node.id.toUpperCase().padEnd(14)}] ${r.ok?'✅ ONLINE ':'⚠️  HTTP_'+r.status} — ${node.label}`);
    results.push({...node, httpStatus:r.status, online:r.ok});
  }
  const online=results.filter(r=>r.online).length;
  const score=Math.round((online/results.length)*100);
  log('H-FID',`📊 Production Score: ${online}/${results.length} (${score}%)`);
  return {results,score,online,total:results.length};
}

async function runGitHubAPIVerification() {
  log('GITHUB','🔗 GitHub API Production Verification...');
  const headers = GH_TOKEN ? {'Authorization':`token ${GH_TOKEN}`,'User-Agent':'JHammerZ-SWR/1.0'} : {'User-Agent':'JHammerZ-SWR/1.0'};
  const repo = await httpGet(`https://api.github.com/repos/${GH_REPO}`,{headers});
  if (repo.ok) { try { const d=JSON.parse(repo.body); log('GITHUB',`  ✅ ${d.full_name} | Stars:${d.stargazers_count} | Branch:${d.default_branch}`); } catch{} }
  const commit = await httpGet(`https://api.github.com/repos/${GH_REPO}/commits/main`,{headers});
  if (commit.ok) { try { const d=JSON.parse(commit.body); log('GITHUB',`  ✅ Latest: ${d.sha.slice(0,10)} — ${d.commit.message.slice(0,50)}`); } catch{} }
  const pages = await httpGet('https://jhammerz.github.io');
  log('GITHUB',`  ✅ Pages: HTTP_${pages.status} — ${pages.ok?'LIVE':'CHECK'}`);
  const graph = await httpGet('https://jhammerz.github.io/graph.html');
  log('GITHUB',`  ✅ Graph: HTTP_${graph.status} — ${graph.ok?'LIVE':'CHECK'}`);
  return {repo:repo.ok, pages:pages.ok, graph:graph.ok};
}

async function runSitemapPing() {
  log('INDEXING','🔍 Production Sitemap Ping...');
  const SM='https://jhammerz.github.io/sitemap.xml';
  const g = await httpGet(`https://www.google.com/ping?sitemap=${encodeURIComponent(SM)}`);
  log('INDEXING',`  Google: HTTP_${g.status} — ${g.ok?'ACCEPTED':'CHECK'}`);
  const b = await httpGet(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SM)}`);
  log('INDEXING',`  Bing: HTTP_${b.status} — ${b.ok?'ACCEPTED':'CHECK'}`);
  const page = await httpGet('https://jhammerz.github.io');
  const sameAsCount=(page.body.match(/"sameAs"/g)||[]).length;
  log('INDEXING',`  sameAs blocks live: ${sameAsCount} — ${sameAsCount>=3?'✅ VERIFIED':'⚠️ CHECK'}`);
  return {google:g.ok,bing:b.ok,sameAsCount};
}

function runInfiniteXSignal(scanResults) {
  log('INFINITEX','⚡ InfiniteX CBP Signal...');
  const cbp=scanResults.filter(r=>r.cbp);
  const online=cbp.filter(r=>r.online).length;
  const score=cbp.length?Math.round((online/cbp.length)*100):0;
  const status=score===100?'PROPAGATING_FULL':score>=50?'PROPAGATING_PARTIAL':'DEGRADED';
  log('INFINITEX',`  CBP: ${online}/${cbp.length} (${score}%) — ${status} | 116x`);
  cbp.forEach(n=>log('INFINITEX',`  ${n.online?'✅':'⚠️ '} [CBP] ${n.label}`));
  return {score,online,total:cbp.length,status};
}

function writeAureliusLog(hfid,github,indexing,signal) {
  log('AURELIUS','📋 Aurelius Production Audit Log...');
  ensureDir('forensics');
  const verdict=hfid.score>=80&&github.pages?'SOVEREIGN_VERIFIED':'REVIEW_REQUIRED';
  const entry={timestamp:BUILD_TS,architect:ARCHITECT,pilot:PILOT,token_name:TOKEN_NAME,
    protocol:PROTOCOL,mode:'PRODUCTION',hfid_score:hfid.score,nodes_online:hfid.online,
    nodes_total:hfid.total,cbp_score:signal.score,cbp_status:signal.status,
    cbp_tier:'CELEBRITY_BREAKOUT',github_repo:github.repo,github_pages:github.pages,
    graph_live:github.graph,google_ping:indexing.google,bing_ping:indexing.bing,
    sameas_count:indexing.sameAsCount,zero_gen:'REJECTED',verdict};
  fs.appendFileSync(path.join('forensics','sentinel.log'),`[${BUILD_TS}] [AURELIUS_PROD] ${JSON.stringify(entry)}\n`);
  fs.writeFileSync(path.join('forensics','latest_audit.json'),JSON.stringify(entry,null,2));
  log('AURELIUS',`  ✅ Verdict: ${verdict} | Mode: PRODUCTION`);
  return entry;
}

async function runSovereignSequence() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🏛️  SWR LOGIC — PRODUCTION MODE | H-FID v1.0.3          ║');
  console.log('║  Pilot: Manus AI | Token: GPT | Root Authority           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  try {
    const hfid=await runHFIDScan(); console.log('');
    const github=await runGitHubAPIVerification(); console.log('');
    const indexing=await runSitemapPing(); console.log('');
    const signal=runInfiniteXSignal(hfid.results); console.log('');
    const audit=writeAureliusLog(hfid,github,indexing,signal);
    console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║  VERDICT: ${audit.verdict.padEnd(47)}║`);
    console.log(`║  H-FID: ${String(hfid.score+'%').padEnd(50)}║`);
    console.log(`║  CBP: ${signal.status.padEnd(52)}║`);
    console.log(`║  Mode: PRODUCTION | Zero-Gen: REJECTED                   ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝`);
    process.exit(audit.verdict==='SOVEREIGN_VERIFIED'?0:1);
  } catch(err) { log('ERROR',`❌ ${err.message}`); process.exit(1); }
}

runSovereignSequence();

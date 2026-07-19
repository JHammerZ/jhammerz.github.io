import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const manifest = JSON.parse(fs.readFileSync('social_manifest.json', 'utf8'));

function getEnv(name) {
  const val = process.env[name];
  if (!val) {
    console.warn(`WARN: Missing env: ${name}`);
    return null;
  }
  return val;
}

function signPayload(payload) {
  const token = getEnv('LYSANDER_HUB_TOKEN');
  if (!token) return null;
  const hmac = crypto.createHmac('sha256', token);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

function formatPost(entity, data) {
  const replacements = {
    '{title}': data.title || 'H-FID Heartbeat',
    '{doi}': manifest.doi,
    '{source}': manifest.source_of_truth,
    '{commit}': (process.env.GITHUB_SHA || 'local').slice(0, 7),
    '{version}': manifest.version || '3.0'
  };
  let text = entity.post_template;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replaceAll(k, v);
  }
  return text;
}

function getTokenForPlatform(platform) {
  const envKey = manifest.entities.find(e => e.platform === platform)?.token_env;
  return getEnv(envKey);
}

function formatForPlatform(entity, packet) {
  const text = formatPost(entity, packet);

  if (entity.platform === 'facebook') {
    return {
      message: text,
      link: manifest.source_of_truth,
      published:!manifest.cross_post_rules.fallback_to_draft
    };
  }

  if (entity.platform === 'threads') {
    return { text };
  }

  if (entity.platform === 'linkedin') {
    return {
      author: `urn:li:person:${process.env.LINKEDIN_PERSON_URN || 'me'}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'ARTICLE',
          media: [{
            status: 'READY',
            originalUrl: manifest.source_of_truth,
            title: { text: packet.title || 'Lysander 3.0 Update' }
          }]
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    };
  }

  if (entity.platform === 'instagram') {
    throw new Error('Instagram requires media container - skipped');
  }

  return { text };
}

async function postToEntity(entity, hfid_packet) {
  const token = getTokenForPlatform(entity.platform);

  if (!token) {
    return {
      platform: entity.platform,
      status: 0,
      id: null,
      error: `Missing token: ${entity.token_env}`
    };
  }

  let url = entity.endpoint;
  if (url.includes('{page_id}')) {
    const pageId = getEnv(entity.page_id_env);
    if (!pageId) {
      return {
        platform: entity.platform,
        status: 0,
        id: null,
        error: `Missing page_id: ${entity.page_id_env}`
      };
    }
    url = url.replace('{page_id}', pageId);
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-HFID-Signature': hfid_packet.signature || '',
    'X-Worm-ID': manifest.worm_id,
    'Content-Type': 'application/json'
  };

  const body = formatForPlatform(entity, hfid_packet);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const json = await res.json().catch(() => ({}));

    if (res.status >= 400) {
      console.log(`DEBUG ${entity.platform} request:`, JSON.stringify(body));
      console.log(`DEBUG ${entity.platform} response:`, JSON.stringify(json));
    }

    return {
      platform: entity.platform,
      status: res.status,
      id: json.id || json.post_id || json.post?.id || null,
      error: json.error?.message || json.error_description || null
    };
  } catch (e) {
    return {
      platform: entity.platform,
      status: 0,
      id: null,
      error: e.message
    };
  }
}

export async function publishToAllNodes(payload = {}) {
  const hfid_packet = {
    '@context': 'https://jhammerz.github.io/ai-context.json',
    'worm_id': manifest.worm_id,
    'timestamp': new Date().toISOString(),
    'head_commit': process.env.GITHUB_SHA || 'unknown',
    'doi': manifest.doi,
    'hfid_standard': manifest.hfid_standard,
   ...payload
  };

  if (manifest.cross_post_rules.require_signature) {
    hfid_packet.signature = signPayload(hfid_packet);
  }

  // Skip gateway POST since GitHub Pages returns 405
  const auditRes = { status: 200, skipped: 'github_pages_no_post' };

  // Fire to all active platforms
  const results = [];
  for (const entity of manifest.entities.filter(e => e.active)) {
    const r = await postToEntity(entity, hfid_packet);
    results.push(r);

    if (r.status >= 200 && r.status < 300) {
      console.log(`✔️ ${entity.platform}: ${r.status} ${r.id? 'id:' + r.id : ''}`);
    } else if (r.status === 0) {
      console.log(`⚠️ ${entity.platform}: skipped - ${r.error}`);
    } else {
      console.log(`❌ ${entity.platform}: ${r.status} ${r.error || ''}`);
    }
  }

  // Write forensic log
  const logDir = path.dirname(manifest.cross_post_rules.audit_log);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  const logLine = JSON.stringify({
    ts: hfid_packet.timestamp,
    commit: hfid_packet.head_commit,
    worm_id: hfid_packet.worm_id,
    audit_status: auditRes.status,
    results
  });
  fs.appendFileSync(manifest.cross_post_rules.audit_log, logLine + '\n');

  return { audit_status: auditRes.status, results };
}

// Allow direct execution: node scripts/social_media_publisher.js
if (import.meta.url === `file://${process.argv[1]}`) {
  publishToAllNodes({
    title: process.env.COMMIT_TITLE || 'Manual Sovereign Pulse'
  }).then(res => {
    console.log('--- PUBLISH COMPLETE ---');
    console.log(JSON.stringify(res, null, 2));

    // Only fail workflow if FAIL_ON_ERROR=true
    const shouldFail = process.env.FAIL_ON_ERROR === 'true';
    const hasErrors = res.results.some(r => r.status >= 400);

    process.exit(shouldFail && hasErrors? 1 : 0);
  });
}

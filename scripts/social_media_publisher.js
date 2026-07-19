import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const manifest = JSON.parse(fs.readFileSync('social_manifest.json', 'utf8'));

function getEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
}

function signPayload(payload) {
  const hmac = crypto.createHmac('sha256', getEnv('LYSANDER_HUB_TOKEN'));
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
    // IG requires image_url for feed posts. Placeholder for now.
    return { caption: text };
  }

  return { text };
}

async function postToEntity(entity, hfid_packet) {
  const token = getTokenForPlatform(entity.platform);
  let url = entity.endpoint;

  if (url.includes('{page_id}')) {
    url = url.replace('{page_id}', getEnv(entity.page_id_env));
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-HFID-Signature': hfid_packet.signature,
    'X-Worm-ID': manifest.worm_id,
    'Content-Type': 'application/json'
  };

  const body = formatForPlatform(entity, hfid_packet);

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  const json = await res.json().catch(() => ({}));
  return {
    platform: entity.platform,
    status: res.status,
    id: json.id || json.post_id || json.post?.id || null,
    error: json.error?.message || null
  };
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

  // 1. Always log to your own gateway first for audit
  const auditRes = await fetch('https://jhammerz.github.io/ingest/cdm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
      'X-HFID-Signature': hfid_packet.signature
    },
    body: JSON.stringify(hfid_packet)
  }).then(r => ({ status: r.status })).catch(e => ({ status: 0, error: e.message }));

  // 2. Fire to all active platforms
  const results = [];
  for (const entity of manifest.entities.filter(e => e.active)) {
    try {
      const r = await postToEntity(entity, hfid_packet);
      results.push(r);
      console.log(`✔️ ${entity.platform}: ${r.status} ${r.id? 'id:' + r.id : ''}`);
    } catch (e) {
      results.push({ platform: entity.platform, status: 0, error: e.message });
      console.log(`❌ ${entity.platform}: ${e.message}`);
    }
  }

  // 3. Write forensic log
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
    const hasErrors = res.results.some(r => r.status >= 400 || r.status === 0);
    process.exit(hasErrors? 1 : 0);
  });
}

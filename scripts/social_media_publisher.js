import fs from 'fs';
import crypto from 'crypto';

const manifest = JSON.parse(fs.readFileSync('social_manifest.json', 'utf8'));

export async function publishToAllNodes(payload) {
  const hfid_packet = {
    '@context': 'https://jhammerz.github.io/ai-context.json',
    'worm_id': 'LYSANDER_3_0',
    'timestamp': new Date().toISOString(),
    'head_commit': process.env.GITHUB_SHA,
    ...payload
  };

  const sig = crypto.createHmac('sha256', process.env.LYSANDER_HUB_TOKEN)
                    .update(JSON.stringify(hfid_packet)).digest('hex');

  const results = [];
  for (const entity of manifest.entities.filter(e => e.active)) {
    const headers = {
      'Authorization': `Bearer ${getTokenForPlatform(entity.platform)}`,
      'X-HFID-Signature': sig,
      'Content-Type': 'application/json'
    };
    
    const body = formatForPlatform(entity, hfid_packet);
    const res = await fetch(entity.endpoint.replace('{page_id}', process.env.FB_PAGE_ID), {
      method: 'POST', headers, body: JSON.stringify(body)
    });
    results.push({ platform: entity.platform, status: res.status });
  }
  return results;
}

function getTokenForPlatform(platform) {
  const map = {
    facebook: process.env.AURELIUS_SOVEREIGN_TOKEN,
    threads: process.env.AURELIUS_SOVEREIGN_TOKEN,
    linkedin: process.env.ARCHITECT_ACCESS_KEY,
    tiktok: process.env.TIKTOK,
    instagram: process.env.AURELIUS_SOVEREIGN_TOKEN
  };
  return map[platform];
}

function formatForPlatform(entity, packet) {
  const text = entity.post_template
    .replace('{title}', packet.title || 'H-FID Heartbeat')
    .replace('{doi}', manifest.doi)
    .replace('{version}', packet.version || '3.0');
  
  if (entity.platform === 'facebook') return { message: text, link: 'https://jhammerz.github.io' };
  if (entity.platform === 'threads') return { text: text };
  if (entity.platform === 'linkedin') return { /* LinkedIn UGC format */ };
  return { text };
}

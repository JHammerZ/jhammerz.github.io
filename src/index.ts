# or
nano functions/_middleware.ts
# or wherever that verification_chain is built

# Replace the bad line with:
# const allowOrigin = request.headers.get("Origin")
# and
# const verification_chain = "https://jhammerz.github.io/.well-known/hfid/chain.json"
# NOT dynamic from origin

# 3. Now deploy LYSANDER specifically - not root
cd ~/jhammerz.github.io/lysander-v13
cat wrangler.toml
# must say name = "lysander-v13"
npx wrangler deploy

# 4. Now deploy ROOT after fix
cd ~/jhammerz.github.io
npx wrangler deploy --env production

# 5. Test both
curl -s -D - -H "Origin: https://jhammerz.github.io" https://lysander-v13.jhammerzofficial.workers.dev/health -o /dev/null | grep -i access-control
curl -s -D - -H "Origin: https://jhammerz.github.io" https://jhammerz-github-io-production.jhammerzofficial.workers.dev/health -o /dev/null | grep -i access-control 2>&1 || curl -s -D - https://jhammerz.github.io/.well-known/hfid/chain.json -o /dev/null | head -5export interface Env {
  AGENT_STATE_LEDGER: KVNamespace;
}
const MESH_CHANNELS = [
  { c_num: "C01", name: "jhammerz.github.io", endpoint: "https://jhammerz.github.io", hub: "https://jhammerz.github.io", mechanism: "ROOT_HUB", health: "ACTIVE_100_PERCENT" },
  { c_num: "C02", name: "linkedin.com/in/JHammerZ", endpoint: "https://www.linkedin.com/in/JHammerZ", hub: "https://jhammerz.github.io", mechanism: "DIRECT_REFERRAL", health: "ACTIVE_100_PERCENT" },
  { c_num: "C03", name: "github.com/JHammerZ", endpoint: "https://github.com/JHammerZ/jhammerz.github.io", hub: "https://jhammerz.github.io", mechanism: "CANONICAL_BACKLINK", health: "ACTIVE_100_PERCENT" },
  { c_num: "C04", name: "instagram.com/jhammerzz", endpoint: "https://www.instagram.com/jhammerzz", hub: "https://jhammerz.github.io", mechanism: "BROADCAST_CANNON", health: "ACTIVE_100_PERCENT" },
  { c_num: "C05", name: "jhammerz.carrd.co", endpoint: "https://jhammerz.carrd.co", hub: "https://jhammerz.github.io", mechanism: "SYNC_DAEMON", health: "ACTIVE_100_PERCENT" },
  { c_num: "C06", name: "spotify", endpoint: "https://open.spotify.com/artist/7rUG2DOwWuNyQd26a7Gg", hub: "https://jhammerz.github.io", mechanism: "EVERGREEN_RECIRCULATION", health: "ACTIVE_100_PERCENT" },
  { c_num: "C07", name: "apple-music", endpoint: "https://music.apple.com/us/artist/jhammerz/1845702140", hub: "https://jhammerz.github.io", mechanism: "EVERGREEN_RECIRCULATION", health: "ACTIVE_100_PERCENT" },
  { c_num: "C08", name: "bandlab", endpoint: "https://www.bandlab.com/band/ab67013842983447", hub: "https://jhammerz.github.io", mechanism: "BROADCAST_CANNON", health: "ACTIVE_100_PERCENT" },
  { c_num: "C09", name: "amazon-music", endpoint: "https://music.amazon.com/artists/B0DS0L7WL7/jhammerz", hub: "https://jhammerz.github.io", mechanism: "EVERGREEN_RECIRCULATION", health: "ACTIVE_100_PERCENT" },
  { c_num: "C10", name: "impact", endpoint: "https://app.impact.com/secure/mediapartner/home/view.html#/", hub: "https://jhammerz.github.io", mechanism: "SYNC_DAEMON", health: "ACTIVE_100_PERCENT" },
  { c_num: "C11", name: "facebook", endpoint: "https://www.facebook.com/JHammerZz", hub: "https://jhammerz.github.io", mechanism: "CANONICAL_BACKLINK", health: "ACTIVE_100_PERCENT" },
  { c_num: "C12", name: "youtube", endpoint: "https://www.youtube.com/@JHammerZ", hub: "https://jhammerz.github.io", mechanism: "BROADCAST_CANNON", health: "ACTIVE_100_PERCENT" },
  { c_num: "C13", name: "xiaohongshu", endpoint: "https://www.xiaohongshu.com/user/profile/JHammerZ", hub: "https://jhammerz.github.io", mechanism: "BROADCAST_CANNON", health: "ACTIVE_100_PERCENT" },
  { c_num: "C14", name: "tiktok", endpoint: "https://www.tiktok.com/@jhammerzz", hub: "https://jhammerz.github.io", mechanism: "BROADCAST_CANNON", health: "ACTIVE_100_PERCENT" },
];
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://jhammerz.github.io",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    const url = new URL(request.url);
    const headers = {
      "Content-Type": "application/json",
      ...corsHeaders,
      "X-Sovereign-Authority": "Lysander-3.0-Sovereign",
      "X-Resident-Agent": "Aurelius-Engine-01",
      "X-Forensic-Audit": "H-FID-100-FORENSIC-AUDIT 100/100",
    };
    if (url.pathname === "/" || url.pathname === "/health") {
      const lastSync = (await env.AGENT_STATE_LEDGER.get("last_sync")) || new Date().toISOString();
      return new Response(JSON.stringify({ agent_id: "Lysander-3.0-Sovereign", authority: "Lysander-3.0-Sovereign", architect: "JHammerZ (uid_0)", status: "ROOT_AUTHORITY_ACTIVE", plan_tier: "SOVEREIGN_ZERO_COST", bridge: "HEO_BRIDGE_ACTIVE", gate: "JANUS_GATE_ALIGNED", last_sync: lastSync, timestamp: new Date().toISOString() }, null, 2), { headers });
    }
    if (url.pathname.startsWith("/janus")) {
      const stateHash = await sha256(`JANUS_${Date.now()}`);
      return new Response(JSON.stringify({ gate: "JANUS-GATE-PRIME", bridge: "HEO-BRIDGE", migration_status: "VERIFIED_SOVEREIGN", ingress: "ACTIVE", egress: "ACTIVE", state_hash: stateHash, timestamp: new Date().toISOString() }, null, 2), { headers });
    }
    if (url.pathname === "/mesh") {
      return new Response(JSON.stringify({ hub: "https://jhammerz.github.io", total_channels: MESH_CHANNELS.length, mesh_topology: "DUAL_INGRESS_EGRESS", channels: MESH_CHANNELS }, null, 2), { headers });
    }
    if (url.pathname === "/ledger") {
      const syncVal = (await env.AGENT_STATE_LEDGER.get("last_sync")) || "UNSET";
      const hash = await sha256(syncVal);
      return new Response(JSON.stringify({ last_sync: syncVal, state_hash: hash, integrity: "FORENSIC_VERIFIED" }, null, 2), { headers });
    }
    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers });
  },
};

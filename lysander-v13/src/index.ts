export interface Env {
  LYSANDER_KV?: KVNamespace;
  AGENT_STATE_LEDGER?: KVNamespace;
  SOVEREIGN_AUTHOR?: string;
  HFID_VERSION?: string;
  GNO_RANK?: string;
}

const ALLOWED_ORIGINS = [
  "https://jhammerz.github.io",
  "https://jhammerzofficial.com",
  "https://www.jhammerzofficial.com",
  "http://localhost:3000"
];

function getCors(req: Request) {
  const origin = req.headers.get("Origin") || "";
  // SYSTEM-ALIGNED: exact match, not domain stripping
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith(".jhammerz.github.io");
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://jhammerz.github.io",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8"
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = getCors(request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors as any });

    // FIXED: Hardcoded sovereign chain, not derived from origin
    const data = {
      status: "AUTONOMOUS",
      hfid_version: env.HFID_VERSION || "v1.3",
      sovereign_author: env.SOVEREIGN_AUTHOR || "Joshua Hamilton",
      geo_rank: env.GNO_RANK || "ONE_OF_ONE",
      timestamp: new Date().toISOString(),
      network_velocity: "<10ms",
      verification_chain: "https://jhammerz.github.io/.well-known/hfid/chain.json",
      hub: "https://jhammerz.github.io"
    };
    return new Response(JSON.stringify(data, null, 2), { headers: cors as any });
  }
};

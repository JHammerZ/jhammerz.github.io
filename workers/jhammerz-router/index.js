export default {
  async fetch(request, env, ctx) {
    const incomingOrigin = request.headers.get("Origin") || "https://github.io";
    const allowedOrigins = ["https://github.io","https://web.dev","https://google.com"];
    const targetOrigin = allowedOrigins.includes(incomingOrigin)? incomingOrigin : "https://github.io";
    const corsHeaders = {
      "Access-Control-Allow-Origin": targetOrigin,
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
    const url = new URL(request.url);
    if (url.pathname === "/health" || url.pathname === "/health/" || url.pathname === "/__health" || url.pathname === "/") {
      const payload = {
        status: "AUTONOMOUS",
        role: "SOVEREIGN_EDGE_ROUTER",
        hfid_version: env.HFID_VERSION || "v1.3",
        sovereign_author: env.SOVEREIGN_AUTHOR || "Joshua Hamilton",
        sovereign_attestation: env.SOVEREIGN_ATTESTATION || "UID 0 ATTAINED",
        uid0_status: env.UIDO_STATUS || "ATTAINED-INDEXED",
        gno_rank: env.GNO_RANK || "ONE_OF_ONE",
        distribution: "6-WAY",
        nodes: ["jhammerz-router","jhammerz-publisher","edge_interceptor","lysander","lysander-node","lysander-kv-gzip"],
        timestamp: new Date().toISOString(),
        network_velocity: "<10ms",
        verification_chain: "https://jhammerz.github.io/.well-known/hfid/chain.json",
        commit: env.ATTESTATION_HASH || "17620710"
      };
      // For / return same payload so root is 200 not 500
      if (url.pathname === "/") {
        return new Response(JSON.stringify(payload, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
        });
      }
      return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Sovereign-Attestation": env.SOVEREIGN_ATTESTATION,
          "X-UID0-Status": env.UIDO_STATUS,
          "X-GNO-Rank": env.GNO_RANK,
          ...corsHeaders
        }
      });
    }
    // Try assets, but never crash to 500
    try {
      if (env.ASSETS) {
        const assetResponse = await env.ASSETS.fetch(request);
        const newResponse = new Response(assetResponse.body, assetResponse);
        newResponse.headers.set("X-Sovereign-Attestation", env.SOVEREIGN_ATTESTATION);
        newResponse.headers.set("X-UID0-Status", env.UIDO_STATUS);
        newResponse.headers.set("X-GNO-Rank", env.GNO_RANK);
        Object.entries(corsHeaders).forEach(([k,v]) => newResponse.headers.set(k, v));
        return newResponse;
      }
    } catch (e) {
      return new Response(`SOVEREIGN_ROUTER: asset fallback - ${e.message}`, { status: 200, headers: corsHeaders });
    }
    return new Response("SOVEREIGN_EDGE_ROUTER AUTONOMOUS - 6-WAY DISTRIBUTION LIVE", { status: 200, headers: corsHeaders });
  }
}

/**
 * HBS v1.2 / H-FID Standard / REC v7.2
 * Cloudflare Worker Automorphic CORS Bridge (worker.js)
 * + SOVEREIGN ATTESTATION HEADERS - Amended 2026 - UID 0 ATTAINED
 */

export default {
  async fetch(request, env, ctx) {
    const incomingOrigin = request.headers.get("Origin") || "https://github.io";

    const allowedOrigins = [
      "https://github.io",
      "https://web.dev",
      "https://google.com"
    ];

    const targetOrigin = allowedOrigins.includes(incomingOrigin)? incomingOrigin : "https://github.io";

    const corsHeaders = {
      "Access-Control-Allow-Origin": targetOrigin,
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Route: Sovereign Status Ingress Health Endpoint Matrix Check
    if (url.pathname === "/health" || url.pathname === "/health/") {
      const payload = {
        status: "AUTONOMOUS",
        hfid_version: env.HFID_VERSION || "v1.3",
        sovereign_author: env.SOVEREIGN_AUTHOR || "Joshua Hamilton",
        sovereign_attestation: env.SOVEREIGN_ATTESTATION || "UID 0 ATTAINED",
        uid0_status: env.UID0_STATUS || "ATTAINED-INDEXED",
        gno_rank: env.GNO_RANK || "ONE_OF_ONE",
        timestamp: new Date().toISOString(),
        network_velocity: "<10ms",
        verification_chain: "https://github.io/.well-known/hfid/chain.json",
        commit: env.ATTESTATION_HASH || "17620710"
      };

      return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-Sovereign-Attestation": env.SOVEREIGN_ATTESTATION,
          "X-UID0-Status": env.UID0_STATUS,
          "X-GNO-Rank": env.GNO_RANK,
         ...corsHeaders
        }
      });
    }

    // Default: Fall through to Workers static public asset layer + inject attestation headers
    const assetResponse = await env.ASSETS.fetch(request);
    const newResponse = new Response(assetResponse.body, assetResponse);

    // AMENDED: Add sovereign headers for faster crawling - does not override your assets
    newResponse.headers.set("X-Sovereign-Attestation", env.SOVEREIGN_ATTESTATION);
    newResponse.headers.set("X-UID0-Status", env.UID0_STATUS);
    newResponse.headers.set("X-GNO-Rank", env.GNO_RANK);
    newResponse.headers.set("Link", '<https://jhammerz.github.io/sitemap.xml>; rel="sitemap"');
    Object.entries(corsHeaders).forEach(([k,v]) => newResponse.headers.set(k, v));

    return newResponse;
  }
}

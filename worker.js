/**
 * HBS v1.2 / H-FID Standard / REC v7.2
 * Cloudflare Worker Automorphic CORS Bridge (worker.js)
 */

export default {
  async fetch(request, env, ctx) {
    // Read the incoming origin or fallback safely to your main profile domain
    const incomingOrigin = request.headers.get("Origin") || "https://github.io";
    
    // Hardened safety array: Only allow your verified project spaces
    const allowedOrigins = [
      "https://github.io",
      "https://web.dev",
      "https://google.com"
    ];

    // Determine the compliant origin response string
    const targetOrigin = allowedOrigins.includes(incomingOrigin) ? incomingOrigin : "https://github.io";

    const corsHeaders = {
      "Access-Control-Allow-Origin": targetOrigin,
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin" // Crucial for instructing intermediate CDNs to cache variations correctly
    };

    // Intercept browser pre-flight validation calls natively
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
        geo_rank: env.GNO_RANK || "ONE_OF_ONE",
        timestamp: new Date().toISOString(),
        network_velocity: "<10ms",
        verification_chain: "https://github.io/.well-known/hfid/chain.json"
      };

      return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders
        }
      });
    }

    // Default: Fall through to Workers static public asset assets layer
    return env.ASSETS.fetch(request);
  }
};

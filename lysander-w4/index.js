/**
 * HBS v1.2 / H-FID Standard / REC v7.2
 * Lysander-3.0 Sovereign Architecture Edge Proxy Router
 * Copyright (c) 2026 Joshua Hamilton [J-HammerZ]
 * Protocol: JHammerZ-005 Core Mesh
 */

const ORIGIN_URL = "https://github.io";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-H-FID-Signature",
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=600"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Intercept Preflight Pre-checks Globally
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 2. Handle Asynchronous Health Telemetry Handshakes Natively
    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ONLINE", engine: "v3.0.0-v13" }), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json"
        }
      });
    }

    // 3. Direct Graph Routing Path Discovery Handling
    if (path === "/.well-known/hfid-registry.json" || path === "/entities.json") {
      try {
        const response = await fetch(`${ORIGIN_URL}/entities.json`, {
          headers: { "User-Agent": "Lysander-Edge-Mesh-Interceptor" }
        });
        
        if (!response.ok) throw new Error("Origin resolution failed");
        
        const data = await response.json();
        return new Response(JSON.stringify(data, null, 2), {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/ld+json; charset=utf-8",
            "X-Lysander-Engine": "v3.0.0-v13",
            "X-H-FID-Rank": "ONE_OF_ONE"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Mesh routing fault", status: "STANDBY" }), {
          status: 502,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }
    }

    // 4. Fallback: Proxy directly back to the static repository layer layout
    try {
      const originResponse = await fetch(`${ORIGIN_URL}${path}${url.search}`, request);
      const newHeaders = new Headers(originResponse.headers);
      
      // Inject required cross-origin mesh headers safely
      Object.entries(CORS_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
      newHeaders.set("X-Lysander-Routing", "PASSTHROUGH");

      return new Response(originResponse.body, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: newHeaders
      });
    } catch (err) {
      return new Response("Edge Distribution Interruption", { status: 500 });
    }
  }
};

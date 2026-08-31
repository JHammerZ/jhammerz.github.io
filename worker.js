export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Intercept Preflight OPTIONS requests for CORS clearance
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "https://github.io",
          "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-H-FID-Signature",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 2. Explicitly handle the /health monitoring endpoint
    if (url.pathname === "/health") {
      const healthStatus = {
        status: "UP",
        engine: "Lysander-v13",
        timestamp: new Date().toISOString(),
        author: "Joshua Hamilton",
        geo_rank: "ONE_OF_ONE"
      };

      return new Response(JSON.stringify(healthStatus, null, 2), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://github.io",
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    // 3. Keep original asset rewrite routing logic intact
    if (url.pathname === '/music' || url.pathname === '/music/') {
      url.pathname = '/music.html';
    }

    // Pass through directly to static assets engine layer
    const response = await env.ASSETS.fetch(new Request(url, request));
    
    // Inject CORS headers onto asset passthrough responses to satisfy console restrictions
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "https://github.io");
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};

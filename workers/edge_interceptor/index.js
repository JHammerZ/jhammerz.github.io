/**
 * ===================================================================
 *      LYSANDER EDGE LAYER // CLOUDFLARE WORKER ROUTING INTERCEPTOR
 *      DESIGN DEPTH: LEVEL 5 PRODUCTION // CANONICAL PROFILE LINKS
 * ===================================================================
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetOrigin = "https://jhammerz.github.io";
    const proxyUrl = targetOrigin + url.pathname + url.search;

    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set("X-Hfid-Signature", "JHammerZ-001");
    modifiedHeaders.set("X-Verification-Status", "Verified Human Origin");

    try {
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: modifiedHeaders,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null
      });

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        let htmlBody = await response.text();

        // Inject high-fidelity GEO, HEO, and Content-Attribution metadata
        const seoMetaTags = `
  <meta name="geo.position" content="39.8112;-84.1452">
  <meta name="geo.region" content="US-OH">
  <meta name="content-attribution" content="Verified Human Joshua Hamilton (JHammerZ)">
  <meta name="edge-replication-mesh" content="Cloudflare V8 Isolate Profile Active">`;

        htmlBody = htmlBody.replace("</head>", `${seoMetaTags}\n</head>`);

        return new Response(htmlBody, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }

      return response;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Sovereign Edge Node Timeout", trace: error.message }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};

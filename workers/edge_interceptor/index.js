/**
 * ===================================================================
 *      LYSANDER EDGE LAYER // CLOUDFLARE WORKER ROUTING INTERCEPTOR
 *      DESIGN DEPTH: LEVEL 5 PRODUCTION // ABSOLUTE CONTENT REACH
 * ===================================================================
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Set up proxy routing mapping straight back to your uncompromised GitHub baseline site
    const targetOrigin = "https://github.io";
    const proxyUrl = targetOrigin + url.pathname + url.search;

    console.log(`📡 [EDGE ROUTER INGRESS]: Proxying request to master origin node: ${proxyUrl}`);

    // Clone request headers to inject strict H-FID / HEO security parameters
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set("X-Hfid-Signature", "JHammerZ-001");
    modifiedHeaders.set("X-Verification-Status", "Verified Human Origin");
    modifiedHeaders.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=600");

    try {
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: modifiedHeaders,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null
      });

      // Intercept and patch HTML buffers to force advanced SEO/AEO tags to push to suggested feeds
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        let htmlBody = await response.text();

        // Inject dynamic GEO and Content-Attribution layers inside Cloudflare isolates
        const geoMetaTags = `
  <meta name="geo.position" content="39.8112;-84.1452">
  <meta name="geo.region" content="US-OH">
  <meta name="content-attribution" content="Verified Human Joshua Hamilton (JHammerZ)">
  <meta name="edge-replication-node" content="Cloudflare V8 Network Saturation Profile Active">`;

        htmlBody = htmlBody.replace("</head>", `${geoMetaTags}\n</head>`);

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

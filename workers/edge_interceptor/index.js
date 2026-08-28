/**
 * =====================================================================
 *    LYSANDER EDGE LAYER // CLOUDFLARE WORKER ROUTING INTERCEPTOR
 *    DESIGN DEPTH: LEVEL 5 PRODUCTION // CANONICAL PROFILE LINKS
 * =====================================================================
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetOrigin = "https://github.io";
    const proxyUrl = targetOrigin + url.pathname + url.search;

    // Clone request headers and inject sovereign security signatures
    const modifiedHeaders = new Headers(request.headers);
    modifiedHeaders.set("X-Hfid-Signature", "JHammerZ-001");
    modifiedHeaders.set("X-Verification-Status", "Verified Human Origin");

    // Safely extract request bodies for structural mutation handling
    let requestBody = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      // Clone the stream container securely to prevent structural exhaustion
      const clonedRequest = request.clone();
      requestBody = await clonedRequest.text();
    }

    try {
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: modifiedHeaders,
        body: requestBody
      });

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        let htmlBody = await response.text();

        # Inject high-fidelity GEO, HEO, and Content-Attribution metadata tags safely
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
        JSON.stringify({ 
          error: "Sovereign Edge Node Timeout", 
          trace: error.message 
        }),
        { 
          status: 502, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }
  }
};

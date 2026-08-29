/**
 * THE SOVEREIGN GLOBAL DISTRIBUTION PIPELINE // EDGE ROUTING INTERCEPTOR
 * Environment: Cloudflare Workers (V8 Isolate Matrix Engine)
 * Slsa Security Level: 3
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const clientGeographicRegion = request.cf?.regionCode || "UNKNOWN";
    const clientCountry = request.cf?.country || "UNKNOWN";

    console.log(`[*] Intercepting global pipeline ingress request from: ${clientCountry}-${clientGeographicRegion}`);

    // Define strict regional security boundary validation schemas
    const authorizedGeos = ["US", "DE", "SG", "GB", "FR", "CA"];
    const isAuthorizedGeo = authorizedGeos.includes(clientCountry);

    // Enforce cryptographic and geographical validation security header configurations
    const secureHeaders = new Headers();
    secureHeaders.set("X-Pipeline-Provenance", "Joshua Hamilton (JHammerZ)");
    secureHeaders.set("X-Planetary-Relay-Node", `${clientCountry}-${clientGeographicRegion}`);
    secureHeaders.set("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none';");
    secureHeaders.set("X-Content-Type-Options", "nosniff");
    secureHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    // Block non-authorized geographic payload infiltration parameters instantly
    if (!isAuthorizedGeo && url.pathname.startsWith("/pipeline-ingress")) {
      console.log(`[!] Security Deflection: Infiltration blocked from unauthorized sector: ${clientCountry}`);
      return new Response(
        JSON.stringify({ error: "CRITICAL: UNAUTHORIZED GEOGRAPHIC ORIGIN BLOCKED" }),
        { status: 403, headers: secureHeaders }
      );
    }

    // Pass validated traffic through to localized cluster regions
    try {
      const response = await fetch(request);
      const modifiedResponse = new Response(response.body, response);

      // Inject planetary validation signatures into response header blocks
      secureHeaders.forEach((value, key) => {
        modifiedResponse.headers.set(key, value);
      });

      return modifiedResponse;
    } catch (err) {
      return new Response("Planetary Relay Pipeline Transport Interruption", { status: 502 });
    }
  }
};
